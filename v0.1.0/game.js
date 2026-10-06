/* =========================================================================
   Shattered Depths — game.js
   v0.1.0
   ========================================================================= */

/* ------------------------------ Constants ------------------------------ */
const DUNGEON_WIDTH  = 10;
const DUNGEON_HEIGHT = 10;

const PLAYER_AP_RATE = 1.0;
const RAT_AP_RATE    = 1.0;

const PLAYER_MAX_HP  = 10;
const RAT_MAX_HP     = 3;

const PLAYER_ATTACK  = 1;
const RAT_ATTACK     = 1;

const AI_ACTION_DELAY_MS = 300;

/* -------------------------- Internal constants ------------------------- */
const CELL_SIZE     = 40;
const WALL          = 1;
const FLOOR         = 0;
const BSP_MIN_LEAF  = 3;
const BSP_MAX_DEPTH = 4;

const DIRS = [[0, -1], [0, 1], [-1, 0], [1, 0]];

/* ------------------------------- State --------------------------------- */
const game = {
  runId: 0,
  active: false,
  over: false,
  awaitingInput: false,
  grid: null,
  player: null,
  enemies: [],
  schedule: [],
  scheduleIndex: 0,
};

/* ------------------------------- DOM ----------------------------------- */
const el = {
  screenMenu:      document.getElementById('screen-menu'),
  screenPlay:      document.getElementById('screen-play'),
  screenChangelog: document.getElementById('screen-changelog'),
  grid:            document.getElementById('grid'),
  debug:           document.getElementById('debug'),
  playerHp:        document.getElementById('player-hp'),
  toast:           document.getElementById('toast'),
  modal:           document.getElementById('modal'),
  overlay:         document.getElementById('overlay'),
  overlayText:     document.getElementById('overlay-text'),
};

/* =========================================================================
   Utility
   ========================================================================= */
function randInt(n) { return Math.floor(Math.random() * n); }
function inBounds(x, y) {
  return x >= 0 && y >= 0 && x < DUNGEON_WIDTH && y < DUNGEON_HEIGHT;
}
function manhattan(a, b) { return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); }

function enemyAt(x, y) {
  return game.enemies.find(e => e.hp > 0 && e.x === x && e.y === y) || null;
}

/* =========================================================================
   Dungeon generation (BSP)
   ========================================================================= */
function generateDungeon() {
  const grid = [];
  for (let y = 0; y < DUNGEON_HEIGHT; y++) {
    grid.push(new Array(DUNGEON_WIDTH).fill(WALL));
  }

  // Interior region — the outer ring stays solid wall.
  const root = { x: 1, y: 1, w: DUNGEON_WIDTH - 2, h: DUNGEON_HEIGHT - 2 };
  const leaves = splitRegion(root, 0);

  const rooms = leaves.map(leaf => carveRoom(grid, leaf));

  // Connect rooms in BSP order with L-shaped corridors (guarantees connectivity).
  for (let i = 1; i < rooms.length; i++) {
    carveCorridor(grid, roomCenter(rooms[i - 1]), roomCenter(rooms[i]));
  }

  return grid;
}

function splitRegion(region, depth) {
  const canSplitH = region.w >= BSP_MIN_LEAF * 2;
  const canSplitV = region.h >= BSP_MIN_LEAF * 2;

  if (depth >= BSP_MAX_DEPTH || (!canSplitH && !canSplitV)) return [region];

  let splitHorizontally;
  if (canSplitH && canSplitV) splitHorizontally = Math.random() < 0.5;
  else splitHorizontally = canSplitH;

  if (splitHorizontally) {
    const cut = BSP_MIN_LEAF + randInt(region.w - BSP_MIN_LEAF * 2 + 1);
    return [
      ...splitRegion({ x: region.x, y: region.y, w: cut, h: region.h }, depth + 1),
      ...splitRegion({ x: region.x + cut, y: region.y, w: region.w - cut, h: region.h }, depth + 1),
    ];
  } else {
    const cut = BSP_MIN_LEAF + randInt(region.h - BSP_MIN_LEAF * 2 + 1);
    return [
      ...splitRegion({ x: region.x, y: region.y, w: region.w, h: cut }, depth + 1),
      ...splitRegion({ x: region.x, y: region.y + cut, w: region.w, h: region.h - cut }, depth + 1),
    ];
  }
}

