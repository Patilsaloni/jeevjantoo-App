import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { provideHttpClient } from '@angular/common/http';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideIonicAngular(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
     provideHttpClient()
  ]
}).catch(err => {
  console.error(err);
  // Conditionally handle Keyboard plugin if initialized here
  if (Capacitor.getPlatform() === 'web' && err.message.includes('Keyboard')) {
    console.warn('Keyboard plugin ignored on web');
  }
});