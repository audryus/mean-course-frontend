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

  private mapper(document: PostMessage):Post[] {
    return document.posts.map(post => {
      return {
        title: post.title,
        content: post.content,
        id: post._id
      }
    })
  }

  private next() {
    this.postSubject.next([...this.posts]);
  }

  findAll() {
    this.httpClient.get<PostMessage>(this.api)
      .pipe(map((postData) => this.mapper(postData)))
      .subscribe((pipedPosts) => {
        this.posts = pipedPosts
        this.next();
      });
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
