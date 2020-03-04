import { Subject } from "rxjs";
import { map } from 'rxjs/operators'
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Post, PostMessage } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostService {
  private posts: Post[] = [];
  private postSubject = new Subject<Post[]>();

  private api: string = "http://localhost:3000/api/post/"

  constructor(private httpClient: HttpClient) {}

  getListener() {
    return this.postSubject.asObservable();
  }

  map(post:any): Post {
    return {
      title: post.title,
      content: post.content,
      id: post._id
    }
  }

  private mapper(document: PostMessage):Post[] {
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

  findAll() {
    this.httpClient.get<PostMessage>(this.api)
      .pipe(map((postData) => this.mapper(postData)))
      .subscribe((pipedPosts) => {
        this.posts = pipedPosts
        this.next();
      });
  }

  save(post: Post) {
    if (post.id != null) {
      this.update(post)
    } else {
      this.add(post)
    }
  }

  update(post: Post) {
    this.httpClient.patch(this.api+post.id, post)
      .subscribe(response => {
        // const updatedPosts = [...this.posts]
        // const oldPosIndex = this.posts.findIndex(p => p.id === post.id)
        // updatedPosts[oldPosIndex] = post
        // this.posts = updatedPosts
        // this.next()
      })
  }

  add(post: Post) {
    this.httpClient
      .post<PostMessage>(this.api, post)
      .subscribe(response => {
        this.posts.push(response.posts[0]);
        this.next();
      })
  }

  delete(postId: string) {
    this.httpClient.delete(this.api +postId)
      .subscribe(()=> {
        const updatedPosts = this.posts.filter(post => post.id !== postId)
        this.posts = updatedPosts
        this.next()
      })
  }
}
