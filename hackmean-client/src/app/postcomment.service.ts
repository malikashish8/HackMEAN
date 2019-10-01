import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PostComment } from './postcomment.module';

import { AppSettings } from './app-settings';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostCommentService {
  postComments: PostComment[] = [];
  constructor(private httpClient: HttpClient, private authService: AuthService) { }
  private baseURL = AppSettings.apiUrl;
  private postPath = 'post';
  private commentPath = 'comment';
  ngOnInit(){

  }
  getPostCommentsByPostId(postId: string): Observable<PostComment[]> {
    return <Observable<PostComment[]>> this.httpClient.get(this.baseURL + this.postPath + '/' + postId + '/' + 'comment', this.authService.httpOptions);
  }

  deleteComment(commentId: string) {
    return this.httpClient.delete(this.baseURL + this.commentPath + '/' + commentId, this.authService.httpOptions);
  }

}
