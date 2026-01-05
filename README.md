# Abishek-kk-BEFUNGE-93---Talos26

# 🧩 Befunge-93 Advanced Visual Debugger

An **advanced, web-based Befunge-93 compiler and visual debugger** built using **HTML, CSS, and JavaScript**.

This project allows you to **write, execute, and visually dry-run Befunge-93 programs** with step-by-step execution, time-travel debugging, and rich visualizations.

> 🎯 Ideal for learning esoteric languages, teaching compiler concepts, hackathons, and portfolio showcase.

---

## 🚀 Features

### 🔹 Befunge-93 Language Support
- Full **Befunge-93 instruction set**
- True **80 × 25 toroidal playfield**
- Stack-based execution model
- String mode (`" "`)
- Memory access instructions (`g` / `p`)
- Safe stack behavior (empty pop → `0`)
- Random direction instruction (`?`)

### 🔹 Advanced Visualization
- Canvas-based **2D execution grid**
- Animated **Instruction Pointer (IP)** with direction arrow
- **Execution heat-map** showing frequently visited cells
- Live stack visualization (Top → Bottom)
- Real-time program output panel

### 🔹 Time-Travel Debugging
- Step forward execution
- **Step backward (time travel)**
- Immutable execution snapshots
- Execution trace log
- Pause / Resume execution
- Adjustable execution speed

### 🔹 Developer-Friendly Architecture
- Modular and clean codebase
- Separation of concerns:
  - Engine (execution logic)
  - Renderer (visualization)
  - Debugger (history & time travel)
  - Controls (UI orchestration)

---

## 🗂 Project Structure

```text
/src
 ├── index.html      # Application layout and UI structure
 ├── style.css       # IDE-style dark theme and animations
 ├── engine.js       # Befunge-93 execution engine
 ├── renderer.js     # Canvas-based visualization layer
 ├── debugger.js     # Time-travel debugger and history manager
 ├── controls.js     # UI controls and event orchestration
