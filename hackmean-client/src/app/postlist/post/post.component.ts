import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router';

import { PostService } from 'src/app/post.service';
import { Post } from 'src/app/post.module';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styles: []
})
export class PostComponent implements OnInit {
  post: Post;
  private id: string;
  editedTitle: string;
  editedBody: string;
  isEditing: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private postService: PostService) {
    this.router.events.subscribe((event: Event) => {
      if(event instanceof NavigationEnd) {
        // ToDo: resize things and focus on /post
        if(event.url.match(/\/post\/[a-zA-Z0-9]+/)) {
          this.ngOnInit();
        }
      }
    })
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('_id');
    this.postService.getPost(this.id).subscribe((res) => {
      this.post = res;
      this.isEditing = false;
      this.editedBody = this.post.body;
      this.editedTitle = this.post.title;
    });
  }

  updatePost() {
    let p = new Post(this.post._id, this.post.author, this.editedTitle, this.editedBody, new Date(), this.post.visibility);
    this.postService.editPost(p).subscribe((res) => {
      this.post = <Post> res;
      this.isEditing = ! this.isEditing;
    });
    // Implement (error) => {}
  }
}
