---
title: Single sign-on with passkeys
file: single-sign-on.md
summary: One account and one sign-in across every subdomain, with passkeys first and access that can be withdrawn instantly.
order: 4
tags: [webauthn, laravel, security]
draft: true
---

## The problem

Every FrameTech application lives on its own subdomain. Without a shared identity, people would need a separate login for each one, and withdrawing someone's access would mean visiting every application and hoping none was missed.

## Constraints

- People sign in to the suite to do their jobs, so signing in had to be quick and could never lock someone out.
- Removing a person's access had to take effect everywhere, straight away.
- Each application should carry as little sign-in code as possible, because every copy is something else to secure.
- Teams matter: most records belong to a team, and people must only see their own team's work.

## What we built

We built single sign-on across every subdomain, through a central portal: the only application in the suite with a sign-in page.

- **Passkeys first.** Passkeys (WebAuthn) are the main way to sign in. Email sign-in links are the fallback and recovery route, so nobody is locked out by a lost device. Setting up and using a passkey only ever happens on the portal.
- **One session for every subdomain.** One session is shared across every subdomain, so every application sees the same signed-in person. Anyone who isn't signed in is sent to the portal and brought back to the page they asked for.
- **Read live, never cached.** Every application reads who someone is, what they may do and which teams they belong to from the central source on every request. Deactivating someone or withdrawing their access takes effect on their next request anywhere in the suite. Caching an access decision is ruled out, because a cached "allowed" is a window in which the system fails open.
- **Deny by default.** Records that belong to a team are filtered to the person's active teams on every query. With no team context, as in a background job or for a guest, the filter returns nothing rather than everything.
- **Permissions declared where they're enforced.** Each application declares its own permissions, and they're written to one central register, where they can be bound to roles. The vocabulary sits next to the code that checks it, and the portal still has one list of everything that can be granted.
- **One session at a time.** Signing in again ends any earlier session.

## Outcome

People have one account and one sign-in for the whole suite, mostly with a passkey. Access is withdrawn in one place and takes effect everywhere at once. A new application gets sign-in, single-session rules and team scoping by adding a shared package, with no login page of its own and nothing new to secure.