function carveRoom(grid, leaf) {
  const x = leaf.x + 1;
  const y = leaf.y + 1;
  const w = Math.max(1, leaf.w - 2);
  const h = Math.max(1, leaf.h - 2);

  for (let j = y; j < y + h; j++) {
    for (let i = x; i < x + w; i++) {
      if (inBounds(i, j)) grid[j][i] = FLOOR;
    }
  }
  return { x, y, w, h };
}

function roomCenter(room) {
  return {
    x: room.x + Math.floor((room.w - 1) / 2),
    y: room.y + Math.floor((room.h - 1) / 2),
  };
}

function carveCorridor(grid, a, b) {
  let x = a.x, y = a.y;

  const horizontalFirst = Math.random() < 0.5;
  const stepX = () => {
    while (x !== b.x) {
      x += Math.sign(b.x - x);
      if (inBounds(x, y)) grid[y][x] = FLOOR;
    }
  };
  const stepY = () => {
    while (y !== b.y) {
      y += Math.sign(b.y - y);
      if (inBounds(x, y)) grid[y][x] = FLOOR;
    }
  };

  if (horizontalFirst) { stepX(); stepY(); } else { stepY(); stepX(); }

  if (inBounds(a.x, a.y)) grid[a.y][a.x] = FLOOR;
  if (inBounds(b.x, b.y)) grid[b.y][b.x] = FLOOR;
}

/* =========================================================================
   Actors
   ========================================================================= */
function makePlayer(x, y) {
  return {
    isPlayer: true,
    label: 'P',
    tieOrder: 999,          // ties with enemies: enemies are processed first
    x, y,
    hp: PLAYER_MAX_HP,
    maxHp: PLAYER_MAX_HP,
    apRate: PLAYER_AP_RATE,
    currentAp: 0,
  };
}

function makeRat(x, y) {
  return {
    isPlayer: false,
    label: 'E',
    tieOrder: 0,            // spawn order among enemies
    x, y,
    hp: RAT_MAX_HP,
    maxHp: RAT_MAX_HP,
    apRate: RAT_AP_RATE,
    currentAp: 0,
  };
}

/* =========================================================================
   AP schedule
   ========================================================================= */
/**
 * Build the locked turn schedule for this turn.
 *
 *  - sort actors ascending by n_a (number of actions this turn)
 *  - place each actor's actions using ceil(k * R / n) over the free-slot list
 *
 * Tie-break note: with the ceil-proportional placement, the actor processed
 * FIRST is pushed toward the LAST free slot. For the canonical cases to come
 * out right (e.g. P:1 / E:1  ->  "P E"), the player must therefore be
 * processed LAST when action counts are equal — i.e. enemies come first in
 * the sorted list, then the player.
 *
 * This is deliberately the opposite of the literal spec prose
 * ("Player first, then enemies, in spawn order"), which would produce the
 * reversed sequence. The code semantics below match all 9 canonical test
 * cases; the spec prose is what's wrong.
 */
function buildSchedule(actors) {
  const entries = actors
    .map(a => ({ actor: a, n: Math.floor(a.currentAp) }))
    .filter(e => e.n > 0);

  entries.sort((a, b) => {
    if (a.n !== b.n) return a.n - b.n;
    return a.actor.tieOrder - b.actor.tieOrder;
  });

  const T = entries.reduce((sum, e) => sum + e.n, 0);
  const free = [];
  for (let i = 1; i <= T; i++) free.push(i);

  const slots = new Array(T).fill(null);

  for (const entry of entries) {
    const n = entry.n;
    for (let k = 1; k <= n; k++) {
      const R = free.length;
      const pos = Math.ceil((k * R) / n);
      const slotNumber = free[pos - 1];
      slots[slotNumber - 1] = entry.actor;
      free.splice(pos - 1, 1);
    }
  }

  return slots;
}

