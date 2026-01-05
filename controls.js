/* =========================================================
   CONTROLS.JS
   UI → Debugger orchestration layer

   Responsibilities:
   - Wire buttons & inputs
   - Control run / pause / step
   - Manage speed slider
   - Load / reset programs
========================================================= */

(() => {

  /* =========================
     DOM ELEMENTS
  ========================= */

  const codeEditor   = document.getElementById("codeEditor");

  const btnStep      = document.getElementById("btnStep");
  const btnRun       = document.getElementById("btnRun");
  const btnPause     = document.getElementById("btnPause");
  const btnBack      = document.getElementById("btnBack");
  const btnReset     = document.getElementById("btnReset");

  const speedSlider  = document.getElementById("speedControl");
  const speedLabel   = document.getElementById("speedLabel");

  /* =========================
     INITIAL SETUP
  ========================= */

  function updateSpeedLabel() {
    speedLabel.textContent = `${speedSlider.value} ms`;
  }

  updateSpeedLabel();

  /* =========================
     PROGRAM LOADING
  ========================= */

  function loadFromEditor() {
    const source = codeEditor.value || "";
    BefungeDebugger.loadProgram(source);
  }

  /* =========================
     BUTTON HANDLERS
  ========================= */

  btnStep.addEventListener("click", () => {
    if (BefungeDebugger.isRunning()) return;

    if (BefungeDebugger.getHistoryLength() === 0) {
      loadFromEditor();
    }

    BefungeDebugger.stepForward();
  });

  btnBack.addEventListener("click", () => {
    if (BefungeDebugger.isRunning()) return;
    BefungeDebugger.stepBackward();
  });

  btnRun.addEventListener("click", () => {
    if (BefungeDebugger.isRunning()) return;

    if (BefungeDebugger.getHistoryLength() === 0) {
      loadFromEditor();
    }

    const speed = Number(speedSlider.value);
    BefungeDebugger.startRunLoop(speed);
  });

  btnPause.addEventListener("click", () => {
    BefungeDebugger.stopRunLoop();
  });

  btnReset.addEventListener("click", () => {
    BefungeDebugger.stopRunLoop();
    loadFromEditor();
  });

  /* =========================
     SPEED CONTROL
  ========================= */

  speedSlider.addEventListener("input", () => {
    updateSpeedLabel();

    if (BefungeDebugger.isRunning()) {
      BefungeDebugger.stopRunLoop();
      BefungeDebugger.startRunLoop(Number(speedSlider.value));
    }
  });

  /* =========================
     EDITOR CHANGE HANDLING
     (Auto-reset on edit)
  ========================= */

  let editorDirty = false;

  codeEditor.addEventListener("input", () => {
    editorDirty = true;
  });

  codeEditor.addEventListener("blur", () => {
    if (editorDirty) {
      BefungeDebugger.stopRunLoop();
      loadFromEditor();
      editorDirty = false;
    }
  });

  /* =========================
     INITIAL LOAD
  ========================= */

  window.addEventListener("load", () => {
    loadFromEditor();
  });

})();
