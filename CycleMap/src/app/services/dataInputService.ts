import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import axios from 'axios';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataInputService {
  private distanceInKM = 5275917.396937822;
  private distanceInWeirdFormat = 16678977.626334907;
  private correction = this.distanceInWeirdFormat / this.distanceInKM;
  private firstStageInMetersCorrected =
    5275.917396937822 * 1000 * this.correction;

  getCorrection() {
    return this.correction;
  }

  getFirstStage() {
    return this.firstStageInMetersCorrected;
  }

  //
  private kilometerSubject = new BehaviorSubject(0);
  public meters$: Observable<number> = this.kilometerSubject
    .asObservable()
    .pipe(map((value: number) => value * 1000 * this.correction));
    public kilometers$ = this.kilometerSubject.asObservable();

  constructor(private client: HttpClient) {}

  public refreshDistance() {
    //this.kilometerSubject.next(5275.5);
    // call the API to get the distance from https://km-reader.azurewebsites.net/api/ReadFromGraph
    this.client
      .get('https://km-reader.azurewebsites.net/api/ReadFromGraph')
      .subscribe((data: any) => {
        console.log('got data', data);
      this.kilometerSubject.next(data);
      });
  }
}
