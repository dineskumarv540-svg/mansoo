# CI/CD Pipeline Guide

Automated CI/CD workflow defined in `.github/workflows/ci.yml`.

---

## ⚙️ CI/CD Workflow Pipeline Diagram

```mermaid
graph LR
    Push[Git Push / PR] --> Runner[GitHub Actions Runner]
    Runner --> Checkout[Checkout Repo]
    Checkout --> Setup[Node 18 & NPM Cache]
    Setup --> Install[npm ci]
    Install --> Lint[npm run lint]
    Lint --> Test[npm test]
    Test --> EAS[EAS Production Build]
```

---

## Related Guides
- [Deployment Guide](deployment.md)
- [Monitoring & Observability](monitoring.md)
