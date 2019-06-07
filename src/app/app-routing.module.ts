import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';


const routes: Routes = [
  {path: 'edit', loadChildren: './edit-query/edit-query.module#EditQueryModule'},
  {path: 'result-viewer', loadChildren: './result-viewer/result-viewer.module#ResultViewerModule'},
  {path: 'browse-results', loadChildren: './browse-results/browse-results.module#BrowseResultsModule'},
  {path: 'settings', loadChildren: './settings/settings.module#SettingsModule'},
  {path: '', pathMatch: 'full', redirectTo: 'browse-query'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
