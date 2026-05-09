# Technical Philosophy

## Browser-first

10924 is intentionally browser-first.

The goal is to make the world easy to enter, easy to share, and lightweight for invited players. A user should ideally be able to click a link and step into the world with minimal friction.

Primary development and testing currently target:

- Opera GX (latest stable)
- Google Chrome (latest stable)

Chromium-based browsers are the initial baseline.

## Local-first development

The project begins locally hosted and intentionally small in scope.

Initial development hardware:

- Intel i9-13900KF
- 64GB DDR5 5600MHz RAM
- NVIDIA RTX 4080 16GB

The initial infrastructure philosophy is:

- simple
- understandable
- observable
- easy to recover

Complex distributed infrastructure should only appear when genuinely needed.

## Scale philosophy

10924 is not attempting hyperscale architecture.

This project targets:

- fewer than 50 concurrent players
- a small trusted community
- narrative and exploration experiences over large-scale combat systems

The project should avoid “enterprise theater” and unnecessary complexity.

## Technology posture

The project should favor:

- TypeScript
- maintainable tooling
- readable architecture
- rapid iteration
- small deployable milestones

Likely stack direction:

- Browser client: PixiJS + Vite
- Networking/server: Node.js + TypeScript
- Persistence: lightweight initially, expandable later
- Infrastructure: local Docker-first, cloud-expandable later

## Development philosophy

The goal is not to engineer the perfect MMO framework before anything playable exists.

The goal is to quickly reach:

- visible movement
- atmosphere
- multiplayer presence
- environmental storytelling
- playable emotional spaces

A small living prototype is more valuable than a perfect design document.

## Collaboration philosophy

This repository is built collaboratively between:

- Bliss
- Ciarelle
- Codex

Bliss is new to programming outside of infrastructure and Terraform work, but is an adaptive learner, systems thinker, and creative collaborator.

Ciarelle acts as a creative and architectural partner focused on coherence, atmosphere, structure, and technical direction.

Codex acts as an implementation-oriented development partner capable of accelerating iteration and scaffolding.

The intent is cooperative creation rather than isolated authorship.
