import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app.component';

@NgModule({
  providers: [
    provideHttpClient(withInterceptorsFromDi()), 
  ],
})
export class AppModule {}