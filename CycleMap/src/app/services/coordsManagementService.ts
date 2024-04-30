import { Injectable } from "@angular/core";
import { Coordinate } from 'ol/coordinate';
import {getDistance} from 'ol/sphere';




@Injectable({providedIn: 'root'})
export class CoordsManagementService{

  private cordThun: Coordinate = [848077.086943238, 5898493.41929597];
  private cordAddis: Coordinate = [4313733.731515491, 1009908.8055733215];
  private cordCapeTown: Coordinate = [2057033.2407148802, -4075747.348106025];

  private vectorTA: Coordinate = [this.cordAddis[0]-this.cordThun[0], this.cordAddis[1]-this.cordThun[1]];
  private distanceTA: number = getDistance(this.cordThun, this.cordAddis);
  private normalizedVectorTA: Coordinate = [this.vectorTA[0]/this.distanceTA, this.vectorTA[1]/this.distanceTA];

  private vectorAC: Coordinate = [this.cordCapeTown[0]-this.cordAddis[0], this.cordCapeTown[1]-this.cordAddis[1]];
  private distanceAC: number = getDistance(this.cordAddis, this.cordCapeTown);
  private normalizedVectorAC: Coordinate = [this.vectorAC[0]/this.distanceAC, this.vectorAC[1]/this.distanceAC];

  getNormalizedTA(): Coordinate {
    return this.normalizedVectorTA;
  }

  getNormalizedAC(): Coordinate {
    return this.normalizedVectorAC;
  }

  getThunCoords(): Coordinate {
    return this.cordThun;
  }

  getAddisCoords(): Coordinate {
    return this.cordAddis;
  }

  getCapeTownCoords(): Coordinate {
    return this.cordCapeTown;
  }
}