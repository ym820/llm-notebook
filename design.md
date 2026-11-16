# LLM notebook - design

Living document. Update it whenever a decision or a chapter's status changes.

## Why this exists

Yikai's ML and LLM learning is scattered across codebases, rough notes, and the cs336 assignments. Too much text, easy to forget, hard to pick back up. The goal is compounding: open the page a month later and be able to re-derive a topic.

## Goals

- Derivation first. Every topic can be derived start to finish.
- Each topic has an end to end worked example with visualization, for example how the attention weight matrix changes at each step.
- Comprehensive, following the full cs336 assignment 1 pipeline.
- Clear nodes, so confident material can be skipped.
- High UI quality.

## Non-goals

- No real model tensors. No running a real model in the browser.
- No hardware and performance content from `ml-engineering` in phase one, except as a reference in resource accounting.
- No editor, search, accounts, or backend.

## What failure looks like

- A wall of text.
- Visualization that is decoration, with numbers that do not match the derivation.
- Flashy motion that slows reading.
- Prose that reads as AI-generated.

## Current state

- Two chapters exist: Attention (`index.html`) and RMSNorm and pre-norm (`rmsnorm.html`). No build step.
- Shared across chapters: `style.css` and `chapter.js` (chapter map, node collapse and mastery, KaTeX, code highlighting). Each page keeps its own worked-example script inline and sets `<body data-chapter="...">`. The chapter list lives in `chapter.js`.
- Live at https://ym820.github.io/llm-notebook/. GitHub Pages publishes the root of `main`, so a push to `main` deploys.
- Plain static pages are deliberate while the format is still being revised. Migrating to Astro + MDX is an open decision. Ask before migrating.

## Chapter structure

Each chapter has five nodes, plus an Ablation node when the assignment ablates that component. Each node can be collapsed and marked mastered. Progress is stored in `localStorage`.

1. **Intuition**: a few labeled lines.
2. **Derivation**: numbered steps, each a name plus a formula with shapes. The "why" is collapsed behind a toggle.
3. **Worked example**: a stepper over one small matrix. Clicking a cell shows its arithmetic. A variant of the topic (for example two heads) gets a second, smaller stage under the first, reusing the same inputs.
4. **Code**: one row per step, comparing Yikai's line with a reference line.
5. **Ablation** (only where one exists): for each ablation, the code diff, a derivation of why the change matters, and Yikai's real result (numbers and plots in `img/`, downsized from the cs336 `images/`). One stage with a switch compares the variants on the same toy input. Ablations live in the chapter of the component they remove: no norm and post-norm in RMSNorm, SiLU in SwiGLU, NoPE in RoPE.
6. **Self-check**: three questions with hidden answers, and a button to mark the chapter mastered. A "Test me first" link at the top jumps here.

## Conventions

### Language and writing

- Page content is in English.
- Follow the `executable-lecture-prose` skill: one idea per line, claim first, bold labeled lead-ins (Goal, Query, Score, ...), numbers instead of adjectives.
- Text budget: each step caption is at most 12 words. Intuition is a handful of lines.
- No template-generated explanation sentences in the UI. Let the formula, the numbers, and highlighting carry it.
- No metaphorical headings. Use symbols, for example `S[sat, cat]`.
- Sentence case. No em dashes.

### Fidelity

| Content | Fidelity |
|---|---|
| Derivation | Complete and exact, with shapes. Notation matches Yikai's `model.py`. |
| Example numbers | Hand-picked toy inputs (about 4 tokens, d = 4), but computed for real by JS in the page, so every step matches the formula. |
| Example inputs | Chosen so the pattern is obvious. |
| Dimensions | Abstract: dim 1 to dim 4. Do not give them semantic names. |
| Code | Real lines from Yikai's repo and from the reference. |
| Experiment results | Real numbers and curves from the cs336 writeup. |
| Toy vs real gap | One note per example, for example "here d_k = 4, your model has d_k = 32". |

One sentence runs through every chapter: "the cat sat down". Each chapter shows what happens to it at that stage.

Every symbol used in the example must be defined where it appears (for example what `A[down, j]` and `v_j` are).

### Code node

- One row per step. Left label is the step name used in the worked example, with the formula as small text under it.
- Under each step, full-width lines stacked: `mine`, then the reference, tagged by source (`nanoGPT`, `PyTorch`).
- Python highlighting with highlight.js, plus a small pass that colors call names. Colors come from the page's own tokens.
- Keep Yikai's code. It is the from-scratch version that passed the tests. The reference shows what practice looks like.
- Choose the reference per chapter and read the actual source first. For Attention it is `karpathy/nanoGPT` `model.py` plus `F.scaled_dot_product_attention`. `karpathy/nanochat` was rejected for Attention because its current code adds value residual, QK norm, and KV cache. For RMSNorm it is `meta-llama/llama` `llama/model.py` for the norm and nanoGPT's `Block` for pre-norm placement. nanoGPT has no RoPE, so that chapter needs another reference.

### UI

- Use Emil Kowalski's skills (`emil-design-eng`, `animate`, `choreograph`, `animation-performance`, `review-animations`) and `frontend-design`.
- Tokens are CSS variables on `:root`, with a dark mode block. Fonts: IBM Plex Sans (UI and text), IBM Plex Mono (numbers and code), Source Serif 4 (chapter title only).
- Motion only where it shows a state change. Under 300ms, custom ease-out, respect `prefers-reduced-motion`.
- Math with KaTeX from cdnjs.

## Chapters

| # | Chapter | Status |
|---|---|---|
| 0 | Overview: one sentence through the whole model | not started |
| 1 | BPE: encoding and training | not started |
| 2 | Embedding | not started |
| 3 | RMSNorm and pre-norm, with no-norm and post-norm ablations | prototype done. Post-norm result is read off the plot, update when the writeup has final numbers |
| 4 | RoPE | not started |
| 5 | Attention: scaled dot product, causal mask, multi-head | prototype done |
| 6 | SwiGLU FFN | not started |
| 7 | Transformer block and residual stream | not started |
| 8 | LM head, cross entropy, perplexity | not started |
| 9 | AdamW, LR schedule, gradient clipping | not started |
| 10 | Training and experiments: LR sweep, batch size, ablations | not started |
| 11 | Decoding: temperature, top-p | not started |
| 12 | Resource accounting: parameters, FLOPs, memory | not started |

## Source material

- `~/Desktop/cs336/assignments/assignment1-basics`: `cs336_basics/model.py` and the other modules, `notes/bpe_tokenization.md`, `notes/bpe_training.md`, `assignment1-writeup.md`, `experiment-plan.md`. Base config: `context_length=256`, `d_model=512`, `num_heads=16`, `num_layers=4`, `d_ff=1344`, `vocab_size=10000`.
- `~/Desktop/learning/ml-engineering`: Stas Bekman's book plus Yikai's video plan. Hardware and performance, for a later phase.
- `~/Desktop/learning/llm-notes`: not reviewed yet.

## Adding a chapter

1. Read the matching code and notes in the source material.
2. Pick and read the reference implementation.
3. Copy `rmsnorm.html` as the page skeleton, write the nodes following the conventions above, and add the file to `CHAPTERS` in `chapter.js`.
4. Verify in the browser: no console errors, math renders, every number in the example matches the formula.
5. Update the chapter table here.
6. Commit, then push as a separate command.
