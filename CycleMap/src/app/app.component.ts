import { Component, OnInit } from '@angular/core';
import { Feature } from 'ol';
import Map from 'ol/Map';
import View from 'ol/View';
import { Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { Vector } from 'ol/source';
import OSM from 'ol/source/OSM';
import { DistanceService } from './services/distance.service';
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
  providers:  [ DistanceService, HttpClient ]
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
  cordCapeTown = [848077.086943238, 5898493.41929597];
  vectorAC = [this.cordAddis[0]-this.cordThun[0], this.cordAddis[1]-this.cordThun[1]]
  distanceAC = getDistance(this.cordThun, this.cordAddis);
  normalizedVectorAC = [this.vectorTA[0]/this.distanceAC, this.vectorTA[1]/this.distanceAC];

  constructor(private distanceService: DistanceService){}

  ngOnInit(): void {

    let cordThunTransformed = transform(this.cordThun, 'EPSG:3857', 'EPSG:4326');
    let cordAddisTransformed = transform(this.cordAddis, 'EPSG:3857', 'EPSG:4326');
    this.distanceTA = getDistance(cordThunTransformed, cordAddisTransformed);

    this.distanceService.refreshDistance();

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


    this.distanceService.meters$.pipe(
      tap(m => console.log('DistanceService output:', m)),
      filter(m => m > 0),
      tap(m => {
        let point = new Point(this.cordThun);
        var feature = new Feature({
          geometry: point
        });


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

        
        let pointStartCoordinates = [this.cordThun[0], this.cordThun[1]];
        let pointStart = new Point(pointStartCoordinates);
        var featureLogo = new Feature({
          geometry: point
        });


        let iconStyleLogo = new Style({
          image: new Icon({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'assets/images/Jonas.png',
            scale: 0.2,
          }),
        });
        featureLogo.setStyle(iconStyleLogo)


        let point2Coords = [this.cordThun[0]+(m*this.normalizedVectorTA[0]), this.cordThun[1]+(m*this.normalizedVectorTA[1])];
        let point2 = new Point(point2Coords);
        var feature2 = new Feature({
          geometry: point2
        });
        
        this.map?.getView().fit([Math.min(this.cordThun[0], point2Coords[0]), Math.min(this.cordThun[1], point2Coords[1]), 
        Math.max(this.cordThun[0], point2Coords[0]), Math.max(this.cordThun[1], point2Coords[1])], 
        {size: this.map.getSize(),
          padding: [200,200,200,200]
        });

        let lineString = new LineString([this.cordThun, point2.getCoordinates()]);

        let lineFeature = new Feature({
          geometry: lineString
        });

        lineFeature.setStyle(new Style({
          stroke: new Stroke({
            color: '#ff0000',
            width: 3
          })
        }));

        var vectorLayer = new VectorLayer({
          source: new VectorSource({
            features: [feature, feature2, featureJonas, lineFeature]
          })
        });
        console.log("testtt")
        console.log(this.map)
        this.map?.addLayer(vectorLayer);
      })


    ).subscribe();


    this.map.on('singleclick', function (evt: { coordinate: Coordinate; }) {
      console.log(evt.coordinate);
      console.log(transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'));
    });
  }
}