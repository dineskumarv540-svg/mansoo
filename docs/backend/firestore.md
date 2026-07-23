# Firestore Database Model & Schema

Mansoo Firestore database is organized into collections optimized for read efficiency and low lock contention.

---

## 🗄️ Entity-Relationship Diagram

```mermaid
erDiagram
    USERS {
        string uid PK
        string name
        string handle
        boolean isPro
        number xpPoints
    }
    POSTS {
        string id PK
        string authorId FK
        string quoteText
        string category
        number likesCount
    }
    COMMENTS {
        string id PK
        string postId FK
        string authorId FK
        string commentText
    }
    WRITING_ROOMS {
        string id PK
        string hostId FK
        string title
        boolean isPrivate
    }
    SUPPORT_TICKETS {
        string id PK
        string userEmail
        string subject
        string status
    }

    USERS ||--o{ POSTS : creates
    POSTS ||--o{ COMMENTS : receives
    USERS ||--o{ WRITING_ROOMS : hosts
    USERS ||--o{ SUPPORT_TICKETS : submits
```

---

## Related Guides
- [Backend Overview](backend.md)
- [Database Indexing](indexes.md)
