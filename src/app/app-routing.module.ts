import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowseQueryComponent } from './browse-query/browse-query.component';
import { EditComponent } from './edit/edit.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BrowseResultsComponent } from './browse-results/browse-results.component';
import { BrowseToolbarComponent } from './browse-query/browse-toolbar/browse-toolbar.component';
import { ResultViewerComponent } from './result-viewer/result-viewer.component';

const routes: Routes = [
  {path: 'browse-query', component: BrowseQueryComponent, data: {'sidebar': BrowseToolbarComponent}},
  {path: 'browse-results', component: BrowseResultsComponent},
  {path: 'edit/:id', component: EditComponent},
  {path: 'result-viewer', pathMatch: 'full', redirectTo: 'result-viewer/last'},
  {path: 'result-viewer/:id', component: ResultViewerComponent},
  {path: '', pathMatch: 'full', redirectTo: 'browse-query'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
