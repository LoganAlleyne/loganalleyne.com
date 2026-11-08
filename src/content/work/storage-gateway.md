---
title: The storage gateway
file: storage-gateway.md
summary: One door to S3-compatible storage for the whole suite, with direct uploads, per-record access control and a virus scan on every file.
order: 2
tags: [s3, laravel, security]
draft: true
---

## The problem

Many FrameTech applications need to store files: drawings, quotes, photos, documents. If each one held its own storage credentials and kept its own list of files, nobody could say with confidence who could reach a given file, whether it was safe to open, or whether it existed at all.

## Constraints

- The object store is S3-compatible but can't send notifications when files change. Any write that goes around the system can't be detected, so there could be only one writer.
- Large files must not pass through the web application's own processes.
- Access depends on who owns the record a file belongs to, such as a project or an organisation, and that knowledge lives in other applications.
- An uploaded file can't be assumed to be safe.

## What I built

I created a storage gateway: the only service in the suite that holds the storage credentials. Every other application talks to it through a signed client package, and a separate file-browsing application is just one more client.

- **Presign, then commit.** A caller asks for an upload URL, sends the bytes straight to storage, then calls commit. The gateway checks type and size when it issues the URL, can bind a SHA-256 checksum into the signature so storage itself rejects tampered bytes, and at commit checks the file's opening bytes against its declared type. A file isn't live until commit succeeds, and abandoned uploads are cleaned up on a schedule.
- **A virus scan on every file.** Each new version is queued for a ClamAV scan, and downloads are refused while the scan is pending or once a file is found to be infected. If the scanner is down, new files are unavailable rather than served unchecked. That trade-off was chosen deliberately and written down, and it applies to administrators too.
- **Access and naming are separate facts.** Who may read or write the files for a record is held apart from the record's display name. Each application is the authority for its own records, and the gateway stores a reference to them without learning what a project or an organisation is.
- **Policy as a closed set.** The allowed file types are a fixed list that administrators can narrow but never widen beyond what the platform supports. Callers can ask for the policy up front, but the gateway remains the only place it's enforced.
- **Queues by weight.** Heavy file transfers and maintenance sweeps run on their own queues and workers, so they can't slow down work a user is waiting on. Failed scans retry with backoff and are dead-lettered when retries run out.

## Outcome

Every stored byte in the suite is accounted for by one service. Credentials live in one place and are rotated in one place, every file has a scan verdict before anyone can download it, and the applications that use storage hold no credentials and no file index of their own.