/* =========================================================================
   Turn flow
   ========================================================================= */
function startNewTurn() {
  if (!game.active || game.over) return;

  const actors = [game.player, ...game.enemies].filter(a => a.hp > 0);

  // 1. Gain AP.
  for (const a of actors) a.currentAp += a.apRate;

  // 2/3. Compute n_a and lock the schedule for the turn.
  game.schedule = buildSchedule(actors);
  game.scheduleIndex = 0;

  render();

  if (game.schedule.length === 0) {
    // Nothing to do this turn (shouldn't happen with the default rates).
    setTimeout(() => { if (game.active && !game.over) startNewTurn(); },
               AI_ACTION_DELAY_MS);
    return;
  }

  advance();
}

function advance() {
  if (!game.active || game.over) return;

  // Turn over? Only NOW do we resolve win / lose, so a mid-turn kill does
  // not abort the remaining slots of the locked schedule.
  if (game.scheduleIndex >= game.schedule.length) {
    checkGameEnd();
    if (game.over) return;
    startNewTurn();
    return;
  }

  const actor = game.schedule[game.scheduleIndex];

  // Dead actors and actors that cannot afford an action are skipped.
  if (!actor || actor.hp <= 0 || actor.currentAp < 1) {
    game.scheduleIndex++;
    advance();
    return;
  }

  if (actor.isPlayer) {
    game.awaitingInput = true;
    render();
    return; // wait for WASD / SPACE
  }

  // Enemy action.
  game.awaitingInput = false;
  render();

  const runId = game.runId;
  setTimeout(() => {
    if (runId !== game.runId) return;          // run was restarted
    if (!game.active || game.over) return;
    if (actor.hp <= 0 || actor.currentAp < 1) {
      game.scheduleIndex++;
      advance();
      return;
    }

    ratAction(actor);
    actor.currentAp -= 1;
    game.scheduleIndex++;

    // If the rat killed the player, end immediately — no point resolving
    // the rest of the schedule for a dead protagonist.
    if (game.player.hp <= 0) {
      checkGameEnd();
      render();
      return;
    }

    render();

    if (game.active && !game.over) advance();
  }, AI_ACTION_DELAY_MS);
}

/* ---------------------------- Player action ---------------------------- */
function playerAction(kind, dx, dy) {
  if (!game.active || game.over || !game.awaitingInput) return;

  const actor = game.schedule[game.scheduleIndex];
  if (!actor || !actor.isPlayer) return;

  game.awaitingInput = false;

  if (kind === 'move') playerMove(dx, dy);
  // 'wait' does nothing.

  actor.currentAp -= 1;
  game.scheduleIndex++;

  render();

  // NOTE: do NOT call checkGameEnd() here. The player's action may have
  // killed the last enemy, but the remaining slots of the locked schedule
  // must still resolve (dead actors are skipped inside advance()). Win /
  // lose is checked at the end of the turn inside advance().
  if (game.active) advance();
}

function playerMove(dx, dy) {
  const p = game.player;
  const nx = p.x + dx;
  const ny = p.y + dy;

  // Bumping into a wall or the edge still costs the action.
  if (!inBounds(nx, ny)) return;
  if (game.grid[ny][nx] === WALL) return;

  const target = enemyAt(nx, ny);
  if (target) {
    target.hp -= PLAYER_ATTACK;
    if (target.hp <= 0) {
      target.hp = 0;
      game.enemies = game.enemies.filter(e => e !== target);
    }
    return;
  }

  p.x = nx;
  p.y = ny;
}

