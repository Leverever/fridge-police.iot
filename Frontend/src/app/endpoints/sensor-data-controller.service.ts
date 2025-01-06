import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../myConfig';
import {GetReportsRequest} from './esp-report-controller.service';
import {Observable} from 'rxjs';
import {buildHttpParams} from '../http-params.helper';

export interface SensorReport {
  id: number;
  temperature: number;
  humidity: number;
  heatIndex: number;
  recordedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class SensorDataControllerService {
  private readonly getUrl = `${MyConfig.apiAddress}/api/SensorData/GetSensorData`;

  constructor(private http: HttpClient) { }

  handleGetSensorData(req: GetReportsRequest) : Observable<SensorReport[]> {
    let params = buildHttpParams(req);
    return this.http.get<SensorReport[]>(this.getUrl,{params:params});
  }
}
