import { Injectable } from '@angular/core';
import {MyConfig} from '../myConfig';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {buildHttpParams} from '../http-params.helper';

export interface EspReport {
  id: number;
  lastUpdate: string;
  temperature: number;
  humidity: number;
  image: string;
}

export interface GetReportsRequest {
  returnAmount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EspReportControllerService {
  private readonly getUrl = `${MyConfig.apiAddress}/api/EspReport/GetReports`;
  private readonly deleteUrl = `${MyConfig.apiAddress}/api/EspReport/DeleteReport`;

  constructor(private http: HttpClient) { }

  handleGet(request: GetReportsRequest): Observable<EspReport[]> {
    let params = buildHttpParams(request);
    return this.http.get<EspReport[]>(this.getUrl,{params:params}).pipe(
      map((res: EspReport[]) => res.map(val => {
        val.image = `${MyConfig.apiAddress}/media/${val.image}`
        return val;
      }))
    );
  }

  handleDelete(id: number): Observable<any> {
    return this.http.delete(`${this.deleteUrl}/${id}`);
  }
}
