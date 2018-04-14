<template>
  <div>
    <div class="map">
      <gmap-map
        :center="{lat:position.coordinates.latitude, lng: position.coordinates.longitude}"
        :zoom="16"
        style="width: 100%; height: 100%"
      >
        <gmap-marker
          v-for="(item, index) in closeStations"
          :key="index"
          :position="item.station.coordinate | toGMapCoord"
          :clickable="true"
          :label="`${item.station.availableBikes}`"
        >
        </gmap-marker>      
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
                {{ position.coordinates.longitude.toFixed(4) }}, 
                {{ position.coordinates.latitude.toFixed(4) }}
              </span>
              <span v-if="!position">
                위치 확인중...
              </span>
            </div>
            <div>
              <span class="updateIndicator"></span>
              <span>{{ this.allStationsUpdatedAt | fromNow }}</span>
            </div>
          </div>
        </div>
        <div class="stationListBody">
          <div class="stationListItem" 
               v-for="item in closeStations"
               :key="item.name">
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

const sample = require('./sample.json')
// const allStations = sample.realtimeList.filter(s => s.stationUseYn === 'Y').map(s => {
//   const name = (() => {
//     const res = s.stationName.match(/(\d+).(.+)/i)
//     return ((res && res[2]) || s.stationName)
//   })()
//   return {
//     name,
//     coordinate: {
//       latitude: Number(s.stationLatitude),
//       longitude: Number(s.stationLongitude),
//     },
//     availableBikes: s.parkingBikeTotCnt
//   }
// })

export default {
  name: 'Home',
  created() {
    this.position = this.getLastPosition();
    this.focus = "map";
    this.allStations = [];
    this.allStationsUpdatedAt = null;
  },
  mounted() {
    navigator.geolocation.watchPosition(
      (raw) => {
        const position = {
          coordinates: {
            accuracy: raw.coords.accuracy,
            latitude: raw.coords.latitude,
            longitude: raw.coords.longitude,
            speed: raw.coords.speed,
          }
        };
        this.setLastPosition(position); 
        this.position = position;
      }, (error) => {
        // window.alert(`Error : ${JSON.stringify(error)}`);
      }, {
        enableHighAccuracy: false,
        maximumAge: 30 * 1000,
      });

    this.fetchStations();
  },
  filters: {
    meterUnit(distance) {
      if (distance < 1000) {
        return `${distance}m`;
      } else {
        return `${(distance / 1000).toFixed(2)}km`;
      }
    },
    toGMapCoord(coordinate) {
      return {
        lat: coordinate.latitude,
        lng: coordinate.longitude,
      }
    },
    fromNow(timestamp) {
      return moment(timestamp).fromNow();
    },
  },
  methods: {
    distanceToMe(coordinate) {
      const distance = geolib.getDistance(
        (this.position && this.position.coordinates)
        ||
        {
          latitude: 37.5649,
          longitude: 126.9965,
        },
        coordinate,
      );
      return distance;
    },
    setLastPosition(position) {
      localStorage.setItem("Home-LastLocation", JSON.stringify(position));
    },
    getLastPosition() {
      const raw = localStorage.getItem("Home-LastLocation");
      if (raw) {
        return JSON.parse(raw);
      } else {
        return null;
      }
    },
    fetchStations() {
      axios.get("https://s3.ap-northeast-2.amazonaws.com/seoul-bike-prod/stations.json")
        .then((response) => {
          this.allStations = response.data.stations;
          this.allStationsUpdatedAt = response.data.meta.createdAt;
        });
    },
    activateMap() {
      this.focus = "map";
    },
    activateList() {
      this.focus = "list";
    },
  },
  computed: {
    closeStations() {
      return _(this.allStations)
        .map(station => {
          return {
            station,
            distance: this.distanceToMe(station.coordinate),
          }
        })
        .sortBy(item => item.distance)
        .take(36)
        .value();
    }
  },
  data() {
    return {
      position: this.position,
      allStations: this.allStations,
      allStationsUpdatedAt: this.allStationsUpdatedAt,
      focus: this.focus,
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
  height: 62%;
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
