import { Component, OnInit } from '@angular/core';
import { Post } from '../post.module';
import { PostService } from '../post.service';
import { Router, Event, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-postlist',
  templateUrl: './postlist.component.html',
  styles: []
})
export class PostlistComponent implements OnInit {
  public posts: Post[] = [];
  public isPostSelected;

  constructor(private postService: PostService, private router: Router) { 
    this.router.events.subscribe((event: Event) => {
      if(event instanceof NavigationEnd) {
        // resize things and focus on /post
        this.ngOnInit();
        if(event.url.match(/\/post\/[a-zA-Z0-9]+/)) {
          this.isPostSelected = /\/post\/([a-zA-Z0-9]+)/.exec(event.url)[1];
        }
      }
    });
  }

  ngOnInit() {
    this.getPosts();
  }
  getPosts(): void {
    this.postService.getPosts().subscribe(posts => this.posts = <Post[]> posts)
  }
}
