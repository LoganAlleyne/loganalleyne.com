---
title: Trust between services
file: service-trust.md
summary: Signed requests, replay protection and centrally managed permissions for 20+ applications that call each other all day.
order: 1
tags: [hmac, laravel, security]
draft: true
---

## The problem

The FrameTech suite is more than twenty separate Laravel applications, each on its own subdomain with its own database. They call each other's APIs constantly: quoting asks the parts service for costs, projects creates organisations in the CRM. Every one of those calls has to prove which application sent it, which user it was made for, and what that caller is allowed to do.

## Constraints

- A team of two runs the whole estate, so the design had to be simple to operate and hard to get wrong.
- No central service could sit on the path of every request. If it went down, the suite would go down with it.
- An intercepted request must give an attacker nothing they could reuse.
- The suite kept growing, so setting up trust for a new pair of services had to be a routine procedure.

## What I built

I designed and implemented the service-to-service trust layer as a shared package that every application uses.

- **Signed requests, not sent credentials.** The caller builds a canonical form of the request (method, path, sorted query, timestamp, a single-use nonce, the acting user and a hash of the body) and signs it with HMAC-SHA256 using a secret only the two applications share. Only the signature travels. The receiver rebuilds the same string and compares the signatures with a timing-safe check.
- **Replay protection.** Requests outside a short time window are refused, and each nonce can be used only once.
- **The acting user is signed in.** Because the user is part of what is signed, a request can't be quietly re-attributed to someone else on the way.
- **Capability-based permissions.** Trust between two applications is one-directional and lists exactly which "abilities" the caller has, such as reading organisations or creating contacts. Each route declares the ability it needs, so the routes file shows exactly what a caller can reach.
- **Managed in one place.** An administration service issues the secrets and abilities and rotates them, keeping an append-only audit log. Applications fetch their own configuration at boot and cache it, so checking an incoming request needs no network call and no database lookup.

The protocol is written down independently of PHP, so a service in another language could take part by following the document.

## Outcome

Every cross-application call in the suite is signed and gated on the narrowest ability that describes it, and no request depends on a central service being up. Adding a new application is a short, written procedure: register it, grant the partnerships it needs, refresh. Alongside it, each headless service has a client package with a signed HTTP implementation and an in-memory fake, so the applications that consume a service can be built and tested before that service is live.
