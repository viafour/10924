# Persistence Plan

Milestone 2 does not require a database, accounts, auth, sessions, or migrations. The current server stores connected player positions in memory only.

## Preferred Database

PostgreSQL is the preferred future database unless a later technical constraint creates a strong reason to choose otherwise.

Reasons:

- mature and well documented
- easy to run locally
- suitable for structured account, character, and world state records
- expandable without forcing cloud infrastructure early

## Future Tables

These are planning notes, not implemented schema.

### accounts

Stores player account identity when account registration is introduced.

Likely fields:

- `id`
- `display_name`
- `email`, if email login is chosen
- `password_hash`, if password login is chosen
- `created_at`
- `updated_at`

### characters

Stores playable character records owned by accounts.

Likely fields:

- `id`
- `account_id`
- `display_name`
- `created_at`
- `updated_at`

### sessions

Stores active login/session records if the project chooses database-backed sessions.

Likely fields:

- `id`
- `account_id`
- `expires_at`
- `created_at`

The choice between database-backed sessions and JWT-style tokens is intentionally deferred.

### character_positions

Stores persistent character world positions after persistence exists.

Likely fields:

- `character_id`
- `x`
- `y`
- `zone_id`, once zones exist
- `updated_at`

## Future Auth Direction

Authentication should be added only when the project needs named returning players.

When added, use proven libraries for:

- password hashing
- session or token management
- input validation

Do not hand-roll password storage or cryptography.

## Milestone 2 Non-Goals

Milestone 2 intentionally does not add:

- PostgreSQL runtime requirements
- database clients
- migrations
- registration routes
- login routes
- login UI
- JWT handling
- session management

The current temporary Explorer identities are connection-scoped and disappear when the server restarts or the browser disconnects.
