import { Injectable } from '@angular/core';
import {MyConfig} from '../myConfig';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface EspControl {
  requirePicture: boolean;
  pictureQuality: string;
  withFlash: boolean;
  aiSummary: boolean;
  autoUpdate: boolean;
  requireTemperature: boolean;
  timeInCritical: number;
  maxTimeInCritical: number;
}

@Injectable({
  providedIn: 'root'
})
export class EspControlDataService {
  private readonly getUrl = `${MyConfig.apiAddress}/api/Esp/GetControlData`;
  private readonly setUrl = `${MyConfig.apiAddress}/api/Esp/SetControlData`;

  constructor(private http: HttpClient) { }

  handleGetAsync(): Observable<EspControl> {
    return this.http.get<EspControl>(this.getUrl);
  }

  handleSetAsync(request: EspControl) : Observable<EspControl> {
    return this.http.post<EspControl>(this.setUrl, request);
  }
}
