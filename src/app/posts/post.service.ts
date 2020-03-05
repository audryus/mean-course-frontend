import { Subject } from "rxjs";
import { map } from 'rxjs/operators'
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { Post, PostMessage, PostPaginator } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostService {
  private posts: Post[] = [];
  private postSubject = new Subject<Post[]>();

  private api: string = "http://localhost:3000/api/post/"

  constructor(private httpClient: HttpClient, private route: Router) {}

  getListener() {
    return this.postSubject.asObservable();
  }

  map(post:any): Post {
    return {
      title: post.title,
      content: post.content,
      id: post._id,
      imagePath: post.imagePath,
      image: post.imagePath
    }
  }

  toData(post: Post): FormData | Post {
    let data:FormData | Post;
    if (typeof post.image === "object") {
      data = new FormData();
      data.append("title", post.title);
      data.append("content", post.content);
      data.append("id", post.id);
      data.append("image", post.image, post.title);
    } else {
      data = {
        ...post,
        imagePath: post.image
      }
    }
    return data;
    
  }

  private mapper(document: PostMessage, paginator?: PostPaginator):Post[] {
    if (paginator) {
      paginator.totalPosts = document.count;
    }
    return document.posts.map(post => {
      return this.map(post)
    })
  }

  private next() {
    this.postSubject.next([...this.posts]);
  }


  findById(postId: string) {
    return this.httpClient.get<PostMessage>(this.api +postId)
  }

  findAll(paginator?: PostPaginator) {
    var findUrl = this.api;

    if (paginator) {
      const queryParams = `?pagesize=${paginator.postsPerPage}&page=${paginator.currentPage}`;
      findUrl += queryParams
    }

    this.httpClient.get<PostMessage>(findUrl)
      .pipe(map((postData) => this.mapper(postData, paginator)))
      .subscribe((pipedPosts) => {
        this.posts = pipedPosts
        this.next();
      });
  }

  save(post: Post, callbackRouter?: Function) {
    if (post.id != null) {
      this.update(post, callbackRouter)
    } else {
      this.add(post, callbackRouter)
    }
  }

  update(post: Post, callbackRouter?: Function) {
    const postData = this.toData(post);
    this.httpClient.patch(this.api+post.id, postData)
      .subscribe(response => {
        // const updatedPosts = [...this.posts]
        // const oldPosIndex = this.posts.findIndex(p => p.id === post.id)
        // updatedPosts[oldPosIndex] = post
        // this.posts = updatedPosts
        this.next()
        if (callbackRouter) {
          callbackRouter(this.route);
        }
      })
  }

  add(post: Post, callbackRouter?: Function) {
    const postData = this.toData(post);
    this.httpClient
      .post<PostMessage>(this.api, postData)
      .subscribe(response => {
        this.posts.push(response.posts[0]);
        this.next();
        if (callbackRouter) {
          callbackRouter(this.route);
        }
      })
  }

  delete(postId: string) {
    return this.httpClient.delete(this.api +postId);
  }
}
