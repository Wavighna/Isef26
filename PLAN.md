# ISEF Demo Build Plan

## Objective

Turn this Next.js prototype into a more judge-ready product and science demo for the solar-panel self-cleaning overlay concept. The app should make the invention understandable in under one minute, then give deeper views for mechanism, pattern choices, region recommendations, and honest technical assumptions.

## Current Starting Point

- Product and Pattern Lab pages live mostly in `app/_components/project-pages.tsx`.
- The 3D optimizer, region categories, and recommendation logic live in `app/page.tsx`.
- Tailwind is configured through `app/globals.css` and `postcss.config.mjs`.
- Scripts are defined in `package.json` and currently use Turbopack.
- `next-env.d.ts` already has a local modification before this session; this plan will not touch it unless verification proves it is necessary.

## Constraints

- Keep code and config changes inside `/Users/avighnawuthoo/Documents/GitHub/Isef26`.
- Do not create or edit files in `/Users/avighnawuthoo`.
- Do not edit shell profiles, PATH settings, global npm config, or system Node/npm setup.
- Do not install global packages.
- Do not change Node, npm, or package-manager versions.
- Project-local dependency changes are allowed only if verification shows they are necessary.
- Keep scientific claims honest; separate tested evidence from prototype heuristics and future validation needs.
- Do not add fake citations or fake experimental results.
- If sample values are used, label them as illustrative or prototype heuristic values.

## Parallel Review Workstreams

- Product/story review: judge, investor, mentor, and customer clarity.
- UX/design review: navigation, hierarchy, responsive behavior, mechanism visualization, optimizer usability.
- Science/assumptions review: validated facts, plausible hypotheses, demo-only model values, needed experiments.
- QA/build review: scripts, dependencies, lint/build/typecheck behavior, existing local changes.

## Implementation Phases

### Phase 1: Planning and Audit

Status: completed.

- Inspect app structure and current git status.
- Create `PLAN.md` and `DECISIONS.md` before editing app code.
- Wait for parallel reviewer findings and integrate the useful parts.
- Baseline verification before implementation: `npm run lint`, `npm run typecheck`, and `npm run build` all passed.
- Product/story finding: avoid "coating" language where the project means a laser-etched surface pattern.
- UX finding: reduce first-viewport clutter, add clearer mechanism labels, make mobile optimizer show the globe earlier, and avoid hidden scroll panels.
- Model finding: optimizer values are broad heuristic lookups, not calibrated regional optima.
- QA finding: remove judge-facing placeholder metrics and make README match app caution level.

### Phase 2: Product and Judge Narrative

Status: in progress.

- Strengthen the product page so it clearly explains the soiling problem, retrofit overlay, wetting/release sequence, business value, and validation status.
- Add a compact judge-readiness section that distinguishes what is built, what is tested, and what still needs to be proven.
- Preserve the current animated surface visual and improve surrounding copy rather than replacing the core concept.

### Phase 3: Mechanism and Pattern Lab

Status: pending.

- Add clearer labels for hydrophilic PMMA zones and laser-textured hydrophobic release zones.
- Make the relationship between strip direction, water path, dust transport, and future pattern variants easier to read.
- Add design constraints such as transparency, manufacturability, inspection, and droplet pinning.

### Phase 4: Optimizer and Assumptions

Status: pending.

- Make the optimizer visibly honest about being a heuristic prototype, not a validated calculator.
- Add concise explanation of how rainfall, dust, tilt, moisture, and temperature influence the recommendation.
- Add explicit model limits and data needed for validation.

### Phase 5: Verification

Status: pending.

- Run `npm run lint`.
- Run `npm run typecheck`.
- Run `npm run build`.
- If needed, start the dev server and perform a browser or HTTP smoke check.
- Fix only project-local causes if any check fails.

### Phase 6: Final Documentation

Status: pending.

- Update this plan with completed status.
- Update `DECISIONS.md` with final choices.
- Create `VERIFY.md` with commands and results.
- Summarize changed files and unresolved risks.

## Likely Files to Change

- `app/_components/project-pages.tsx`
- `app/page.tsx`
- `PLAN.md`
- `DECISIONS.md`
- `VERIFY.md`

## Verification Commands

```bash
npm run lint
npm run typecheck
npm run build
```

## Risks

- `app/page.tsx` is large and includes the optimizer and Three.js scene, so changes there should be conservative.
- Current scripts use Turbopack; if build behavior differs from past sessions, document the behavior before changing scripts.
- The app already has generated `.next` files and local tool folders; avoid touching generated build output manually.
- Scientific evidence copy must not overstate the prototype as field-validated.
- Several dependencies use `latest`; do not change package versions in this session unless a local project failure requires it.
- The optimizer uses external Three.js texture URLs for bump/water/cloud details; the local Earth texture keeps the main globe usable, but CDN texture failures remain a demo risk.

## Rollback Notes

- App-code edits should stay in `app/_components/project-pages.tsx` and limited sections of `app/page.tsx`.
- Documentation changes can be removed independently if needed.
- No global environment edits are part of this plan.

## Success Criteria

- A judge can understand the invention, mechanism, evidence, and limits quickly.
- The Pattern Lab explains why patterns differ and what each is meant to test.
- The optimizer gives region recommendations with visible assumptions and model limits.
- Planning, decisions, and verification are readable in repo files.
- Lint, typecheck, and build results are recorded.
