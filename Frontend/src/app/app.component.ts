import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIcon, MatAnchor, MatButton, MatDivider, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  title = 'Fridge Police';
}
