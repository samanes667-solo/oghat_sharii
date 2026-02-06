const deg2rad = d => d * Math.PI / 180;
const rad2deg = r => r * 180 / Math.PI;

// تبدیل تاریخ gregorian به julian day
function julianDay(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function solarPosition(jd) {
  const T = (jd - 2451545.0) / 36525;
  const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
  const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);

  const C =
    Math.sin(deg2rad(M)) * (1.914602 - T * (0.004817 + 0.000014 * T)) +
    Math.sin(deg2rad(2 * M)) * (0.019993 - 0.000101 * T) +
    Math.sin(deg2rad(3 * M)) * 0.000289;

  const trueLong = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const lambda = trueLong - 0.00569 - 0.00478 * Math.sin(deg2rad(omega));
  const epsilon = 23.439291 - 0.0130042 * T;

  const declination = rad2deg(
    Math.asin(Math.sin(deg2rad(epsilon)) * Math.sin(deg2rad(lambda)))
  );

  const y = Math.tan(deg2rad(epsilon / 2)) ** 2;
  const eqTime = 4 * rad2deg(
    y * Math.sin(2 * deg2rad(L0)) -
    2 * e * Math.sin(deg2rad(M)) +
    4 * e * y * Math.sin(deg2rad(M)) * Math.cos(2 * deg2rad(L0)) -
    0.5 * y * y * Math.sin(4 * deg2rad(L0)) -
    1.25 * e * e * Math.sin(2 * deg2rad(M))
  );

  return { declination, eqTime };
}

function solarNoon(lng, timezone, eqTime) {
  return 12 + timezone - lng / 15 - eqTime / 60;
}

function sunAngleTime(lat, decl, angle) {
  const h = deg2rad(angle);
  const phi= deg2rad(lat);
  const delta = deg2rad(decl);
  const cosH = (Math.sin(h) - Math.sin(phi)*Math.sin(delta)) / (Math.cos(phi)*Math.cos(delta));
  if (cosH < -1 || cosH > 1 || isNaN(cosH)) return null;
  return rad2deg(Math.acos(cosH)) / 15;
}

function asrHourAngle(lat, declination, factor) {
  const phi = deg2rad(lat);
  const delta = deg2rad(declination);
  const h = Math.atan(1 / (factor + Math.tan(Math.abs(phi - delta))));
  const cosH = (Math.sin(h) - Math.sin(phi)*Math.sin(delta)) / (Math.cos(phi)*Math.cos(delta));
  if (cosH < -1 || cosH > 1 || isNaN(cosH)) return null;
  return rad2deg(Math.acos(cosH)) / 15;
}

function toClock(t) {
  if (t == null || isNaN(t)) return "--:--";
  const h = (Math.floor(t) + 24) % 24;
  const m = Math.floor((t - Math.floor(t)) * 60);
  return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`;
}

document.getElementById("btn").addEventListener("click", showTimes);

function showTimes() {
  // خواندن ورودی‌ها در لحظه کلیک:
  let lat = parseFloat(document.getElementById("latitude").value);
  let lng = parseFloat(document.getElementById("longitude").value);
  let tz  = parseFloat(document.getElementById("timeZone").value);

  if (isNaN(lat) || isNaN(lng) || isNaN(tz)) {
    // مختصات پیش‌فرض قم
    lat = 34.6416; lng = 50.8746; tz = 3.5;
  }

  const date = new Date();
  const jd = julianDay(date);
  const { declination, eqTime } = solarPosition(jd);
  const noon = solarNoon(lng, tz, eqTime);

  const sunrise = noon - sunAngleTime(lat, declination, -0.833);
  const sunset  = noon + sunAngleTime(lat, declination, -0.833);
  const fajr    = noon - sunAngleTime(lat, declination, -12);
  const maghrib = noon + sunAngleTime(lat, declination, -4.5);
  const isha    = noon + sunAngleTime(lat, declination, -9);
  const asrTime = noon + asrHourAngle(lat, declination, 1); // شیعه
  const nightDuration =(24 - maghrib) + fajr;
  const midnight = maghrib + nightDuration / 2;

  document.getElementById("output").innerHTML =
    "اذان صبح (فجر): " + toClock(fajr) + "<br>" +
    "طلوع آفتاب: " + toClock(sunrise) + "<br>" +
    "اذان ظهر: " + toClock(noon) + "<br>" +
    "اذان عصر: " + toClock(asrTime) + "<br>" +
    "غروب آفتاب: " + toClock(sunset) + "<br>" +
    "اذان مغرب: " + toClock(maghrib) + "<br>" +
    "اذان عشا: " + toClock(isha) + "<br>" +
    "نیمه شب شرعی: " + toClock(midnight);
}
