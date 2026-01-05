/* =========================================================
   BEFUNGE-93 EXECUTION ENGINE
   Pure logic – no rendering, no DOM
========================================================= */

(() => {

  /* =========================
     CONSTANTS
  ========================= */

  const WIDTH = 80;
  const HEIGHT = 25;

  const DIRS = {
    RIGHT: { dx: 1, dy: 0, symbol: "→" },
    LEFT:  { dx: -1, dy: 0, symbol: "←" },
    UP:    { dx: 0, dy: -1, symbol: "↑" },
    DOWN:  { dx: 0, dy: 1, symbol: "↓" }
  };

  const DIR_ARRAY = [DIRS.RIGHT, DIRS.LEFT, DIRS.UP, DIRS.DOWN];

  /* =========================
     ENGINE STATE
  ========================= */

  function createEmptyGrid() {
    return Array.from({ length: HEIGHT }, () =>
      Array(WIDTH).fill(" ")
    );
  }

  function loadGridFromSource(source) {
    const grid = createEmptyGrid();
    const lines = source.split("\n");

    lines.forEach((line, y) => {
      if (y >= HEIGHT) return;
      [...line].forEach((ch, x) => {
        if (x < WIDTH) grid[y][x] = ch;
      });
    });

    return grid;
  }

  function initialState(grid) {
    return {
      grid,
      ip: { x: 0, y: 0, dx: 1, dy: 0 },
      stack: [],
      output: "",
      inputBuffer: [],
      stringMode: false,
      halted: false,
      stepCount: 0
    };
  }

  function cloneState(state) {
    return {
      grid: state.grid.map(row => [...row]),
      ip: { ...state.ip },
      stack: [...state.stack],
      output: state.output,
      inputBuffer: [...state.inputBuffer],
      stringMode: state.stringMode,
      halted: state.halted,
      stepCount: state.stepCount
    };
  }

  /* =========================
     STACK HELPERS
  ========================= */

  function pop(stack) {
    return stack.length ? stack.pop() : 0;
  }

  function push(stack, value) {
    stack.push(value | 0);
  }

  /* =========================
     IP MOVEMENT
  ========================= */

  function moveIP(ip) {
    ip.x = (ip.x + ip.dx + WIDTH) % WIDTH;
    ip.y = (ip.y + ip.dy + HEIGHT) % HEIGHT;
  }

  function setDir(ip, dir) {
    ip.dx = dir.dx;
    ip.dy = dir.dy;
  }

  /* =========================
     EXECUTE SINGLE STEP
  ========================= */

  function step(state) {
    if (state.halted) return state;

    const s = cloneState(state);
    const { ip, grid } = s;

    const instr = grid[ip.y][ip.x];
    s.stepCount++;

    /* ---------- STRING MODE ---------- */
    if (s.stringMode && instr !== '"') {
      push(s.stack, instr.charCodeAt(0));
      moveIP(ip);
      return s;
    }

    /* ---------- DIGITS ---------- */
    if (instr >= "0" && instr <= "9") {
      push(s.stack, instr.charCodeAt(0) - 48);
    }

    /* ---------- INSTRUCTION SWITCH ---------- */
    switch (instr) {

      /* Direction */
      case ">": setDir(ip, DIRS.RIGHT); break;
      case "<": setDir(ip, DIRS.LEFT); break;
      case "^": setDir(ip, DIRS.UP); break;
      case "v": setDir(ip, DIRS.DOWN); break;
      case "?": setDir(ip, DIR_ARRAY[Math.floor(Math.random() * 4)]); break;

      /* Arithmetic */
      case "+": push(s.stack, pop(s.stack) + pop(s.stack)); break;
      case "-": {
        const a = pop(s.stack), b = pop(s.stack);
        push(s.stack, b - a); break;
      }
      case "*": push(s.stack, pop(s.stack) * pop(s.stack)); break;
      case "/": {
        const a = pop(s.stack), b = pop(s.stack);
        push(s.stack, a === 0 ? 0 : Math.trunc(b / a)); break;
      }
      case "%": {
        const a = pop(s.stack), b = pop(s.stack);
        push(s.stack, a === 0 ? 0 : b % a); break;
      }

      /* Logic */
      case "!": push(s.stack, pop(s.stack) === 0 ? 1 : 0); break;
      case "`": {
        const a = pop(s.stack), b = pop(s.stack);
        push(s.stack, b > a ? 1 : 0); break;
      }

      /* Flow */
      case "_": setDir(ip, pop(s.stack) === 0 ? DIRS.RIGHT : DIRS.LEFT); break;
      case "|": setDir(ip, pop(s.stack) === 0 ? DIRS.DOWN : DIRS.UP); break;
      case "#": moveIP(ip); break;

      /* Stack ops */
      case ":": {
        const v = pop(s.stack);
        push(s.stack, v);
        push(s.stack, v);
        break;
      }
      case "\\": {
        const a = pop(s.stack), b = pop(s.stack);
        push(s.stack, a);
        push(s.stack, b);
        break;
      }
      case "$": pop(s.stack); break;

      /* Output */
      case ".": s.output += pop(s.stack) + " "; break;
      case ",": s.output += String.fromCharCode(pop(s.stack)); break;

      /* Input (stubbed as 0 if empty) */
      case "&": push(s.stack, s.inputBuffer.length ? s.inputBuffer.shift() : 0); break;
      case "~": push(s.stack, s.inputBuffer.length ? s.inputBuffer.shift().charCodeAt(0) : 0); break;

      /* String mode toggle */
      case "\"": s.stringMode = !s.stringMode; break;

      /* Memory access */
      case "g": {
        const y = pop(s.stack);
        const x = pop(s.stack);
        if (y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH) {
          push(s.stack, grid[y][x].charCodeAt(0));
        } else {
          push(s.stack, 0);
        }
        break;
      }

      case "p": {
        const y = pop(s.stack);
        const x = pop(s.stack);
        const v = pop(s.stack);
        if (y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH) {
          grid[y][x] = String.fromCharCode(v);
        }
        break;
      }

      /* End */
      case "@":
        s.halted = true;
        return s;
    }

    moveIP(ip);
    return s;
  }

  /* =========================
     PUBLIC API
  ========================= */

  window.BefungeEngine = {
    WIDTH,
    HEIGHT,
    loadGridFromSource,
    initialState,
    step
  };

})();
