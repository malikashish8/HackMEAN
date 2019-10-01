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
  public isLoggedIn
  private baseURL = AppSettings.apiUrl;
  public httpOptions = {};

  constructor(private httpClient: HttpClient, private alerts: AlertsService, private router: Router) { }

  login(username: String, password: String): Promise<any> {
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
          localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
          

          this.httpOptions = {
            headers: new HttpHeaders({
              'Authorization': localStorage.getItem('id_token')
            })
          };
          
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
        this.httpOptions = {};
      },
      () => {
        this.alerts.setMessage('loggout failed', 'error');
      } 
    )
  }
}
