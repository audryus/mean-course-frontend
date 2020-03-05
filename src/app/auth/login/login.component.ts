import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AuthData } from '../auth.model';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    isLoading:boolean = false;
    autData: AuthData;

    constructor(public authService: AuthService) { }

    ngOnInit() { }

    onLogin(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.isLoading = true;
        this.autData = form.value;
        this.authService.signin(this.autData);
    }

    getInputError(field: NgModel) {
        if (!field.errors) {
            return;
        }
        if (field.errors.required) {
            return "Required field."
        }
        if (field.errors.email) {
            return "Invalid E-mail"
        }

    }
}