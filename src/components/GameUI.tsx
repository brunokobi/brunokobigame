import React, { useEffect } from "react";
import { loadModules, setDefaultOptions } from "esri-loader";

setDefaultOptions({ css: true });

interface PointAddNewProps {}

const PointAddNew: React.FC<PointAddNewProps> = () => {
  const styles: {
    container: React.CSSProperties;
    mapDiv: React.CSSProperties;
  } = {
    container: {
      height: "70vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    mapDiv: {
      marginTop: "10px",
      height: "78vh",
      width: "80vh",
      borderRadius: "10px",
    },
  };

  useEffect(() => {
    let view: __esri.SceneView;

    loadModules([
      "esri/config",
      "esri/Map",
      "esri/views/SceneView",
      "esri/layers/TileLayer",
      "esri/layers/GeoJSONLayer",
      "esri/Basemap",
      "esri/layers/ElevationLayer",
      "esri/layers/BaseElevationLayer",
      "esri/Graphic",
      "esri/geometry/Point",
      "esri/geometry/Mesh",
      "esri/core/watchUtils",
    ])
      .then(
        ([
          esriConfig,
          Map,
          SceneView,
          TileLayer,
          ,
          Basemap,
          ElevationLayer,
          BaseElevationLayer,
          Graphic,
          Point,
          Mesh,
          watchUtils,
        ]) => {
          esriConfig.apiKey = process.env.REACT_APP_ESRI_API_KEY as string;

          const R = 6358137;
          const offset = 300000;

          const ExaggeratedElevationLayer =
            BaseElevationLayer.createSubclass({
              properties: {
                exaggerationTopography: null,
                exaggerationBathymetry: null,
              },

              load: function (this: any) {
                this._elevation = new ElevationLayer({
                  url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/TopoBathy3D/ImageServer",
                });

                this.addResolvingPromise(this._elevation.load());
              },

              fetchTile: function (
                this: any,
                level: number,
                row: number,
                col: number
              ) {
                return this._elevation
                  .fetchTile(level, row, col)
                  .then((data: any) => {
                    for (let i = 0; i < data.values.length; i++) {
                      if (data.values[i] >= 0) {
                        data.values[i] =
                          data.values[i] * this.exaggerationTopography;
                      } else {
                        data.values[i] =
                          data.values[i] * this.exaggerationBathymetry;
                      }
                    }
                    return data;
                  });
              },
            });

          const basemap = new Basemap({
            baseLayers: [
              new TileLayer({
                url: "https://tiles.arcgis.com/tiles/nGt4QxSblgDfeJn9/arcgis/rest/services/terrain_with_heavy_bathymetry/MapServer",
              }),
            ],
          });

          const map = new Map({
            basemap,
            ground: {
              layers: [
                new ExaggeratedElevationLayer({
                  exaggerationBathymetry: 60,
                  exaggerationTopography: 40,
                }),
              ],
            },
          });

          view = new SceneView({
            container: "viewDiv",
            map,
            alphaCompositingEnabled: true,
            qualityProfile: "high",
            camera: {
              position: [-55.03975781, 14.94826384, 19921223.30821],
              heading: 2.03,
              tilt: 0.13,
            },
            environment: {
              background: {
                type: "color",
                color: [255, 252, 244, 0],
              },
              starsEnabled: false,
              atmosphereEnabled: false,
            },
          });

          const origin = new Point({
            x: 0,
            y: -90,
            z: -(2 * R),
          });

          const oceanSurfaceMesh = Mesh.createSphere(origin, {
            size: {
              width: 2 * R,
              depth: 2 * R,
              height: 2 * R,
            },
            densificationFactor: 5,
            material: {
              color: [0, 210, 210, 0.8],
              metallic: 0.9,
              roughness: 0.8,
            },
          });

          const oceanSurface = new Graphic({
            geometry: oceanSurfaceMesh,
            symbol: {
              type: "mesh-3d",
              symbolLayers: [{ type: "fill" }],
            },
          });

          view.graphics.add(oceanSurface);

          const cloudsSphere = Mesh.createSphere(
            new Point({
              x: 0,
              y: -90,
              z: -(2 * R + offset),
            }),
            {
              size: 2 * (R + offset),
              material: {
                colorTexture:
                  "https://raw.githubusercontent.com/RalucaNicola/the-globe-of-extremes/master/clouds-nasa.png",
              },
              densificationFactor: 4,
            }
          );

          cloudsSphere.components[0].shading = "flat";

          const clouds = new Graphic({
            geometry: cloudsSphere,
            symbol: {
              type: "mesh-3d",
              symbolLayers: [{ type: "fill" }],
            },
          });

          view.graphics.add(clouds);

          const isPlaying = true;

          view.when(() => {
            watchUtils.whenFalseOnce(view, "updating", rotate);
          });

          function rotate() {
            if (isPlaying) {
              const camera = view.camera.clone();
              camera.position.longitude -= 0.2;
              view.goTo(camera, { animate: false });
              requestAnimationFrame(rotate);
            }
          }
        }
      )
      .catch((err) => console.error(err));

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return (
    <div style={styles.container}>
      <div id="viewDiv" style={styles.mapDiv}></div>
    </div>
  );
};

export { PointAddNew };
