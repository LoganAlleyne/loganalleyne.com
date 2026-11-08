---
title: A safety net for paid APIs
file: paid-api-safety.md
summary: What changed after a cost incident with paid address and mapping APIs, and why accidental paid traffic is now hard to cause.
order: 5
tags: [incident response, laravel, resilience]
draft: true
---

## The problem

The suite uses several paid APIs: address lookup, geocoding, place search, address validation, maps and weather. Each call costs money. In April 2026, an incident showed how easily those calls could add up, especially from development and test environments where nobody was watching the bill.

## Constraints

- The features that use these APIs still had to work in production.
- Developers needed to keep building and testing those features without spending money by accident.
- The fix had to live in one place, because many applications use these lookups.

## What I built

All of the location services sit behind one shared package with a small contract for each kind of lookup, so applications never call a provider directly. After the incident, I added caching, a circuit breaker, usage gates and logging. Together with the shape of the contracts, they make a five-layer safety model.

- **Contract shape.** The address lookup has a free "find suggestions" step and a separate paid "retrieve the full address" step. An earlier single method did both, which left applications with no control over when the paid call happened.
- **Caching.** Results are cached, with a lifetime suited to each kind of data. Weather, for example, caches current conditions for 30 minutes and forecasts for 3 hours.
- **A circuit breaker.** Usage caps trip a breaker instead of letting calls run up a bill.
- **Usage gates.** Every paid provider defaults to a stub that makes no external call. Real paid traffic needs two explicit opt-ins for each provider, and the most expensive call needs a third. Without them, an application logs a warning at boot and uses the stub.
- **Cost-aware logging.** Every paid call writes a structured log entry, and the most expensive calls and every breaker trip are logged as critical.

The same thinking reaches the interface: the shared address and place search components enforce a minimum query length, debouncing and locked values, so an application can't weaken them.

## Outcome

Paid traffic now happens only where someone has deliberately switched it on, every paid call is visible in the logs, and a runaway loop trips a breaker instead of running up a bill. Because the protection sits in one shared package, every application that uses these services got it on its next update.
