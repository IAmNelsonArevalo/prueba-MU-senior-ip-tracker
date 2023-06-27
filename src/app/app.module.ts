import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './views/screens/map/map.component';
import {NgxPermissionsModule} from "ngx-permissions";
import { LoadingComponent } from './views/components/loading/loading.component';
import {NgOptimizedImage} from "@angular/common";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxPermissionsModule.forRoot(),
    NgOptimizedImage,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
