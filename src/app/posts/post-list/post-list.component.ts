import { Subscription } from "rxjs";

import { Component, OnInit, OnDestroy } from "@angular/core";

import { Post, PostPaginator } from "../post.model";
import { PostService } from "../post.service";
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  paginator: PostPaginator;
  isLoading: boolean = false;
  isAuth: boolean = false;

  private postSub: Subscription;
  private authSub: Subscription;

  constructor(public postService: PostService, private authService:AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.paginator = {
      postsPerPage: 1,
      currentPage: 1,
      totalPosts: 0,
      pageSizeOptions: [1, 2 , 5, 10]
    }
    this.postService.findAll(this.paginator);
    this.postSub = this.postService.getListener().subscribe((posts: Post[]) => {
      if (this.paginator.currentPage > 1 && posts.length == 0) {
        this.paginator.currentPage = this.paginator.currentPage - 1;
        this.postService.findAll(this.paginator);
      }
      this.posts = posts;
      this.isLoading = false;
    });
    this.isAuth = this.authService.isAuth();
    this.authSub = this.authService.getListener().subscribe(isAuthenticated => {
      this.isAuth = isAuthenticated;
    })
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postService.delete(postId).subscribe(() => {
      this.postService.findAll(this.paginator);
    });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authSub.unsubscribe();
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.paginator.currentPage = pageData.pageIndex + 1;
    this.paginator.postsPerPage = pageData.pageSize;
    this.postService.findAll(this.paginator);
  }
}
