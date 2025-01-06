import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import moment from 'moment/moment';
import Chart from 'chart.js/auto';
import {NgStyle} from '@angular/common';
import {NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-chart',
  imports: [
    NgStyle
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements AfterViewInit, OnChanges {
  canvas: HTMLCanvasElement | null = null;
  @Input() dataset: any[] = [1,2,3];
  @Input() labels: string[] = ["1","2","3"];
  private chart!: Chart;

  realDataset: any[] = [];
  realLabels: string[] = [];
  chartId: string = Math.random().toString();
  @Input() chartTitle: string = "";

  @Input() chartColor: string = "'rgb(255,0,0)'";
  randomBetween = (min:number, max:number) => min + Math.floor(Math.random() * (max - min + 1));

  constructor(private router: Router,
              private changeDetector: ChangeDetectorRef) {

  }

  ngAfterViewInit(): void {
    this.canvas = document.getElementById(this.chartId) as HTMLCanvasElement;
    console.log(this.canvas);
    this.realDataset = this.dataset.toReversed();
    this.realLabels = this.labels.toReversed();
    this.loadChart();

    /*
    const r = this.randomBetween(0, 100);
    const g = this.randomBetween(50, 255);
    const b = this.randomBetween(100, 255);
    this.chartColor = `'rgb(${r}, ${g}, ${b})'`;
     */

    console.log(this.chartColor);

    this.setCanvas(this.router.url);
    this.router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.setCanvas(event.url);
      }
    });

    this.changeDetector.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if(this.chart != null){
      this.realDataset = this.dataset.toReversed();
      this.realLabels = this.labels.toReversed();


      //this.chart.data.datasets[0].label = this.chartTitle;
      //this.chart.data.datasets[0].borderColor = this.chartColor;
      this.chart.data.labels = this.realLabels;
      this.chart.data.datasets[0].data = this.realDataset;
      this.chart.update();
    }
    this.changeDetector.detectChanges();
  }

  loadChart() {
    const data = {
      labels: this.realLabels,
      datasets: [{
        label: this.chartTitle,
        data: this.realDataset,
        fill: false,
        borderColor: 'rgb(0, 92, 187)',
        tension: 0.3
      }]
    };
    console.log(this.canvas);
    this.chart = new Chart(
      this.canvas!,
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
    console.log(this.chart);
    this.changeDetector.detectChanges();
  }

  setCanvas(url: string): void {
    console.log(url);
  }
}

