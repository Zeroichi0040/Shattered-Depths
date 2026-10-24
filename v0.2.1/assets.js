/* =========================================================================
   Shattered Depths — assets.js
   v0.2.1 (draft)

   All art is code. No image files.

   - Sprites: 16x16 character grids (SPRITES, below). '.' is transparent;
     every other character is looked up in that sprite's `legend`.
   - Tiles (floor, wall): drawn procedurally at startup from TILE_STYLES,
     with a few seeded variants so a room is not one stamp repeated.

   TRYING OUT NEW ART
   ------------------
   1. Paste a new sprite object into SPRITES (for example `rat_v2`).
   2. Open preview.html to compare it with the others.
   3. Point a role at it in ACTIVE_SPRITES to use it in the game.

   A sprite with a wrong row length or a character missing from its legend
   is reported (see Assets.errors, and the top of preview.html) instead of
   failing silently.

   SPRITE SHAPE
   ------------
     name: {
       legend: { K: '#1a1a2e', ... },     // one character -> one CSS color
       rows:   [ '16 chars', ... x16 ],   // a single frame
       // or, for animation:
       frames: [ [ ...16 rows ], [ ...16 rows ] ],
     }
   ========================================================================= */

const SPRITE_SIZE = 16;

/* Which sprite fills each role in the game. Swap a name to use a variant. */
const ACTIVE_SPRITES = {
  player:  'player',
  rat:     'rat',
  stairs:  'stairs_down',   // compatibility alias
  stairs_down: 'stairs_down',
  stairs_up:   'stairs_up',
  bonfire: 'bonfire',
};

/* ---------------------------- Procedural tiles ------------------------- */
const TILE_STYLES = {
  floor: {
    base:        '#3c3b4a',
    specks:      ['#34333f', '#454452', '#3a3947'],
    speckChance: 0.14,
    crack:       '#2b2a35',
    crackChance: 0.45,
    edge:        '#33323f',    // 1px line on the right and bottom, hints at the grid
  },
  wall: {
    bricks:    ['#5d566b', '#655d73', '#564f63'],
    highlight: '#7a7188',
    mortar:    '#2a2632',
    noise:     '#4b4558',
    noiseChance: 0.08,
  },
};

