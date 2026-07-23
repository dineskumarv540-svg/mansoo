package com.mansoo.app

import android.app.Application
import com.google.firebase.FirebaseApp

class MansooApp : Application() {
    override fun onCreate() {
        super.onCreate()
        try {
            FirebaseApp.initializeApp(this)
        } catch (e: Exception) {
            // Firebase initialized or running in offline mode
        }
    }
}
