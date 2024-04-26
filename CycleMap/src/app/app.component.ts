import { Component, OnInit } from '@angular/core';
import { Feature } from 'ol';
import Map from 'ol/Map';
import View from 'ol/View';
import { Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { Vector } from 'ol/source';
import OSM from 'ol/source/OSM';
import { DataInputService } from './services/dataInputService';
import { HttpClient } from '@angular/common/http';
import { filter, tap } from 'rxjs/operators';
import { transform } from 'ol/proj';
import {LineString} from 'ol/geom';
import {Vector as VectorSource} from 'ol/source';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { Coordinate } from 'ol/coordinate';
import {getDistance} from 'ol/sphere';
import Stroke from 'ol/style/Stroke';

let point2;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  providers:  [ DataInputService, HttpClient ]
})

export class AppComponent implements OnInit {
  map?: Map;
  //Thun -> Addis
  cordThun = [848077.086943238, 5898493.41929597];
  cordAddis = [4313733.731515491, 1009908.8055733215];
  vectorTA = [this.cordAddis[0]-this.cordThun[0], this.cordAddis[1]-this.cordThun[1]]
  distanceTA = getDistance(this.cordThun, this.cordAddis);
  normalizedVectorTA = [this.vectorTA[0]/this.distanceTA, this.vectorTA[1]/this.distanceTA];
  
  // Addis -> Cape Town
  cordCapeTown = [2057033.2407148802, -4075747.348106025];
  vectorAC = [this.cordCapeTown[0]-this.cordAddis[0], this.cordCapeTown[1]-this.cordAddis[1]]
  distanceAC = getDistance(this.cordAddis, this.cordCapeTown);
  normalizedVectorAC = [this.vectorAC[0]/this.distanceAC, this.vectorAC[1]/this.distanceAC];

  constructor(private dataInputService: DataInputService){}

  ngOnInit(): void {

    let cordThunTransformed = transform(this.cordThun, 'EPSG:3857', 'EPSG:4326');
    let cordAddisTransformed = transform(this.cordAddis, 'EPSG:3857', 'EPSG:4326');
    let cordCapeTownTransformed = transform(this.cordCapeTown, 'EPSG:3857', 'EPSG:4326');
    this.distanceTA = getDistance(cordThunTransformed, cordAddisTransformed);
    this.distanceAC = getDistance(cordAddisTransformed, cordCapeTownTransformed);

    this.dataInputService.refreshDistance();
    console.log("Distanz AC = ", this.distanceAC)
    console.log("Distanz TA = ", this.distanceTA)

    this.map = new Map({
      view: new View({
        center: [this.cordThun[0], this.cordThun[1] ],
        zoom: 15,    
      }),

      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'ol-map'
    });

    console.log("Test1")

    this.dataInputService.meters$.pipe(
      tap(m => console.log('DistanceService output:', m)),
      filter(m => m >= 0),
      tap(m => {
        //1. Punkt in Thun mit Logo
        let point = new Point(this.cordThun);
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
        let pointJonas = new Point(this.cordAddis)
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
        let pointFlags = new Point(this.cordCapeTown)
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
        let pointStartCoordinates = [this.cordThun[0], this.cordThun[1]];
        let pointStart = new Point(pointStartCoordinates);
        var featureLogo = new Feature({
          geometry: point
        });
        console.log("testtt")

        let distanceInKM = 5275917.396937822;
        let distanceInWeirdFormat = 16678977.626334907;
        m = m * (distanceInWeirdFormat / distanceInKM);
        //Line Thun - Addis
        let point2Coords = [this.cordThun[0]+(m*this.normalizedVectorTA[0]), this.cordThun[1]+(m*this.normalizedVectorTA[1])];

        let point2 = new Point(point2Coords);
        var feature2 = new Feature({
          geometry: point2
        });

        console.log("distance to THun",getDistance(point2Coords, this.cordThun))
        
        //Zoombereich = Punkt A -> Punkt B
        if(m <= 5000*1000){
          this.map?.getView().fit([Math.min(this.cordThun[0], point2Coords[0]), Math.min(this.cordThun[1], point2Coords[1]), 
          Math.max(this.cordThun[0], point2Coords[0]), Math.max(this.cordThun[1], point2Coords[1])], 
          {size: this.map.getSize(),
            padding: [200,200,200,200]
          });

        } else {
          this.map?.getView().fit([Math.min(point2Coords[0], this.cordCapeTown[0]), Math.min(point2Coords[1], this.cordCapeTown[1]), 
          Math.max(point2Coords[0], this.cordCapeTown[0]), Math.min(point2Coords[1], this.cordCapeTown[1])], 
          {size: this.map.getSize(),
            padding: [200,200,200,200] 
        });

      }


        console.log("point2Coords", point2Coords)
        let lineString = new LineString([this.cordThun, point2Coords]);

        let lineFeature = new Feature({
          geometry: lineString
        });

        let lineStringAC = new LineString([this.cordAddis, this.cordCapeTown]);

        let lineFeatureAC = new Feature({
          geometry: lineString
        });

        lineFeature.setStyle(new Style({
          stroke: new Stroke({
            color: '#010100',
            width: 4
          })
        }));

        var vectorLayer = new VectorLayer({
          source: new VectorSource({
            features: [featureStart, featureFlags, featureLogo, feature2, featureJonas, lineFeature, lineFeatureAC]
          })
        });
        console.log("testtt")
        console.log(this.map)
        this.map?.addLayer(vectorLayer);
      })


    ).subscribe();



    //Ausgabe der Koordinaten 
    this.map.on('singleclick', function (evt: { coordinate: Coordinate; }) {
      console.log(evt.coordinate);
      console.log(transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'));
    });
  }
}

