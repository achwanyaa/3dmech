# 🫀 3D Anatomy Explorer — Build Plan

> **Goal:** An interactive web app where university & med students dive from **organ → tissue → cell → organelle** through real 3D models. We start with **single organs** (the heart first) and expand system by system, reusing the same engine and content schema each time.

---

## Product North Star

One continuous **semantic zoom**: click any structure and the camera dives one level deeper, with a clickable breadcrumb (`Heart › Myocardium › Cardiomyocyte › Mitochondrion`) for navigation. The "infinite zoom into life" feel is the differentiator.

**Primary audience:** university / med students — so clinical relevance, histology, and exam-style recall are first-class, not afterthoughts.

---

## Tech Stack

### Frontend & Hosting
- Next.js (App Router) deployed on **Vercel**
- React Three Fiber (`@react-three/fiber`) + `@react-three/drei`
- Zustand or React state for the "current level / selected structure" store
- Tailwind CSS for UI

### 3D & Content
- glTF / GLB models, Draco-compressed
- Per-structure content in MDX or a headless CMS (Sanity)
- Level-of-detail (LOD) + lazy loading per organ
- Histology images served from Vercel blob / CDN

> ⚠️ **The real cost is content, not code.** The engine is a few weeks; accurate, level-by-level medical content + validated models + histology is the long pole. Build the schema once so every new organ is repeatable.

---

## The "Single Organ" Content Schema

Every organ we add follows the same template. Define this **before** building organ #2 so expansion is copy-paste, not custom work.

| Field | Description |
|---|---|
| **id / slug** | Stable identifier (e.g. `cardiomyocyte`) |
| **level** | organ / region / tissue / cell / organelle |
| **parent / children** | Links that power the zoom-dive tree |
| **names** | Terminologia Anatomica + eponym + lay term |
| **function** | Short description + physiology note |
| **clinical correlation** | Pathology / board-relevant fact |
| **histology** | Matched micrograph (for tissue/cell levels) |
| **quiz items** | Question(s) tied to this structure |
| **model ref** | GLB file + mesh/node name to focus the camera |

---

## Phased Build Plan

### Phase 0 — Proof of Concept *(~2–3 weeks)*

*Goal: prove the zoom-dive feels good and performs.*

- [ ] Next.js + R3F app scaffolded and deployed to Vercel
- [ ] Load **one heart GLB**, rotate / zoom / pan controls
- [ ] Click-to-select a structure → highlight + info panel
- [ ] Implement **one dive transition** (organ → tissue) with camera animation
- [ ] Breadcrumb navigation (dive in / climb out)
- [ ] Validate performance on a mid-range laptop

---

### Phase 1 — First Full Organ MVP (the Heart) *(~4–6 weeks)*

*Goal: the complete dive, end to end, for one organ.*

- [ ] Heart modeled/sourced through all levels: organ → region → tissue → cell → organelle
- [ ] Content schema implemented and filled for the heart
- [ ] **Histology pairing** — 3D tissue ↔ real H&E micrograph side-by-side
- [ ] Search any structure → camera flies to it
- [ ] Section/slice plane (sagittal / coronal / transverse)
- [ ] Labels on/off toggle (clean vs. annotated)
- [ ] Onboard 10–20 med students for feedback

---

### Phase 2 — Depth, Retention & Organ #2 *(~6–8 weeks)*

*Goal: make it a study tool people return to, and prove repeatability.*

- [ ] **Quiz / active-recall mode** ("click the AV node") with scoring
- [ ] Spaced repetition tracking weak structures
- [ ] Clinical correlations pinned to structures
- [ ] User accounts + bookmarks / study sets
- [ ] Progress dashboard (levels / systems mastered)
- [ ] **Add a 2nd organ** (suggest the nephron — another great organ→cell story) to validate the schema scales

---

### Phase 3 — Scale & Distribution *(ongoing)*

*Goal: breadth + reach.*

- [ ] More organs/systems on the repeatable pipeline
- [ ] Imaging overlay (CT / MRI / X-ray next to the model)
- [ ] Physiology animations (heartbeat cycle, conduction wave, blood flow)
- [ ] Shareable deep-links (exact camera angle + level) for study groups & professors
- [ ] **B2B:** pitch a med school as a teaching / lab supplement

---

## Expansion Model (How "One Organ" Scales)

> 🔁 Each new organ is the **same five steps**: (1) source & optimize models per level, (2) fill the content schema, (3) attach histology, (4) write quiz items, (5) QA with a faculty/student reviewer. No new engine work — just content on rails.

1. **Heart** (Phase 1)
2. **Nephron / kidney** (Phase 2)
3. **Neuron / brain region**, **liver lobule**, **alveolus / lung** … (Phase 3+)

---

## Key Decisions to Lock Early

- [ ] **Minimum device target** — dictates poly-count & LOD strategy (decide before modeling)
- [ ] **Model sourcing** — Z-Anatomy (open-source), Sketchfab CC, BioDigital, or commissioned
- [ ] **Content authority** — line up a med student or faculty reviewer for accuracy (credibility is everything in this market)
- [ ] **Content store** — MDX in-repo vs. headless CMS

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Models too heavy for the web | Draco compression, LOD swapping, per-organ lazy loading |
| Content accuracy / credibility | Faculty / student reviewer sign-off before publishing each organ |
| Scope creep across systems | Lock the schema in Phase 1; only add organs once it's stable |
| Sourcing licensed 3D anatomy | Start with open-source (Z-Anatomy); budget for commissions later |
