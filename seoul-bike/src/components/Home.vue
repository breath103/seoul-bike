<template>
  <div>
    <div class="map">

    </div>
    <div v-if="position">
      {{ JSON.stringify(position.coordinates) }}
    </div>
    <div class="stationList">
      <div class="stationListHeader">
        Around You
      </div>
      <div class="stationListBody">
        <div class="stationListItem" v-for="item in closeStations">
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
    const lastPosition = localStorage.getItem("LastPosition");
    if (lastPosition) {
      this.position = JSON.parse(lastPosition);
    } else {
      this.position = null;
    }
  },
  mounted() {
    navigator.geolocation.watchPosition(
      (position) => {
        localStorage.setItem("LastPosition", JSON.stringify(position));
        Vue.set(this, "position", position);
      }, (error) => {
        console.log("Error : ", error);
      }, {
        enableHighAccuracy: false,
        // timeout: 5000,
        // maximumAge: 0,
      }
    );
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
        .take(100)
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
.stationList {
}

.stationListHeader {
  border-bottom: 1px solid black;
  font-size: 28px;
  font-weight: bold;

  padding: 9px 10px;
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
      color: #FF6E30;
      font-weight: bold;

      .unit {
        padding-left: 2px;
      }
    }

    .bookmark {
      color: #FF6E30;
      padding-right: 5px;
    }
  }
}

</style>
