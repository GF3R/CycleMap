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
import { filter, map, tap } from 'rxjs/operators';
import { transform } from 'ol/proj';
import { Vector as VectorSource } from 'ol/source';
import { Coordinate } from 'ol/coordinate';
import { Geometry } from 'ol/geom';

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
  vectorLayer?: VectorLayer<VectorSource<Feature<Geometry>>>;

  constructor(
    private dataInputService: DataInputService,
    private coordsManagementService: CoordsManagementService,
    private featuresService: FeaturesService
  ) {}

  ngOnInit(): void {
    this.featuresService.featureList$
      .pipe(
        tap((featureList: Feature[]) => {
          this.vectorLayer?.getSource()?.clear();
          this.vectorLayer?.getSource()?.addFeatures(featureList);
          this.map?.getView().fit(this.featuresService.extentOfLineString, {
            padding: [100, 100, 100, 100],
          });
        })
      )
      .subscribe();

    this.vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [],
      }),
    });

    let cordThun = this.coordsManagementService.getThunCoords();
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

    this.map?.addLayer(this.vectorLayer);

    this.dataInputService.refreshDistance();
  }
}
