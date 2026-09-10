# Interests imagery

`basketball.webp`, `weights.webp`, `jacket.webp`, and `music.webp` are original photographic cutouts generated with the built-in image_gen tool. They preserve alpha transparency and are cropped to their nontransparent bounds, resized to at most 600 × 300, and encoded as WebP at quality 85. The exact prompts and original source paths are recorded in [the generation manifest](../../../../.agent/rebus-image-prompts.json). These four shipped cutouts total 126,182 bytes.

`pokemon-logo.svg` replaces the generated trading-card image at the user's request. Source: [International Pokémon logo on Wikimedia Commons](https://commons.wikimedia.org/wiki/File:International_Pok%C3%A9mon_logo.svg), downloaded 2026-09-10. The source identifies Pokémon/Nintendo/Creatures/Game Freak as authors and labels the image PD-textlogo with a trademark notice. Optimized with the installed SVGO 1.3.2 while preserving its viewBox and proportions. The logo is a local image asset, not an external embed.

`cards.webp` is the unused original generated card cutout; retained as a design source and excluded from the application bundle.
