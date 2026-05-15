#!/usr/bin/env python3
"""Manage Codex Autorunner tickets (list, insert, move, create, lint).

Commands:
  list                   Show ticket order with titles/done flags.
  lint                   Validate ticket filenames and frontmatter.
  insert --before N      Shift tickets >= N up by COUNT (default 1).
  insert --after N       Shift tickets > N up by COUNT (default 1).
                         Optionally create a ticket in the new slot.
  move --start A --to B  Move ticket/block starting at A (or A..END)
                         so it begins at position B (1-indexed).
  create --title "..."   Create a new ticket at the next or specified
                         index. Use --at to place into a gap.

Examples:
  ticket_tool.py list
  ticket_tool.py insert --before 3
  ticket_tool.py create --title "Investigate flaky test" --at 3
  ticket_tool.py move --start 5 --end 7 --to 2
  ticket_tool.py lint

Notes:
- Filenames must match TICKET-<number>[suffix].md.
- `python3 .codex-autorunner/bin/lint_tickets.py` is the canonical lint entrypoint.
- `ticket_tool.py lint` is a compatibility wrapper around the same shared implementation.
- PyYAML is preferred for linting/title extraction, but the shipped tool keeps a fallback parser for common ticket frontmatter.
- The tool is intentionally dependency-light and safe to run from any
  virtualenv (or none).
"""

from __future__ import annotations

import argparse
import importlib.util
import re
import sys
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional, Sequence, Tuple

try:
    import yaml  # type: ignore
except ImportError:  # pragma: no cover
    yaml = None

_TICKET_NAME_RE = re.compile(r"^TICKET-(\d{3,})([^/]*)\.md$", re.IGNORECASE)
_TICKET_ID_RE = re.compile(r"^[A-Za-z0-9._-]{6,128}$")
_KNOWN_AGENT_IDS = ('codex', 'hermes', 'opencode', 'user', 'zeroclaw')
_IGNORED_NON_TICKET_FILENAMES = {"AGENTS.md", "ingest_state.json"}
__all__ = ["run_ticket_lint"]


def _unescape_double_quoted_yaml_scalar(inner: str) -> str:
    out: list[str] = []
    i = 0
    while i < len(inner):
        ch = inner[i]
        if ch != "\\":
            out.append(ch)
            i += 1
            continue
        if i + 1 >= len(inner):
            out.append("\\")
            break
        nxt = inner[i + 1]
        if nxt == "n":
            out.append("\n")
            i += 2
        elif nxt == '"':
            out.append('"')
            i += 2
        elif nxt == "\\":
            out.append("\\")
            i += 2
        else:
            out.append("\\")
            out.append(nxt)
            i += 2
    return "".join(out)


def _parse_scalar(raw: str) -> object:
    value = raw.strip()
    if not value:
        return ""
    if value.startswith('"') and value.endswith('"') and len(value) >= 2:
        return _unescape_double_quoted_yaml_scalar(value[1:-1])
    lowered = value.lower()
    if lowered == "true":
        return True
    if lowered == "false":
        return False
    if value.isdigit():
        return int(value)
    if ": " in value or value.endswith(":"):
        raise ValueError("unsupported unquoted ':' in scalar")
    return value


def _parse_simple_yaml_mapping(text: str) -> dict[str, object]:
    data: dict[str, object] = {}
    lines = text.splitlines()
    idx = 0
    while idx < len(lines):
        line = lines[idx]
        if not line.strip():
            idx += 1
            continue
        if line[:1].isspace():
            raise ValueError("unexpected indentation")
        if ":" not in line:
            raise ValueError("expected 'key: value'")
        key, raw_value = line.split(":", 1)
        key = key.strip()
        if not key:
            raise ValueError("missing mapping key")

        value = raw_value.strip()
        if value:
            data[key] = _parse_scalar(value)
            idx += 1
            continue

        idx += 1
        block: list[str] = []
        while idx < len(lines):
            child = lines[idx]
            if not child.strip():
                idx += 1
                continue
            if not child.startswith("  "):
                break
            block.append(child[2:])
            idx += 1

        if not block:
            data[key] = None
            continue

        if block[0].lstrip().startswith("- "):
            data[key] = _parse_simple_yaml_list(block)
            continue

        data[key] = _parse_simple_yaml_mapping("\n".join(block))

    return data


