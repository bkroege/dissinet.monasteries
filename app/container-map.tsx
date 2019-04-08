import React from "react";
import { observer } from "mobx-react";
import * as d3 from "d3";

import L from "leaflet";
import {
  Map,
  LayerGroup,
  TileLayer,
  WMSTileLayer,
  GeoJSON,
  Pane,
  CircleMarker,
  ScaleControl,
  AttributionControl,
  Marker,
  Popup,
  Tooltip
} from "react-leaflet";

import "leaflet.markercluster";
import "leaflet.markercluster.placementstrategies";
import MarkerClusterGroup from "react-leaflet-markercluster";

const pie = d3.pie().value(function(d) {
  return d.number;
});

const arc = radius =>
  d3
    .arc()
    .outerRadius(radius)
    .innerRadius(0);

const now = () => {
  const d = new Date();
  return d.valueOf();
};

const radius = 15;
const m = 1.5;
const svgSize = (radius + m) * 2;

@observer
export default class ContainerMap extends React.Component<any, any> {
  refs;
  props;
  mapEl;
  markerClusterEl;
  markerClusters;

  processed;

  constructor(props: any) {
    super(props);
    this.markerClusterEl = React.createRef();
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidMount() {
    this.mapEl = this.refs["map"].leafletElement;

    this.props.store.mapMoved(
      this.props.center,
      this.props.zoom,
      this.mapEl.getBounds()
    );

    this.markerClusters = L.markerClusterGroup({
      showCoverageOnHover: false,
      firstCircleElements: 6,
      clockHelpingCircleOptions: {
        weight: 0.7,
        opacity: 1,
        color: "black",
        fillOpacity: 0,
        dashArray: "10 5",
        transform: "translateY(-10px)"
      },
      spiderfyDistanceSurplus: 35,
      zoomToBoundsOnClick: true,
      removeOutsideVisibleBounds: true,
      elementsPlacementStrategy: "clock-concentric",
      iconCreateFunction: this.clusterMarkerIcon.bind(this),
      animate: false,
      singleMarkerMode: true,
      spiderLegPolylineOptions: { weight: 0 }
    });
    this.markerClusters.addTo(this.mapEl);

    this.update();
  }

  componentDidUpdate() {
    this.update();
    this.loadClusters();
  }

  loadClusters() {
    const data = this.points();

    this.markerClusters.clearLayers();
    this.markerClusters.addLayers(this.points());
  }

  points() {
    return this.props.activeData.map((feature, ri) => {
      return L.marker(feature.geo, {
        fillOpacity: 1,
        weight: 0,
        radius: 10,
        data: feature
      }).bindPopup("<p>" + feature.data.name + "</p>");
    });
  }

  makeClusterGroupRef(el) {
    this.markerClusterEl = el;
  }

  clusterMarkerIcon(cluster) {
    this.processed = this.processed + 1;
    const markers = cluster.getAllChildMarkers();
    const orders = this.props.store.orders;
    const single = markers.length === 1;
    const ordersInCluster = {};

    markers.forEach(marker => {
      const orderNames = marker.options.data.data.orders.map(o => o.name);
      orderNames.forEach(oName => {
        const orderName = orders.find(o =>
          o.names.includes(oName.toLowerCase())
        ).name;
        if (
          !ordersInCluster[orderName] &&
          this.props.store.activeOrdersNames.includes(orderName.toLowerCase())
        ) {
          ordersInCluster[orderName] = true;
        }
      });
    });

    const arcs = pie(
      Object.keys(ordersInCluster).map(order => {
        return { name: order.toLowerCase(), number: 1 };
      })
    );

    const svgEl = document.createElement("svg");
    svgEl.setAttribute("id", "pie" + cluster._leaflet_id);

    const svg = d3
      .select(svgEl)
      .attr("width", svgSize)
      .attr("height", svgSize)
      .append("g")
      .attr("transform", "translate(" + svgSize / 2 + ", " + svgSize / 2 + ")");

    svg.append("circle").attr("r", radius + m);

    const g = svg
      .selectAll("arc")
      .data(arcs)
      .enter()
      .append("g")
      .style("fill", d => {
        const order = orders.find(o => o.names.includes(d.data.name));
        return order ? order.color : "grey";
      })
      .style("stroke", "black")
      .attr("class", "arc");

    svg.append("circle").attr("r", 2 + (radius + m) / 2);

    g.append("path").attr("d", arc(radius));

    svg
      .append("text")
      .text(markers.length)
      .style("fill", "white")
      .attr("class", "cluster-text")
      .attr("dy", 4);

    return L.divIcon({
      html: svgEl.outerHTML,
      className: "marker-icon " + (single ? "marker-single" : "marker-cluster"),
      iconSize: L.point(radius * 2, radius * 2)
    });
  }

  update() {}

  handleMapMove(e) {
    if (this.mapEl) {
      this.props.store.mapMoved(e.center, e.zoom, this.mapEl.getBounds());
    }
  }

  render() {
    this.t1 = now();
    this.processed = 0;
    const store = this.props.store;
    return (
      <div className="map">
        <Map
          style={{ height: "100%" }}
          onViewportChanged={this.handleMapMove.bind(this)}
          ref="map"
          className="component-map"
          attributionControl={false}
          zoom={store.zoom}
          center={store.center}
          maxZoom={10}
        >
          <ScaleControl position="topleft" imperial={false} />
          <AttributionControl position="bottomleft" />
          <TileLayer
            url="http://a.tiles.mapbox.com/v3/isawnyu.map-knmctlkh/{z}/{x}/{y}.png"
            attribution="<a href='http://awmc.unc.edu/wordpress/'>awmc</a>"
            className="map-base-layer-awmc"
          />
        </Map>
      </div>
    );
  }
}
