import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { TeamsComponent } from './teams/teams.component';
import { VotingsComponent } from './votings/votings.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';


const routes: Routes =[
  { path: 'home',  component: HomeComponent,
      children: [
      { path: 'dashboard',      component: DashboardComponent },
      { path: 'teams',          component: TeamsComponent },
      { path: 'votings',        component: VotingsComponent },

      { path: 'user-profile',   component: UserProfileComponent },
      { path: 'typography',     component: TypographyComponent },
      { path: 'icons',          component: IconsComponent },
      { path: 'maps',           component: MapsComponent },
      { path: 'notifications',  component: NotificationsComponent },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  exports: [
    RouterModule
  ],
})
export class HomeRoutingModule { }

