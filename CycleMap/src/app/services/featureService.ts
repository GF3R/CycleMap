import { CoordsManagementService } from "./coordsManagementService";
import { DataInputService } from "./dataInputService";
import {Vector as VectorSource} from 'ol/source';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import {getDistance} from 'ol/sphere';
import Stroke from 'ol/style/Stroke';
import { Coordinate } from 'ol/coordinate';
import {LineString} from 'ol/geom';
import { Vector } from 'ol/source';
import { Point } from 'ol/geom';
import { Injectable } from "@angular/core";
import { Feature, Observable } from 'ol';
import { BehaviorSubject,tap } from "rxjs";




@Injectable({providedIn: 'root'})
export class FeaturesService{

  private featureListBehaviorSubject: BehaviorSubject<Feature[]> = new BehaviorSubject<Feature[]>(this.featuresList);
  public featureList$ = this.featureListBehaviorSubject.asObservable();
  
  constructor(
    private coordsManagementService: CoordsManagementService, 
    private dataInputService: DataInputService
  ) {
    this.initializeFeatureList();
  }

  initializeFeatureList(){
    this.dataInputService.meters$.pipe(
      tap((m: any) => console.log('DistanceService output:', m)),
      tap((m: number) => {
        // Get coordinates from CoordsManagementService
        let cordThun = this.coordsManagementService.getThunCoords();
        let cordAddis = this.coordsManagementService.getAddisCoords();
        let cordCapeTown = this.coordsManagementService.getCapeTownCoords();
        let normalizedTA = this.coordsManagementService.getNormalizedTA();

      //1. Punkt in Thun mit Logo
      let point = new Point(cordThun);
      var featureStart = new Feature({
        geometry: point
      });

      let iconStyleNexplore = new Style({
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'assets/images/Nexplore_N.gif',
          scale: 0.2,
        }),
      });
      featureStart.setStyle(iconStyleNexplore)

      //Point Jonas
      let pointJonas = new Point(cordAddis)
      var featureJonas = new Feature({
        geometry : pointJonas
      })

      let iconStyleJonas = new Style({
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'assets/images/Jonas.png',
          scale: 0.2,
        }),
      });
      featureJonas.setStyle(iconStyleJonas);
      

      //Point Flags
      let pointFlags = new Point(cordCapeTown)
      var featureFlags = new Feature({
        geometry : pointFlags
      })

      let iconStyleFlags = new Style({
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'assets/images/flags.png',
          scale: 0.09,
        }),
      });
      featureFlags.setStyle(iconStyleFlags);


      //Was das??
      let pointStartCoordinates = [cordThun[0], cordThun[1]];
      let pointStart = new Point(pointStartCoordinates);
      var featureLogo = new Feature({
        geometry: point
      });
      console.log("testtt")


      //Line Thun - Addis
      let point2Coords = [cordThun[0]+(m*normalizedTA[0]), cordThun[1]+(m*normalizedTA[1])];

      let point2 = new Point(point2Coords);
      var feature2 = new Feature({
        geometry: point2
      });

      console.log("distance to THun",getDistance(point2Coords, cordThun))
      

        console.log("point2Coords", point2Coords)
        let lineString = new LineString([cordThun, point2Coords]);

        let lineFeature = new Feature({
          geometry: lineString
        });

        let lineStringAC = new LineString([cordAddis, cordCapeTown]);

        let lineFeatureAC = new Feature({
          geometry: lineString
        });

        lineFeature.setStyle(new Style({
          stroke: new Stroke({
            color: '#010100',
            width: 4
          })
        }));


        this.featureListBehaviorSubject.next([lineFeature, lineFeatureAC, featureFlags, featureJonas, featureLogo, featureStart]);
      ));
  }

}