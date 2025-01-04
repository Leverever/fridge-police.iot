import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardLgImage} from '@angular/material/card';
import {EspReport, EspReportControllerService} from '../../endpoints/esp-report-controller.service';
import {NgStyle} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import moment from 'moment';

@Component({
  selector: 'app-report-card',
  imports: [
    MatCard,
    NgStyle,
    MatCardHeader,
    MatCardContent,
    MatCardLgImage,
    MatIcon,
    MatCardFooter
  ],
  templateUrl: './report-card.component.html',
  styleUrl: './report-card.component.css'
})
export class ReportCardComponent {
  @Input() espReport: EspReport | null = null;
  @Input() interactable: boolean = false;

  @Output() onDelete: EventEmitter<EspReport> = new EventEmitter();

  constructor(private espReportService: EspReportControllerService) {
  }

  getTime() {
    if(this.espReport == null){
      return "";
    }
    return moment(this.espReport.lastUpdate).fromNow();
  }

  delete() {
    if(this.espReport){
      this.espReportService.handleDelete(this.espReport.id).subscribe(
        {
          next: val => {
            this.onDelete.emit(this.espReport!);
          }
        }
      );
    }
  }
}
