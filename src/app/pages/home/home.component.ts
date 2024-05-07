import {Router} from '@angular/router';
import {ComputerStrategies} from './../../enums/computer-strategies';
import {Component, inject} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly router = inject(Router);

  ComputerStrategies = ComputerStrategies;

  selectStrategy(strategy: ComputerStrategies): void {
    this.router.navigateByUrl(`/game/${strategy}`);
  }
}
