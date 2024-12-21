import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  images = [
    'assets/ga.jpg',
    'assets/ga1.jpg',
    'assets/ga2.jpg'
  ];
}
