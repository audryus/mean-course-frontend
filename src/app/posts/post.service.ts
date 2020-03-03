import { Subject } from "rxjs";

import { Injectable } from "@angular/core";
import { Post } from "./post.model";

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postSubject = new Subject<Post[]>()

  getListener() {
    return this.postSubject.asObservable();
  }

  getPosts() {
    return [...this.posts];
  }
  addPost(post: Post) {
    this.posts.push(post);
    this.postSubject.next([...this.posts]);
  }

}