def _parse_simple_yaml_list(lines: list[str]) -> list[object]:
    values: list[object] = []
    idx = 0
    while idx < len(lines):
        line = lines[idx]
        if not line.strip():
            idx += 1
            continue

        stripped = line.lstrip()
        if stripped != line or not stripped.startswith("- "):
            raise ValueError("mixed list indentation")

        item_value = stripped[2:].strip()
        idx += 1

        child_lines: list[str] = []
        while idx < len(lines):
            child = lines[idx]
            if not child.strip():
                idx += 1
                continue
            if not child.startswith("  "):
                break
            child_lines.append(child[2:])
            idx += 1

        if ":" in item_value:
            mapping_lines = [item_value, *child_lines] if child_lines else [item_value]
            values.append(_parse_simple_yaml_mapping("\n".join(mapping_lines)))
            continue

        if not child_lines:
            values.append(_parse_scalar(item_value))
            continue

        raise ValueError("list item with nested block must start with 'key: value'")

    return values


def _sanitize_ticket_id(raw: object) -> Optional[str]:
    if not isinstance(raw, str):
        return None
    cleaned = raw.strip()
    if not cleaned or not _TICKET_ID_RE.match(cleaned):
        return None
    return cleaned


def _normalize_agent(raw: object) -> Tuple[Optional[str], Optional[str]]:
    if not isinstance(raw, str):
        return None, "frontmatter.agent is required (e.g. 'codex' or 'opencode')."

    cleaned = raw.strip()
    if not cleaned:
        return None, "frontmatter.agent is required (e.g. 'codex' or 'opencode')."

    normalized = cleaned.lower()
    if normalized not in _KNOWN_AGENT_IDS:
        return None, f"frontmatter.agent is invalid: Unknown agent: {cleaned!r}"

    return normalized, None


def _lint_frontmatter(data: dict[str, Any]) -> List[str]:
    errors: List[str] = []

    raw_ticket_id = data.get("ticket_id")
    ticket_id = _sanitize_ticket_id(raw_ticket_id)
    if raw_ticket_id is not None and not ticket_id:
        errors.append("frontmatter.ticket_id must match [A-Za-z0-9._-]{6,128} when provided.")

    _agent, agent_error = _normalize_agent(data.get("agent"))
    if agent_error:
        errors.append(agent_error)

    done = data.get("done")
    if not isinstance(done, bool):
        errors.append("frontmatter.done is required and must be a boolean.")

    return errors



@dataclass
class TicketFile:
    index: int
    path: Path
    suffix: str
    title: Optional[str]
    done: Optional[bool]
    ticket_id: Optional[str]


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def _ticket_dir(repo_root: Path) -> Path:
    return repo_root / ".codex-autorunner" / "tickets"


def _load_shared_linter():
    module_path = Path(__file__).resolve().with_name("_ticket_lint_impl.py")
    spec = importlib.util.spec_from_file_location("_ticket_lint_impl", module_path)
    if spec is None or spec.loader is None:
        sys.stderr.write(
            f"Unable to load shared ticket lint implementation from {module_path}\n"
        )
        return None
    module = importlib.util.module_from_spec(spec)
    try:
        spec.loader.exec_module(module)
    except Exception as exc:  # noqa: BLE001 - wrapper should surface import failures directly
        sys.stderr.write(
            f"Unable to import shared ticket lint implementation from {module_path}: {exc}\n"
        )
        return None
    return getattr(module, "run_ticket_lint", None)


