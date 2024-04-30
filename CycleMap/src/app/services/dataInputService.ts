import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import axios from 'axios';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataInputService {
  // 5275.917396937822 distanz addis
  private distanceInKM = 5275917.396937822;
  private distanceInWeirdFormat = 16678977.626334907;
  private correction = this.distanceInWeirdFormat / this.distanceInKM;

  //
  private kilometerSubject = new BehaviorSubject(500);
  public meters$: Observable<number> = this.kilometerSubject
    .asObservable()
    .pipe(map((value: number) => value * 1000 * this.correction));

  constructor(private client: HttpClient) {}

  public refreshDistance() {
    // this.client.get("https://simplescraper.io/api/NZ3QALh5rnYDnI7DWbaY?apikey=MkwEFueoBCVpojXO9LupMkAIuklAJNjo&run_now=true").subscribe(
    //     response => {
    //         var mData = (response as any).data[0];
    //         var m = (mData['nexplore-m'] as string).split(' ')[0] as unknown as number;
    //         console.log(m);
    //         this.kilometerSubject.next(m)
    //     }
    // )
    // const apiUrl = 'https://api.biketowork.ch/graphql';
    // const requestData = {
    //   operationName: 'ParticipatingCompanies',
    //   variables: {
    //     where: {
    //       OR: [
    //         {
    //           name: {
    //             contains: 'Nexplore AG',
    //             mode: 'Insensitive'
    //           }
    //         }
    //       ]
    //     },
    //     skip: 0,
    //     take: 1
    //   },
    //   query: `
    //     query ParticipatingCompanies($where: CompanyFilter, $skip: Int!, $take: Int!) {
    //       currentCampaign {
    //         participatingCompanies(
    //           where: $where
    //           take: $take
    //           skip: $skip
    //           orderBy: {name: Asc}
    //         ) {
    //           company {
    //             name
    //           }
    //           stats {
    //             distance
    //           }
    //         }
    //       }
    //     }
    //   `
    // };
    // var distance = 0;
    // axios.post(apiUrl, requestData)
    //   .then(response => {
    //   distance = response.data.data.currentCampaign.participatingCompanies[0].stats.distance;
    //   })
    //   .catch(error => {
    //     console.error('Error:', error);
    //   });
    //   this.kilometerSubject.next(distance);
    //    setTimeout(() => {
    //    this.refreshDistance();
    //    }, 60*60*1000)
  }
}
