import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { PagesModule } from './pages/pages.module';

import { AppComponent } from './app.component';

import { Web3Provider } from './providers/web3/web3';
import { LoggingProvider } from './providers/web3/logging';
import { LocationProvider } from './providers/web3/location';
import { VotingProvider } from './providers/web3/voting';
import { TeamProvider } from './providers/web3/team';
import { AppStateProvider } from './providers/storage/app-state';
import { SettingsProvider } from './providers/storage/settings';
import { IonicStorageModule } from '@ionic/storage';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    PagesModule,
  ],
  providers: [
    Web3Provider,
    AppStateProvider,
    SettingsProvider,
    LoggingProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
