/* =========================================================================
   Shattered Depths — changelog.js
   v0.1.0

   HOW TO ADD A NEW ENTRY
   ----------------------
   Push a new object to the TOP of CHANGELOG (newest first). Each entry:

     {
       version: '0.2.0',
       date:    'YYYY-MM-DD',
       title:   'Short release title',
       summary: [                          // shown to everyone
         { tag: 'New',    text: '...' },
         { tag: 'Change', text: '...' },
         { tag: 'Tweak',  text: '...' },
         { tag: 'Fix',    text: '...' },
         { tag: 'Removed',text: '...' },
       ],
       tech: [                             // hidden behind the "+" icon
         '...',
         '...',
       ],
     }

   Suggested tag vocabulary: New, Change, Tweak, Fix, Removed, Improved.
   Keep each bullet short — one idea per line.
   ========================================================================= */

const CHANGELOG = [
  {
    version: '0.1.0',
    date: '2026-10-07',
    title: 'Initial prototype',
    summary: [
      { tag: 'New', text: 'A turn-based dungeon crawler on a single procedurally generated 10×10 floor.' },
      { tag: 'New', text: 'Move with WASD. Attack by bumping into an adjacent enemy.' },
      { tag: 'New', text: 'Action Point (AP) system — faster actors take more actions per turn.' },
      { tag: 'New', text: 'A single rat enemy that hunts the player and attacks when adjacent.' },
      { tag: 'New', text: 'Space to wait (spend 1 AP). R to restart after death or clear.' },
      { tag: 'New', text: 'Main menu with Play, Upgrades, Encyclopedia, Settings, Changelogs, and Quit.' },
      { tag: 'New', text: 'Changelog screen (this one) documenting each release.' },
    ],
    tech: [
      'Pure HTML / CSS / JS. No build step, no dependencies, no external assets.',
      'Files: index.html, style.css, game.js, changelog.js.',
      'BSP dungeon generation — recursive region splitting plus L-shaped corridor carving between room centers.',
      'AP scheduling: the slower actor is placed at ceil(k * R / n) over a shrinking free-slot list. Tie-break sort order is enemies-first, player-last, which is what makes the canonical "P E" for 1:1 come out right.',
      'Rat AI: BFS distance map from the player, recomputed each AI action. Moves one orthogonal step toward the player; attacks when adjacent.',
      'Turn schedule is locked at turn start. Dead actors\' remaining slots are skipped; win / lose is only evaluated at turn end.',
    ],
  },
];