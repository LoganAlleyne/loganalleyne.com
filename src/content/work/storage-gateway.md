---
title: The storage gateway
file: storage-gateway.md
summary: One door to S3-compatible storage for the whole suite, with a catalogue that is the single record of every file, direct uploads and a virus scan on every version.
order: 2
tags: [s3, mariadb, laravel, security]
draft: false
---

## The problem

Many FrameTech applications need to store files: drawings, quotes, photos, documents. If each one held its own storage credentials and kept its own list of files, nobody could say with confidence who could reach a given file, whether it was safe to open, or whether it existed at all.

## Constraints

- The object store is S3-compatible but can't send notifications when files change. A write that goes around the system can't be detected, so there could be only one writer, and its record of files had to be the truth rather than a copy of it.
- Large files must not pass through the web application's own processes.
- One file can belong to several records at once, in more than one language and in more than one version.
- Access depends on who owns the record a file belongs to, and that knowledge lives in other applications.
- An uploaded file can't be assumed to be safe.

## What I built

I created a storage gateway: the only service in the suite that holds the storage credentials. It sits on a framework-free storage engine. Every other application talks to it through a client package that signs each request, so the gateway always knows which application is asking. Even the suite's own file browser is just one more client.

**The catalogue**

- **The catalogue is the record, not the bucket.** Every file, version, folder and link lives in its own MariaDB database. Browsing and search read the catalogue and never list the bucket, so the bucket holds bytes and the catalogue holds meaning.
- **Stored procedures behind small contracts.** The engine reads and writes the catalogue through stored procedures, behind separate reader and writer contracts, with no ORM. The schema and procedures ship with the package and are applied by a sync command that is safe to rerun. A one-off data change records a marker so a later sync doesn't undo an administrator's choice.
- **Files and versions are separate.** A file points at its current version, and a new upload adds a version rather than replacing one. The virus-scan verdict lives on the version, so a file is only as safe as its current version.
- **Language isn't a version.** A file can record the language it's written in, so two language copies of the same document sit side by side for one record instead of one overwriting the other.
- **Links, not folders, say what a file belongs to.** A file is linked to records in other applications by a reference those applications own. A file can carry more than one link, so a document can belong to a record and to the larger record it sits within, without a schema change. Uploads can still carry a folder path, shown beneath the record without creating folder rows.
- **Questions asked in bulk.** Pages that show many records ask once which of them have files, and how many and how large, rather than once per record.

**Handling the file data (the blobs)**

- **Presign, then commit.** A caller asks for an upload URL, sends the bytes straight to storage, then calls commit. The gateway checks type and size when it issues the URL, and can bind a SHA-256 checksum into the signature so storage itself rejects tampered bytes. At commit it checks the stored size and the store's own fingerprint of the object, and reads only the file's opening bytes, not the whole file, to confirm it matches its declared type. Commit is safe to repeat, and a file isn't live until it succeeds.
- **Retries that don't corrupt uploads.** Transfers retry with backoff, but a retry rewinds the stream to the start before resending it. A stream that can't be rewound is sent once, because resending a half-read body would store a broken file.
- **Keeping bucket and catalogue in step.** Because nothing can watch the bucket, two scheduled sweeps do it instead. Every so often, uploads that were never committed are expired along with their bytes. On a regular schedule, the bucket is compared against the catalogue, and stored files with no catalogue record are queued for deletion one at a time, so a sweep that stops halfway can safely run again.
- **System documents that can't go missing.** Documents the system generates itself are stored by a queued job that caches its upload under a stable key, so a retry resumes the same upload instead of filing a duplicate.
- **Buckets split by setting, not by owner.** A small number of buckets differ only in visibility, lifecycle and retention. Access is enforced by the gateway, never by which bucket a file is in.

**Safety and access**

- **A virus scan on every version.** Each new version is queued for a virus scan, and downloads are refused while the scan is pending or once a file is found to be infected. If the scanner is down, new files are unavailable rather than served unchecked, and that applies to administrators too.
- **Access and naming are separate facts.** Who may read or write a record's files is held apart from the record's display name, and each application stays the authority for its own records.
- **Queues by weight.** Heavy transfers and the maintenance sweeps run on their own queues, so they can't slow down work a user is waiting on.

## Outcome

Every stored byte in the suite is accounted for by one service and one catalogue. Credentials live in one place, every file version has a scan verdict before anyone can download it, the bucket and the catalogue are reconciled regularly, and the applications that use storage hold no credentials and no file index of their own.
