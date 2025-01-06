import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {EspControl, EspControlDataService} from '../../endpoints/esp-control-data.service';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatTab, MatTabContent, MatTabGroup} from '@angular/material/tabs';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatButton} from '@angular/material/button';
import {EspReport, EspReportControllerService} from '../../endpoints/esp-report-controller.service';
import {ReportCardComponent} from '../report-card/report-card.component';
import moment from 'moment';
import Chart from 'chart.js/auto';
import {ReportService} from '../../services/report.service';
import {MyConfig} from '../../myConfig';
import {MatFormField, MatPrefix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {SensorReportChartsComponent} from '../sensor-report-charts/sensor-report-charts.component';
import {MatIcon} from '@angular/material/icon';
import {ChartComponent} from '../chart/chart.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-headquarters',
  imports: [
    ReactiveFormsModule,
    MatTabGroup,
    MatTab,
    MatSlideToggle,
    MatButton,
    ReportCardComponent,
    MatFormField,
    MatInput,
    SensorReportChartsComponent,
    MatIcon,
    MatPrefix,
    ChartComponent,
    MatTabContent
  ],
  templateUrl: './headquarters.component.html',
  styleUrl: './headquarters.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeadquartersComponent implements OnInit {
  espControl: EspControl | null = null;
  espReports: EspReport[] = [];
  form: FormGroup = new FormGroup({
    requirePicture: new FormControl(false),
    withFlash: new FormControl(false),
    autoUpdate: new FormControl(false),
    requireTemperature: new FormControl(false),
    maxTimeInCritical: new FormControl(5),
    maxTemperature: new FormControl(0),
  });
  espControlCallback = (espControl: EspControl) => {
    this.espControl = espControl;
  }

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

  constructor(private espControlService: EspControlDataService,
              private espReportService: EspReportControllerService,
              private reportService: ReportService,
              private router: Router,) {
  }


  ngOnInit(): void {
    this.reportService.addEspReportReceiveListener(this.espReportCallback);
    this.reportService.addControlDataListener(this.espControlCallback);

    this.espControlService.handleGetAsync().subscribe(res => {
      this.espControl = res;
      this.form.get('autoUpdate')!.setValue(res.autoUpdate);
      this.form.get('requirePicture')!.setValue(res.requirePicture);
      this.form.get('withFlash')!.setValue(res.withFlash);
      this.form.get('maxTemperature')!.setValue(res.maxTemperature);
      this.form.get('maxTimeInCritical')!.setValue(res.maxTimeInCritical);
      this.form.get('requireTemperature')!.setValue(res.requireTemperature);
    })

    this.espReportService.handleGet({returnAmount: 30}).subscribe(res => {
      this.espReports = res;
    })
  }

  protected readonly JSON = JSON;

  takePicture() {
    this.espControl!.requirePicture = true;
    this.SavePictureSettings();
  }

  saveSensorSettings() {
    this.espControl!.maxTemperature = this.form.get('maxTemperature')?.value;
    this.espControl!.maxTimeInCritical = this.form.get('maxTimeInCritical')?.value;
    this.espControl!.requireTemperature = this.form.get('requireTemperature')?.value;

    this.espControlService.handleSetAsync(this.espControl!).subscribe(res => {
      this.espControl = res;
    })
  }

  getLabels() {
    return this.espReports.map(val => moment(val.lastUpdate).format('HH:mm:ss'));
  }

  getDataSet() {
    return this.espReports.map(val => val.temperature);
  }

  route(b: boolean) {
    b ? this.router.navigate(["/hq"]) : this.router.navigate(["/hq"], {queryParams: {charts:'show'}});
    console.log(this.router.url);
  }

  SavePictureSettings() {
    this.espControl!.autoUpdate = this.form.get('autoUpdate')?.value;
    this.espControl!.withFlash = this.form.get('withFlash')?.value;
    this.espControlService.handleSetAsync(this.espControl!).subscribe(res => {
      this.espControl = res;
    })
  }
}
