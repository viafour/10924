# AGENTS.md

This file defines how contributors, AI agents, and collaborators should approach development inside the 10924 repository.

The goal is coherence, maintainability, atmosphere, and small-scale collaborative iteration.

---

# Project identity

10924 is currently focused on **10924: Liberty**, a browser-first isometric narrative RPG prototype centered on Via Four.

The project focuses on:

- atmosphere
- exploration
- emotional spaces
- memory
- environmental storytelling
- transformation-driven action over time
- future-ready session infrastructure

This is not intended to become a hyperscale commercial MMO. The existing Socket.IO/server foundation should be preserved as useful local/session infrastructure, but the first playable experience is RPG-first.

The project prioritizes:

- emotional coherence
- artistic consistency
- sustainable scope
- rapid playable iteration
- readability and maintainability

---

# Development philosophy

Contributors should favor:

- simple architecture
- understandable systems
- readable code
- incremental progress
- visible functionality
- maintainability over cleverness

Avoid:

- premature optimization
- unnecessary abstraction
- enterprise-scale assumptions
- overengineering for hypothetical future scale
- adding frameworks without clear purpose

The project should evolve organically.

---

# Technical posture

Current direction:

- browser-first
- TypeScript-first
- RPG-first runtime prototype
- local-first development
- cloud-expandable later if needed

Likely technologies:

- PixiJS
- Vite
- Node.js
- lightweight networking stack
- Docker for local orchestration

Favor technologies that:

- are well documented
- are understandable to collaborators learning the stack
- reduce operational burden
- support fast iteration

---

# Artistic posture

10924 should feel:

- cold
- beautiful
- ancient
- alive
- emotionally distant
- quietly melancholic

Avoid turning the world into:

- generic fantasy
- overly comedic tone
- excessively noisy UI clutter
- hyper-saturated visual chaos
- feature bloat

Atmosphere matters.

Silence matters.

Negative space matters.

Environmental implication matters.

---

# Collaboration guidelines

Human and AI collaborators are expected to work cooperatively.

Contributors should:

- explain reasoning clearly
- document important decisions
- prefer clarity over ego
- help maintain momentum
- avoid gatekeeping knowledge

When implementing systems:

- leave readable comments where useful
- avoid magical hidden behavior
- document setup steps
- prefer explicitness over obscurity

The repository should remain approachable to newer programmers.

---

# Scope discipline

A working small prototype is more valuable than an enormous unfinished architecture.

Priority order:

1. Playable atmosphere
2. Via Four movement and interaction
3. Environmental storytelling
4. Transformation/action foundations
5. Persistence and systems expansion

Do not attempt to solve every future RPG or multiplayer/session problem immediately.

The first goal is making the world feel alive.

---

# AI collaboration notes

AI collaborators should:

- preserve project tone consistency
- avoid introducing unnecessary complexity
- explain tradeoffs when making architectural decisions
- prefer scaffolding and iteration over massive one-shot generation
- maintain alignment with the project's emotional and technical philosophy

When uncertain:

- ask for clarification
- propose options with tradeoffs
- avoid silently inventing major lore or architecture decisions

The goal is collaborative creation, not replacement of human direction.
