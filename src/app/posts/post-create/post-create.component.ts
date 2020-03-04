import { Component, OnInit } from "@angular/core";
import { NgForm, NgModel } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { Post } from "../post.model";
import { PostService } from '../post.service';

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  post:Post

  private currentState: PostMode = PostMode.Create

  constructor(public postService: PostService, public route: ActivatedRoute){}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      // Reseting state ...
      this.currentState = PostMode.Create

      if (paramMap.has("postId")) {
        this.currentState = PostMode.Edit
        this.postService.findById(paramMap.get("postId")).subscribe(postData => {
          this.post = this.postService.map(postData.posts[0])
        })
      }
    })
  }

  onSave(form: NgForm) {
    if (form.invalid) {
      return;
    }
    let tmpPost: Post = {
      title: form.value.title,
      content: form.value.content
    };

    if (this.currentState == PostMode.Edit) {
      tmpPost.id = this.post.id
    }

    this.postService.save(tmpPost);
    form.resetForm();
  }
  getInputError(inputField: NgModel) {
    let error = ""
    if (!inputField.errors) {
      return error;
    }

    if (inputField.errors.minlength) {
      error = "Minimum title length is " + inputField.errors.minlength.requiredLength;
    }
    if (inputField.errors.required) {
      error = "Required field"
    }
    return error
  }
}

enum PostMode {
  Create, Edit
}