/* ------------------------------ Rat AI --------------------------------- */
function ratAction(rat) {
  const p = game.player;

  // 1. Adjacent orthogonally? Attack.
  if (manhattan(rat, p) === 1) {
    p.hp -= RAT_ATTACK;
    return;
  }

  // 2. Step one tile along the shortest orthogonal path.
  const dist = computeDistances(p.x, p.y);

  let best = Infinity;
  let options = [];

  for (const [dx, dy] of DIRS) {
    const nx = rat.x + dx;
    const ny = rat.y + dy;

    if (!inBounds(nx, ny)) continue;
    if (game.grid[ny][nx] === WALL) continue;
    if (nx === p.x && ny === p.y) continue;   // occupied by the player
    if (enemyAt(nx, ny)) continue;            // occupied by another enemy

    const d = dist[ny][nx];
    if (d === Infinity) continue;

    if (d < best) {
      best = d;
      options = [{ x: nx, y: ny }];
    } else if (d === best) {
      options.push({ x: nx, y: ny });
    }
  }

  if (options.length > 0) {
    const step = options[randInt(options.length)]; // random among equally short paths
    rat.x = step.x;
    rat.y = step.y;
    return;
  }

  // 3. No path — wander to any valid adjacent tile.
  const wander = [];
  for (const [dx, dy] of DIRS) {
    const nx = rat.x + dx;
    const ny = rat.y + dy;

    if (!inBounds(nx, ny)) continue;
    if (game.grid[ny][nx] === WALL) continue;
    if (nx === p.x && ny === p.y) continue;
    if (enemyAt(nx, ny)) continue;

    wander.push({ x: nx, y: ny });
  }

  if (wander.length > 0) {
    const step = wander[randInt(wander.length)];
    rat.x = step.x;
    rat.y = step.y;
  }
  // else: wait (no valid move).
}

function computeDistances(sx, sy) {
  const dist = [];
  for (let y = 0; y < DUNGEON_HEIGHT; y++) {
    dist.push(new Array(DUNGEON_WIDTH).fill(Infinity));
  }

  const queue = [[sx, sy]];
  dist[sy][sx] = 0;

  while (queue.length > 0) {
    const [x, y] = queue.shift();
    for (const [dx, dy] of DIRS) {
      const nx = x + dx;
      const ny = y + dy;
      if (!inBounds(nx, ny)) continue;
      if (game.grid[ny][nx] === WALL) continue;
      if (dist[ny][nx] !== Infinity) continue;
      dist[ny][nx] = dist[y][x] + 1;
      queue.push([nx, ny]);
    }
  }

  return dist;
}

/* =========================================================================
   Win / lose
   ========================================================================= */
function checkGameEnd() {
  if (game.over) return;

  if (game.player.hp <= 0) {
    game.player.hp = 0;
    game.over = true;
    game.awaitingInput = false;
    showOverlay('You died. Press R to restart.');
    return;
  }

  if (game.enemies.length === 0) {
    game.over = true;
    game.awaitingInput = false;
    showOverlay('Cleared. Press R to restart.');
  }
}

function showOverlay(text) {
  el.overlayText.textContent = text;
  el.overlay.classList.remove('hidden');
}

function hideOverlay() {
  el.overlay.classList.add('hidden');
}

/* =========================================================================
   Rendering
   ========================================================================= */
function render() {
  if (!game.player) return;
  renderGrid();
  renderSidebar();
  renderDebug();
}

function renderGrid() {
  el.grid.innerHTML = '';
  el.grid.style.gridTemplateColumns = `repeat(${DUNGEON_WIDTH}, ${CELL_SIZE}px)`;
  el.grid.style.gridTemplateRows    = `repeat(${DUNGEON_HEIGHT}, ${CELL_SIZE}px)`;

  const p = game.player;

  for (let y = 0; y < DUNGEON_HEIGHT; y++) {
    for (let x = 0; x < DUNGEON_WIDTH; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';

      if (game.grid[y][x] === WALL) {
        cell.classList.add('wall');
      } else if (p.hp > 0 && p.x === x && p.y === y) {
        cell.appendChild(makeSprite('👤', null));
      } else {
        const enemy = enemyAt(x, y);
        if (enemy) cell.appendChild(makeSprite('🐀', enemy));
      }

      el.grid.appendChild(cell);
    }
  }
}

