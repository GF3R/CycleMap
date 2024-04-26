import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import { Vector } from 'ol/source';
import { DataInputService } from './services/dataInputService';
import { transform } from 'ol/proj';
import {LineString} from 'ol/geom';
import {Vector as VectorSource} from 'ol/source';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { Coordinate } from 'ol/coordinate';
import {getDistance} from 'ol/sphere';
import Stroke from 'ol/style/Stroke';
import { getVectorContext } from 'ol/render';


 //Thun -> Addis
 let cordThun = [848077.086943238, 5898493.41929597];
 let cordAddis = [4313733.731515491, 1009908.8055733215];
 let vectorTA = [cordAddis[0]-cordThun[0], cordAddis[1]-cordThun[1]]
 let distanceTA = getDistance(cordThun, cordAddis);
 let normalizedVectorTA = [vectorTA[0]/distanceTA, vectorTA[1]/distanceTA];

 let vectorTa = getVector[cordThun, cordAddis];
 
 // Addis -> Cape Town
 let cordCapeTown = [2057033.2407148802, -4075747.348106025];
 let vectorAC = [cordCapeTown[0]-cordAddis[0], cordCapeTown[1]-cordAddis[1]]
 let distanceAC = getDistance(cordAddis, cordCapeTown);
 let normalizedVectorAC = [vectorAC[0]/distanceAC, vectorAC[1]/distanceAC];