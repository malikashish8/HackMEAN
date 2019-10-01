import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  showingMenu = false;
  username = "Username";
  password = "Password";
  
  loggedIn = false;
  httpOptions: any;

  constructor(private authService: AuthService) { }

  ngOnInit() { }

  login() {
    this.authService.login(this.username, this.password)
      .then((httpOptions) => {
        this.httpOptions = httpOptions;
        this.loggedIn = true;
      })
      .catch((errorMessage) => {
        console.log("Login failed: " + errorMessage);
      });
  }

  logout() {
    this.authService.logout();
    this.loggedIn = false;
  }

  showMenu() {
    this.showingMenu = ! this.showingMenu;
  }
}
