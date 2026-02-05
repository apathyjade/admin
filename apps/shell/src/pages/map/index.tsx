
import  maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";

var geojson = {
    "type": "FeatureCollection",
    "features": [
        // 示例数据点
        { "type": "Feature", "properties": { "intensity": 0.5 }, "geometry": { "type": "Point", "coordinates": [39, 116] } },
        { "type": "Feature", "properties": { "intensity": 0.7 }, "geometry": { "type": "Point", "coordinates": [65, 115] } }
        // 可以继续添加更多的点...
    ]
};

const MapPage = () => {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    let map = new maplibregl.Map({
        container: ref.current,
        // style: '/style/osm_liberty',
        style: {
            version: 8,
            sources: {
                'basemap-source': {
                    type: 'vector',
                    // tiles: ['http://localhost:3000/api/gis/tiles/{z}/{x}/{y}/tile.pbf'],
                    tiles: ['http://localhost:3000/tiles/{z}/{x}/{y}.pbf'],
                    minzoom: 0,
                    maxzoom: 14
                },
                'beijing-source': {
                    type: 'vector',
                    tiles: ['http://localhost:3000/tiles/output/{z}/{x}/{y}.mvt'],
                    minzoom: 0,
                    maxzoom: 14,
                    bounds: [115.3957595, 39.4318305, 117.526822, 116.38892799999999]
                },
                'heatmap-data': {
                    type: 'geojson',
                    data: geojson,
                }
            },
            layers: [
                // 水体
                {
                    id: 'water-fill',
                    type: 'fill',
                    source: 'basemap-source',
                    'source-layer': 'basemap',
                    filter: ['==', 'layer', 'water'],
                    paint: { 'fill-color': '#add8e6' }
                },
                // 陆地
                {
                    id: 'land-fill',
                    type: 'fill',
                    source: 'basemap-source',
                    'source-layer': 'basemap',
                    filter: ['==', 'layer', 'land'],
                    paint: { 'fill-color': '#e0d3c5' }
                },
                {
                    id: 'land-line',
                    type: 'line',
                    source: 'basemap-source',
                    'source-layer': 'basemap',
                    filter: ['==', 'layer', 'land'],
                    paint: { 'line-color': '#888', 'line-width': 0.5 }
                },
                // 海岸线
                // {
                //     id: 'coast-line',
                //     type: 'line',
                //     source: 'basemap-source',
                //     'source-layer': 'basemap',
                //     filter: ['==', 'layer', 'coast'],
                //     paint: { 'line-color': '#888', 'line-width': 0.5 }
                // },
                // 冰川
                // {
                //     id: 'ice-fill',
                //     type: 'fill',
                //     source: 'basemap-source',
                //     'source-layer': 'basemap',
                //     filter: ['==', 'layer', 'ice'], // ← 关键！
                //     paint: { 'fill-color': '#ffffff' }
                // },
                // {
                //     id: 'ice-line',
                //     type: 'line',
                //     source: 'basemap-source',
                //     'source-layer': 'basemap',
                //     filter: ['==', 'layer', 'ice'], // ← 关键！
                //     paint: { 'line-color': '#888', 'line-width': 0.5 }
                // },
                // 冰川线
                // {
                //     id: 'ice-line',
                //     type: 'line',
                //     source: 'basemap-source',
                //     'source-layer': 'basemap',
                //     filter: ['==', 'layer', 'ice-outline'],
                //     paint: { 'line-color': '#888', 'line-width': 0.5 }
                // },
                
                {
                    id: 'beijing-line',
                    type: 'line',
                    source: 'beijing-source',
                    'source-layer': 'line',
                    paint: { 'line-color': '#666', 'line-width': .5, "line-opacity": .6 },
                },
                {
                    id: 'poi-labels',
                    type: 'symbol',
                    source: 'beijing-source',
                    'source-layer': 'point', // 必须指定矢量瓦片中的图层名
                    layout: {
                        'text-field': ['get', 'name'],
                        'text-font': ['Open Sans Regular'],
                        'text-size': 12
                    },
                    paint: {
                        'text-color': '#ff0000',
                        "text-opacity": .9
                    }
                },
                {
                    id: 'beijing-point',
                    type: 'circle',
                    source: 'beijing-source',
                    'source-layer': 'point',
                    paint: { 'circle-color': '#f50', 'circle-radius': 5, "circle-opacity": .8 },
                },
                {
                    id: 'heatmap-layer',
                    type: 'heatmap',
                    source: 'heatmap-data',
                    paint: {
                    // 热力图权重基于属性'intensity'
                    'heatmap-weight': ['get', 'intensity'],
                    'heatmap-intensity': 1,
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0, 'rgba(33,102,172,0)',
                        0.2, 'rgb(103,169,207)',
                        0.4, 'rgb(209,229,240)',
                        0.6, 'rgb(253,219,199)',
                        0.8, 'rgb(239,138,98)',
                        1, 'rgb(178,24,43)'
                    ],
                    'heatmap-radius': 10,
                    'heatmap-opacity': 0.9
                }
                }
            ]
        },
        center: [115.3132, 39.63986],
    zoom: 4
    });
    map.on('load', function () { 
        // map.addLayer({
        //     id: 'debug-all',
        //     type: 'fill',
        //     source: 'basemap-source',
        //     'source-layer': 'basemap',
        //     paint: { 'fill-color': 'rgba(255, 0, 0, 0.5)' }
        // });
        window.__map = map;
    });
    
  }, [ref.current]);
  return (
    <div style={{ height: '560px'}} ref={ref} id="map" />
  )
};
export default MapPage;