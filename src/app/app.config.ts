import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { themeFeature } from './store/reducers/theme.reducer';
import { invoiceFeature } from './store/reducers/invoice.reducer';
import { InvoiceEffects } from './store/effects/invoice.effects';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideStore({
      [themeFeature.name]: themeFeature.reducer,
      [invoiceFeature.name]: invoiceFeature.reducer,
    }),
    provideEffects([InvoiceEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true
    }),
  ],
};
