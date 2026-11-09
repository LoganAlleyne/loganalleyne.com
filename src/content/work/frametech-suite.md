---
title: The FrameTech suite
file: suite-overview.md
summary: A suite of web applications built from the ground up by a team of two, one for each part of the business, that share one sign-in and one design and talk to each other only through signed APIs.
order: 0
tags: [architecture, laravel, apis]
draft: true
---

## The problem

Aspen Pumps needed software to run this part of its business from end to end, from first contact with a customer through design and sales to finance and reporting. Existing systems were still in use and had to keep working.

## Constraints

- There were two of us, so every application had to be built, tested and deployed the same way, or the suite would be impossible to look after.
- Each part of the business has its own rules and changes at its own pace, so each part of the software had to change and deploy on its own.
- Information is constantly needed across those parts, such as a customer's details in several places at once.
- The existing systems are outside our control, so their data shapes could not be allowed to spread through the new code.

## What we built

We built the suite from the ground up as separate applications, one for each area of the business, each on its own subdomain with its own database and its own deploy.

- **Covering the whole business.** Separate applications handle customers, projects, engineering design, sales, finance and reporting, and shared tools for tasks, notes, files and support work across all of them.
- **One owner for every fact.** Each piece of data belongs to one application. Others read it through the owner's API and keep only its identifier, and no application writes to another's database.
- **Two ways of working, by context.** Inside an application, code uses the framework's database layer directly and fetches only what the page needs. Across a boundary, it goes through a contract, a service and a plain data object, so no application's internals leak into another.
- **Signed calls between applications.** Every call from one application to another is signed, carries the person it's acting for, and is checked against what that application is allowed to do. Those permissions and the signing secrets are managed and rotated centrally.
- **One sign-in, one look.** A central portal is the only place anyone signs in ([single sign-on](/work/single-sign-on/)), and every application with a user interface is built from one [component library](/work/component-library/).
- **Shared packages instead of copies.** Private shared packages hold what more than one application needs, from [file storage](/work/storage-gateway/) to the [calculation and pricing engines](/work/domain-engines/). Each service comes with a client package that includes an in-memory fake, so applications can be built and tested before the service they depend on is live.
- **Old systems kept at arm's length.** Older and external systems sit behind translation layers that turn their data into the suite's own shapes, and their changes are read by polling a change feed.
- **An activity log.** Significant changes are recorded in an append-only event log once they're saved, and that log feeds each person's dashboard and workspace.
- **One way to build and ship.** Every repository has the same test-driven workflow and the same checks: Pest tests, PHPStan at level 7, an 85% coverage floor (93% on average), secret scanning and dependency audits. Every change deploys to a mirrored staging environment, and production releases are manual and can be rolled back.

## Outcome

The business's work runs on one suite rather than a set of disconnected tools, and two engineers can look after all of it because every application is built the same way. Each application can be changed and deployed on its own. A new application gets sign-in, the design system, file storage and trusted calls to the rest of the suite by adding shared packages, and the suite's rules are written down in a playbook of more than 70 pages used for onboarding.
