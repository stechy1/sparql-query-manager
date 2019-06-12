import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {path: 'edit', loadChildren: () => import('./edit-query/edit-query.module').then(m => m.EditQueryModule)},
  {path: 'result-viewer', loadChildren: () => import('./result-viewer/result-viewer.module').then(m => m.ResultViewerModule)},
  {path: 'browse-results', loadChildren: () => import('./browse-results/browse-results.module').then(m => m.BrowseResultsModule)},
  {path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)},
  {path: '', pathMatch: 'full', redirectTo: 'browse-query'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
