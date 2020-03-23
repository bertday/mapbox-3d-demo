import * as three from 'three';
import mapboxgl from 'mapbox-gl';
import ThreeObjLoader from './ThreeObjLoader';

class LayerManager {
  getMapboxBuildingsLayer() {
    // this returns a config object for mapbox extruded buildings
    // TODO there are some hard-coded values in here that could be parametrized
    return {
      'id': '3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 15,
      'paint': {
        // fade extrusion color out on zoom out (for visual effect)
        'fill-extrusion-color': [
          'interpolate',
          ['exponential', 0.5],
          ['zoom'],
          15,
          '#777',
          22,
          '#ff938c'
        ],
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'height'],
        ],
        'fill-extrusion-base': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'min_height'],
        ],
        'fill-extrusion-opacity': 0.6,
      },
    };
  }

  getCustomObjLayer(options) {
    /*
    OPTIONS
    - id (string):        the string id for the map layer
    - filePath (string):  the path to the obj file
    - origin (array):     lon/lat coords for the location of the building
    - scale (float):      scale factor for building object
    */

    // this code is based on the mapbox gl example for adding a custom 3d model
    // and has been modified to replicate the approx. location and dimensions
    // of the aon center building in downtown chicago.
    // see: https://docs.mapbox.com/mapbox-gl-js/example/add-3d-model/

    const modelOrigin = options.origin;
    const modelAltitude = 0;
    const modelRotate = [Math.PI / 2, 0, 0];

    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude,
    );

    const scaleMercator = (
      modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
      *
      options.scale
    )

    const modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      scale: scaleMercator,
    };

    const camera = new three.Camera();
    const scene = new three.Scene();
    let renderer;

    const customLayer = {
      id: options.id,
      type: 'custom',
      renderingMode: '3d',
      onAdd: (map, gl) => {
        const directionalLight = new three.DirectionalLight(0xffffff);
        directionalLight.position.set(0, -70, 100).normalize();
        scene.add(directionalLight);

        const directionalLight2 = new three.DirectionalLight(0xffffff);
        directionalLight2.position.set(0, 70, 100).normalize();
        scene.add(directionalLight2);

        const loader = new ThreeObjLoader();
        loader.load(
          options.filePath,
          (obj) => {
            scene.add(obj);
          }
        );

        renderer = new three.WebGLRenderer({
          canvas: map.getCanvas(),
          context: gl,
          antialias: true,
        });

        renderer.autoClear = false;
      },
      render: (gl, matrix) => {
        const rotationX = new three.Matrix4().makeRotationAxis(
          new three.Vector3(0.9, 0, 0),
          modelTransform.rotateX
        );
        const rotationY = new three.Matrix4().makeRotationAxis(
          new three.Vector3(0, 1, 0),
          modelTransform.rotateY
        );
        const rotationZ = new three.Matrix4().makeRotationAxis(
          new three.Vector3(0, 0, 1),
          modelTransform.rotateZ
        );

        const m = new three.Matrix4().fromArray(matrix);
        const l = new three.Matrix4()
          .makeTranslation(
            modelTransform.translateX,
            modelTransform.translateY,
            modelTransform.translateZ
          )
          .scale(
            new three.Vector3(
              modelTransform.scale,
              -modelTransform.scale,
              modelTransform.scale
            )
          )
          .multiply(rotationX)
          .multiply(rotationY)
          .multiply(rotationZ);

        camera.projectionMatrix = m.multiply(l);
        renderer.state.reset();
        renderer.render(scene, camera);
      }
    };

    return customLayer;
  }
}

export default LayerManager;
