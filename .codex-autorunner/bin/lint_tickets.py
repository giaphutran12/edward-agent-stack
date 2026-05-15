#!/usr/bin/env python3
"""Canonical portable ticket frontmatter linter.

`ticket_tool.py lint` is a compatibility wrapper around this same shared
implementation.
"""

from __future__ import annotations

import argparse
import importlib.util
import sys
from pathlib import Path
from typing import List, Optional


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


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Lint CAR ticket frontmatter.")
    parser.add_argument(
        "--fix-ticket-ids",
        action="store_true",
        help="Backfill missing or invalid ticket_id values before linting.",
    )
    args = parser.parse_args(argv)

    run_ticket_lint = _load_shared_linter()
    if run_ticket_lint is None:
        return 2
    return run_ticket_lint(
        Path(__file__).resolve().parent.parent / "tickets",
        fix_ticket_ids=args.fix_ticket_ids,
    )


if __name__ == "__main__":  # pragma: no cover
    sys.exit(main())
