import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import {ReportService} from './services/report.service';
import {EspControl} from './endpoints/esp-control-data.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIcon, MatAnchor, MatButton, MatDivider, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
  title = 'Fridge Police';
  crtitical: boolean = false;

  controlDataCallback = (control : EspControl) => {
    if(this.crtitical !== (control.timeInCritical > control.maxTimeInCritical) && (control.timeInCritical > control.maxTimeInCritical)) {
      let audio = new Audio("/assets/warning.mp3");
      audio.play();
    }
    this.crtitical = control.timeInCritical > control.maxTimeInCritical;
  }

  constructor(private reportService: ReportService) {
  }

  ngOnInit(): void {
    this.reportService.addControlDataListener(this.controlDataCallback);
  }
}