function makeSprite(emoji, enemy) {
  const wrap = document.createElement('div');
  wrap.className = 'entity';

  if (enemy) {
    const bar = document.createElement('div');
    bar.className = 'hp-bar';

    const fill = document.createElement('div');
    fill.className = 'hp-fill';
    fill.style.width = Math.max(0, (enemy.hp / enemy.maxHp) * 100) + '%';

    bar.appendChild(fill);
    wrap.appendChild(bar);
  }

  const sprite = document.createElement('span');
  sprite.className = 'sprite';
  sprite.textContent = emoji;
  wrap.appendChild(sprite);

  return wrap;
}

function renderSidebar() {
  const p = game.player;
  el.playerHp.textContent = `HP: ${Math.max(0, p.hp)} / ${p.maxHp}`;
}

function renderDebug() {
  const parts = [];
  if (game.player) parts.push(`P: ${game.player.currentAp.toFixed(1)}`);

  let enemyIndex = 0;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const label = enemyIndex === 0 ? 'E' : 'E' + (enemyIndex + 1);
    parts.push(`${label}: ${e.currentAp.toFixed(1)}`);
    enemyIndex++;
  }

  const scheduleText = game.schedule.length === 0
    ? '—'
    : game.schedule.map((actor, i) => {
        const label = actor.isPlayer ? 'P' : 'E';
        return i === game.scheduleIndex ? `<b>${label}</b>` : label;
      }).join(' → ');

  el.debug.innerHTML = `${parts.join(' | ')}<br>Schedule: ${scheduleText}`;
}

/* =========================================================================
   Screens / menu
   ========================================================================= */
function showScreen(name) {
  el.screenMenu.classList.toggle('hidden', name !== 'menu');
  el.screenPlay.classList.toggle('hidden', name !== 'play');
  el.screenChangelog.classList.toggle('hidden', name !== 'changelog');
}

/* ---------------------------- Changelog -------------------------------- */
function renderChangelog() {
  const list = document.getElementById('changelog-list');
  list.innerHTML = '';

  for (const entry of CHANGELOG) {
    const article = document.createElement('article');
    article.className = 'changelog-entry';

    // ---- header row: version / date / title / + toggle ----
    const header = document.createElement('div');
    header.className = 'changelog-header';

    const heading = document.createElement('div');
    heading.className = 'changelog-heading';

    const version = document.createElement('span');
    version.className = 'changelog-version';
    version.textContent = `v${entry.version}`;
    heading.appendChild(version);

    const date = document.createElement('span');
    date.className = 'changelog-date';
    date.textContent = entry.date;
    heading.appendChild(date);

    const title = document.createElement('span');
    title.className = 'changelog-title';
    title.textContent = entry.title;
    heading.appendChild(title);

    header.appendChild(heading);

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'changelog-toggle';
    toggle.textContent = '+';
    toggle.setAttribute('aria-label', 'Toggle technical details');
    toggle.setAttribute('aria-expanded', 'false');
    header.appendChild(toggle);

    article.appendChild(header);

    // ---- tagged summary bullets ----
    const summary = document.createElement('ul');
    summary.className = 'changelog-summary';

    for (const item of entry.summary) {
      const li = document.createElement('li');

      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = item.tag;
      li.appendChild(tag);

      const text = document.createElement('span');
      text.textContent = item.text;
      li.appendChild(text);

      summary.appendChild(li);
    }
    article.appendChild(summary);

    // ---- collapsible technical notes ----
    const tech = document.createElement('div');
    tech.className = 'changelog-tech hidden';

    const techTitle = document.createElement('div');
    techTitle.className = 'changelog-tech-title';
    techTitle.textContent = 'More technical information';
    tech.appendChild(techTitle);

    const techList = document.createElement('ul');
    for (const line of entry.tech) {
      const li = document.createElement('li');
      li.textContent = line;
      techList.appendChild(li);
    }
    tech.appendChild(techList);
    article.appendChild(tech);

    // ---- toggle behaviour ----
    toggle.addEventListener('click', () => {
      const nowHidden = tech.classList.toggle('hidden');
      toggle.textContent = nowHidden ? '+' : '−';
      toggle.setAttribute('aria-expanded', String(!nowHidden));
    });

    list.appendChild(article);
  }
}

