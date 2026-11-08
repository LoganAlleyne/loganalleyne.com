---
title: The component library
file: component-library.md
summary: One shared interface library behind every FrameTech application, from page layout to a personal workspace that follows you between apps.
order: 1
tags: [laravel, livewire, design systems]
draft: true
---

## The problem

The FrameTech suite has 18 applications with a user interface, each with its own repository and deploy. Without a shared library, every one of them would rebuild the same headers, pickers, forms and navigation, and they would slowly drift apart in look and behaviour. With two engineers, there was no time to fix the same thing eighteen times.

## Constraints

- Every application has to look and behave as one product, while staying free to deploy on its own.
- The library can't know about any one application's records, yet it has to offer pickers and inline editing for all of them.
- Some features depend on services that may not be installed or reachable from a given application.
- A shared package is a shared failure point, so it needs a higher bar than application code.

## What I built

I own the library outright: its design, its code and its releases. It's a Laravel package of Blade and Livewire components, design tokens, CSS and fonts, and every application with a user interface requires it. Applications pick up improvements with a normal dependency update, without copying or publishing any views.

- **Generic over records, without growing special cases.** The entity picker and the inline field editor know nothing about organisations, parts or projects. Each application registers a small lookup or field writer for each kind of record, so supporting a new record type means adding one class in the application, not editing the library.
- **Design tokens, not per-app styling.** Surfaces, text, status colours, spacing, radius, motion and type are tokens. Applications declare no colours at all: each one names itself, and the library supplies its accent colour for light and dark modes.
- **A personal workspace that follows you.** A panel of sections (notes, favourites, recents, recent files, your projects, tasks, a calendar, the sales forecast) appears in every application. Each section is registered, and a person's arrangement of sections is remembered across the suite. When the service behind a section isn't available, that one section says so and the rest of the panel keeps working.
- **Safety built into the components.** Address and place lookups call paid APIs, so the components themselves enforce a minimum query length, debouncing and locked values. An application using them can't weaken those safeguards.
- **Made to be tested.** The library ships in-memory fakes for everything it reads, so an application can render the sidebar and workspace in its own tests without a live identity database or sibling services.
- **Strict at the boundary.** Every concrete class is final and readonly with strict types, held to PHPStan level 7, and the library supports many languages.

## Outcome

Eighteen applications share one set of components, one design language and one workspace. A fix or improvement is made once, released once, and reaches every application on its next update. Design decisions are recorded in the package itself, so the reasoning travels with the code.
