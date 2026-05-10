# Solstice Surface Systems

Solstice Surface Systems is a static Next.js prototype for an ISEF26 solar-panel cleaning overlay. The concept uses transparent PMMA as a solar-cover analog and combines hydrophilic wetting areas with CO2 laser-textured hydrophobic release areas. Water spreads first to loosen dust and mineral residue, then moves through lower-contact regions so droplets can carry debris down the panel without PFAS-style chemical coatings.

Use this repo as a presentation-grade research prototype. It explains the material idea, shows coating layouts, and includes a 3D regional optimizer that turns location and surface conditions into a suggested hydrophilic / hydrophobic pattern mix.

## Research Question

Solar panels lose output when dust, mineral residue, pollen, salt film, or biological residue blocks incoming light. Conventional cleaning needs water, labor, or chemical coatings. This prototype asks whether a transparent retrofit overlay can reduce residue by controlling how water wets and releases from the panel surface.

The design tests one main idea: hydrophilic areas should spread water across stuck particles, while laser-textured hydrophobic areas should reduce droplet pinning and help dirty water leave the panel. The alternating pattern tries to use both behaviors in sequence instead of choosing one surface type for the whole panel.

## Product Story

The product page presents the cleaning sequence and the current testing basis:

- PMMA cover analog with transparent retrofit-overlay framing.
- CO2 laser-textured hydrophobic regions at 30% dot density.
- Animated runoff surface showing soil wetting, droplet travel, and residue removal.
- Three-step mechanism: wet the soil, move the droplet, carry residue off.
- Testing evidence from hydrophilic, hydrophobic, and alternating coupons.

Current evidence shown in the UI:

| Metric | Value |
| --- | --- |
| Residual contamination | 2.02% |
| Improvement vs. hydrophilic control | 21.7% |
| Statistical result | p < 0.01 |
| PMMA transmittance basis | ~92% |

## Pattern Lab

The pattern lab compares the coating layouts behind the concept:

- **Alternating bands:** tested baseline with equal-width hydrophilic and hydrophobic paths.
- **Continuous wettability gradient:** future direction that smooths the transition between wetting and release.
- **Concentric rectangular transport paths:** future geometry for steering dirty water outward as well as downward.

The copy stays tied to physical behavior: hydrophilic areas spread water across dust, while dotted hydrophobic areas create release paths that keep droplets moving.

## 3D Optimizer

The optimizer is an interactive Three.js globe. Users can hover and click land regions, switch from the world map into U.S. states by selecting the United States, or choose an ocean / sea from the selector.

When a region is selected, the inspector returns:

- Region type: country, U.S. state, ocean, or sea.
- Estimated annual tilt.
- Rainfall, soiling, temperature, and moisture context.
- Recommended hydrophilic / hydrophobic coating mix.
- Suggested strip count for the preview pattern.
- A short note explaining why that environment needs the selected pattern.

The recommendations are prototype heuristics in `app/page.tsx`, not a validated engineering calculator. Country and state classifications use small hardcoded sets plus latitude rules. Marine zones use hardcoded entries for major oceans and seas.

## Surface Categories

The optimizer maps each selected region into one of these surface profiles:

| Category | Hydrophilic | Hydrophobic | Strip count | Use case |
| --- | ---: | ---: | ---: | --- |
| Rainy / steep | 86% | 14% | 6 | High rainfall, low to moderate soiling |
| Humid / moderate | 76% | 24% | 8 | Organic film and light dust |
| Temperate | 66% | 34% | 10 | Mixed dirt, pollen, and road dust |
| Arid / dusty | 52% | 48% | 14 | Frequent mineral dust |
| Desert / flat | 42% | 58% | 18 | Heavy fine dust and mineral residue |
| Humid marine | 82% | 18% | 7 | Salt film, spray, rain, and fog |
| Arid marine | 60% | 40% | 12 | Salt film plus coastal dust |
| Cold marine | 88% | 12% | 5 | Salt, ice, moisture, and low evaporation |

## Tech Stack

- Next.js App Router with React and TypeScript.
- Tailwind CSS v4 through PostCSS.
- Turbopack for local development and production builds.
- Three.js for the interactive globe.
- `d3-geo`, `topojson-client`, `world-atlas`, and `us-atlas` for region geometry and hit detection.
- Static assets only. The Earth texture lives in `public/textures/earth-8192.jpg`.

## Project Map

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Main client app shell, navigation, 3D optimizer, region data, recommendation logic |
| `app/product/page.tsx` | Product route wrapper |
| `app/pattern-lab/page.tsx` | Pattern lab route wrapper |
| `app/optimizer/page.tsx` | Optimizer route wrapper |
| `app/_components/project-pages.tsx` | Product and pattern lab page content, visuals, and research sections |
| `app/layout.tsx` | Metadata and root layout |
| `app/globals.css` | Tailwind import |
| `public/textures/earth-8192.jpg` | Local Earth surface texture |
| `run-local.sh` | Helper script that runs the dev server with a repo-local Node path when available |

## Running Locally

Use Node.js 20.9 or newer.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Build the production bundle:

```bash
npm run build
```

Run the production server after a build:

```bash
npm run start
```

## Quality Checks

Run TypeScript without emitting files:

```bash
npm run typecheck
```

Run ESLint:

```bash
npm run lint
```

## Current Scope

This repo is a static, client-side prototype. It has no API routes, database, authentication, server data fetching, or external calculation service. All region recommendations, pattern percentages, marine-zone notes, and research copy live in the frontend code so the prototype can run as a self-contained demo.
