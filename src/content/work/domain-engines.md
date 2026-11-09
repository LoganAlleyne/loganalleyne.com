---
title: Calculation and pricing engines
file: domain-engines.md
summary: Structural engineering and pricing as framework-free code, checked against independent Python reference implementations in CI.
order: 3
tags: [php, python, domain modelling]
draft: true
---

## The problem

Two parts of the business must never be quietly wrong: whether a structure will stand up, and what a customer is charged. Both calculations are needed by more than one application, and both have to be exact.

## Constraints

- The structural results have to stand up to an engineer checking them by hand, against Eurocode.
- Pricing policy is set by the business and changes over time, but the arithmetic must not change with it.
- Both engines are used by more than one application, so they can't depend on any one application's database or framework.

## What we built

We built both as framework-free PHP packages: no Laravel, no database, no HTTP. Everything they need is passed in, and every result is plain data. Architecture tests hold the boundary, so framework code can't creep in.

**The structural calculation engine**

- **Two independent methods, one result.** The structure is analysed as a grid of beams (a grillage), and how load spreads across it is worked out two ways: by the lever rule, simple enough to check by hand, and by the direct stiffness method, a full matrix solution. Both produce the same result shape, and every case the lever rule can solve must give the same answer under both, so the simple method anchors trust in the complex one.
- **Eurocode verification.** Cross-section, wind, snow and stability checks, with wind uplift (the force trying to lift the structure) always worked out and reported.
- **Failures are results, not exceptions.** A structure that fails its checks returns a failed result with the reasons. Only input the engine can't process at all raises an error. A part the data can't describe is reported as "not worked out", never guessed.
- **Shows its working.** Each result carries a trace of the intermediate values, each with its symbol, unit and Eurocode clause, so the working can be shown without recalculating it.
- **Checked in Python.** Reference ("golden") tests pin the key numbers, and a separate CI job recomputes them independently in Python with numpy, scipy and eurocodepy. Changing a golden number means updating the reference script first.

**The pricing engine**

- **A pure calculator.** It owns no data. The business's pricing policy comes in through small contracts, so a price review is a data change, not a code change.
- **Money in whole pence.** There's no floating-point arithmetic on money anywhere, and each final figure is converted once and rounded once, so a quote's totals always add up.
- **Never a silent zero.** A part with no cost, or a missing policy value, raises an error rather than pricing at zero. Charging nothing has to be a deliberate decision, never a side effect of missing data.
- **Open for new price types.** New pricing types plug in as strategies, without editing the core engine.

## Outcome

The two calculations the business can least afford to get wrong are small, independently tested packages that any application can use. Structural results agree with an independent implementation in another language on every build, and pricing either produces figures that add up or refuses loudly.
