import { Injectable } from '@angular/core';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {MyConfig} from '../myConfig';
import {EspReport} from '../endpoints/esp-report-controller.service';
import {SensorReport} from '../endpoints/sensor-data-controller.service';
import {EspControl} from '../endpoints/esp-control-data.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private hubConnection!: HubConnection;

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${MyConfig.apiAddress}/reportHub`)
      .build();

    this.hubConnection.start().then(
      connection => {
        console.log("Connected to " + MyConfig.apiAddress);
      }
    )

    this.hubConnection.on('connectionStart', (conString) => {
      console.log(conString);
    })
  }

  addEspReportReceiveListener(callback: (espReport: EspReport) => void) {
    this.hubConnection.on('receivedReport', (report: EspReport) => {
      callback(report);
    })
  }

  addSensorDataReceiveListener(callback: (sensorReport: SensorReport) => void) {
    this.hubConnection.on('receivedSensorData', (report: SensorReport) => {
      callback(report);
    })
  }

  addControlDataListener(callback: (espControl: EspControl) => void) {
    this.hubConnection.on('receivedControlData', (control: EspControl) => {
      callback(control);
    })
  }
}
