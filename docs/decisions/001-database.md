# 001: IndexedDB with Dexie

**Status:** Accepted; database initialization is deferred beyond the scaffold.

## Context

Meal history must be stored locally and remain accessible without an internet
connection. IndexedDB is the required persistence mechanism.

## Decision

Use Dexie to manage IndexedDB queries, schema versions, and transactions. Use
the documented `CaliipDB` version 1 with `meals` and `foodEntries` tables.
IndexedDB is the source of truth; the Bun backend does not persist meals.

A meal groups multiple food entries. Each entry stores its quantity and
nutritional values per 100 grams. Calculate totals rather than storing them
redundantly, and group meals by local `YYYY-MM-DD` dates.

## Consequences

- Saved data supports future offline meal views without a remote database.
- Dexie simplifies database access and future schema migrations.
- Application code must maintain meal-to-entry relationships; IndexedDB does
  not enforce foreign keys.
- Food catalog tables are outside the current model.

## References

- [Data schema](../data-schema.md)
- [Dexie reference implementation](../dexie-schema.md)
- Original root `decisions`, `data schema`, and
  `dexie.js implementation of data schema` documents.
