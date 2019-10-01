import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { UserlistComponent } from './userlist/userlist.component';
import { PostlistComponent } from './postlist/postlist.component';
import { PostComponent } from './postlist/post/post.component';
import { HttpClientModule } from '@angular/common/http';
import { CommentlistComponent } from './postlist/post/commentlist/commentlist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertsModule } from 'angular-alert-module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UserlistComponent,
    PostlistComponent,
    PostComponent,
    CommentlistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AlertsModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
