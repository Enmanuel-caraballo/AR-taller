import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-welcome-page',
  standalone: true,   // 👈 debe estar
  imports: [
    CommonModule,
    RouterModule,      // 👈 ESTA ES LA CLAVE
    MatButtonModule
  ],
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit {

  constructor() { }

  ngOnInit() {}
}
