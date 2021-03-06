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
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { MatFormFieldModule, } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { SimpleMQ } from 'ng2-simple-mq';

@NgModule({
  declarations: [
    AppComponent,
    AppAuthButtonComponent,
    UserProfileComponent,
    NavbarComponent,
    MapComponent,
    ProfileFormComponent 
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
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  exports: [MatInputModule],
  providers: [ SimpleMQ],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }
