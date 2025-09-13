import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from './app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { Capacitor } from '@capacitor/core';


bootstrapApplication(AppComponent, {
  providers: [
    // Only modules go here
    importProvidersFrom(
      IonicModule.forRoot({
        scrollAssist: false,
        scrollPadding: false,
        inputShims: false
      })
    ),
    // Firebase providers are added directly, NOT inside importProvidersFrom
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth())
  ]
});
