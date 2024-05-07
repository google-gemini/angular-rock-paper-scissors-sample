import {Component, inject} from '@angular/core';
import {Dialog, DialogModule} from '@angular/cdk/dialog';
import {AboutComponent} from '../about/about.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [DialogModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  private readonly dialog = inject(Dialog);

  openAboutDialog(): void {
    this.dialog.open(AboutComponent, {});
  }
}
