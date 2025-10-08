import { Routes } from '@angular/router';
import {MapComponent} from './components/map/map';
import {TrackerComponent} from './components/tracker/tracker';
import {ListComponent} from './components/list/list';
import {ProfileComponent} from './components/profile/profile';
export const routes: Routes = [
  { path: 'map', component: MapComponent },
  { path: 'tracker', component: TrackerComponent },
  { path: 'list', component: ListComponent },
  { path: 'profile', component: ProfileComponent},
  { path: '', redirectTo: '/map', pathMatch: 'full' },
  { path: '**', redirectTo: '/map' }
];
