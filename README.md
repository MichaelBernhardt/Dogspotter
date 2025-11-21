# DogSpotter

A React Native offline-first dog spotting field guide app.

## Prerequisites
- Node.js > 18
- React Native CLI
- Android Studio / Xcode
- CocoaPods (for iOS)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install iOS pods (Mac only):
   ```bash
   cd ios && pod install && cd ..
   ```

## Running the App

### Android
1. Start an Android emulator or connect a device.
2. Run:
   ```bash
   npx react-native run-android
   ```

### iOS
1. Run:
   ```bash
   npx react-native run-ios
   ```

## Troubleshooting
- If you see vector icon errors, ensure you've linked the fonts or rebuilt the app.
- If images don't load, check your internet connection (for first fetch).
- Camera permissions are required for logging sightings.

## Architecture
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Database**: SQLite (react-native-sqlite-storage)
- **State**: Local state + Database queries
- **Images**: Cached locally via react-native-fs
