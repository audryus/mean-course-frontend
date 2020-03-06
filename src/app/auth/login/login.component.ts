import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AuthData } from '../auth.model';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
    isLoading:boolean = false;
    autData: AuthData;
    private authListenerSubs: Subscription;

    constructor(public authService: AuthService) { }

    ngOnInit() { 
        this.authListenerSubs = this.authService.getListener().subscribe(
            authStatus => {
                this.isLoading = authStatus;
            }
        );
    }

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
    ngOnDestroy(): void {
        this.authListenerSubs.unsubscribe();
    }
}