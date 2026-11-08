---
title: Built for failure
file: built-for-failure.md
summary: Idempotent writes, retries and dead-lettering, imports that recover after a crash, and lessons from live incidents.
order: 2
tags: [queues, idempotency, reliability]
draft: true
---

## The problem

A suite of separate services that talk over the network will meet every kind of partial failure: a request that times out after the work was done, a queue worker that dies halfway through a job, a third-party system that goes quiet, a paid API that gets called far more often than anyone intended. With around 40 people relying on it to run roughly £50m of business a year, "retry and hope" was not good enough.

## Constraints

- Two engineers, so failures had to resolve themselves where possible and be obvious where not.
- External systems (SAP Business One and a legacy platform) we could not change.
- Heavy background work, such as file scanning and large imports, running alongside work a user is waiting on.

## What I built

- **Idempotent writes.** Every write to a service carries an idempotency key, and the key is reserved in the same database transaction as the work. The receipt and the change exist together or not at all, and a retried request replays the first response instead of doing the work twice.
- **Retries with a floor.** Queued work retries with backoff and is dead-lettered when retries run out, so nothing fails silently and nothing loops forever.
- **At-least-once events.** Events are delivered by cursor, so a consumer that falls behind picks up where it left off.
- **Imports that checkpoint.** Large imports from external systems save their position mid-stream, so a crash costs one batch rather than the whole run.
- **Queues by weight.** Heavy jobs run on separate queues and workers, so moving large files cannot starve short jobs a user is waiting on.
- **Legacy systems at arm's length.** SAP and the legacy platform sit behind anti-corruption layers and change-feed polling, so their data shapes and failure modes never leak into the rest of the suite.

## Lessons from live incidents

- **A silent SAP integration failure.** Data from SAP stopped arriving without an error. I traced it to a client library that swallowed 401 responses and returned an empty result. The fix was to make the client raise every transport error, so the failure would have been visible from the first request.
- **A paid-API cost incident.** After an external API was called far more often than expected, I added caching, a circuit breaker, usage gates and logging. Non-production environments now use stubs by default, so real paid traffic needs an explicit opt-in.
- **Tests that passed locally but failed in CI.** Several tests depended on infrastructure that only existed on a development machine. I reworked the testing standard so each test asserts the decision its own code makes, rather than reaching into another package's infrastructure.

## Outcome

Retries are safe by construction, failures end in a dead letter someone can act on, and each incident left the suite with a guard that stops the same class of failure from coming back.