/* -------------------------------- Sprites ------------------------------ */
const SPRITES = {

  player: {
    legend: {
      K: '#1a1a2e',   // outline / eyes
      H: '#2b2b2b',   // hair
      S: '#f0c08a',   // skin
      T: '#c69a63',   // shirt — light brown leather
      t: '#a67a45',   // shirt shade / ragged hem
      P: '#7a4f28',   // pants — darker brown leather
      p: '#5a3719',   // pants shade
      B: '#3a2414',   // boots
    },
    rows: [
      '.....KKKKKK.....',
      '....KHHHHHHK....',
      '...KHHHHHHHHK...',
      '...KHHHHHHHHK...',
      '...KHSSSSSSHK...',
      '...KSSKSSKSSK...',
      '....KSSSSSSK....',
      '..KKKTTTTTTKKK..',
      '.KTTTTTTTTTTTTK.',
      '.KTTTtTTTTtTTTK.',
      '.KSSKTTTTTTKSSK.',
      '.KSSKtTTTTtKSSK.',
      '..KKKpPPPPpKKK..',
      '....KPPKKPPK....',
      '....KPPKKPPK....',
      '....KBBKKBBK....',
    ],
  },

  rat: {
    legend: {
      K: '#1a1a24',   // outline
      G: '#8d8d9b',   // fur
      g: '#63636f',   // fur shade
      P: '#e9a1b4',   // ears, nose, feet, tail
      R: '#e03a3a',   // eye
      W: '#ffffff',   // teeth
    },
    rows: [
      '................',
      '................',
      '................',
      '..KKK...........',
      '.KPPPK..........',
      '.KPPGK..........',
      '..KGGKKKKKK...PP',
      '.KRGGGGGGGGKK.P.',
      'PGGGGGGGGGGGGKP.',
      'KWKggGGGGGGggKP.',
      '..KKKKKKKKKKK...',
      '...KPK...KPK....',
      '................',
      '................',
      '................',
      '................',
    ],
  },

  stairs_down: {
    legend: {
      K: '#252624',   // charcoal outline
      D: '#353633',   // dark stone / stairwell shadow
      S: '#484a44',   // masonry shade
      M: '#62655c',   // stone frame
      G: '#85877f',   // tread face
      H: '#a0a299',   // worn top edge
      L: '#72756c',   // tread shade
    },
    rows: [
      '................',
      '.MMMMMMMMMMMMMM.',
      '.MDDDDDDDDDDDDM.',
      '.MDSDDDDDDDDDDM.',
      '.MDDDDDDDDDLKKM.',
      '.MDDDDDDDDHGGLM.',
      '.MDDDDDDDDLLLLM.',
      '.MDDDDDDHGGGGLM.',
      '.MDDDDDDLLLLLLM.',
      '.MDDDDHGGGGGGLM.',
      '.MDDDDLLLLLLLLM.',
      '.MDDHGGGGGGGGLM.',
      '.MDDLLLLLLLLLLM.',
      '.MHHGGGGGGGGGLM.',
      '.MMMMMMMMMMMMMM.',
      '................',
    ],
  },

  // Candidate down staircases; keep the active sprite unchanged until selection.
  stairs_down_01: {
    legend: {
      K: '#252624', D: '#353633', S: '#484a44', M: '#62655c',
      G: '#85877f', H: '#a0a299', L: '#72756c',
    },
    rows: [
      '................',
      '.KKKKKKKKKKKKKK.',
      '.KHHHHHHHHHHHHK.',
      '.KGGGGGGGGGGGGK.',
      '.KDGGGGGGGGGGDK.',
      '.KDLLLLLLLLLLDK.',
      '.KDDLLLLLLLLDDK.',
      '.KDDMMMMMMMMDDK.',
      '.KDDDMMMMMMDDDK.',
      '.KDDDSSSSSSDDDK.',
      '.KDDDDSSSSDDDDK.',
      '.KDDDDDDDDDDDDK.',
      '.KDDDDDDDDDDDDK.',
      '.KDDDDDDDDDDDDK.',
      '.KKKKKKKKKKKKKK.',
      '................',
    ],
  },

  stairs_down_02: {
    legend: {
      K: '#252624', D: '#353633', S: '#484a44', M: '#62655c',
      G: '#85877f', H: '#a0a299', L: '#72756c',
    },
    rows: [
      '................',
      '.KKKKKKKKKKKKKK.',
      '.KHHHHHHHHHHHHK.',
      '.KGGGGGGGGGGGGK.',
      '.KGGGGGGGGGGGGK.',
      '.KLLLLLLLLLLLLK.',
      '.KLLLLLLLLLLLLK.',
      '.KMMMMMMMMMMMMK.',
      '.KMMMMMMMMMMMMK.',
      '.KSSSSSSSSSSSSK.',
      '.KSSSSSSSSSSSSK.',
      '.KDDDDDDDDDDDDK.',
      '.KDDDDDDDDDDDDK.',
      '.KDDDDDDDDDDDDK.',
      '.KKKKKKKKKKKKKK.',
      '................',
    ],
  },

  stairs_down_03: {
    legend: {
      K: '#252624', D: '#353633', S: '#484a44', M: '#62655c',
      G: '#85877f', H: '#a0a299', L: '#72756c',
    },
    rows: [
      '................',
      '.KKKKKKKKKKKKKK.',
      '.KDDDDDDDDDDDDK.',
      '.KHHHHHHHHHHHDK.',
      '.KGGGGGGGGGGGDK.',
      '.KDGGGGGGGGGGDK.',
      '.KDLLLLLLLLLLDK.',
      '.KDDLLLLLLLLLDK.',
      '.KDDMMMMMMMMMDK.',
      '.KDDDMMMMMMMMDK.',
      '.KDDDSSSSSSSSDK.',
      '.KDDDDSSSSSSSDK.',
      '.KDDDDDDDDDDDDK.',
      '.KDDDDDDDDDDDDK.',
      '.KKKKKKKKKKKKKK.',
      '................',
    ],
  },

  stairs_down_04: {
    legend: {
      K: '#252624', D: '#353633', S: '#484a44', M: '#62655c',
      G: '#85877f', H: '#a0a299', L: '#72756c',
    },
    rows: [
      '................',
      '.KKKKKKKKKKKKKK.',
      '.KDDDDDDDDDDDDK.',
      '.KHHHHHHHHHHHDK.',
      '.KGGGGGGGGGGGDK.',
      '.KGGGGGGGGGGDDK.',
      '.KLLLLLLLLLLDDK.',
      '.KLLLLLLLLLDDDK.',
      '.KMMMMMMMMMDDDK.',
      '.KMMMMMMMMDDDDK.',
      '.KSSSSSSSSDDDDK.',
      '.KSSSSSSSDDDDDK.',
      '.KDDDDDDDDDDDDK.',
      '.KDDDDDDDDDDDDK.',
      '.KKKKKKKKKKKKKK.',
      '................',
    ],
  },

  stairs_down_05: {
    legend: {
      K: '#252624', D: '#353633', S: '#484a44', M: '#62655c',
      G: '#85877f', H: '#a0a299', L: '#72756c',
    },
    rows: [
      '................',
      '.HKKKKKKKKKKKKH.',
      '.KKKKKKKKKKKKKK.',
      '.KHHHHHHHHHHHHK.',
      '.KGGGGGGGGGGGGK.',
      '.KKLLLLLLLLLLKK.',
      '.KKMMMMMMMMMMKK.',
      '.KKKMMMMMMMMKKK.',
      '.KKKSSSSSSSSKKK.',
      '.KKKKSSSSSSKKKK.',
      '.KKKKDDDDDDKKKK.',
      '.KKKKKKKKKKKKKK.',
      '.KKKKKKKKKKKKKK.',
      '.KKKKKKKKKKKKKK.',
      '.KKKKKKKKKKKKKK.',
      '................',
    ],
  },

  stairs_down_06: {
    legend: {
      K: '#252624', D: '#353633', S: '#484a44', M: '#62655c',
      G: '#85877f', H: '#a0a299', L: '#72756c',
    },
    rows: [
      '................',
      '.KKKKKKKKKKKKKK.',
      '.KHHHHHHHHHHHHK.',
      '.KGGGGGGGGGGGGK.',
      '.KGGGGGGGGGGGGK.',
      '.KDDDDLLLLLLLLK.',
      '.KDDDDMMMMMMMMK.',
      '.KDDDDDMMMMMMDK.',
      '.KDDDDDSSSSSSDK.',
      '.KDDDDDDSSSSDDK.',
      '.KDDDDDDDDDDDDK.',
      '.KDDDDDDDDDDDDK.',
      '.KDDDDDDDKKDDDK.',
      '.KDDDDDDDDDDDDK.',
      '.KKKKKKKKKKKKKK.',
      '................',
    ],
  },

  stairs_down_07: {
    legend: {
      K: '#252624', D: '#353633', S: '#484a44', M: '#62655c',
      G: '#85877f', H: '#a0a299', L: '#72756c',
    },
    rows: [
      '................',
      '................',
      '.KKKK...........',
      '.KHHK...........',
      '.KGGKKKK........',
      '.KGGKGGK........',
      '.KDDKLLKKKK.....',
      '.KDDKLLKLLK.....',
      '.KDDKDDKMMKKKK..',
      '.KDDKDDKMMKMMK..',
      '.KDDKDDKDDKSSK..',
      '.KDDKDDKDDKSSK..',
      '.KKKKKKKKKKKKK..',
      '................',
      '................',
      '................',
    ],
  },

  stairs_down_08: {
    legend: {
      K: '#252624', D: '#353633', S: '#484a44', M: '#62655c',
      G: '#85877f', H: '#a0a299', L: '#72756c',
    },
    rows: [
      '................',
      '................',
      '...........KKKK.',
      '...........KHHK.',
      '........KKKKGGK.',
      '........KGGKGGK.',
      '.....KKKKLLKSSK.',
      '.....KLLKLLKDDK.',
      '..KKKKMMKSSKDDK.',
      '..KMMKMMKDDKDDK.',
      '..KSSKSSKDDKDDK.',
      '..KSSKDDKDDKDDK.',
      '..KSSKKKKKKKKKK.',
      '................',
      '................',
      '................',
    ],
  },

  stairs_down_09: {
    legend: {
      K: '#252624', D: '#353633', S: '#484a44', M: '#62655c',
      G: '#85877f', H: '#a0a299', L: '#72756c',
    },
    rows: [
      '................',
      '................',
      '.MMMM...........',
      '.KHHK...........',
      '.KGGMMMM........',
      '.KGGKGGK........',
      '.KDDKLLMMMM.....',
      '.KDDKLLKLLK.....',
      '.KDDKDDKMMMMMM..',
      '.KDDKDDKMMKMMK..',
      '.KDDKDDKDDKSSK..',
      '.KDDKDDKDDKSSK..',
      '.KKKKKKKKKKKKK..',
      '................',
      '................',
      '................',
    ],
  },

  stairs_down_10: {
    legend: {
      K: '#252624', D: '#353633', S: '#484a44', M: '#62655c',
      G: '#85877f', H: '#a0a299', L: '#72756c',
    },
    rows: [
      '................',
      '................',
      '...........MMMM.',
      '...........KHHK.',
      '........MMMMGGK.',
      '........KGGKGGK.',
      '.....MMMMLLKSSK.',
      '.....KLLKLLKDDK.',
      '..MMMMMMKSSKDDK.',
      '..KMMKMMKDDKDDK.',
      '..KSSKSSKDDKDDK.',
      '..KSSKDDKDDKDDK.',
      '..KSSKKKKKKKKKK.',
      '................',
      '................',
      '................',
    ],
  },

  stairs_down_11: {
    legend: {
      K: '#252624', D: '#353633', S: '#484a44', M: '#62655c',
      G: '#85877f', H: '#a0a299', L: '#72756c',
    },
    rows: [
      '................',
      '.KKKKKKKKKKKKKK.',
      '.KDDDDDDDDDDDDK.',
      '.KHHHDDDDDDDDDK.',
      '.KGGGDDDDDDDDDK.',
      '.KGGGGGGDDDDDDK.',
      '.KGGGLLLDDDDDDK.',
      '.KKKKLLLLLLDDDK.',
      '.KKKKLLLMMMDDDK.',
      '.KDDDKKKMMMMMMK.',
      '.KDDDDDDMMMSSSK.',
      '.KDDDDDDDDDSSSK.',
      '.KDDDDDDDDDSSSK.',
      '.KDDDDDDDDDDDDK.',
      '.KKKKKKKKKKKKKK.',
      '................',
    ],
  },

  stairs_down_12: {
    legend: {
      K: '#252624', D: '#353633', S: '#484a44', M: '#62655c',
      G: '#85877f', H: '#a0a299', L: '#72756c',
    },
    rows: [
      '................',
      '.KKKKKKKKKKKKKK.',
      '.KDDDDDDDDDDDDK.',
      '.KDDDDDDDDDHHHK.',
      '.KDDDDDDDDDGGGK.',
      '.KDDDDDDGGGGGGK.',
      '.KDDDDDDLLLGGGK.',
      '.KDDDLLLLLLKKKK.',
      '.KDDDMMMLLLKKKK.',
      '.KMMMMMMKKKDDDK.',
      '.KSSSMMMDDDDDDK.',
      '.KSSSDDDDDDDDDK.',
      '.KSSSDDDDDDDDDK.',
      '.KDDDDDDDDDDDDK.',
      '.KKKKKKKKKKKKKK.',
      '................',
    ],
  },

  stairs_up: {
    legend: {
      K: '#252624',   // charcoal outline
      D: '#353633',   // dark stone / stairwell shadow
      S: '#484a44',   // masonry shade
      M: '#62655c',   // stone frame
      G: '#85877f',   // tread face
      H: '#a0a299',   // worn top edge
      L: '#72756c',   // tread shade
    },
    rows: [
      '.KKKK...........',
      '.KHGGK..........',
      '.KGGGK..........',
      '.KGGGKKKK.......',
      '.KGGGKHGGK......',
      '.KGGGKGGGK......',
      '.KLLLKGGGKKKK...',
      '.KDDDKGGGKHGGK..',
      '.KDSDKLLLKGGGK..',
      '.KDDDKDDDKGGGK..',
      '.KDDSSDDDKGGGK..',
      '.KSDDDDDDKLLLK..',
      '.KDDDDSSDKDDDK..',
      '.KDSDDDDDDDSDK..',
      '.KKKKKKKKKKKKK..',
      '................',
    ],
  },

  bonfire: {
    legend: {
      R: '#d62f1f',   // flame edge
      O: '#ff8c1a',   // flame body
      Y: '#ffd23f',   // flame inner
      W: '#fff4b0',   // flame core
      L: '#6b4423',   // log
      l: '#8b5a2b',   // log highlight
      S: '#6e6e7a',   // ring stone
      s: '#4c4c57',   // ring stone shade
    },
    frames: [
      [
        '................',
        '................',
        '.......R........',
        '......RRO.......',
        '......ROR.......',
        '.....RROOR......',
        '.....ROOOR......',
        '....RROYOOR.....',
        '....ROYYYOR.....',
        '....ROYWYOR.....',
        '....ROYWWYOR....',
        '.....ROYYOR.....',
        '..LL.RROORR.LL..',
        '.LllLLLLLLLLllL.',
        '.SsSLllLLllLSsS.',
        '..SSSSSSSSSSSS..',
      ],
      [
        '................',
        '................',
        '........R.......',
        '.......ORR......',
        '.......ROR......',
        '......ROORR.....',
        '.....ROOOR......',
        '....ROOYOORR....',
        '....ROYYYOR.....',
        '....ROYWYOR.....',
        '....ROYWWYOR....',
        '.....ROYYOR.....',
        '..LL.RROORR.LL..',
        '.LllLLLLLLLLllL.',
        '.SsSLllLLllLSsS.',
        '..SSSSSSSSSSSS..',
      ],
    ],
  },

};

