import * as AWS from "aws-sdk";
import Axios from "axios";
import * as debug from "debug";

const logger = debug("Cron");
const s3 = new AWS.S3();

export async function handler() {
  const response = await Axios.post("https://www.bikeseoul.com/app/station/getStationRealtimeStatus.do");

  const stations = (response.data.realtimeList as any[])
    .filter((s: any) => {
      return s.stationUseYn === "Y" &&
        Number(s.stationLatitude) !== 0 &&
        Number(s.stationLongitude) !== 0;
    })
    .map((s: any) => {
      const name = (() => {
        const res = s.stationName.match(/(\d+).(.+)/i);
        return ((res && res[2]) || s.stationName) as string;
      })();
      return {
        name,
        coordinate: {
          latitude: Number(s.stationLatitude),
          longitude: Number(s.stationLongitude),
        },
        availableBikes: Number(s.parkingBikeTotCnt),
      };
    });

  logger("Stations: %O", stations.slice(0, 10));

  await s3.putObject({
    Bucket: process.env.ASSET_BUCKET as string,
    Key: "stations.json",
    Body: JSON.stringify({
      stations,
      meta: {
        createdAt: new Date().getTime(),
      }
    }),
    CacheControl: "max-age: 60",
    ContentType: "application/json",
  }).promise();

  logger("Done");
}