def _ticket_paths(ticket_dir: Path) -> Tuple[List[Path], List[str]]:
    tickets: List[tuple[int, Path, str]] = []
    errors: List[str] = []
    index_to_paths: dict[int, List[Path]] = {}
    for path in sorted(ticket_dir.iterdir()):
        if not path.is_file():
            continue
        if path.name in _IGNORED_NON_TICKET_FILENAMES:
            continue
        m = _TICKET_NAME_RE.match(path.name)
        if not m:
            errors.append(
                f"{path}: Invalid ticket filename; expected TICKET-<number>[suffix].md"
            )
            continue
        try:
            idx = int(m.group(1))
        except ValueError:
            errors.append(f"{path}: Invalid ticket filename; number must be digits")
            continue
        tickets.append((idx, path, m.group(2)))
        if idx not in index_to_paths:
            index_to_paths[idx] = []
        index_to_paths[idx].append(path)
    tickets.sort(key=lambda t: t[0])

    for idx, paths in index_to_paths.items():
        if len(paths) > 1:
            paths_str = ", ".join([str(p) for p in paths])
            errors.append(
                f"Duplicate ticket index {idx:03d}: multiple files share the same index ({paths_str}). "
                "Rename or remove duplicates to ensure deterministic ordering."
            )

    return [p for _, p, _ in tickets], errors


def _split_frontmatter(text: str):
    if not text:
        return None, ["Empty file; missing YAML frontmatter."]
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return None, ["Missing YAML frontmatter (expected leading '---')."]
    end_idx = None
    for idx in range(1, len(lines)):
        if lines[idx].strip() in ("---", "..."):
            end_idx = idx
            break
    if end_idx is None:
        return None, ["Frontmatter is not closed (missing trailing '---')."]
    fm_yaml = "\n".join(lines[1:end_idx])
    return fm_yaml, []


def _parse_yaml(fm_yaml: Optional[str]):
    if fm_yaml is None:
        return {}, ["Missing or invalid YAML frontmatter (expected a mapping)."]
    if yaml is None:
        try:
            loaded = _parse_simple_yaml_mapping(fm_yaml)
        except ValueError as exc:
            return {}, [f"YAML parse error: {exc}"]
        return loaded, []
    try:
        loaded = yaml.safe_load(fm_yaml)
    except Exception as exc:  # intentional: portable CLI script must be resilient to any YAML parsing failure  # noqa: BLE001
        return {}, [f"YAML parse error: {exc}"]
    if loaded is None or not isinstance(loaded, dict):
        return {}, ["Invalid YAML frontmatter (expected a mapping)."]
    return loaded, []


def _read_ticket(path: Path) -> Tuple[Optional[TicketFile], List[str]]:
    try:
        raw = path.read_text(encoding="utf-8")
    except OSError as exc:
        return None, [f"{path}: Unable to read file ({exc})."]

    fm_yaml, fm_errors = _split_frontmatter(raw)
    if fm_errors:
        return None, [f"{path}: {msg}" for msg in fm_errors]

    data, parse_errors = _parse_yaml(fm_yaml)
    if parse_errors:
        return None, [f"{path}: {msg}" for msg in parse_errors]

    lint_errors = _lint_frontmatter(data)
    if lint_errors:
        return None, [f"{path}: {msg}" for msg in lint_errors]

    title = data.get("title") if isinstance(data, dict) else None
    done_val = data.get("done") if isinstance(data, dict) else None
    ticket_id = _sanitize_ticket_id(data.get("ticket_id"))

    m = _TICKET_NAME_RE.match(path.name)
    idx = int(m.group(1)) if m else 0
    suffix = m.group(2) if m else ""
    return (
        TicketFile(
            index=idx,
            path=path,
            suffix=suffix,
            title=title,
            done=done_val,
            ticket_id=ticket_id,
        ),
        [],
    )


