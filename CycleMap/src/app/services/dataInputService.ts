import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import axios from "axios";


@Injectable({providedIn: 'root'})
export class DataInputService {
  
    private kilometerSubject = new BehaviorSubject(5275.917396937822);
    public meters$ = this.kilometerSubject.asObservable().pipe(map(value => value * 1000));

    constructor(
      private client: HttpClient,
      ) { }

      public refreshDistance(){

    

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