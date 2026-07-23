# Customer Support Ecosystem Architecture

Mansoo features a customer support infrastructure comprising:
- In-app Help Center & FAQ Accordions (`SupportTicketModal.js`).
- Ticket Submission System (`supportService.js` & `supportTickets` Firestore collection).
- Feedback forms & abuse report routing.

---

## Ticket Workflow
1. User submits request via `SupportTicketModal`.
2. Document created in `supportTickets` with status `open`.
3. Support admin dashboard notifies support team.
4. Ticket resolution updates status to `resolved`.

---

## Related Guides
- [Help Center & FAQ](help-center.md)
- [Troubleshooting](troubleshooting.md)
