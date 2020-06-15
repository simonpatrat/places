import EXIF from "exif-js";

export const getImageExifData = (...args) => {
  return new Promise((resolve, reject) => {
    return EXIF.getData(...args, function () {
      let exifdata = this.exifdata;
      return resolve(exifdata);
    });
  });
};

export function getImageGPSCoordinatesFromExifData(exifdata) {
  var aLat = exifdata.GPSLatitude;
  var aLong = exifdata.GPSLongitude;

  if (!(aLat && aLong)) return; // whoops, no GPS info

  // convert from deg/min/sec to decimal for Google
  var strLatRef = exifdata.GPSLatitudeRef || "N";
  var strLongRef = exifdata.GPSLongitudeRef || "W";
  var fLat =
    (aLat[0] + aLat[1] / 60 + aLat[2] / 3600) * (strLatRef == "N" ? 1 : -1);
  var fLong =
    (aLong[0] + aLong[1] / 60 + aLong[2] / 3600) * (strLongRef == "W" ? -1 : 1);
  return {
    latitude: fLat,
    longitude: fLong,
  };
}