def _ticket_files(ticket_dir: Path) -> Tuple[List[TicketFile], List[str]]:
    paths, name_errors = _ticket_paths(ticket_dir)
    tickets: List[TicketFile] = []
    errors = list(name_errors)
    for path in paths:
        ticket, errs = _read_ticket(path)
        if ticket:
            tickets.append(ticket)
        errors.extend(errs)
    tickets.sort(key=lambda t: t.index)
    return tickets, errors


def _read_ticket_id(path: Path) -> Optional[str]:
    try:
        raw = path.read_text(encoding="utf-8")
    except OSError:
        return None
    fm_yaml, fm_errors = _split_frontmatter(raw)
    if fm_errors:
        return None
    data, parse_errors = _parse_yaml(fm_yaml)
    if parse_errors:
        return None
    return _sanitize_ticket_id(data.get("ticket_id"))


def _pad_width(indices: Sequence[int]) -> int:
    if not indices:
        return 3
    return max(3, max(len(str(i)) for i in indices))


def _fmt_name(index: int, suffix: str, width: int) -> str:
    return f"TICKET-{index:0{width}d}{suffix}.md"


def _safe_renames(mapping: Sequence[tuple[Path, Path]]) -> None:
    temp_pairs: list[tuple[Path, Path]] = []
    for src, dst in mapping:
        if src == dst:
            continue
        temp = src.with_name(src.name + ".tmp-move")
        counter = 0
        while temp.exists():
            counter += 1
            temp = src.with_name(f"{src.name}.tmp-move-{counter}")
        src.rename(temp)
        temp_pairs.append((temp, dst))

    for temp, dst in temp_pairs:
        dst.parent.mkdir(parents=True, exist_ok=True)
        temp.rename(dst)


def cmd_list(ticket_dir: Path) -> int:
    tickets, errors = _ticket_files(ticket_dir)
    if errors:
        for msg in errors:
            sys.stderr.write(msg + "\n")
    width = _pad_width([t.index for t in tickets])
    for t in tickets:
        status = "done" if t.done else "open"
        title = f" - {t.title}" if t.title else ""
        sys.stdout.write(f"{t.index:0{width}d} [{status}] {t.path.name}{title}\n")
    if errors:
        return 1
    return 0


def cmd_lint(ticket_dir: Path, *, fix_ticket_ids: bool) -> int:
    run_ticket_lint = _load_shared_linter()
    if run_ticket_lint is None:
        return 2
    return run_ticket_lint(ticket_dir, fix_ticket_ids=fix_ticket_ids)


def _shift(ticket_dir: Path, start_idx: int, delta: int) -> None:
    if delta == 0:
        return
    paths, errors = _ticket_paths(ticket_dir)
    if errors:
        raise ValueError("Cannot shift while filenames are invalid; run lint first.")
    iterable = reversed(paths) if delta > 0 else paths
    width = _pad_width([_parse_index(p.name) for p in paths] + [start_idx + delta])
    mapping: list[tuple[Path, Path]] = []
    for path in iterable:
        idx = _parse_index(path.name)
        if idx is None or idx < start_idx:
            continue
        new_idx = idx + delta
        if new_idx <= 0:
            raise ValueError("Shift would create non-positive ticket index")
        suffix = _parse_suffix(path.name)
        target = path.with_name(_fmt_name(new_idx, suffix, width))
        mapping.append((path, target))
    _safe_renames(mapping)


def _parse_index(name: str) -> Optional[int]:
    m = _TICKET_NAME_RE.match(name)
    return int(m.group(1)) if m else None


def _parse_suffix(name: str) -> str:
    m = _TICKET_NAME_RE.match(name)
    return m.group(2) if m else ""


def _generate_ticket_id() -> str:
    return f"tkt_{uuid.uuid4().hex}"


