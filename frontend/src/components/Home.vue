<template>
  <div>
    <div class="map">
      <gmap-map
        ref="map"
        :center="mapCenter"
        :zoom="15"
        @center_changed="mapCenterChanged"
        style="width: 100%; height: 100%"
      >
        <gmap-marker
          v-for="item in stationsCloseToMapCenter"
          v-bind:key="item.station.name"
          :position="toGMapCoord(item.station.coordinate)"
          :clickable="true"
          :icon="{
            url: '/static/img/icons/station.svg',
          }"
          :label="{
            text: `${item.station.availableBikes}`,
            color: '#FFFFFF',
            fontSize: '20px',
            fontWeight: 'bold'
          }"
        >
        </gmap-marker>
        <gmap-marker
          ref="currentPositionMarker"
          v-if="position"
          :position="position"
          :icon="{
            url: '/static/img/icons/marker.svg',
            anchor: { x: 56, y: 56 }
          }"
        >
        </gmap-marker>
        <gmap-circle :center="position" :radius="5">
        </gmap-circle>
      </gmap-map>
    </div>
    <div :class="[(focus == 'map' ? 'disable' : 'active'), 'stationListContainer']">
      <div class="stationListTopMargin"
           @mouseover="activateMap()"
           @touchstart="activateMap()">
      </div>
      <div class="stationList"
           @mouseover="activateList()"
           @touchstart="activateList()">
        <div class="stationListHeader">
          <div class="listTitle">내 주변</div>
          <div class="description">
            <div>
              <span v-if="position">
                {{ position.lng.toFixed(4) }},
                {{ position.lat.toFixed(4) }}
              </span>
              <span v-if="!position">
                위치 확인중...
              </span>
            </div>
            <div>
              <span class="updateIndicator"></span>
              <span>{{ this.allStationsMeta.createdAt | fromNow }}</span>
            </div>
          </div>
        </div>
        <div class="stationListBody">
          <div class="stationListItem"
               v-for="item in stationsCloseToMe"
               :key="item.station.name"
               @click="currentMapCenter = mapCenter = toGMapCoord(item.station.coordinate)">
            <div class="name" >
              {{ item.station.name }}
            </div>
            <div class="distance">
              {{ item.distance | meterUnit }}
            </div>
            <div class="availableBikes">
              {{ item.station.availableBikes }}<span class="unit">대</span>
            </div>
            <div class="bookmark">
              {{ item.station.bookmark }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash';
import Vue from 'vue';
import * as geolib from 'geolib';
import * as axios from 'axios';
import * as moment from 'moment';
import { setInterval } from 'timers';

// Seoul City Hall
const DEFAULT_POSITION = { lat: 37.566701, lng: 126.978428 };

function getDistance(a, b) {
  return geolib.getDistance(
    { latitude: a.latitude || a.lat, longitude: a.longitude || a.lng },
    { latitude: b.latitude || b.lat, longitude: b.longitude || b.lng },
  );
}

export default {
  name: 'Home',
  created() {
    // UI setting
    this.focus = "map";

    // Remote data
    this.allStations = [];
    this.allStationsMeta = { createdAt: null };

    // Fetch Stations
    axios.get("https://s3.ap-northeast-2.amazonaws.com/seoul-bike-prod/stations.json")
      .then(({ data }) => {
        this.allStations = data.stations;
        this.allStationsMeta = { createdAt: data.meta.createdAt };

        this.computeStationsCloseToMapCenter();
      });

    // user position
    this.position = this.getLastPosition(); // || DEFAULT_POSITION;

    // Map Setting
    if (this.position) {
      this.mapCenter = this.position;
    } else {
      // Seoul City Hall
      this.mapCenter = DEFAULT_POSITION;
    }
    this.lastCalCenter = this.mapCenter;

    // Stations
    this.stationsCloseToMapCenter = [];

    // Start Updating Position
    let updateCount = 0;
    navigator.geolocation.watchPosition(
      (raw) => {
        // console.log("RAW", raw);
        const position = {
          accuracy: raw.coords.accuracy,
          lat: raw.coords.latitude,
          lng: raw.coords.longitude,
          speed: raw.coords.speed,
        };
        this.setLastPosition(position);
        this.position = position;

        if (updateCount === 0) {
          // Move to currentPosition
          this.mapCenter = this.position;
        }
        updateCount++;
      }, (error) => {
        // window.alert(`Error : ${JSON.stringify(error)}`);
      }, {
        enableHighAccuracy: false,
        maximumAge: 30 * 1000,
      });
  },
  mounted() {
    console.log(window.google);
    console.log(this.$refs.currentPositionMarker);

    // setInterval(() => {
    //   if (this.$refs.currentPositionMarker) {
    //     this.$refs.currentPositionMarker.$markerObject.anchorPosition = { x:}
    //   }
    //   console.log(this.$refs.currentPositionMarker.$markerObject)
    // }, 100);
  },
  filters: {
    meterUnit(distance) {
      if (distance < 1000) {
        return `${distance}m`;
      } else {
        return `${(distance / 1000).toFixed(2)}km`;
      }
    },
    fromNow(timestamp) {
      return moment(timestamp).fromNow();
    },
  },
  methods: {
    toGMapCoord(coordinate) {
      return {
        lat: coordinate.latitude,
        lng: coordinate.longitude,
      }
    },
    distanceToMe(coordinate) {
      return getDistance(
        this.position,
        coordinate
      );
    },
    setLastPosition(position) {
      localStorage.setItem("Home-LastLocation-v4", JSON.stringify(position));
    },
    getLastPosition() {
      const raw = localStorage.getItem("Home-LastLocation-v4");
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch (e) {
          return null;
        }
      } else {
        return null;
      }
    },
    activateMap() {
      this.focus = "map";
    },
    activateList() {
      this.focus = "list";
    },

    mapCenterChanged(newCenter) {
      newCenter = {
        lat: newCenter.lat(),
        lng: newCenter.lng(),
      };

      if (!this.lastCalCenter) {
        this.lastCalCenter = newCenter;
      } else {
        const distance = getDistance(this.lastCalCenter, newCenter);
        if (distance > 100) {
          this.lastCalCenter = newCenter;
          this.computeStationsCloseToMapCenter();
        }
      }

      this.currentMapCenter = newCenter;
    },

    computeStationsCloseToMapCenter() {
      if (!this.debouncer) {
        this.debouncer = _.debounce(() => {
          this.stationsCloseToMapCenter =
            _(this.allStations)
              .map(station => {
                return {
                  station,
                  distance: getDistance(this.lastCalCenter, station.coordinate),
                }
              })
              .sortBy(item => item.distance)
              .take(128)
              .value();
        }, 250);
      }
      this.debouncer();
    }
  },
  computed: {
    stationsCloseToMe() {
      return _(this.allStations)
        .map(station => {
          return {
            station,
            distance: getDistance(this.position || DEFAULT_POSITION, station.coordinate),
          }
        })
        .sortBy(item => item.distance)
        .take(36)
        .value();
    },
  },
  data() {
    return {
      focus: this.focus,

      position: this.position,

      allStations: this.allStations,
      allStationsMeta: this.allStationsMeta,

      mapCenter: this.mapCenter,
      currentMapCenter: this.currentMapCenter,
      lastCalCenter: this.lastCalCenter,

      stationsCloseToMapCenter: this.stationsCloseToMapCenter,
    }
  }
}
</script>

