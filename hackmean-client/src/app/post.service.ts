import { Injectable } from '@angular/core';
import { Post } from './post.module';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppSettings } from './app-settings';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts: Post[] = [];
  constructor(private httpClient: HttpClient, private authService: AuthService) { }
  private baseURL = AppSettings.apiUrl;
  private postPath = 'post';
  post: Post = null;

  ngOnInit(){
    this.getPosts();
  }
  
  getPosts() {
    return this.httpClient.get(this.baseURL + this.postPath, this.authService.httpOptions);
  }

  getPost(id: string): Observable<Post> {
    let p = <Observable<Post>> this.httpClient.get(this.baseURL + this.postPath + '/' + id, this.authService.httpOptions);
    return p;
  }

  editPost(post: Post) {
    let res = this.httpClient.put(this.baseURL + this.postPath + '/' + post._id, post, this.authService.httpOptions);
    return res;
  }
}
