# Security Specification - Amit Verma Portfolio

This document outlines the zero-trust security specification and data invariants for the Amit Verma premium portfolio database.

## 1. Data Invariants
1. **Public Read, Admin Write**: Settings, Projects, Skills, Services, and Testimonials are readable by anyone, but can only be created, updated, or deleted by a verified administrator.
2. **Anonymous/Public Message Submission**: Anyone can write (create) a message in `/contacts/{contactId}`. However, only an authenticated Administrator can read, list, or delete these messages.
3. **Admin Identification**: A user is considered an Admin if their verified email is `amtverma01@gmail.com` or if they exist in the `/admins/` collection.
4. **Data Validation**:
   - Project document names must be valid IDs (`isValidId`).
   - Project fields must be type-safe (images must be lists, title must be a string <= 200 characters).
   - Contact messages must be strictly verified for size (message <= 2000 chars, name <= 100 chars, email <= 150 chars with email format).

---

## 2. The "Dirty Dozen" Payloads (Red Team Penetration Scenarios)

The following 12 payloads are designed to attempt unauthorized reads, privilege escalations, status bypasses, or data poisoning:

1. **Unauthenticated Project Creation**: Guest tries to push a new project document to `/projects/malicious-project`.
2. **Impostor Project Edit**: Authenticated non-admin Google user tries to edit `/projects/existing-project`.
3. **Shadow Field Injection**: Admin update that injects `isSystemVerified: true` (a ghost field not in schema).
4. **Metadata Spoofing**: Attackers trying to overwrite the global `/settings/website_config` to direct users to phishing links.
5. **PII Message Scraping**: A guest tries to list all messages in `/contacts/` to scrape user emails/phones.
6. **Self-Elevated Administrator**: User tries to write a document to `/admins/{theirUserId}` to grant themselves admin privileges.
7. **Junk Project ID Attack (ID Poisoning)**: Admin or attacker tries to create a project with a 2MB string as the document ID.
8. **Malicious Contact Payload (Denial of Wallet)**: A guest submits a message body of 10MB to crash storage/wallet.
9. **Null Auth Field Hijack**: Editing user data with request.auth = null where fields are evaluated.
10. **State Shortcutting**: Updating a contact message status to an invalid or terminal state without proper fields.
11. **Negative Skill Progress**: Forcing a skill percentage to `-150` or `15000` to break UI visual rendering.
12. **Timestamp Forgery**: Forging a custom client timestamp in `createdAt` instead of using `request.time`.

---

## 3. The Test Runner Strategy (Zero-Trust Validation)

All of these test payloads must be rejected with `PERMISSION_DENIED` by the `firestore.rules` engine. The rule structures are crafted below to mathematically block these vectors.
