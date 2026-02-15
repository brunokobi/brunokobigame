import React, { useEffect } from "react";
import { loadModules, setDefaultOptions } from "esri-loader";


setDefaultOptions({ css: true });

interface PointAddProps {
  longitude: number;
  latitude: number;
  name?: string;
  description?: string;
  zoom?: number;
  duration?: number;
}

const PointAdd: React.FC<PointAddProps> = (props) => {
  const styles: {
    container: React.CSSProperties;
    mapDiv: React.CSSProperties;
  } = {
    container: {
      height: "70vh",
    },
    mapDiv: {
      height: "69vh",
      border: "1px solid #42c920",
      background: "transparent",
      borderRadius: "5px",
    },
  };

  useEffect(() => {
    loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/Graphic",
      "esri/symbols/WebStyleSymbol",
      "esri/widgets/Legend",
      "esri/WebMap",
    ])
      .then(([Map, MapView, Graphic]) => {
        const map = new Map({ basemap: "hybrid" });

        const view = new MapView({
          container: "viewDiv",
          map,
          zoom: 4,
          center: [0, 0],
        });

        const point: __esri.PointProperties = {
          type: "point",
          longitude: props.longitude,
          latitude: props.latitude,
        };

        const ovni: __esri.PictureMarkerSymbolProperties = {
          type: "picture-marker",
          url: "https://media.tenor.com/j91H7eyBWEcAAAAi/flying-saucer-joypixels.gif",
          width: "40px",
          height: "40px",
        };

        const popupTemplate: __esri.PopupTemplateProperties = {
          title: "{Name}",
          content: "{Description}",
        };

        const attributes = {
          Name: props.name ? "Local: " + props.name : "Novo Ponto",
          Description:
            (props.description ?? "") +
            "<br><br>" +
            "Latitude: " +
            props.latitude +
            "<br>" +
            "Longitude: " +
            props.longitude,
        };

        const graphic = new Graphic({
          geometry: point,
          symbol: ovni,
          attributes,
          popupTemplate,
        });

        const opts = {
          duration: props.duration ?? 2000,
        };

        if (
          props.longitude !== 0 &&
          props.latitude !== 0 &&
          props.name
        ) {
          view.graphics.add(graphic);

          view.goTo(
            {
              target: graphic,
              zoom: props.zoom ?? 16,
            },
            opts
          );
        }
      })
      .catch((err) => console.error(err));

     
  }, [
    props.longitude,
    props.latitude,
    props.name,
    props.description,
    props.zoom,
    props.duration,
  ]);

  return (
    <div style={styles.container}>      
      <div id="viewDiv" style={styles.mapDiv}></div>
    </div>
  );
};

export { PointAdd };
