import { Routes } from '@angular/router';
import {HeadquartersComponent} from './components/headquarters/headquarters.component';
import {ArchivesComponent} from './components/archives/archives.component';

export const routes: Routes = [
  {path:'', redirectTo:'hq', pathMatch: 'full'},
  {path:'hq', component: HeadquartersComponent},
  {path:'archives', component: ArchivesComponent},
];