<style lang="scss">
$highlightColor: #FF6E30;


.map {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.stationListContainer {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: scroll;

  &.disable {
    pointer-events: none;
  }
  &.active {

  }
  // background-color: rgba(0, 0, 0, 0.15);
}

.stationListTopMargin {
  height: 70%;
}

.stationList {
  border-top-left-radius: 1em;
  border-top-right-radius: 1em;

  background-color: #f7f7f7db;

  transform: translate3d(0, 0, 0);
  box-shadow: 0px -2px 12px 0px #0000004f;

  pointer-events: all;

  padding: 10px 3px;
  margin: 0px 4px;
}

.stationListHeader {
  border-bottom: 1px solid black;
  padding: 9px 12px;
  display: flex;

  // align-items: baseline;

  .listTitle {
    font-size: 28px;
    font-weight: bold;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba($highlightColor, 0.4);
    }
    70% {
      box-shadow: 0 0 0 0.5em rgba($highlightColor, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba($highlightColor, 0);
    }
  }
  .updateIndicator {
    display: inline-block;
    width: 0.4em;
    height: 0.4em;

    background-color: $highlightColor;
    border-radius: 50%;

    box-shadow: 0 0 0 rgba($highlightColor, 0.4);
    animation: pulse 1.5s infinite;

    font-size: 20px;
  }

  .description {
    font-size: 14px;
    font-weight: 300;

    margin-left: 10px;
    margin-right: 2px;
  }
}

.stationListBody {
  padding: 5px 10px;

  .stationListItem {
    display: flex;
    align-items: center;
    height: 55px;
    padding: 0px 4px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);

    .name {
      color: #444444;
      font-size: 16px;
      font-weight: 500;
      flex: 1;
    }

    .distance {
      color: #444444;
      font-weight: bold;
      padding-right: 10px;
    }

    .availableBikes {
      color: $highlightColor;
      font-weight: bold;
      width: 2.2em;
      text-align: right;

      .unit {
        padding-left: 2px;
      }
    }

    .bookmark {
      color: $highlightColor;
      padding-right: 5px;
    }
  }
}

</style>
