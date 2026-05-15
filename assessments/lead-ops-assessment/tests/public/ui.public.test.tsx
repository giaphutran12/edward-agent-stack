import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../../src/app/App";

describe("ops UI", () => {
  it("renders core operator panels", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Leads" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Lead Detail" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Failed CRM Jobs" })).toBeInTheDocument();
  });
});
