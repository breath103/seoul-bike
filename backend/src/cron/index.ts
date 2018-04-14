import * as AWS from "aws-sdk";
import Axios from "axios";

export async function handler(event: any) {
  const response = await Axios.get("https://www.bikeseoul.com/app/station/getStationRealtimeStatus.do");  
  
  const stations = (response.data.realtimeList as Array<any>)
    .filter((s: any) => s.stationUseYn === 'Y')
    .map((s: any) => {
      const name = (() => {
        const res = s.stationName.match(/(\d+).(.+)/i)
        return ((res && res[2]) || s.stationName) as string;
      })()
      return {
        name,
        coordinate: {
          latitude: Number(s.stationLatitude),
          longitude: Number(s.stationLongitude),
        },
        availableBikes: Number(s.parkingBikeTotCnt),
      }
    });

  console.log(JSON.stringify(stations.slice(0, 10)));
    
  console.log("Upload");
  const s3 = new AWS.S3();
  await s3.putObject({
    Bucket: process.env.ASSET_BUCKET as string,
    Key: 'stations.json',
    Body: JSON.stringify({
      stations,
      meta: {
        createdAt: new Date().getTime(),
      }
    }),
    CacheControl: "max-age: 60",
    ContentType: "application/json",
  }).promise();

  console.log("Done");
  // Upload this to S3? hm..
  // but then cloudfront could be even more expensive
}