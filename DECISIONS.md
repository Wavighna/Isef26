# Build Decisions

## Decision Log

### 2026-06-23: Keep All Changes Project-Local

The prior Paxel report flagged environment/tooling ambiguity. This session will keep all edits inside `/Users/avighnawuthoo/Documents/GitHub/Isef26` and avoid home-directory wrappers, shell profile edits, global installs, and Node/npm version changes.

### 2026-06-23: Use Documentation Artifacts Before App Edits

`PLAN.md` and this decision log are created before app-code changes so the session is auditable and easier to evaluate later.

### 2026-06-23: Improve Existing Pages Before Rebuilding Architecture

The current app already has a product page, pattern lab, and optimizer. The first implementation path is to strengthen copy, hierarchy, assumptions, and supporting UI inside existing files rather than introducing new routing or a broad refactor.

### 2026-06-23: Treat Optimizer Outputs as Prototype Heuristics

The region optimizer should be framed as a demo model based on environmental heuristics. It should not be presented as a validated engineering calculator until real panel testing, soiling datasets, contact-angle measurements, and optical/transmission tests support it.

### 2026-06-23: Say Surface Pattern, Not Coating, For the Core Mechanism

The concept should be described as a transparent PMMA/acrylic overlay with unmodified hydrophilic regions and CO2 laser-etched hydrophobic regions. "Coating" is reserved for discussing conventional chemical coating alternatives or avoided entirely where it could imply that this project applies a chemical hydrophobic layer.

### 2026-06-23: Keep Evidence Visible But Label Its Status

The product page can show poster-reported controlled-coupon results, but any value that lacks visible method details should say what is missing: replicate count, error bars, image-analysis method, statistical test name, or field PV validation. Presentation polish should not turn prototype evidence into a commercial performance claim.

### 2026-06-23: Add Keyboard-Friendly Region Selection

The globe is visually compelling, but a judge should not depend only on pointer picking through a canvas. The optimizer will keep the globe while adding a region select control as an accessible and presentation-safe fallback.
