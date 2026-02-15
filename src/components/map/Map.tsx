import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

const styles: {
  container: React.CSSProperties;
  mapDiv: React.CSSProperties;
} = {
  container: {
    height: "567px",
  },
  mapDiv: {
    height: "100%",
  },
};

const Map: React.FC = () => {
  const mapDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let view: __esri.MapView;

    loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/Graphic",
    ]).then(
      ([
        Map,
        MapView,
        FeatureLayer,
        Graphic,
      ]: [
        typeof import("@arcgis/core/Map"),
        typeof import("@arcgis/core/views/MapView"),
        typeof import("@arcgis/core/layers/FeatureLayer"),
        typeof import("@arcgis/core/Graphic")
      ]) => {

        if (!mapDivRef.current) return;

        const map = new Map({
          basemap: "hybrid",
        });

        view = new MapView({
          container: mapDivRef.current,
          map,
          zoom: 4,
          center: [0, 0],
        });

        const polygon: __esri.PolygonProperties = {
          type: "polygon",
          rings: [
            [-40.29003, -20.31573],
            [-40.28995, -20.31557],
            [-40.28957, -20.31572],
            [-40.28964, -20.31588],
            [-40.29003, -20.31573],
          ],
        };

        const point: __esri.PointProperties = {
          type: "point",
          longitude: -40.29003,
          latitude: -20.31573,
        };

        const simboloPadrao: __esri.SimpleMarkerSymbolProperties = {
          type: "simple-marker",
          path: "M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z",
          color: "red",
          size: 24,
        };

        const rendererPoint: __esri.UniqueValueRendererProperties = {
          type: "unique-value",
          field: "activity_type",
          defaultSymbol: simboloPadrao,
        };

        const labelSymbol: __esri.TextSymbolProperties = {
          type: "text",
          color: "#ffffff",
          font: {
            family: "Arial",
            size: 12,
            weight: "normal",
          },
          haloColor: "#000000",
          haloSize: 2,
        };

        const pointLabelClass: __esri.LabelClassProperties = {
          symbol: labelSymbol,
          labelPlacement: "below-center",
          labelExpressionInfo: {
            expression: "return 'Ambipar'",
          },
        };

        const fillSymbol: __esri.SimpleFillSymbolProperties = {
          type: "simple-fill",
          color: [0, 183, 235, 0.1],
          outline: {
            color: [255, 255, 0],
            width: 1,
          },
        };

        const popupTemplate: __esri.PopupTemplateProperties = {
          title: "Ambipar Orbit - Base",
          content: "Ambipar Orbit - Base",
        };

        const graphic2 = new Graphic({
          geometry: polygon,
          symbol: fillSymbol,
        });

        const graphic = new Graphic({
          geometry: point,
          symbol: simboloPadrao,
        });

        const layer = new FeatureLayer({
          title: "Empreendimentos (Pontos)",
          source: [graphic],
          objectIdField: "ObjectID",
          geometryType: "point",
          outFields: ["*"],
          spatialReference: { wkid: 4326 },
          renderer: rendererPoint,
          labelingInfo: [pointLabelClass],
          popupTemplate,
          labelsVisible: true,
        });

        map.add(layer);
        view.graphics.add(graphic2);

        view.goTo(
          {
            target: [-40.29003, -20.31573],
            zoom: 16,
          },
          { duration: 3000 }
        );
      }
    );

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return (
    <div className="card-body">
      <div style={styles.container}>
        <div ref={mapDivRef} style={styles.mapDiv} />
      </div>
    </div>
  );
};

export default Map;
