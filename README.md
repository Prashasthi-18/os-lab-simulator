# OS Lab Simulator

**Understand. Simulate. Compare.** An interactive simulator for an 8-week Operating Systems lab:
CPU scheduling, memory allocation, file allocation, deadlocks and page replacement.

**Live demo: [os-lab-simulator-rose.vercel.app](https://os-lab-simulator-rose.vercel.app)**

![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES%20modules-F7DF1E?logo=javascript&logoColor=black)
![No dependencies](https://img.shields.io/badge/runtime%20dependencies-none-brightgreen)
![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000?logo=vercel&logoColor=white)

---

## Contents

- [Features](#features)
- [Modules](#modules)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [How it works](#how-it-works)
- [API](#api)
- [Tests](#tests)
- [Deploy to Vercel](#deploy-to-vercel)
- [Algorithm assumptions](#algorithm-assumptions)
- [Limits](#limits)
- [Design notes](#design-notes)

## Features

- **Step-by-step playback:** play, pause, step forward and back through a complete execution trace. Every step explains
  *why* the algorithm made its choice.
- **Compare algorithms:** run every algorithm in a module on the same input and see which one is best for each metric,
  plus a plain-language summary.
- **Saved experiments:** keep inputs and results in your browser and reopen them later.
- **Export:** download results as CSV or JSON.
- **Learn panel:** for each algorithm, an overview, its complexity, trade-offs, formulas and viva questions.
- **Strict validation:** invalid input is reported clearly and never silently corrected.
- **Light and dark themes**, a responsive layout, and no build step.

## Modules

| Week | Module | Algorithms |
|---|---|---|
| 1, 2 | `cpu` | FCFS, SJF (+ SRTF option), Priority (+ preemptive option), Round Robin |
| 3 | `memory` | First Fit, Best Fit, Worst Fit |
| 4, 5 | `files` | Sequential, Indexed, Linked |
| 6 | `deadlock` | Banker's (avoidance + request check), Detection |
| 7, 8 | `paging` | FIFO, Optimal, LRU, Belady's anomaly demo |

## Quick start

You need **Python 3.9+**. No `pip install` is needed to run the app.

```bash
git clone https://github.com/Prashasthi-18/os-lab-simulator.git
cd os-lab-simulator
python dev_server.py          # http://localhost:8000
```

To use another port, run `python dev_server.py 3000`. `npm start` does the same as `python dev_server.py`, and
`vercel dev` also works if you have the Vercel CLI.

## Project structure

```
os-lab-simulator/
├── api/
│   ├── simulate.py          # Vercel serverless function: POST /api/simulate
│   └── _core/               # Pure-Python algorithms (standard library only)
│       ├── __init__.py      # dispatch(): routes {module, algorithm, input} to a module
│       ├── common.py        # shared validation helpers
│       ├── cpu.py           # FCFS, SJF/SRTF, Priority, Round Robin
│       ├── memory.py        # First / Best / Worst Fit
│       ├── files.py         # Sequential, Indexed, Linked allocation
│       ├── deadlock.py      # Banker's algorithm, Detection
│       └── paging.py        # FIFO, Optimal, LRU, Belady's anomaly
├── public/                  # Static frontend (HTML, CSS, ES modules)
│   ├── index.html
│   ├── css/                 # variables, themes, layout, components, charts
│   └── js/
│       ├── main.js          # hash router
│       ├── modules/         # input forms and renderers for each module
│       ├── views/           # dashboard, workspace, compare, saved, learn, about
│       ├── playback.js      # step-by-step trace controller
│       ├── charts.js        # dependency-free SVG/HTML charts
│       └── export.js        # CSV / JSON export
├── tests/                   # pytest suites + node:test frontend tests
├── dev_server.py            # local server: static files + /api/simulate
└── vercel.json              # function config (framework preset: Other)
```

## How it works

The browser POSTs `{module, algorithm, input}` to `/api/simulate`. Python validates the input (nothing is silently
corrected), runs the algorithm and returns a **complete execution trace** plus metrics. The UI renders one trace step at a
time, so Previous step restores the exact earlier state, speed changes never alter results, and editing an input
invalidates the old trace until you run again. Compare runs every selected algorithm on the same input; best-per-metric
and the plain-language summary are computed from the real results.

## API

`POST /api/simulate` takes a JSON body and always returns HTTP 200 with `ok: true` or `ok: false`. The only exceptions
are malformed JSON (400) and request bodies over 1 MB (413).

| Field | Description |
|---|---|
| `module` | `cpu`, `memory`, `files`, `deadlock` or `paging` |
| `algorithm` | one algorithm, e.g. `fcfs`, `sjf`, `priority`, `rr`, `first`, `best`, `worst`, `sequential`, `indexed`, `linked`, `banker`, `detection`, `fifo`, `optimal`, `lru`, `belady` |
| `algorithms` | *(optional)* a list of algorithms to run on the same input; the response then has `results` keyed by algorithm |
| `input` | the module's input object |

Example:

```bash
curl -X POST https://os-lab-simulator-rose.vercel.app/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"module":"cpu","algorithm":"fcfs","input":{"processes":[{"id":"P1","arrival":0,"burst":3},{"id":"P2","arrival":1,"burst":2}]}}'
```

```jsonc
{ "ok": true, "result": { "algorithm": "fcfs", "label": "First Come, First Served", "steps": [ ... ], "metrics": { ... } } }
// on invalid input:
{ "ok": false, "errors": ["..."] }
```

## Tests

```bash
pip install pytest
npm test                      # = python -m pytest tests -q  &&  node --test tests/js/*.test.mjs
```

- `tests/test_*.py`: 99 tests covering every algorithm, edge cases and input validation (CPU, memory, files, deadlocks, paging).
- `tests/js/app.test.mjs`: 8 tests for the playback controller, saved experiments/progress, CSV/JSON export and the
  compare ranking logic.

There is no build step and no TypeScript, so there is nothing to compile.

## Deploy to Vercel

**From GitHub (auto-deploys on every push):**

1. Import this repository at [vercel.com/new](https://vercel.com/new).
2. Use the framework preset **Other**, with no build command and no output directory. Vercel serves `public/` and
   detects `api/simulate.py` as a Python function.
3. Deploy. `vercel.json` already bundles `api/_core/**` with the function and sets `"framework": null`, so Vercel
   doesn't treat the project as a single Python app.

**From the command line:**

```bash
npx vercel login
npx vercel deploy --prod
```

## Algorithm assumptions

These are also shown in the app.

- **CPU:** clock starts at 0 (early idle counts); total time = last completion. Ties: FCFS input order; SJF burst then arrival then ID; Priority arrival then ID. Round Robin queues arrivals at or before a quantum's end before the pre-empted process. Context switches are counted but cost no time.
- **Memory:** one process per block; leftover = internal fragmentation; Best/Worst ties go to the first block.
- **Files:** automatic policy uses lowest-numbered free blocks (Sequential: first contiguous run). 4-byte pointers/index entries; single-level index holds `block_size/4` entries; files are at least 1 byte. Costs are block reads with no caching or seek model (teaching estimates).
- **Deadlocks:** Banker's picks the first eligible process by index (other safe sequences may exist). Detection marks processes holding nothing as finished.
- **Paging:** fixed frame slots; Optimal evicts the earliest-loaded page among those never used again.

## Limits

| Module | Limit |
|---|---|
| CPU | 30 processes, 500 total burst time |
| Memory | 30 blocks, 30 processes |
| Files | 128 disk blocks, 20 files |
| Deadlock | 10 processes x 6 resource types |
| Paging | 500 page references, 16 frames |

## Design notes

The project uses Python + HTML/CSS/JS instead of the originally specified React/TypeScript/Vite/Recharts/Framer
Motion/Lucide/Vitest stack. Charts are dependency-free HTML/SVG, icons are inline Lucide-style SVG, animation is CSS,
and tests use pytest and `node:test`. The spec's "no backend" became a stateless serverless function: there is no
database and nothing is stored on the server.
