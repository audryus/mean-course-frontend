import { Component } from "@angular/core";
import { NgForm, NgModel } from "@angular/forms";

import { Post } from "../post.model";
import { PostService } from '../post.service';

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent {
  constructor(public postService: PostService){}

  onAddPost(form: NgForm) {
    if (form.invalid)
      return;

    const post:Post = {
      title: form.value.title,
      content: form.value.content
    };
    this.postService.addPost(post);
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
