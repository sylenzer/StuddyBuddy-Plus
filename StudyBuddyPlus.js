import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import StudyBuddyMathDashboard from "@/components/StudyBuddyMathDashboard";
import { defineConfig } from "cypress";

describe("StudyBuddy+ Math Dashboard", () => {
  test("renders dashboard and UI elements correctly", () => {
    render(<StudyBuddyMathDashboard />);
    expect(screen.getByText("📚 StudyBuddy+ Math Dashboard")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type your math problem here")).toBeInTheDocument();
    expect(screen.getByText("🔍 Solve")).toBeInTheDocument();
  });

  test("handles empty input submission", () => {
    render(<StudyBuddyMathDashboard />);
    const solveButton = screen.getByText("🔍 Solve");
    fireEvent.click(solveButton);
    expect(screen.getByText("❌ Please enter a problem to solve.")).toBeInTheDocument();
  });

  test("handles extremely large numbers", () => {
    render(<StudyBuddyMathDashboard />);
    const input = screen.getByPlaceholderText("Type your math problem here");
    const solveButton = screen.getByText("🔍 Solve");
    fireEvent.change(input, { target: { value: "9999999999999999 * 9999999999999999" } });
    fireEvent.click(solveButton);
    expect(screen.getByText("🤖 AI is solving..."));
  });

  test("toggles dark mode correctly", () => {
    render(<StudyBuddyMathDashboard />);
    const toggleSwitch = screen.getByText("☀️ Light Mode").nextSibling;
    fireEvent.click(toggleSwitch);
    expect(screen.getByText("🌙 Dark Mode")).toBeInTheDocument();
  });

  test("prevents invalid inputs", () => {
    render(<StudyBuddyMathDashboard />);
    const input = screen.getByPlaceholderText("Type your math problem here");
    fireEvent.change(input, { target: { value: "Hello world!" } });
    const solveButton = screen.getByText("🔍 Solve");
    fireEvent.click(solveButton);
    expect(screen.getByText("❌ Invalid input. Please enter a valid math problem.")).toBeInTheDocument();
  });
});

export const e2eTests = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000",
  },
});

describe("E2E Tests for StudyBuddy+", () => {
  it("Loads the StudyBuddy dashboard", () => {
    cy.visit("/");
    cy.contains("📚 StudyBuddy+ Math Dashboard").should("be.visible");
  });

  it("Prevents empty submissions", () => {
    cy.visit("/");
    cy.contains("🔍 Solve").click();
    cy.contains("❌ Please enter a problem to solve.").should("be.visible");
  });

  it("Handles large numbers", () => {
    cy.visit("/");
    cy.get("input[placeholder='Type your math problem here']").type("9999999999999999 * 9999999999999999");
    cy.contains("🔍 Solve").click();
    cy.contains("🤖 AI is solving...").should("be.visible");
  });

  it("Rejects invalid text input", () => {
    cy.visit("/");
    cy.get("input[placeholder='Type your math problem here']").type("Hello world!");
    cy.contains("🔍 Solve").click();
    cy.contains("❌ Invalid input. Please enter a valid math problem.").should("be.visible");
  });

  it("Tracks solved problems", () => {
    cy.visit("/");
    cy.contains("🔍 Solve").click();
    cy.wait(3000);
    cy.contains("Solved Problems: 1").should("be.visible");
  });
});
