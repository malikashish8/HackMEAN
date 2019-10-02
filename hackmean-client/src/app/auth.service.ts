import { Injectable } from '@angular/core';
import { HttpResponse, HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { AlertsService } from 'angular-alert-module';
import { Router } from '@angular/router';
import { AppSettings } from './app-settings';
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseURL = AppSettings.apiUrl;
  
  public isLoggedIn: boolean;
  public httpOptions = {};
  public loggedInUser: string;

  constructor(private httpClient: HttpClient, private alerts: AlertsService, private router: Router) { 
    // check if a valid credentials exist in browser local storage
    let id_token = localStorage.getItem('id_token');
    let expires_at = localStorage.getItem('expires_at');
    if (id_token && expires_at && moment(expires_at, "x") > moment()){
      this.httpOptions = {headers: new HttpHeaders({'Authorization': `Bearer ${id_token}`})};
      this.isLoggedIn = true;
      this.loggedInUser = localStorage.getItem('user');
    } else {
      this.logout();
    }
  }

  login(username: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.post<any>(this.baseURL + 'login',
      {
        username: username,
        password: password
      }
      ).subscribe(
        (resp: HttpResponse<any>) => {
          this.alerts.setMessage('login successful', 'success');
          let expiresAt = moment().add(resp['expiresIn'], 'second');
          localStorage.setItem('id_token', resp['token']);
          localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
          localStorage.setItem("user", username);
          
          this.httpOptions = {
            headers: new HttpHeaders({
              'Authorization': `Bearer ${localStorage.getItem('id_token')}`
            })
          };
          this.isLoggedIn = true;
          this.loggedInUser = username;

          let timeoutTime = (expiresAt.valueOf()) - (new Date).getTime();
          setTimeout(() => {
            this.logout();
          }, timeoutTime);
          resolve(this.httpOptions);
          
          this.router.navigateByUrl(this.router.url);
        },
        (error: HttpErrorResponse) => {
          this.alerts.setMessage((error.error.error), 'error');
          reject(error.error.error);
      });
    });
  }

  logout() {
    this.httpClient.get(this.baseURL + 'logout').subscribe(
      () => {
        this.alerts.setMessage('logged out', 'success');
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("user");
        this.httpOptions = {};
        this.isLoggedIn = false;
        this.loggedInUser = null;
        this.router.navigateByUrl('/');
      },
      () => {
        this.alerts.setMessage('logout failed', 'error');
      } 
    )
  }
}
