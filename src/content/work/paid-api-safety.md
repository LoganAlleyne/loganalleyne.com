---
title: A safety net for paid APIs
file: paid-api-safety.md
summary: What changed after a cost incident with paid address and mapping APIs, and why accidental paid traffic is now hard to cause.
order: 5
tags: [incident response, laravel, resilience]
draft: true
---

## The problem

The suite uses several paid APIs for things like address lookup, mapping and location search. Each call costs money. A cost incident showed how easily those calls could add up, especially from developers' machines and test environments, where nobody was watching the bill.

## Constraints

- The features that use these APIs still had to work in production.
- Developers needed to keep building and testing those features without spending money by accident.
- The fix had to live in one place, because many applications use these lookups.

## What we built

All of the location services sit behind one shared package with a small contract for each kind of lookup, so applications never call a provider directly. After the incident, we added caching, a circuit breaker, usage gates and logging. Together with the shape of the contracts, they make a five-layer safety model.

- **Free and paid steps kept apart.** The address lookup has a free step that suggests matches as someone types, and a separate paid step that fetches the full address once one is chosen. An earlier single method did both, which left applications no control over when the paid call happened.
- **Caching.** Results are cached, with a lifetime suited to each kind of data.
- **A circuit breaker.** Usage caps trip a breaker instead of letting calls run up a bill.
- **Usage gates.** Every paid provider defaults to a stub: a stand-in that gives fixed answers without calling out. Choosing a real provider is a deliberate setting, and outside production a second setting must also be switched on. The most expensive calls need a further opt-in of their own. Without them, the application logs a warning when it starts and uses the stub.
- **Cost-aware logging.** Every paid call writes a structured log entry, and the most expensive calls and every breaker trip are logged as critical.

The same thinking reaches the interface: the shared address and place search components won't search until enough has been typed and the typing has paused, and an application can't weaken that.

## Outcome

Paid traffic now happens only where someone has deliberately switched it on rather than by accident from a developer's machine; every paid call is visible in the logs, and a runaway loop trips a breaker instead of running up a bill. Because the protection sits in one shared package, every application that uses these services got it on its next update.
