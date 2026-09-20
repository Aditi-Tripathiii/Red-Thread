# Supplied ZIP source package

This folder preserves the source from the supplied `red-thread v.zip` archive as an independent Capacitor/Vite Android package. It is kept separate from the repository's primary application to avoid overwriting that app.

## Build

Run `npm install`, `npm run build`, `npx cap sync android`, then `cd android; .\gradlew.bat assembleDebug`.

The debug APK built from this package is available at `../artifacts/red-thread-v-debug.apk`.
