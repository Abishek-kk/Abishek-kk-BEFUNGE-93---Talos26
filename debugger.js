/* =========================================================
   DEBUGGER.JS
   Time-travel execution manager for Befunge-93

   Responsibilities:
   - Maintain immutable history
   - Step forward / backward
   - Restart & reset
   - Bridge engine ↔ renderer
========================================================= */

(() => {

  /* =========================
     INTERNAL STATE
  ========================= */

  let grid = null;          // Static program grid
  let history = [];         // Array of immutable states
  let pointer = -1;         // Current position in history
  let running = false;      // Run loop flag
  let timer = null;         // setInterval handler

  /* =========================
     INITIALIZATION
  ========================= */

  function loadProgram(source) {
    grid = BefungeEngine.loadGridFromSource(source);
    history = [];
    pointer = -1;
    running = false;
    stopRunLoop();

    const initial = BefungeEngine.initialState(grid);
    history.push(initial);
    pointer = 0;

    BefungeRenderer.reset();
    BefungeRenderer.render(initial);
  }

  /* =========================
     EXECUTION CONTROL
  ========================= */

  function stepForward() {
    if (!history.length) return;

    const current = history[pointer];
    if (current.halted) {
      stopRunLoop();
      return;
    }

    const next = BefungeEngine.step(current);

    history.push(next);
    pointer++;

    BefungeRenderer.render(next);
  }

  function stepBackward() {
    if (pointer <= 0) return;

    pointer--;
    const prev = history[pointer];

    BefungeRenderer.render(prev);
  }

  function reset() {
    if (!grid) return;

    stopRunLoop();

    history = [];
    pointer = -1;

    const initial = BefungeEngine.initialState(grid);
    history.push(initial);
    pointer = 0;

    BefungeRenderer.reset();
    BefungeRenderer.render(initial);
  }

  /* =========================
     RUN LOOP
  ========================= */

  function startRunLoop(speed) {
    stopRunLoop();
    running = true;

    timer = setInterval(() => {
      if (!running) return;

      const state = history[pointer];
      if (state.halted) {
        stopRunLoop();
        return;
      }

      stepForward();
    }, speed);
  }

  function stopRunLoop() {
    running = false;
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  /* =========================
     STATE QUERIES
  ========================= */

  function isRunning() {
    return running;
  }

  function getCurrentState() {
    return history[pointer] || null;
  }

  function getHistoryLength() {
    return history.length;
  }

  function getPointer() {
    return pointer;
  }

  /* =========================
     PUBLIC API
  ========================= */

  window.BefungeDebugger = {
    loadProgram,
    stepForward,
    stepBackward,
    reset,
    startRunLoop,
    stopRunLoop,
    isRunning,
    getCurrentState,
    getHistoryLength,
    getPointer
  };

})();
