# Storage & Security Rules Architecture

- Firebase Storage rules enforce size limit `< 5MB` and MIME type `image/*`.
- Firestore security rules require `request.auth != null` and owner verification.
