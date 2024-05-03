import { CoordsManagementService } from './coordsManagementService';
import { DataInputService } from './dataInputService';
import { Vector as VectorSource } from 'ol/source';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { getDistance } from 'ol/sphere';
import Stroke from 'ol/style/Stroke';
import { Coordinate } from 'ol/coordinate';
import { LineString } from 'ol/geom';
import { Vector } from 'ol/source';
import { Point } from 'ol/geom';
import { Injectable } from '@angular/core';
import { Feature, Observable } from 'ol';
import { BehaviorSubject, tap } from 'rxjs';
import { extend } from 'ol/extent';

@Injectable({ providedIn: 'root' })
export class FeaturesService {
  private featureListBehaviorSubject: BehaviorSubject<Feature[]> =
    new BehaviorSubject<Feature[]>([]);
  public featureList$ = this.featureListBehaviorSubject.asObservable();

  public extentOfLineString: number[] = [0, 0, 0, 0];

  constructor(
    private coordsManagementService: CoordsManagementService,
    private dataInputService: DataInputService
  ) {
    this.initializeFeatureList();
  }

  initializeFeatureList() {
    this.dataInputService.meters$
      .pipe(
        //
        tap((m: number) => {
          // Get coordinates from CoordsManagementService
          let cordThun = this.coordsManagementService.getThunCoords();
          let cordAddis = this.coordsManagementService.getAddisCoords();
          let cordCapeTown = this.coordsManagementService.getCapeTownCoords();
          let normalizedTA = this.coordsManagementService.getNormalizedTA();
          let normalizedAC = this.coordsManagementService.getNormalizedAC();

          //1. Punkt in Thun mit Logo
          let point = new Point(cordThun);
          var featureLogo = new Feature({
            geometry: point,
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
          featureLogo.setStyle(iconStyleNexplore);

          //Point Jonas
          let pointJonas = new Point(cordAddis);
          var featureJonas = new Feature({
            geometry: pointJonas,
          });

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
          let pointFlags = new Point(cordCapeTown);
          var featureFlags = new Feature({
            geometry: pointFlags,
          });

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

          let point2Coords = [cordThun[0], cordThun[1]];
          console.log('Value of m');
          console.log(m);
          console.log(this.dataInputService.getFirstStage());



          let point2 = new Point(point2Coords);
          var feature2 = new Feature({
            geometry: point2,
          });

          var feature2 = new Feature({
            geometry: point2,
          });

          //Punkt für 2.Line
          if (m <= this.dataInputService.getFirstStage()) {
            //Line Thun - Addis
            point2Coords = [
              cordThun[0] + m * normalizedTA[0],
              cordThun[1] + m * normalizedTA[1],
            ];
          } else {
            point2Coords = [cordAddis[0], cordAddis[1]]
          }


          
          let lineString = new LineString([cordThun, point2Coords]);

          let lineFeature = new Feature({
            geometry: lineString,
          });

          let point3Coords = [cordAddis[0], cordAddis[1]];
          this.extentOfLineString = lineString.getExtent();
          lineFeature.setStyle(
            new Style({
              stroke: new Stroke({
                color: '#010100',
                width: 4,
              }),
            })
          );

          let lineStringDotTA = new LineString([cordThun, cordAddis]);

          let lineFeatureDotTA = new Feature({
            geometry: lineStringDotTA,
          });
          lineFeatureDotTA.setStyle(
            new Style({
              stroke: new Stroke({
                color: '#010100',
                width: 4,
                lineDash: [4,16]
              })
            })
          )

          let lineStringDotAC = new LineString([cordAddis, cordCapeTown]);

          let lineFeatureDotAC = new Feature({
            geometry: lineStringDotAC,
          });
          lineFeatureDotAC.setStyle(
            new Style({
              stroke: new Stroke({
                color: '#010100',
                width: 4,
                lineDash: [4,16]
              })
            })
          )
          

          let allFeatures = [
            lineFeature,
            feature2,
            featureFlags,
            featureJonas,
            featureLogo,
            lineFeatureDotTA,
            lineFeatureDotAC,
          ];

          if (m > this.dataInputService.getFirstStage()) {
            point2Coords = [cordAddis[0], cordAddis[1]]
            point3Coords = [
              cordAddis[0] +
                (m - this.dataInputService.getFirstStage()) * normalizedAC[0],
              cordAddis[1] +
                (m - this.dataInputService.getFirstStage()) * normalizedAC[1],
            ];

            let lineStringAC = new LineString([cordAddis, point3Coords]);

            let lineFeatureAC = new Feature({
              geometry: lineStringAC,
            });

            lineFeatureAC.setStyle(
              new Style({
                stroke: new Stroke({
                  color: '#010100',
                  width: 4,
                }),
              })
            );
            this.extentOfLineString = extend(
              this.extentOfLineString,
              lineStringAC.getExtent()
            );
            allFeatures.push(lineFeatureAC);
          }

          this.featureListBehaviorSubject.next(allFeatures);
        })
      )
      .subscribe();
  }
}
