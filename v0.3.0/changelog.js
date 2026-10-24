/* =========================================================================
   Shattered Depths — changelog.js
   v0.3.0

   HOW TO ADD A NEW ENTRY
   ----------------------
   Push a new object to the TOP of CHANGELOG (newest first). Each entry
   has two visible tiers:

     summary — always visible. What changed, for a player.
     panel   — hidden behind the "+" toggle in the entry header. Contains
               two sections separated by a horizontal divider:
                 1. More technical information  (the `tech` array)
                 2. Design notes                (the `dev` array, optional)
               When there is no `dev` data, the divider and the "Design
               notes" heading are not rendered at all.

   Each entry:

     {
       version: '0.2.0',
       date:    'YYYY-MM-DD',
       title:   'Short release title',

       summary: [                          // consumer-facing, always visible
         { tag: 'New',    text: '...' },
         { tag: 'Change', text: '...' },
         { tag: 'Tweak',  text: '...' },
         { tag: 'Fix',    text: '...' },
         { tag: 'Removed',text: '...' },
       ],

       tech: [                             // short overview of what changed
         '...',
         '...',
       ],

       dev: [                              // design notes; omit for tiny entries
         { heading: 'Spawning', items: ['...', '...'] },
         // a plain string is also allowed and renders as a bullet
         'A loose bullet with no heading.',
       ],
     }

   WRITING GUIDELINES
   ------------------
   - Describe the DELTA only: what changed, why, and any gotcha.
   - `dev` adds to `tech`; never repeat the same fact in both.
   - Aim for 3-6 bullets per `dev` entry. If it needs more, it is reference
     material and belongs in the Encyclopedia, not the changelog.
   - Don't re-document unchanged behavior or the changelog itself.

   Suggested tag vocabulary: New, Change, Tweak, Fix, Removed, Improved.
   Keep each bullet short — one idea per line.
   ========================================================================= */

