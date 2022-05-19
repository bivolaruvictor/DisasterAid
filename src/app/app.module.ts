import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthModule } from '@auth0/auth0-angular';
import { AppAuthButtonComponent } from './app-auth-button/app-auth-button.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import  {MdbCollapseModule} from 'mdb-angular-ui-kit/collapse'
import data from '../../auth_config.json';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    AppAuthButtonComponent,
    UserProfileComponent,
    NavbarComponent,
    MapComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MdbCollapseModule,
    AuthModule.forRoot({
      domain : data.domain,
      clientId: data.clientId,
      cacheLocation: 'localstorage'
    }),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
