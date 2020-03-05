import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs:Subscription;

  isAuth = false;

  constructor(private authService:AuthService) {}

  ngOnInit(): void {
    this.isAuth = this.authService.isAuth();
    this.authListenerSubs = this.authService.getListener().subscribe(isAuthenticated => {
      this.isAuth = isAuthenticated;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  
}