def _create_ticket_file(ticket_dir: Path, *, index: int, title: str, agent: str, existing_indices: List[int]) -> Path:
    normalized_agent, agent_error = _normalize_agent(agent)
    if agent_error:
        raise ValueError(agent_error)
    assert normalized_agent is not None
    width = _pad_width(existing_indices + [index])
    name = _fmt_name(index, "", width)
    path = ticket_dir / name
    if path.exists():
        raise ValueError(f"Ticket index {index} already exists: {path}")
    path.parent.mkdir(parents=True, exist_ok=True)
    title_scalar = _yaml_scalar(title)
    agent_scalar = _yaml_scalar(normalized_agent)
    ticket_id_scalar = _yaml_scalar(_generate_ticket_id())
    body = (
        f"---\n"
        f"title: {title_scalar}\n"
        f"agent: {agent_scalar}\n"
        f"done: false\n"
        f"ticket_id: {ticket_id_scalar}\n"
        f"---\n\n"
        f"## Goal\n- \n"
    )
    path.write_text(body, encoding="utf-8")
    return path


def cmd_insert(
    ticket_dir: Path,
    *,
    before: Optional[int],
    after: Optional[int],
    count: int,
    title: Optional[str],
    agent: str,
) -> int:
    if (before is None) == (after is None):
        sys.stderr.write("Specify exactly one of --before or --after.\n")
        return 2
    if title and count != 1:
        sys.stderr.write("--title is only supported with --count 1.\n")
        return 2
    if title:
        _normalized_agent, agent_error = _normalize_agent(agent)
        if agent_error:
            sys.stderr.write(agent_error + "\n")
            return 1
    anchor = before if before is not None else after + 1  # type: ignore[operator]
    if anchor is None or anchor < 1:
        sys.stderr.write("Anchor index must be >= 1.\n")
        return 2
    try:
        _shift(ticket_dir, anchor, count)
    except ValueError as exc:
        sys.stderr.write(str(exc) + "\n")
        return 1
    if title:
        tickets, errors = _ticket_files(ticket_dir)
        if errors:
            for msg in errors:
                sys.stderr.write(msg + "\n")
            return 1
        existing_indices = [t.index for t in tickets]
        try:
            path = _create_ticket_file(
                ticket_dir, index=anchor, title=title, agent=agent, existing_indices=existing_indices
            )
        except ValueError as exc:
            sys.stderr.write(str(exc) + "\n")
            return 1
        sys.stdout.write(f"Inserted gap and created {path}\n")
    else:
        sys.stdout.write(
            f"Inserted gap at index {anchor}; run create --at {anchor} to add a ticket.\n"
        )
    return 0


def _yaml_scalar(value: str) -> str:
    '''Render a Python string as a safe single-line YAML scalar.

    Returns a double-quoted value with backslashes, quotes, and newlines escaped.
    '''

    escaped = (
        value.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\n", "\\n")
    )
    return f'"{escaped}"'


def cmd_create(ticket_dir: Path, *, title: str, agent: str, at: Optional[int]) -> int:
    tickets, errors = _ticket_files(ticket_dir)
    if errors:
        for msg in errors:
            sys.stderr.write(msg + "\n")
        return 1
    existing_indices = [t.index for t in tickets]
    next_index = max(existing_indices) + 1 if existing_indices else 1
    index = at or next_index
    if index in existing_indices:
        sys.stderr.write(
            f"Ticket index {index} already exists. Use insert to open a gap or choose --at another index.\n"
        )
        return 1
    try:
        path = _create_ticket_file(
            ticket_dir, index=index, title=title, agent=agent, existing_indices=existing_indices
        )
    except ValueError as exc:
        sys.stderr.write(str(exc) + "\n")
        return 1
    sys.stdout.write(f"Created {path}\n")
    return 0


