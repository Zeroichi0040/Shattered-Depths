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

   WRITING GUIDELINES
   ------------------
   - Describe the DELTA only: what changed, why, and any gotcha.
   - Don't re-document unchanged behavior or the changelog itself.
   - Long-form reference material belongs in the Encyclopedia, not here.

   Suggested tag vocabulary: New, Change, Tweak, Fix, Removed, Improved.
   Keep each bullet short — one idea per line.
   ========================================================================= */

const CHANGELOG = [
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
      'Turn order comes from an Action Point system: each actor gains AP every turn and gets floor(AP) actions at 1 AP each. Leftover fractions carry over.',
      'Actions are interleaved across the turn with pos = ceil(k × R / n), so a faster actor is spread out rather than front-loaded.',
      'The turn schedule is locked at turn start. A dead actor\'s remaining slots are skipped, and win / lose is only checked at turn end.',
      'Rat pathfinding uses BFS, so a rat always steps along a shortest path to you.',
    ],
  },
];