/* =========================================================================
   Loader
   ========================================================================= */
const Assets = (() => {
  const TILE_VARIANTS = 4;

  const spriteCanvases = {};   // name -> [canvas, ...] (one per frame)
  const tileCanvases   = {};   // kind -> [canvas, ...] (one per variant)
  const urlCache       = new Map();
  const errors         = [];
  let ready = false;

  /* Small seeded RNG so tiles look the same on every load. */
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function newCanvas() {
    const c = document.createElement('canvas');
    c.width = SPRITE_SIZE;
    c.height = SPRITE_SIZE;
    return c;
  }

  function framesOf(def) {
    return def.frames || [def.rows];
  }

  /* ---- sprites ---- */
  function checkSprite(name, def) {
    const seen = new Set();
    const report = (msg) => {
      if (!seen.has(msg)) { seen.add(msg); errors.push(msg); }
    };
    const legend = def.legend;
    if (!legend) report(`${name}: missing legend`);

    framesOf(def).forEach((rows, f) => {
      if (!Array.isArray(rows)) {
        report(`${name}: frame ${f} is not an array of rows`);
        return;
      }
      if (rows.length !== SPRITE_SIZE) {
        report(`${name} frame ${f}: ${rows.length} rows (need ${SPRITE_SIZE})`);
      }
      rows.forEach((row, y) => {
        if (row.length !== SPRITE_SIZE) {
          report(`${name} frame ${f} row ${y}: ${row.length} chars (need ${SPRITE_SIZE})`);
        }
        for (const ch of row) {
          if (ch !== '.' && legend && !(ch in legend)) {
            report(`${name} frame ${f} row ${y}: '${ch}' is not in the legend`);
          }
        }
      });
    });
  }

  function drawFrame(rows, legend) {
    const c = newCanvas();
    const ctx = c.getContext('2d');
    for (let y = 0; y < SPRITE_SIZE; y++) {
      const row = rows[y] || '';
      for (let x = 0; x < SPRITE_SIZE; x++) {
        const ch = row[x];
        if (!ch || ch === '.') continue;
        const color = legend && legend[ch];
        if (!color) continue;                 // already reported by checkSprite
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    return c;
  }

  /* ---- tiles ---- */
  function pick(rand, list) {
    return list[Math.floor(rand() * list.length)];
  }

  function drawFloor(style, seed) {
    const c = newCanvas();
    const ctx = c.getContext('2d');
    const rand = mulberry32(seed);

    ctx.fillStyle = style.base;
    ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

    for (let y = 0; y < SPRITE_SIZE; y++) {
      for (let x = 0; x < SPRITE_SIZE; x++) {
        if (rand() < style.speckChance) {
          ctx.fillStyle = pick(rand, style.specks);
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

    if (rand() < style.crackChance) {
      let x = 2 + Math.floor(rand() * (SPRITE_SIZE - 4));
      let y = 2 + Math.floor(rand() * (SPRITE_SIZE - 4));
      const len = 3 + Math.floor(rand() * 3);
      ctx.fillStyle = style.crack;
      for (let i = 0; i < len; i++) {
        ctx.fillRect(x, y, 1, 1);
        x = Math.min(SPRITE_SIZE - 2, x + (rand() < 0.6 ? 1 : 0));
        y = Math.max(1, Math.min(SPRITE_SIZE - 2, y + (rand() < 0.5 ? 1 : -1)));
      }
    }

    ctx.fillStyle = style.edge;
    ctx.fillRect(SPRITE_SIZE - 1, 0, 1, SPRITE_SIZE);
    ctx.fillRect(0, SPRITE_SIZE - 1, SPRITE_SIZE, 1);
    return c;
  }

  function drawWall(style, seed) {
    const c = newCanvas();
    const ctx = c.getContext('2d');
    const rand = mulberry32(seed);

    for (let y = 0; y < SPRITE_SIZE; y++) {
      const row = y >> 2;                       // bricks are 4px tall
      const offset = (row % 2) ? 4 : 0;         // alternate rows are staggered
      const mortarH = (y % 4) === 3;

      for (let x = 0; x < SPRITE_SIZE; x++) {
        const mortarV = ((x + offset) % 8) === 0;
        let color;

        if (mortarH || mortarV) {
          color = style.mortar;
        } else {
          const brick = Math.floor((x + offset) / 8);
          color = style.bricks[(row * 3 + brick + seed) % style.bricks.length];
          if ((y % 4) === 0) color = style.highlight;
          else if (rand() < style.noiseChance) color = style.noise;
        }

        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    return c;
  }

  const TILE_DRAWERS = { floor: drawFloor, wall: drawWall };

  /* ---- public ---- */
  function init() {
    if (ready) return errors;

    for (const name of Object.keys(SPRITES)) {
      const def = SPRITES[name];
      checkSprite(name, def);
      spriteCanvases[name] = framesOf(def).map(rows => drawFrame(rows || [], def.legend));
    }

    for (const kind of Object.keys(TILE_STYLES)) {
      const draw = TILE_DRAWERS[kind];
      if (!draw) continue;
      tileCanvases[kind] = [];
      for (let v = 0; v < TILE_VARIANTS; v++) {
        tileCanvases[kind].push(draw(TILE_STYLES[kind], 1000 + v * 97));
      }
    }

    ready = true;
    return errors;
  }

  /* A role ('player') resolves through ACTIVE_SPRITES; a raw name also works. */
  function resolve(key) {
    return ACTIVE_SPRITES[key] || key;
  }

  function spriteCanvas(key, frame = 0) {
    const list = spriteCanvases[resolve(key)];
    if (!list) return null;
    return list[frame % list.length];
  }

  function tileVariant(x, y) {
    return (((x * 73856093) ^ (y * 19349663)) >>> 0) % TILE_VARIANTS;
  }

  function tileCanvas(kind, x = 0, y = 0) {
    const list = tileCanvases[kind];
    if (!list) return null;
    return list[tileVariant(x, y)];
  }

  function toURL(canvas) {
    if (!canvas) return null;
    if (!urlCache.has(canvas)) urlCache.set(canvas, canvas.toDataURL());
    return urlCache.get(canvas);
  }

  return {
    size: SPRITE_SIZE,
    errors,
    init,
    spriteCanvas,
    spriteURL:  (key, frame) => toURL(spriteCanvas(key, frame)),
    tileCanvas,
    tileURL:    (kind, x, y) => toURL(tileCanvas(kind, x, y)),
    frameCount: (key) => (spriteCanvases[resolve(key)] || []).length,
    spriteNames: () => Object.keys(SPRITES),
    rolesOf: (name) => Object.keys(ACTIVE_SPRITES).filter(r => ACTIVE_SPRITES[r] === name),
    tileKinds: () => Object.keys(tileCanvases),
    tileVariants: TILE_VARIANTS,
  };
})();
