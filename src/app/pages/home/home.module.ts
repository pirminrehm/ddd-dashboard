import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ComponentsModule } from '../../components/components.module';
import { HomeRoutingModule } from './home.routing';

import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TeamsComponent } from './teams/teams.component';
import { VotingsComponent } from './votings/votings.component';
import { VotingChartPage } from './voting-chart/voting-chart';


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
    VotingChartPage,
  ]
})
export class HomeModule { }
