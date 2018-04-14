<template>
  <div>
    <div class="map">

    </div>
    <div class="stationList">
      <div class="stationListHeader">
        <span class="listTitle">내 주변</span>
        <div>
          <span class="description">
            <span v-if="position">
              {{ position.coordinates.longitude.toFixed(4) }}, 
              {{ position.coordinates.latitude.toFixed(4) }}
            </span>
            <span v-if="!position">
              위치 확인중...
            </span>
          </span>
          <span class="updateIndicator"></span>
        </div>
      </div>
      <div class="stationListBody">
        <div class="stationListItem" :key="item.name" v-for="item in closeStations">
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
</template>

<script>
import * as _ from 'lodash';
import Vue from 'vue';
import * as geolib from 'geolib';

const sample = require('./sample.json')
const allStations = sample.realtimeList.filter(s => s.stationUseYn === 'Y').map(s => {
  const name = (() => {
    const res = s.stationName.match(/(\d+).(.+)/i)
    return ((res && res[2]) || s.stationName)
  })()
  return {
    name,
    coordinate: {
      latitude: Number(s.stationLatitude),
      longitude: Number(s.stationLongitude),
    },
    availableBikes: s.parkingBikeTotCnt
  }
})

export default {
  name: 'Home',
  created() {
    this.position = this.getLastPosition();
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
        console.log(position, raw); 
        this.setLastPosition(position);

        Vue.set(this, "position", position);
      }, (error) => {
        window.alert(`Error : ${JSON.stringify(error)}`);
      }, {
        enableHighAccuracy: false,
        maximumAge: 30 * 1000,
      });
  },
  filters: {
    meterUnit(distance) {
      if (distance < 1000) {
        return `${distance}m`;
      } else {
        return `${(distance / 1000).toFixed(2)}km`;
      }
    }
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
  },
  computed: {
    closeStations() {
      return _(allStations)
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
      stations: _.take(allStations, 100),
    }
  }
}
</script>

<style lang="scss">
$highlightColor: #FF6E30;

.stationList {
  border-top-left-radius: 1em;
  border-top-right-radius: 1em;

  box-shadow: 0px -2px 12px 0px #0000004f;

  padding: 10px 3px 0px 3px;
  margin: 30% 4px 0px 4px;
}

.stationListHeader {
  border-bottom: 1px solid black;
  padding: 9px 12px;
  display: flex;
  align-items: baseline;
  
  .listTitle {
    font-size: 28px;
    font-weight: bold;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(204, 169, 44, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(204, 169, 44, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(204, 169, 44, 0);
    }
  }
  .updateIndicator {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin: 3px;
    
    background-color: $highlightColor;
    border-radius: 50%;

    box-shadow: 0 0 0 rgba(204,169,44, 0.4);
    animation: pulse 2s infinite;
  }  

  .description {
    font-size: 16px;
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