def cmd_move(ticket_dir: Path, *, start: int, end: Optional[int], to: int) -> int:
    if start < 1 or to < 1:
        sys.stderr.write("Indices must be >= 1.\n")
        return 2
    tickets, errors = _ticket_files(ticket_dir)
    if errors:
        for msg in errors:
            sys.stderr.write(msg + "\n")
        return 1
    indices = [t.index for t in tickets]
    if start not in indices:
        sys.stderr.write(f"No ticket at index {start}.\n")
        return 1
    end_idx = end if end is not None else start
    if end_idx < start:
        sys.stderr.write("--end must be >= --start.\n")
        return 2
    block = [t for t in tickets if start <= t.index <= end_idx]
    if not block:
        sys.stderr.write("No tickets in the specified move range.\n")
        return 1
    remaining = [t for t in tickets if t not in block]
    insert_pos = to - 1
    if insert_pos < 0 or insert_pos > len(remaining):
        sys.stderr.write("Target position is out of range.\n")
        return 1
    new_order = remaining[:insert_pos] + block + remaining[insert_pos:]
    width = _pad_width([t.index for t in new_order])

    mapping: list[tuple[Path, Path]] = []
    for new_idx, ticket in enumerate(new_order, start=1):
        target = ticket.path.with_name(_fmt_name(new_idx, ticket.suffix, width))
        mapping.append((ticket.path, target))
    _safe_renames(mapping)
    return 0


def main(argv: Optional[Sequence[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Manage Codex Autorunner tickets.")
    sub = parser.add_subparsers(dest="cmd", required=True)

    sub.add_parser("list", help="List tickets in order")
    lint_p = sub.add_parser(
        "lint",
        help="Validate ticket filenames and frontmatter (compatibility wrapper)",
    )
    lint_p.add_argument(
        "--fix-ticket-ids",
        action="store_true",
        help="Backfill missing or invalid ticket_id values before linting.",
    )

    insert_p = sub.add_parser("insert", help="Insert gap by shifting tickets")
    insert_group = insert_p.add_mutually_exclusive_group(required=True)
    insert_group.add_argument("--before", type=int, help="First index to shift upward")
    insert_group.add_argument("--after", type=int, help="Shift tickets after this index")
    insert_p.add_argument("--count", type=int, default=1, help="How many slots to insert (default 1)")
    insert_p.add_argument(
        "--title",
        help="Create a ticket in the new slot (requires --count 1)",
    )
    insert_p.add_argument(
        "--agent",
        default="codex",
        help="Frontmatter agent when creating with --title (default: codex)",
    )

    create_p = sub.add_parser("create", help="Create a new ticket")
    create_p.add_argument("--title", required=True, help="Ticket title")
    create_p.add_argument("--agent", default="codex", help="Frontmatter agent (default: codex)")
    create_p.add_argument(
        "--at",
        type=int,
        help="Index to use (must be unused). Defaults to next available index.",
    )

    move_p = sub.add_parser("move", help="Move a ticket or block to a new position")
    move_p.add_argument("--start", type=int, required=True, help="First index in the block to move")
    move_p.add_argument("--end", type=int, help="Last index in the block (defaults to start)")
    move_p.add_argument("--to", type=int, required=True, help="Destination position (1-indexed)")

    args = parser.parse_args(argv)
    repo_root = _repo_root()
    ticket_dir = _ticket_dir(repo_root)
    if not ticket_dir.exists():
        sys.stderr.write(f"Tickets directory not found: {ticket_dir}\n")
        return 2

    if args.cmd == "list":
        return cmd_list(ticket_dir)
    if args.cmd == "lint":
        return cmd_lint(ticket_dir, fix_ticket_ids=args.fix_ticket_ids)
    if args.cmd == "insert":
        return cmd_insert(
            ticket_dir,
            before=args.before,
            after=args.after,
            count=args.count,
            title=args.title,
            agent=args.agent,
        )
    if args.cmd == "create":
        return cmd_create(ticket_dir, title=args.title, agent=args.agent, at=args.at)
    if args.cmd == "move":
        return cmd_move(ticket_dir, start=args.start, end=args.end, to=args.to)
    parser.error("Unknown command")
    return 2


if __name__ == "__main__":  # pragma: no cover
    sys.exit(main())
