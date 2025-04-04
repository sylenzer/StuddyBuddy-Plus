
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSpeechRecognition } from "react-speech-kit";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import { Switch } from "@/components/ui/switch";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function StudyBuddyMathDashboard() {
  const [customProblem, setCustomProblem] = useState("");
  const [customSolution, setCustomSolution] = useState("");
  const [solutionMethod, setSolutionMethod] = useState("algebraic");
  const [graphData, setGraphData] = useState(null);
  const [alternativeMethods, setAlternativeMethods] = useState([]);
  const [hints, setHints] = useState("");
  const [solvedProblems, setSolvedProblems] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const { listen, stop } = useSpeechRecognition({
    onResult: (result) => setCustomProblem(result),
  });

  const solveCustomProblem = async () => {
    setLoading(true);
    setCustomSolution("🤖 AI is solving...");
    setGraphData(null);
    setAlternativeMethods([]);
    setHints("");

    try {
      const response = await fetch("https://api.mathsolver.com/solve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problem: customProblem,
          method: solutionMethod,
        }),
      });
      const data = await response.json();
      setCustomSolution(data.solution || "Solution not available");
      setLoading(false);

      if (solutionMethod === "graphical" && data.graph) {
        setGraphData({
          labels: data.graph.xValues,
          datasets: [
            {
              label: "Graph",
              data: data.graph.yValues,
              borderColor: "blue",
              borderWidth: 2,
              fill: false,
            },
          ],
        });
      }
      if (data.alternativeMethods) {
        setAlternativeMethods(data.alternativeMethods);
      }
      if (data.hints) {
        setHints(data.hints);
      }
      setSolvedProblems((prev) => prev + 1);
    } catch (error) {
      setCustomSolution("❌ Error solving the problem. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center p-6 space-y-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <h1 className="text-3xl font-bold">📚 StudyBuddy+ Math Dashboard</h1>
      <div className="flex items-center space-x-2">
        <span>{darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
      </div>
      <p className="text-lg font-semibold">Solved Problems: {solvedProblems}</p>
      <Card className="w-96 p-4 text-center mt-6 shadow-lg rounded-xl">
        <CardContent>
          <h2 className="text-lg font-bold">Enter Your Own Problem</h2>
          <Input
            type="text"
            placeholder="Type your math problem here"
            value={customProblem}
            onChange={(e) => setCustomProblem(e.target.value)}
            className="mt-4"
          />
          <Button onClick={listen} className="mt-2">🎙 Speak Problem</Button>
          <Button onClick={stop} className="mt-2 ml-2">🛑 Stop Listening</Button>
          <
// Placeholder for StudyBuddyMathDashboard.jsx (insert actual code here)
