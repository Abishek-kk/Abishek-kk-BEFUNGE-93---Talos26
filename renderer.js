/* =========================================================
   RENDERER.JS
   Canvas-based visualization layer
   Responsible for:
   - 80x25 grid rendering
   - Instruction Pointer visualization
   - Direction arrow
   - Execution heat-map
   - UI panel sync (stack, output, IP info)
========================================================= */

(() => {

  /* =========================
     CONSTANTS
  ========================= */

  const CELL_SIZE = 20;
  const FONT_SIZE = 13;
  const FONT_FAMILY = "JetBrains Mono, Consolas, monospace";

  const COLORS = {
    bg: "#020617",
    grid: "#1e293b",
    text: "#94a3b8",
    ip: "#22c55e",
    ipText: "#020617",
    heat: "#2563eb",
    stringMode: "#eab308"
  };

  /* =========================
     CANVAS SETUP
  ========================= */

  const canvas = document.getElementById("befungeCanvas");
  const ctx = canvas.getContext("2d");

  ctx.font = `${FONT_SIZE}px ${FONT_FAMILY}`;
  ctx.textBaseline = "top";

  /* =========================
     HEAT MAP DATA
  ========================= */

  const heatMap = Array.from({ length: BefungeEngine.HEIGHT }, () =>
    Array(BefungeEngine.WIDTH).fill(0)
  );

  function incrementHeat(x, y) {
    heatMap[y][x]++;
  }

  /* =========================
     DRAW GRID
  ========================= */

  function drawGrid(grid) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < BefungeEngine.HEIGHT; y++) {
      for (let x = 0; x < BefungeEngine.WIDTH; x++) {

        const heat = heatMap[y][x];
        if (heat > 0) {
          ctx.fillStyle = `rgba(37, 99, 235, ${Math.min(heat / 20, 0.4)})`;
          ctx.fillRect(
            x * CELL_SIZE,
            y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
          );
        }

        ctx.strokeStyle = COLORS.grid;
        ctx.strokeRect(
          x * CELL_SIZE,
          y * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE
        );

        ctx.fillStyle = COLORS.text;
        ctx.fillText(
          grid[y][x],
          x * CELL_SIZE + 6,
          y * CELL_SIZE + 3
        );
      }
    }
  }

  /* =========================
     DRAW INSTRUCTION POINTER
  ========================= */

  function drawIP(state) {
    const { ip, stringMode } = state;

    ctx.fillStyle = stringMode ? COLORS.stringMode : COLORS.ip;
    ctx.fillRect(
      ip.x * CELL_SIZE,
      ip.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );

    ctx.fillStyle = COLORS.ipText;
    ctx.fillText(
      state.grid[ip.y][ip.x],
      ip.x * CELL_SIZE + 6,
      ip.y * CELL_SIZE + 3
    );

    drawDirectionArrow(ip);
  }

  /* =========================
     DIRECTION ARROW
  ========================= */

  function drawDirectionArrow(ip) {
    const cx = ip.x * CELL_SIZE + CELL_SIZE / 2;
    const cy = ip.y * CELL_SIZE + CELL_SIZE / 2;

    ctx.fillStyle = "#16a34a";

    ctx.beginPath();

    if (ip.dx === 1) {
      ctx.moveTo(cx + 5, cy);
      ctx.lineTo(cx - 4, cy - 4);
      ctx.lineTo(cx - 4, cy + 4);
    }
    else if (ip.dx === -1) {
      ctx.moveTo(cx - 5, cy);
      ctx.lineTo(cx + 4, cy - 4);
      ctx.lineTo(cx + 4, cy + 4);
    }
    else if (ip.dy === 1) {
      ctx.moveTo(cx, cy + 5);
      ctx.lineTo(cx - 4, cy - 4);
      ctx.lineTo(cx + 4, cy - 4);
    }
    else if (ip.dy === -1) {
      ctx.moveTo(cx, cy - 5);
      ctx.lineTo(cx - 4, cy + 4);
      ctx.lineTo(cx + 4, cy + 4);
    }

    ctx.closePath();
    ctx.fill();
  }

  /* =========================
     UI PANEL SYNC
  ========================= */

  function updateStack(stack) {
    const view = document.getElementById("stackView");
    view.innerHTML = "";

    [...stack].reverse().forEach(value => {
      const div = document.createElement("div");
      div.className = "stack-item";
      div.textContent = value;
      view.appendChild(div);
    });
  }

  function updateOutput(output) {
    document.getElementById("outputView").textContent = output;
  }

  function updateInstructionInfo(state) {
    const ip = state.ip;

    document.getElementById("ipPos").textContent = `${ip.x}, ${ip.y}`;

    let dir = "→";
    if (ip.dx === -1) dir = "←";
    if (ip.dy === -1) dir = "↑";
    if (ip.dy === 1) dir = "↓";

    document.getElementById("ipDir").textContent = dir;
    document.getElementById("currentInstr").textContent =
      state.grid[ip.y][ip.x];
  }

  function appendTrace(state) {
    const trace = document.getElementById("traceView");
    trace.textContent +=
      `#${state.stepCount}  IP(${state.ip.x},${state.ip.y})  ` +
      `Instr: ${state.grid[state.ip.y][state.ip.x]}\n`;
    trace.scrollTop = trace.scrollHeight;
  }

  /* =========================
     MAIN RENDER FUNCTION
  ========================= */

  function render(state) {
    incrementHeat(state.ip.x, state.ip.y);
    drawGrid(state.grid);
    drawIP(state);
    updateStack(state.stack);
    updateOutput(state.output);
    updateInstructionInfo(state);
    appendTrace(state);
  }

  /* =========================
     RESET VISUAL STATE
  ========================= */

  function resetRenderer() {
    for (let y = 0; y < heatMap.length; y++) {
      heatMap[y].fill(0);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("stackView").innerHTML = "";
    document.getElementById("outputView").textContent = "";
    document.getElementById("traceView").textContent = "";
  }

  /* =========================
     PUBLIC API
  ========================= */

  window.BefungeRenderer = {
    render,
    reset: resetRenderer
  };

})();
