module.exports = {
  "expo": {
    "name": "Protecan Seguridad",
    "slug": "protecan-seguridad",
    "version": process.env.VERSION,
    "jsEngine": "hermes",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#184260"
    },
    "plugins": [
      "@logrocket/react-native"
    ],
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#184260"
      },
      "package": process.env.ANDROID_PACKAGE,
      "versionCode": process.env.ANDROID_VERSION_CODE
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "sdkVersion": "45.0.0",
    "extra": {
      "eas": {
        "projectId": "19167fdd-2d96-4b2d-bde5-7a559514951d"
      }
    }
  },
  "name": "protecan-cdr-mobile"
}
