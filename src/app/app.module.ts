// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from '../app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      IonicModule.forRoot({
        scrollAssist: false,
        scrollPadding: false,
        inputShims: false
      })
    )
  ]
});
