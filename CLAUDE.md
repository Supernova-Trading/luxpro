# LuxPro Development Rules — Read Before Every Session

## Mandatory repo sources
Every design decision must trace to one of these local repos:
- C:\Users\Sohaib\Documents\GitHub\taste-skill
- C:\Users\Sohaib\Documents\GitHub\ui-ux-pro-max-skill
- C:\Users\Sohaib\Documents\GitHub\open-design
- C:\Users\Sohaib\Documents\GitHub\impeccable
- C:\Users\Sohaib\Documents\GitHub\next-shadcn-dashboard-starter
- C:\Users\Sohaib\Documents\GitHub\superpowers
- C:\Users\Sohaib\Documents\GitHub\awesome-design-md

## Workflow — follow this every time
1. Read the relevant repo files FIRST
2. Show a sourced plan with file + line references
3. Wait for approval
4. Write code
5. Verify against the source before committing

## Never do this
- Invent design values not sourced from the repos above
- Write code before showing a plan
- Auto-commit without approval
- Use generic AI defaults (purple gradients, bounce animations, pure black backgrounds, outer glow shadows)

## LuxPro context
- Production URL: https://luxpro-nu.vercel.app
- Luxury ride tablet UI — passengers use it for 10-40 minutes in a moving car
- Target viewport: 1280x800 landscape, everything must fit without scrolling
- Brand: dark obsidian + gold (#C8A84B) + Newsreader (display serif; replaced Cormorant Garamond 2026-10-03 — see open-design/skills/hyperframes/references/typography.md banned-font list)
- Theme system: [data-theme] with semantic OKLCH tokens, structured like impeccable's token file (impeccable/public/css/tokens.css) — text colors must use tokens, never hardcoded values. (Not open-design's warm-editorial: that theme is hex-based and a light paper aesthetic, not OKLCH or dark-obsidian — checked 2026-10-02.)
- Known perf debt: 15–20 simultaneous backdrop-filter blur surfaces are the top sluggishness cause on Tab A — address in the UX/styling pass
- Every session continues from where the last one left off
