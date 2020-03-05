import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData, AuthMessage } from './auth.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Injectable({ providedIn: "root" })
export class AuthService {
    private api: string = "http://localhost:3000/api/user/";
    private isAuthenticated: boolean = false;

    private token: string = "";
    private authStatusListener = new Subject<boolean>();
    private tokenTimer: any;

    constructor(private httpClient: HttpClient, private route: Router) {}
    
    getToken() {
        return this.token;
    }

    getListener() {
        return this.authStatusListener.asObservable();
    }

    isAuth() {
        return this.isAuthenticated;
    }

    signup(user:AuthData) {
        this.httpClient.post(`${this.api}/sign/up`, user).subscribe(res => {
        })
    }

    signin(user:AuthData) {
        this.httpClient.post<AuthMessage>(`${this.api}/sign/in`, user).subscribe(res => {
            this.token = res.token;
            if (this.token) {
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                this.setAuthTimer(res.expiresIn);
                const now = new Date();
                this.saveAuthData(this.token, new Date(now.getTime() + res.expiresIn* 1000));
                this.route.navigate(['/']);
            }
        })
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.route.navigate(['/']);
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const expiresIn = authInformation.expirationDate.getTime() - new Date().getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.setAuthTimer(expiresIn / 1000);
        }
    }

    private saveAuthData(token: string, experitationDate: Date) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', experitationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    }

    private getAuthData():AuthMessage {
        const token = localStorage.getItem('token');
        const expiration = localStorage.getItem('expiration');

        if (!token || !expiration) {
            return null;
        }
        return {
            token: token,
            expirationDate: new Date(expiration)
        }
    }
}