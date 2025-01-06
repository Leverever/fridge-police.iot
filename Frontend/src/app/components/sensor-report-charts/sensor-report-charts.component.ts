import {Component, OnInit} from '@angular/core';
import {ChartComponent} from '../chart/chart.component';
import {SensorDataControllerService, SensorReport} from '../../endpoints/sensor-data-controller.service';
import {ReportService} from '../../services/report.service';
import moment from 'moment';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-sensor-report-charts',
  imports: [
    ChartComponent,
    MatIcon
  ],
  templateUrl: './sensor-report-charts.component.html',
  styleUrl: './sensor-report-charts.component.css'
})
export class SensorReportChartsComponent implements OnInit {
  sensorReports : SensorReport[] = [];
  sensorCallback = (sensorReport:SensorReport) =>{
    //let audio = new Audio("/assets/notificationSound.mp3");
    //audio.play();
    this.sensorReports.unshift(sensorReport);
    this.sensorReports = this.sensorReports.slice(0,18)
  }

  constructor(private sensorController: SensorDataControllerService,
              private reportService: ReportService,) {
  }

  ngOnInit(): void {
    this.sensorController.handleGetSensorData({returnAmount:18}).subscribe(data =>{
      this.sensorReports = data;
      }
    )
    this.reportService.addSensorDataReceiveListener(this.sensorCallback);
  }

  getLabels() {
    return this.sensorReports.map(sensorReport => moment(sensorReport.recordedAt).format('hh:mm:ss'))
  }

  getTempData() {
    return this.sensorReports.map(sensorReport => sensorReport.temperature);
  }

  getHumidityData() {
    return this.sensorReports.map(sensorReport => sensorReport.humidity);
  }

  getHeatIndexData() {
    return this.sensorReports.map(sensorReport => sensorReport.heatIndex.toFixed(2));
  }
}
