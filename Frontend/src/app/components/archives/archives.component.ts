import {Component, OnInit} from '@angular/core';
import {EspReport, EspReportControllerService} from '../../endpoints/esp-report-controller.service';
import {EspControlDataService} from '../../endpoints/esp-control-data.service';
import {ReportCardComponent} from '../report-card/report-card.component';
import {ReportService} from '../../services/report.service';
import {MyConfig} from '../../myConfig';
import {MatSnackBar} from '@angular/material/snack-bar';

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

  espReportCallback = (espReport: EspReport) => {
    let audio = new Audio("/assets/notificationSound.mp3");
    audio.play();

    if(!espReport.image.includes(MyConfig.apiAddress))
    {
      espReport.image = `${MyConfig.apiAddress}/media/${espReport.image}`;
    }
    else {
      let i = espReport.image.lastIndexOf('/');
      espReport.image = `${MyConfig.apiAddress}/media/${espReport.image.slice(i+1, espReport.image.length)}`;
    }

    let index = this.espReports.find(val => val.id === espReport.id);
    if(index !== undefined) {
      this.espReports.shift()
    }

    this.espReports.unshift(espReport);
  }

  constructor(private espReportService: EspReportControllerService,
              private reportService : ReportService,
              private snackBar : MatSnackBar) {
  }

  ngOnInit(): void {
        this.espReportService.handleGet({}).subscribe((res) => {
          this.espReports = res;
        })

    this.reportService.addEspReportReceiveListener(this.espReportCallback);
  }

  removeReport(report: EspReport) {
    this.snackBar.open("Report removed successfully.","Ok", {duration: 2000});
    this.espReports = this.espReports.filter(esp => esp.id !== report.id);
  }
}
