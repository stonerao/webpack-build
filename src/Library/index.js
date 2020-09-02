import '../style/index.css'

import * as THREE from 'three';
import OrbitControls from '../libs/OrbitControls';
import $ from 'jquery';
window.THREE = THREE;
window.$ = $;
OrbitControls(THREE);
