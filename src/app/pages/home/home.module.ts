import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ComponentsModule } from '../../components/components.module';
import { HomeRoutingModule } from './home.routing';

import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TeamsComponent } from './teams/teams.component';
import { VotingsComponent } from './votings/votings.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    
    ComponentsModule,
    HomeRoutingModule,
    RouterModule,
  ],
  declarations: [
    HomeComponent, 
    TeamsComponent, 
    VotingsComponent,
    DashboardComponent, 
    UserProfileComponent, 
    TypographyComponent, 
    IconsComponent, 
    MapsComponent, 
    NotificationsComponent, 
  ]
})
export class HomeModule { }
