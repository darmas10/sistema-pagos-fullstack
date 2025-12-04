import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public users: any = {
    admin: { password: '1234', roles: ['ESTUDIANTE', 'ADMIN'] },
    user1: { password: '1234', roles: ['ESTUDIANTE'] }
  };

  public username: any;
  public isAuthenticated: boolean = false;
  public roles: string[] = [];
  private API = 'http://localhost:8081/api/auth'; // AJUSTA TU URL
  
  constructor(private router: Router,private http: HttpClient) { }

     register(data: any): Observable<any> {
    return this.http.post(`${this.API}/register`, data);
  }
  
  public login(username: string, password: string): boolean {
    if (this.users[username] && this.users[username]['password'] == password) {
      this.username = username;
      this.isAuthenticated = true;
      this.roles = this.users[username]['roles'];
      return true;
    }
    else {
      return false;
    }
  }

  logout() {
    this.isAuthenticated = false;
    this.roles = [];
    this.username = undefined;
    this.router.navigateByUrl("/login");
  }
}