let toastTimeout = null;
function showToast(message) {
  el.toast.textContent = message;
  el.toast.classList.remove('show');
  void el.toast.offsetWidth;   // force reflow so the animation restarts
  el.toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.toast.classList.remove('show'), 1300);
}

/* =========================================================================
   New run
   ========================================================================= */
function startNewRun() {
  game.runId++;
  game.active = true;
  game.over = false;
  game.awaitingInput = false;
  game.schedule = [];
  game.scheduleIndex = 0;

  game.grid = generateDungeon();

  // Gather floor tiles.
  const floors = [];
  for (let y = 0; y < DUNGEON_HEIGHT; y++) {
    for (let x = 0; x < DUNGEON_WIDTH; x++) {
      if (game.grid[y][x] === FLOOR) floors.push({ x, y });
    }
  }

  // Player spawn.
  const playerSpot = floors[randInt(floors.length)];
  game.player = makePlayer(playerSpot.x, playerSpot.y);

  // Rat spawn — random valid floor tile, preferably not right next to the player.
  let pool = floors.filter(t => manhattan(t, playerSpot) >= 4);
  if (pool.length === 0) {
    pool = floors.filter(t => !(t.x === playerSpot.x && t.y === playerSpot.y));
  }
  if (pool.length === 0) pool = floors;

  const ratSpot = pool[randInt(pool.length)];
  game.enemies = [makeRat(ratSpot.x, ratSpot.y)];

  hideOverlay();
  el.grid.innerHTML = '';
  render();
  startNewTurn();
}

/* =========================================================================
   Input
   ========================================================================= */
document.addEventListener('keydown', (e) => {
  if (el.screenPlay.classList.contains('hidden')) return;

  // Restart after death / clear.
  if (e.key === 'r' || e.key === 'R') {
    if (game.over) {
      e.preventDefault();
      startNewRun();
    }
    return;
  }

  if (game.over || !game.awaitingInput || e.repeat) return;

  const key = e.key.toLowerCase();
  let handled = true;

  if (key === 'w')      playerAction('move', 0, -1);
  else if (key === 's') playerAction('move', 0, 1);
  else if (key === 'a') playerAction('move', -1, 0);
  else if (key === 'd') playerAction('move', 1, 0);
  else if (e.key === ' ') playerAction('wait');
  else handled = false;

  if (handled) e.preventDefault();
});

/* =========================================================================
   Wiring
   ========================================================================= */
document.querySelectorAll('.menu-item[data-action]').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;

    if (action === 'play') {
      showScreen('play');
      startNewRun();
    } else if (action === 'changelogs') {
      showScreen('changelog');
      renderChangelog();
    } else if (action === 'quit') {
      el.modal.classList.remove('hidden');
    } else {
      showToast('Coming soon');
    }
  });
});

document.getElementById('modal-close').addEventListener('click', () => {
  el.modal.classList.add('hidden');
});

document.getElementById('menu-btn').addEventListener('click', () => {
  game.active = false;
  game.awaitingInput = false;
  showScreen('menu');
});

document.getElementById('changelog-back').addEventListener('click', () => {
  showScreen('menu');
});

/* ------------------------------ Boot ----------------------------------- */
showScreen('menu');