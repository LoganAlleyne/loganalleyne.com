---
title: Single sign-on with passkeys
file: single-sign-on.md
summary: One account and one sign-in across 20+ subdomains, with passkeys first and access that can be withdrawn instantly.
order: 4
tags: [webauthn, laravel, security]
draft: true
---

## The problem

Every FrameTech application lives on its own subdomain. Without a shared identity, people would need a separate login for each one, and withdrawing someone's access would mean visiting every application and hoping none was missed.

## Constraints

- Around 40 people rely on the suite, so signing in had to be quick and could never lock someone out.
- Removing a person's access had to take effect everywhere, straight away.
- Each application should carry as little sign-in code as possible, because every copy is something else to secure.
- Teams matter: most records belong to a team, and people must only see their own team's work.

## What I built

I built single sign-on across every subdomain, through a central portal that is the only application with a sign-in.

- **Passkeys first.** Passkeys (WebAuthn) are the main way to sign in. Magic links are the fallback and recovery route, and are never blocked, so nobody is locked out by a lost device. The passkey ceremony runs only on the portal.
- **One session for every subdomain.** The session lives in a shared store with a cookie scoped to the parent domain, so every application sees the same signed-in person. Anyone who isn't signed in is sent to the portal and brought back to the page they asked for.
- **Read live, never cached.** Every application reads identity, access and team membership from the portal on every request, through a read-only connection. Deactivating someone or withdrawing their access takes effect on their next request anywhere in the suite. Caching an access decision is ruled out, because a cached "allowed" is a window in which the system fails open.
- **Deny by default.** Records that belong to a team are filtered to the person's active teams on every query. With no team context, as in a background job or for a guest, the filter returns nothing rather than everything.
- **Permissions declared where they're enforced.** Each application declares its own permissions, and they're written to one central register, where they can be bound to roles. The vocabulary sits next to the code that checks it, and the portal still has one list of everything that can be granted.
- **One session at a time.** Signing in again ends any earlier session.

## Outcome

People have one account and one sign-in for the whole suite, mostly with a passkey. Access is withdrawn in one place and takes effect everywhere at once. A new application gets sign-in, single-session rules and team scoping by wiring in shared middleware, with no login page of its own and nothing new to secure.
