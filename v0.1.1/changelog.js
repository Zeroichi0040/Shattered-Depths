/* =========================================================================
   Shattered Depths — changelog.js
   v0.1.1

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

       tech: [                             // medium-level overview
         '...',
         '...',
       ],

       dev: [                              // design notes; omit for tiny entries
         { heading: 'Files',      items: ['...', '...'] },
         { heading: 'Turn flow',  items: ['...'] },
         // a plain string is also allowed and renders as a bullet
         'A loose bullet with no heading.',
       ],
     }

   Suggested tag vocabulary: New, Change, Tweak, Fix, Removed, Improved.
   Keep each bullet short — one idea per line.
   ========================================================================= */

const CHANGELOG = [
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
      'A new constant, RAT_SPAWN_COUNT, controls how many rats appear per floor. Default is 2.',
      'Rats spawn on distinct tiles, placed at least 4 Manhattan steps away from the player when the map allows it.',
      'Each rat is labeled E1, E2, E3 ... by spawn order. The debug display and the turn schedule use these labels.',
      'The turn scheduler was adjusted so multiple rats of the same speed act in the order they spawned.',
    ],
    dev: [
      { heading: 'Why more than one rat', items: [
        'The original prototype assumed a single rat everywhere in the code, from spawn to win condition. Supporting more than one meant re-checking every assumption.',
        'RAT_SPAWN_COUNT is the new knob at the top of game.js. Default is 2. Set it to 1, 3, or more to try different pack sizes.',
        'The knob is safe to change at any point. It is read once per run, at the moment a floor is generated.',
      ]},
      { heading: 'Where rats spawn', items: [
        'Every rat is placed on its own floor tile. Two rats can never share a tile, and a rat can never spawn on the player.',
        'When the map has room, rats spawn at least 4 Manhattan steps away from the player. This guarantees no rat can reach you and attack on turn 1.',
        'If the map is too tight for that rule, the constraint relaxes to "any tile that is not the player\'s tile".',
        'If even that fails, fewer rats spawn than RAT_SPAWN_COUNT asked for. The run still starts, just with a smaller pack.',
      ]},
      { heading: 'How multiple rats take turns', items: [
        'On each turn, every actor has some number of actions available, derived from their AP. Actors with the same number of actions used to tie, and the tie was resolved simply. With one enemy that worked fine and always produced "player then rat".',
        'With two enemies of the same speed, that same tiebreak produced the two rats in the wrong order. The visible schedule read [You, Rat 2, Rat 1] instead of [You, Rat 1, Rat 2].',
        'The cause is subtle. The slot placement formula processes actors one at a time and places each one\'s actions into whatever free slots are left. The first actor processed ends up toward the end of the turn, not the start. So when several actors tie, the order they are processed in is the reverse of the order they appear.',
        'The rule is now: on a tie, the player is processed last, and enemies are processed in reverse spawn order. Reversing both means the visible schedule reads [You, Rat 1, Rat 2, ...], which is what a player expects.',
        'With a single rat, the change has no visible effect, so all of the original 9 canonical turn order test cases still pass.',
      ]},
      { heading: 'When a rat dies mid-turn', items: [
        'A dead rat is removed from the enemy list the moment its HP reaches 0.',
        'Any remaining slots that belonged to that rat are skipped. They do not cost anyone else an action and they do not shift the schedule.',
        'The rest of the schedule still resolves. Killing rat 1 on your first action does not cancel your second action, and does not cancel rat 2\'s turn.',
        'The win condition is only checked once the entire schedule has resolved. A mid-turn kill cannot end the run early, and cannot short-change the surviving actors.',
      ]},
      { heading: 'Changelog layout', items: [
        'Each entry has a summary that is always visible, and an expandable panel behind the "+" toggle in the entry header.',
        'The panel has two sections separated by a horizontal divider. The first is "More technical information", a bulleted overview written for a player who wants a bit more detail. The second is "Design notes", a longer-form section written for a developer.',
        'Design notes accept two shapes. A plain string becomes a loose bullet. An object with { heading, items } renders a small bold heading followed by a bullet list. Both can be mixed in the same array, in any order.',
        'When an entry has no dev data, the divider and the "Design notes" heading are not created. The panel shows only the technical overview.',
        'Rendering is done with document.createElement and appendChild only — no innerHTML for entry content, no framework. The whole file stays self-contained and adds zero dependencies.',
        'The screen itself is one of the three top-level sections in index.html (menu, play, changelog). It is populated on demand by renderChangelog(), which rebuilds the list from scratch each time it is shown.',
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
      'Dungeon layout is generated procedurally using BSP (binary space partitioning).',
      'Turn order is determined by an Action Point system: each actor gains AP at the start of a turn, and the actions they have available are spread across the turn.',
      'Enemy pathfinding uses BFS so the rat always steps along a shortest path to the player.',
      'The turn schedule is locked at the start of each turn, so mid-turn deaths do not reshuffle the order.',
      'The changelog hides its technical notes behind a "+" toggle in the entry header.',
    ],
    dev: [
      { heading: 'AP combat system', items: [
        'Every actor (you and each rat) carries a pool of Action Points (AP). At the start of every turn, each living actor adds their AP rate to that pool. Both sides start with a rate of 1.0.',
        'An action costs 1 AP. There are three actions: move one tile, attack an adjacent enemy, or wait. Bumping a wall or the edge of the map is still an action. The move fails but the AP is spent.',
        'The number of actions an actor has available this turn is floor(current AP). The leftover fraction stays in the pool and carries into future turns. A rate of 1.5, for example, effectively grants an extra action every other turn.',
        'Available actions are spread across a single shared turn. The turn is split into slots, one slot per action across all actors. That order is locked the moment the turn begins and never re-shuffles mid-turn.',
        'How the order is decided. First, actors are sorted by how many actions they have this turn, fewest first. Ties are broken by a fixed rule. Then each actor\'s actions are placed into the remaining free slots one at a time, using this formula:',
        '• pos = ceil(k × R / n)',
        '• n is how many actions this actor has left to place.',
        '• k is which of their actions is being placed (1st, 2nd, 3rd, ...).',
        '• R is how many free slots remain right now.',
        '• pos is which of those free slots the action goes into, counting from the front.',
        'In plain terms: an actor with n actions places their k-th action at position k divided by n, through whatever free slots are left. This spreads a fast actor\'s actions evenly across the turn instead of letting them front-load everything.',
        'Worked examples, all starting from 0 AP:',
        '• You 1.0 / Rat 1.0  →  You · Rat',
        '• You 2.0 / Rat 1.0  →  You · You · Rat',
        '• You 1.0 / Rat 2.0  →  Rat · Rat · You',
        '• You 3.0 / Rat 2.0  →  You · You · Rat · You · Rat',
        '• You 1.5 / Rat 1.0  →  turn 1: You · Rat (you keep 0.5).  turn 2: You · You · Rat.',
        'Tiebreaks. When you and a rat have the same number of actions, you act first. When several rats tie with each other, they act in spawn order. The formula above places the first actor processed toward the end of the turn, which is why the sort order is the reverse of what you see on screen.',
        'If an actor dies partway through the turn, its remaining slots are skipped. The rest of the schedule still resolves. Killing a rat on your first action does not cancel your second action, and does not cancel any other rat\'s turn.',
      ]},
      { heading: 'Turn flow', items: [
        '1. Every living actor gains their AP rate. Pools carry over from the previous turn.',
        '2. The turn schedule is built from those pools and locked for the rest of the turn.',
        '3. Slots resolve left to right. When a slot belongs to you, the game waits for your input. When a slot belongs to a rat, the game pauses briefly, then the rat acts automatically.',
        '4. Each action subtracts 1 AP from that actor\'s pool.',
        '5. When every slot has resolved, the turn ends. Any leftover AP stays in the pool.',
        '6. The next turn begins immediately, back at step 1.',
        'There is no way to bank AP for a big turn later, and no way to end your turn early. Every action you have must be spent, even if that means waiting in place.',
        'Win and loss are checked only at the end of a turn, never mid-turn. That keeps the schedule stable and means a mid-turn kill cannot cut off the actors who still had slots left to play.',
      ]},
      { heading: 'Changelog: the original layout', items: [
        'Each entry is a single object pushed onto the CHANGELOG array, newest first. Fields: version, date, title, summary, and tech.',
        'The summary is an array of { tag, text } objects. The tag is one of a small vocabulary (New, Change, Tweak, Fix, Removed, Improved) and renders as a small bordered pill next to the text.',
        'The tech array is a list of plain strings. It is hidden by default and revealed by the "+" button in the entry header, which flips to "−" while open.',
        'Rendering is done with document.createElement and appendChild only — no innerHTML for entry content, no framework. The whole file is self-contained and adds zero dependencies.',
        'The screen itself is one of the three top-level sections in index.html (menu, play, changelog). The changelog section is populated on demand by renderChangelog(), which rebuilds the list from scratch each time it is shown.',
      ]},
    ],
  },
];