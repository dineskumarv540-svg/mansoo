# Offline Support & Caching Architecture

Mansoo supports offline reading, local draft autosave, and optimistic UI updates.

---

## 📶 Offline Data & Sync Flow

```mermaid
graph TD
    UserAction[User Writes Post / Draft] --> CheckNet{Network Connected?}
    CheckNet -->|Yes| Firestore[(Firestore DB Direct Sync)]
    CheckNet -->|No| LocalCache[(Local Storage Cache)]
    LocalCache --> DraftTimer[Autosave Draft Every 5s]
    CheckNet -->|Reconnected| QueueSync[Sync Offline Queue to Cloud]
    QueueSync --> Firestore
```

---

## Related Guides
- [System Architecture](../architecture/architecture.md)
- [UI Components](components.md)
