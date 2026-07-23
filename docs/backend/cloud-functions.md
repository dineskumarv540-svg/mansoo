# Cloud Functions Overview

Callable functions:
- `createPost`: Validates schema via Zod, filters profanity, enforces rate-limiting.
- `reportContent`: Logs abuse reports securely for moderator audit.
