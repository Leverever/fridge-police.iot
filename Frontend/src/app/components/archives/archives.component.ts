import {Component, OnInit} from '@angular/core';
import {EspReport, EspReportControllerService} from '../../endpoints/esp-report-controller.service';
import {EspControlDataService} from '../../endpoints/esp-control-data.service';
import {ReportCardComponent} from '../report-card/report-card.component';

@Component({
  selector: 'app-archives',
  imports: [
    ReportCardComponent
  ],
  templateUrl: './archives.component.html',
  styleUrl: './archives.component.css'
})
export class ArchivesComponent implements OnInit {
  espReports: EspReport[] = [];

  constructor(private espReportService: EspReportControllerService) {
  }

  ngOnInit(): void {
        this.espReportService.handleGet({}).subscribe((res) => {
          this.espReports = res;
        })
  }

  removeReport(report: EspReport) {
    this.espReports = this.espReports.filter(esp => esp.id !== report.id);
  }
}
