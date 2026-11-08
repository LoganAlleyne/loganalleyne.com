---
title: The 3D configurator
file: configurator.md
summary: Bringing a legacy configurator for rooftop support structures into the platform, and extending what worked.
order: 3
tags: [vue 3, three.js, typescript]
draft: true
---

## The problem

The business designs support structures for equipment on rooftops. Its 3D configurator was the one system that predated the FrameTech suite. It worked and people relied on it, but it lived outside the platform: its own sign-in, its own way of calculating, and its own documents.

## Constraints

- People relied on it, so it had to keep working while it changed.
- Its structural checks had to agree with a new, independently validated calculation engine.
- It had to fit the suite's shared sign-in, services and design system.

## What I built

I reworked and substantially extended the configurator, keeping what worked rather than starting again.

- **A Vue 3 and TypeScript interface** with Pinia for state, Three.js for the 3D view and Konva for 2D drawing. The pages around it, such as admin and reporting, use the same Laravel and Livewire stack as the rest of the suite.
- **Brought into the platform.** Users arrive through the suite's single sign-on, and the legacy front end is bridged into the Laravel request lifecycle so old and new code run side by side.
- **Structural checks on the new engine.** Calculations run on the suite's framework-free calculation engine, which covers grillage analysis, Eurocode cross-section, wind, snow and stability verification and is validated in CI against numpy reference implementations. Each check's verdict is recorded against the engine version and the site facts it ran on, and progress streams to the browser over websockets.
- **Data, not documents.** The configurator supplies a solution's geometry, parts and results, including DXF CAD output, and the suite's document service turns those into drawings and reports. That keeps document rendering in one place.

## Outcome

The last system that predated the suite now shares its sign-in, services and design system, runs its structural checks on the same validated engine as everything else, and hands its output to the suite's document pipeline instead of building PDFs itself.