const CHANGELOG = [
  {
    version: '0.3.0',
    date: '2026-10-24',
    title: 'Battle window',
    summary: [
      { tag: 'New',    text: 'Touching a rat now opens a battle window over the dungeon.' },
      { tag: 'New',    text: 'Battle menu: Fight or Flee. Fight has Basic Attack and Back, and with two rats in the fight you pick a target.' },
      { tag: 'New',    text: 'Rats that are not in the fight yet can join by bumping into you. Up to 2 rats per battle.' },
      { tag: 'New',    text: 'Click the - at the top right of the window to peek at the dungeon. Any key press or click brings it back.' },
      { tag: 'Change', text: 'Bumping a rat, or a rat striking you, no longer deals damage. It opens a battle instead.' },
      { tag: 'Change', text: 'The Back button on this screen is now at the top of the page.' },
      { tag: 'Removed', text: 'The control hints under How to Play in the sidebar.' },
      { tag: 'Change', text: 'Esc backs out of a battle menu. In battle, Space confirms instead of waiting.' },
    ],
    tech: [
      'New constant BATTLE_MAX_PARTICIPANTS (top of game.js) caps rats per battle. Default is 2. Raise it with RAT_SPAWN_COUNT to test the full 9-slot field.',
      'Battle state lives in game.battle. The AP schedule is unchanged: battle actions are ordinary schedule slots.',
      'Battle input: WASD navigate or cycle targets, Space or click confirm, Esc back. It takes priority over dungeon input.',
      'The window is a fixed-size HTML / CSS card (440x340) centered on the screen, so it does not scale with the dungeon size. The background is a placeholder.',
      'Rats in a battle keep their tile and stay drawn on the board. The debug line marks them with *. The window shows no player sprite or HP; the sidebar has the stats.',
    ],
    dev: [
      { heading: 'Slot field', items: [
        '4 top slots and 5 bottom slots, staggered. Fill order: bottom middle, bottom right, bottom left, bottom outer right, bottom outer left, then top inner-left, inner-right, outer left, outer right.',
        'A joining rat takes the first free slot in that order, and keeps it until it dies or the battle closes.',
      ]},
      { heading: 'Contact and joining', items: [
        'A battle opens with exactly the contacted rat. Opening costs the slot and deals no damage, whether the player or the rat made contact.',
        'A rat joins by spending its slot bumping the player, with no bite on the same action. At the cap the bump does nothing. Adjacency alone never joins.',
      ]},
      { heading: 'Battle turns', items: [
        'There is no separate bite-back step. A participant bites in its own schedule slots, so with one player action and one rat the order reads You, Rat.',
        'Flee costs an action and never moves the player. Rats stay on the board throughout, so a rat you fled from is still next to you. A mid-battle victory closes the window and the remaining slots resolve in the dungeon.',
      ]},
      { heading: 'Minimize', items: [
        'Minimized is a peek only: the window hides with nothing left behind, battle input pauses, and rat turns keep running.',
        'Any game input restores it (WASD, Space, Esc or a mouse click). That input only restores the window and does nothing else.',
      ]},
    ],
  },
  {
    version: '0.2.0',
    date: '2026-10-17',
    title: 'Pixel art',
    summary: [
      { tag: 'New',    text: 'Pixel-art sprites for the player and the rats, replacing the emoji.' },
      { tag: 'New',    text: 'A stone floor and brick walls, with small variations from tile to tile.' },
      { tag: 'Change', text: 'Board cells are a little bigger (40px to 48px) so the art reads clearly.' },
      { tag: 'Change', text: 'Rat health bars are now drawn over the top of the cell.' },
    ],
    tech: [
      'All art is drawn by code, no image files are used.',
      'Sprites are 16x16 character grids shown at 3x. Floor and wall tiles are painted procedurally from a fixed seed, so they look the same on every load.',
      'If a sprite fails to load, the game falls back to the old emoji.',
    ],
    dev: [
      { heading: 'Swapping art', items: [
        'ACTIVE_SPRITES in assets.js maps each role (player, rat, ...) to a sprite name, so trying a variant is a one-line change.',
      ]},
      { heading: 'Rendering', items: [
        'The board is now built once per run, and each render only redraws the player and rats on top. Rebuilding 100 image cells on every action would re-decode the tiles each time.',
      ]},
    ],
  },
  {
    version: '0.1.1',
    date: '2026-10-07',
    title: 'More rats',
    summary: [
      { tag: 'New',    text: 'You can now face more than one rat at a time.' },
      { tag: 'New',    text: 'Each changelog entry now has a design-notes section, tucked under its technical overview.' },
      { tag: 'Change', text: 'Each rat is named, so it is easy to tell them apart during a fight.' },
      { tag: 'Fix',    text: 'With several rats in play, they now take their turns in the order they appeared.' },
    ],
    tech: [
      'New constant RAT_SPAWN_COUNT (top of game.js) sets how many rats appear per floor. Default is 2.',
      'Rats are labeled E1, E2, ... by spawn order in the debug display and turn schedule.',
      'Same-speed rats now act in spawn order.',
    ],
    dev: [
      { heading: 'Spawning', items: [
        'Each rat gets its own floor tile, at least 4 Manhattan steps from the player, so none can attack on turn 1.',
        'If the map is too tight, that distance rule relaxes to "any tile but the player\'s". If it is still too tight, fewer rats spawn.',
      ]},
      { heading: 'Turn order fix', items: [
        'The slot formula places the first-processed actor last in the turn, so ties must be processed in the reverse of the order you want to see.',
        'Ties now process the player last and enemies in reverse spawn order, giving [You, Rat 1, Rat 2]. Before, two rats came out as [You, Rat 2, Rat 1].',
        'With one rat nothing changes, so the original turn-order test cases still pass.',
      ]},
      { heading: 'Unchanged', items: [
        'Mid-turn kills still skip the dead rat\'s remaining slots, and win / lose is still only checked at turn end.',
      ]},
    ],
  },
  {
    version: '0.1.0',
    date: '2026-10-07',
    title: 'Initial prototype',
    summary: [
      { tag: 'New', text: 'A turn-based dungeon crawler on a single procedurally generated floor.' },
      { tag: 'New', text: 'Move with WASD. Attack by bumping into an adjacent enemy.' },
      { tag: 'New', text: 'Action Points based Movement and Combat' },
      { tag: 'New', text: 'A single rat enemy that hunts you down and bites when it gets close.' },
      { tag: 'New', text: 'Space to wait. R to restart after you die or clear the floor.' },
      { tag: 'New', text: 'Main menu with Play, Upgrades, Encyclopedia, Settings, Changelogs, and Quit.' },
      { tag: 'New', text: 'Changelog screen (this one) documenting each release.' },
    ],
    tech: [
      'Pure HTML / CSS / JavaScript. No build step, no libraries, no external assets.',
      'Dungeon layout is generated with BSP (binary space partitioning).',
      'Turn order comes from an Action Point system: each actor gains AP every turn, and its actions are spread across the turn.',
      'Rat pathfinding uses BFS, so a rat always steps along a shortest path to you.',
    ],
    dev: [
      { heading: 'AP system in brief', items: [
        'Each turn an actor gains its AP rate and gets floor(AP) actions, one AP each. Leftover fractions carry over.',
        'Actions are spread across one shared turn with pos = ceil(k × R / n), so a fast actor is interleaved rather than front-loaded.',
        'Examples: You 1 / Rat 1 → You · Rat. You 2 / Rat 1 → You · You · Rat. You 1 / Rat 2 → Rat · Rat · You.',
      ]},
      { heading: 'Turn rules', items: [
        'The schedule is locked at turn start. A dead actor\'s remaining slots are skipped, and win / lose is only checked at turn end.',
        'You cannot bank AP or end a turn early. Unused actions must be spent, even by waiting.',
      ]},
    ],
  },
];