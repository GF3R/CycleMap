import { Component, OnInit } from '@angular/core';
import { Feature } from 'ol';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import { DataInputService } from './services/dataInputService';
import { CoordsManagementService } from './services/coordsManagementService';
import { FeaturesService } from './services/featureService';
import { HttpClient } from '@angular/common/http';
import { filter, tap } from 'rxjs/operators';
import { transform } from 'ol/proj';
import { Vector as VectorSource } from 'ol/source';
import { Coordinate } from 'ol/coordinate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  providers: [
    DataInputService,
    CoordsManagementService,
    FeaturesService,
    HttpClient,
  ],
})
export class AppComponent implements OnInit {
  map?: Map;

  constructor(
    private dataInputService: DataInputService,
    private coordsManagementService: CoordsManagementService,
    private featuresService: FeaturesService
  ) {}

  ngOnInit(): void {
    this.dataInputService.refreshDistance();
    this.coordsManagementService.getNormalizedTA();

    let cordThun = this.coordsManagementService.getThunCoords();
    let cordCapeTown = this.coordsManagementService.getCapeTownCoords();
    let normalizedTA = this.coordsManagementService.getNormalizedTA();
    let normalizedAC = this.coordsManagementService.getNormalizedAC();

    this.dataInputService.meters$.subscribe((m) => {
      let point2Coords = [
        cordThun[0] + m * normalizedTA[0],
        cordThun[1] + m * normalizedTA[1],
      ];

      console.log('m is');
      console.log(m);

      this.map = new Map({
        view: new View({
          center: [cordThun[0], cordThun[1]],
          zoom: 15,
        }),

        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        target: 'ol-map',
      });

      //Zoombereich = Punkt A -> Punkt B
      if (m <= 5275.9 * 1000) {
        this.map
          ?.getView()
          .fit(
            [
              Math.min(cordThun[0], point2Coords[0]),
              Math.min(cordThun[1], point2Coords[1]),
              Math.max(cordThun[0], point2Coords[0]),
              Math.max(cordThun[1], point2Coords[1]),
            ],
            { size: this.map.getSize(), padding: [200, 200, 200, 200] }
          );
      } else {
        this.map
          ?.getView()
          .fit(
            [
              Math.min(point2Coords[0], cordCapeTown[0]),
              Math.min(point2Coords[1], cordCapeTown[1]),
              Math.max(point2Coords[0], cordCapeTown[0]),
              Math.min(point2Coords[1], cordCapeTown[1]),
            ],
            { size: this.map.getSize(), padding: [200, 200, 200, 200] }
          );
      }

      this.featuresService.featureList$.subscribe((featureList: Feature[]) => {
        var vectorLayer = new VectorLayer({
          source: new VectorSource({
            features: featureList,
          }),
        });
        console.log(featureList);
        console.log(this.map);
        console.log(featureList);
        this.map?.addLayer(vectorLayer);
      });
    });

    // Ausgabe der Koordinaten
    // this.map.on('singleclick', function (evt: { coordinate: Coordinate; }) {
    //   console.log(evt.coordinate);
    //   console.log(transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'));
    // });
  }
}
