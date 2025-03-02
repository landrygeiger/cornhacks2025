type Coordinates = {
  azimuth: number;
  altitude: number;
};

export const angleToBody = (
  body: Coordinates,
  camera: Coordinates,
  cameraRoll: number
): number => {
  // console.log(`camera: `, camera, cameraRoll);
  // console.log(`body: `, body);
  const diffAz = camera.azimuth - body.azimuth;
  const diffAl = camera.altitude - body.altitude;
  const diffNormalized = (Math.atan2(diffAl, diffAz) * 180) / Math.PI;
  const finalAngle = diffNormalized - cameraRoll;

  return finalAngle;
};
