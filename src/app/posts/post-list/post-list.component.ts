import { Subscription } from "rxjs";

import { Component, OnInit, OnDestroy } from "@angular/core";

import { Post } from "../post.model";
import { PostService } from "../post.service";
@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading: boolean = false;
  private postSub: Subscription;

  constructor(public postService: PostService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.findAll();
    this.postSub = this.postService.getListener().subscribe((posts: Post[]) => {
      this.posts = posts;
      this.isLoading = false;
    });
  }

  onDelete(postId: string) {
    this.postService.delete(postId);
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
