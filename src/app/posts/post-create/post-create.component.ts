import { Component, OnInit } from "@angular/core";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

import { Post } from "../post.model";
import { PostService } from "../post.service";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  form: FormGroup;
  imagePreview: string;
  post: Post;
  isLoading: boolean = false;

  private currentState: PostMode = PostMode.Create;

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      "title": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      "content": new FormControl(null, {
        validators: [Validators.required]
      }),
      "id": new FormControl(null),
      "imagePath": new FormControl(null),
      "image": new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
    });

    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      // Reseting state ...
      this.currentState = PostMode.Create;
      if (paramMap.has("postId")) {
        this.currentState = PostMode.Edit;
        this.postService
          .findById(paramMap.get("postId"))
          .subscribe(postData => {
            this.post = this.postService.map(postData.posts[0]);
            this.form.setValue(this.post);
            this.isLoading = false;
          });
      }
      this.isLoading = false;
    });
  }

  callbackRoute(router: Router) {
    router.navigate(["/"]);
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    let tmpPost: Post = this.form.value;

    if (this.currentState == PostMode.Edit) {
      tmpPost.id = this.post.id;
    }

    this.postService.save(tmpPost, this.callbackRoute);
    this.form.reset();
  }

  getInputError(fieldName: string) {
    let error = "";
    let inputField = this.form.get(fieldName);
    if (!inputField.invalid) {
      return error;
    }

    if (inputField.errors.minlength) {
      error = `Minimum title length is ${inputField.errors.minlength.requiredLength}`;
    }
    if (inputField.errors.required) {
      error = `${fieldName} is Required`;
    }
    return error;
  }

  onImagePick(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    this.form.patchValue({
      "image": file
    });

    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

enum PostMode {
  Create,
  Edit
}
