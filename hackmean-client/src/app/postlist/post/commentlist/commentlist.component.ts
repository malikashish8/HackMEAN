import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router';
import { PostComment } from 'src/app/postcomment.module';
import { PostCommentService } from 'src/app/postcomment.service';

@Component({
  selector: 'app-commentlist',
  templateUrl: './commentlist.component.html',
  styles: []
})
export class CommentlistComponent implements OnInit {
  postComments: PostComment[] = [];
  constructor(private route: ActivatedRoute, private router: Router, private postCommentService: PostCommentService) { 
    router.events.subscribe((event: Event) => {
      if(event instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('_id');
    this.postCommentService.getPostCommentsByPostId(id).subscribe((postComments: PostComment[]) => {
      this.postComments = postComments;
    });
  }

  deleteComment(commentId: string) {
    this.postCommentService.deleteComment(commentId).subscribe((res) => {
      this.ngOnInit();
    });
  }
}
