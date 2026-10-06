# Asset spec: paste this into the other chat

Copy everything between the lines into the chat that will generate the art. Ask for the sprites in one reply so the style stays consistent, then paste what comes back into `SPRITES` in `assets.js` and open `preview.html` to compare.

---

I'm making a small turn-based dungeon crawler called **Shattered Depths**, with a top-down grid and a dark stone dungeon feel. The art is pixel art written as code, with no image files. Please draw the sprites below as **character grids**, in exactly the format shown.

## Format

Each sprite is a JavaScript object:

```js
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
    '.KPPGKKKKKK.....',
    'KGGGGGGGGGKK..PP',
    'KRGGGGGGGGGGK.P.',
    'PGGGGGGGGGGGGKP.',
    'KWKGGGGGGGGGGKP.',
    '.KKgGGGGGGGGgKK.',
    '..KgggGGGGggK...',
    '...KKKKKKKKK....',
    '..KPK.KPK.KPK...',
    '................',
    '................',
  ],
},
```

## Hard rules

1. Every sprite is **exactly 16 rows of exactly 16 characters**. Count them. A row that is 15 or 17 characters long breaks the sprite.
2. `.` means transparent. Never put `.` in a legend.
3. Every other character must appear in that sprite's `legend`, mapped to a hex color like `'#1a1a24'`.
4. Use single characters only. Letters are fine, and upper and lower case count as different characters.
5. Use **at most 8 colors** per sprite, not counting transparency.
6. Give every sprite a **dark 1px outline** so it reads against a dark floor.
7. Light comes from the **top-left**. Put highlights top-left and shade bottom-right.
8. Keep the **same style across the whole set**: the same outline darkness, the same level of detail and a related palette.
9. The sprite should fill most of the 16×16 area. The floor behind it is dark grey-purple (`#3c3b4a`), so avoid colors close to that.
10. Characters face **left** unless I say otherwise, and stand with their feet near the bottom row.

## What to draw

Give me **3 variants of each** of these, named with a `_v1`, `_v2`, `_v3` suffix (for example `player_v1`, `player_v2`, `player_v3`):

- `player`: a hooded adventurer, front-facing or three-quarter view.
- `rat`: a dungeon rat, side view facing left. It has about 3 HP, so it is small and a bit scrappy.

And **one** of each of these (no variants):

- `stairs_down`: a staircase descending into the dark, seen from above. The steps should get darker as they go down.
- `bonfire`: a campfire ringed by stones with logs. It needs **2 animation frames** for the flicker, so use `frames: [ [16 rows], [16 rows] ]` instead of `rows`. Only the flame should change between frames.

## Output

Reply with **only** the JavaScript objects, as a single code block, ready to paste inside a `const SPRITES = { ... };`. Put a comma after every sprite. No explanations before or after.

After the code block, add one line listing any sprite where you are not sure every row is exactly 16 characters.

---

## Optional: tile colors

Floor and wall tiles are drawn by code, not by hand. If you also want to try new tile colors, ask for this separately:

> Suggest a color set for a dark stone dungeon in this shape: `floor: { base, specks: [3 colors], crack, edge }` and `wall: { bricks: [3 colors], highlight, mortar, noise }`, all as hex strings. Keep the floor darker than the wall so characters stand out against it.

Paste the result into `TILE_STYLES` in `assets.js`.
