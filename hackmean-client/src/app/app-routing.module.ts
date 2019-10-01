import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostlistComponent } from './postlist/postlist.component';

const routes: Routes = [
  { path: '', component: PostlistComponent },
  { path: 'post/:_id', component: PostlistComponent },
  { path: 'posts', component: PostlistComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
