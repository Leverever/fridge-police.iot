import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {EspControl, EspControlDataService} from '../../endpoints/esp-control-data.service';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatButton} from '@angular/material/button';
import {EspReport, EspReportControllerService} from '../../endpoints/esp-report-controller.service';
import {ReportCardComponent} from '../report-card/report-card.component';
import moment from 'moment';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-headquarters',
  imports: [
    ReactiveFormsModule,
    MatTabGroup,
    MatTab,
    MatSlideToggle,
    MatButton,
    ReportCardComponent
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
    maxTimeInCritical: new FormControl(200),
  });

  tempCanvas!:HTMLCanvasElement;

  constructor(private espControlService: EspControlDataService,
              private espReportService: EspReportControllerService) {
  }


  ngOnInit(): void {
    this.tempCanvas = document.getElementById("temp-chart") as HTMLCanvasElement;

    this.espControlService.handleGetAsync().subscribe(res => {
      this.espControl = res;
      this.form.get('autoUpdate')!.setValue(res.autoUpdate);
      this.form.get('requirePicture')!.setValue(res.requirePicture);
      this.form.get('withFlash')!.setValue(res.withFlash);
    })

    this.espReportService.handleGet({returnAmount: 30}).subscribe(res => {
      this.espReports = res;

      const labels = res.map(val => moment(val.lastUpdate).format('HH:mm:ss'));
      const data = {
        labels: labels,
        datasets: [{
          label: 'Temperature readings',
          data: res.map(val => val.temperature),
          fill: false,
          borderColor: 'rgb(0, 92, 187)',
          tension: 0.3
        }]
      };
      console.log(this.tempCanvas);
      const chart = new Chart(
        this.tempCanvas,
        {
          type: "line",
          data: data,
          options: {
            scales: {
              x: {
                grid: {
                  display: false
                }
              },
              y: {
                grid: {
                  display: false
                }
              }
            }
          }
        }
      );
    })
  }

  protected readonly JSON = JSON;

  SetData(b: boolean = true) {
    this.espControl!.autoUpdate = this.form.get('autoUpdate')?.value;
    this.espControl!.withFlash = this.form.get('withFlash')?.value;b
    if(b)
    {
      this.form.get('requirePicture')!.setValue(b);
    }
    this.espControl!.requirePicture = !b ? this.form.get('requirePicture')?.value : true;

    this.espControlService.handleSetAsync(this.espControl!).subscribe(res => {
      this.espControl = res;
    })
  }
}
