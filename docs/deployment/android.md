# Android Deployment Guide

- Configure `app.json`: `package: in.mansoo.app`, `versionCode: 1`.
- Build release APK: `eas build -p android --profile preview`.
- Build Play Store App Bundle (AAB): `eas build -p android --profile production`.
