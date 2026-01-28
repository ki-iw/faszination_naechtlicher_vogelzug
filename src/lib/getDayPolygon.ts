import type { Feature, Polygon } from "geojson";

/* From Gemini */

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

function getJulian(date: Date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function getGMST(julian: number) {
  const d = julian - 2451545.0;
  return (18.697374558 + 24.06570982441908 * d) % 24;
}

function sunEclipticPosition(julian: number) {
  const d = julian - 2451545.0;
  const g = (357.529 + 0.98560028 * d) % 360;
  const q = (280.459 + 0.98564736 * d) % 360;
  const L =
    (q + 1.915 * Math.sin(g * D2R) + 0.02 * Math.sin(2 * g * D2R)) % 360;
  const e = 23.439 - 0.00000036 * d;
  return { L, e };
}

function sunEquatorialPosition(sunEclPos: { L: number; e: number }) {
  const ra = Math.atan2(
    Math.cos(sunEclPos.e * D2R) * Math.sin(sunEclPos.L * D2R),
    Math.cos(sunEclPos.L * D2R),
  );
  const dec = Math.asin(
    Math.sin(sunEclPos.e * D2R) * Math.sin(sunEclPos.L * D2R),
  );
  return { ra, dec };
}

function hourAngle(
  lng: number,
  sunPos: { ra: number; dec: number },
  gmst: number,
) {
  return (gmst * 15 + lng - sunPos.ra * R2D) * D2R;
}

function getLatitude(
  lng: number,
  sunPos: { ra: number; dec: number },
  gmst: number,
) {
  const ha = hourAngle(lng, sunPos, gmst);
  return Math.atan(-Math.cos(ha) / Math.tan(sunPos.dec)) * R2D;
}

export function getDayPolygon(date: Date): Feature<Polygon> {
  const julian = getJulian(date);
  const gmst = getGMST(julian);
  const sunEcl = sunEclipticPosition(julian);
  const sunEq = sunEquatorialPosition(sunEcl);

  const latLngs: [number, number][] = [];

  for (let i = 0; i <= 360; i += 2) {
    const lng = -180 + i;
    const lat = getLatitude(lng, sunEq, gmst);
    latLngs.push([lng, lat]);
  }

  if (sunEq.dec > 0) {
    latLngs.push([180, 90]);
    latLngs.push([-180, 90]);
  } else {
    latLngs.push([180, -90]);
    latLngs.push([-180, -90]);
  }

  latLngs.push(latLngs[0]);

  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [latLngs],
    },
  };
}
