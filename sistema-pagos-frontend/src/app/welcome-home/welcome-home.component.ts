import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome-home',
  templateUrl: './welcome-home.component.html',
  styleUrls: ['./welcome-home.component.css']
})
export class WelcomeHomeComponent {
  currentYear: number = new Date().getFullYear();
}
