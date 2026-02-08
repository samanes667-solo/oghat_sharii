
/* ===========================
   ساعت و تاریخ
=========================== */
function updateTime() {
  const now = new Date();
  document.getElementById("demo").innerHTML =
    now.toLocaleDateString("fa-IR") + " — " +
    now.toLocaleTimeString("fa-IR");
}
updateTime();
setInterval(updateTime, 1000);

/* ===========================
   دیتای شهرها
=========================== */
const cities = {
  "قم": { lat:34.6416, lng:50.8746, tz:3.5 },
  "تهران": { lat:35.6892, lng:51.3890, tz:3.5 },
  "مشهد": { lat:36.2605, lng:59.6168, tz:3.5 },
  "اصفهان": { lat:32.6539, lng:51.6660, tz:3.5 },
  "شیراز": { lat:29.5918, lng:52.5837, tz:3.5 },
  "بغداد": { lat:33.3152, lng:44.3661, tz:3 },
  "نجف": { lat:32.0, lng:44.33, tz:3 },
  "کربلا": { lat:32.616, lng:44.032, tz:3 },
  "کابل": { lat:34.5553, lng:69.2075, tz:4.5 },
  "هرات": { lat:34.3529, lng:62.204, tz:4.5 },
  "آنکارا": { lat:39.9334, lng:32.8597, tz:3 },
  "استانبول": { lat:41.0082, lng:28.9784, tz:3 },
  "ریاض": { lat:24.7136, lng:46.6753, tz:3 },
  "دوحه": { lat:25.2854, lng:51.531, tz:3 },
  "بیروت": { lat:33.53, lng:35.29, tz:2 }
};

/* ===========================
   مدیریت شهرهای کاربر
=========================== */
let userCities = [];

// بارگذاری شهرهای کاربر از localStorage
function loadUserCities() {
  try {
    const saved = localStorage.getItem('userCities');
    userCities = saved ? JSON.parse(saved) : [];
  } catch (e) {
    userCities = [];
    console.error('خطا در بارگذاری شهرهای کاربر:', e);
  }
}

// ذخیره شهرهای کاربر در localStorage
function saveUserCities() {
  try {
    localStorage.setItem('userCities', JSON.stringify(userCities));
  } catch (e) {
    console.error('خطا در ذخیره شهرهای کاربر:', e);
  }
}

// نمایش فرم ذخیره شهر
function showSaveCityForm() {
  const lat = document.getElementById('latitude').value;
  const lng = document.getElementById('longitude').value;
  const tz = document.getElementById('timeZone').value;
  
  if (!lat || !lng || !tz) {
    alert('لطفاً ابتدا مختصات را وارد کنید یا شهر را انتخاب نمایید');
    return;
  }
  
  document.getElementById('saveCityForm').style.display = 'block';
  document.getElementById('userCitiesList').style.display = 'none';
  document.getElementById('cityName').focus();
}

// مخفی کردن فرم ذخیره شهر
function hideSaveCityForm() {
  document.getElementById('saveCityForm').style.display = 'none';
  document.getElementById('cityName').value = '';
}

// ذخیره شهر کاربر
function saveUserCity() {
  const cityName = document.getElementById('cityName').value.trim();
  const lat = document.getElementById('latitude').value;
  const lng = document.getElementById('longitude').value;
  const tz = document.getElementById('timeZone').value;
  
  if (!cityName) {
    alert('لطفاً نام شهر را وارد کنید');
    return;
  }
  
  if (!lat || !lng || !tz) {
    alert('لطفاً مختصات را وارد کنید');
    return;
  }
  
  // بررسی تکراری نبودن
  if (cities[cityName] || userCities.some(city => city.name === cityName)) {
    if (!confirm(`شهر "${cityName}" قبلاً وجود دارد. آیا می‌خواهید جایگزین کنید؟`)) {
      return;
    }
    userCities = userCities.filter(city => city.name !== cityName);
  }
  
  const newCity = {
    name: cityName,
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    tz: parseFloat(tz),
    isUserCity: true
  };
  
  userCities.push(newCity);
  saveUserCities();
  updateCitySelect();
  hideSaveCityForm();
  alert(`شهر "${cityName}" با موفقیت ذخیره شد!`);
  showTimes();
}

// نمایش شهرهای کاربر
function showUserCities() {
  loadUserCities();
  
  if (userCities.length === 0) {
    alert('شما هنوز شهری ذخیره نکرده‌اید.');
    return;
  }
  
  const container = document.getElementById('userCitiesContainer');
  let html = '';
  
  userCities.forEach((city, index) => {
    html += `
      <div class="user-city-item">
        <div class="user-city-info">
          <strong>${index + 1}. ${city.name}</strong>
          <small>عرض: ${city.lat} | طول: ${city.lng} | منطقه: ${city.tz}</small>
        </div>
        <div class="user-city-actions">
          <button onclick="useUserCity('${city.name}')" 
                  style="background: #007bff; padding: 5px 10px;">
            انتخاب
          </button>
          <button class="btn-delete" onclick="deleteUserCity('${city.name}')">
            حذف
          </button>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  document.getElementById('userCitiesList').style.display = 'block';
  document.getElementById('saveCityForm').style.display = 'none';
}

// مخفی کردن لیست شهرهای کاربر
function hideUserCities() {
  document.getElementById('userCitiesList').style.display = 'none';
}

// استفاده از شهر کاربر
function useUserCity(cityName) {
  const city = userCities.find(c => c.name === cityName);
  if (city) {
    document.getElementById('latitude').value = city.lat;
    document.getElementById('longitude').value = city.lng;
    document.getElementById('timeZone').value = city.tz;
    document.getElementById('citySelect').value = '';
    hideUserCities();
    showTimes();
    alert(`شهر "${cityName}" انتخاب شد`);
  }
}

// حذف شهر کاربر
function deleteUserCity(cityName) {
  if (confirm(`آیا از حذف شهر "${cityName}" اطمینان دارید؟`)) {
    userCities = userCities.filter(city => city.name !== cityName);
    saveUserCities();
    updateCitySelect();
    showUserCities();
    alert(`شهر "${cityName}" حذف شد`);
  }
}

// به‌روزرسانی dropdown شهرها
function updateCitySelect() {
  const select = document.getElementById('citySelect');
  const currentValue = select.value;
  
  const userOptions = select.querySelectorAll('option[data-user="true"]');
  userOptions.forEach(option => option.remove());
  
  loadUserCities();
  
  userCities.forEach(city => {
    const option = document.createElement('option');
    option.value = city.name;
    option.textContent = `⭐ ${city.name}`;
    option.setAttribute('data-user', 'true');
    select.appendChild(option);
  });
  
  select.value = currentValue;
}

/* ===========================
   انتخاب شهر
=========================== */
document.getElementById("citySelect").addEventListener("change", function(){
  const selectedValue = this.value;
  
  if (cities[selectedValue]) {
    const city = cities[selectedValue];
    document.getElementById('latitude').value = city.lat;
    document.getElementById('longitude').value = city.lng;
    document.getElementById('timeZone').value = city.tz;
  } else {
    const userCity = userCities.find(city => city.name === selectedValue);
    if (userCity) {
      document.getElementById('latitude').value = userCity.lat;
      document.getElementById('longitude').value = userCity.lng;
      document.getElementById('timeZone').value = userCity.tz;
    }
  }
  
  localStorage.setItem("selectedCity", selectedValue);
  
  const lat = document.getElementById('latitude').value;
  const lng = document.getElementById('longitude').value;
  const tz = document.getElementById('timeZone').value;
  
  if (lat && lng && tz) {
    showTimes();
  }
});

/* ===========================
   توابع نجومی (هسته اصلی)
=========================== */
const deg2rad = d => d * Math.PI / 180;
const rad2deg = r => r * 180 / Math.PI;

function julianDay(date) {
  return date.getTime()/86400000 + 2440587.5;
}

function solarPosition(jd) {
  const T = (jd - 2451545.0) / 36525;

  const L0 = (280.46646 + T * (36000.76983 + 0.0003032 * T)) % 360;
  const M  = 357.52911 + T * (35999.05029 - 0.0001537 * T);
  const e  = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);

  const C =
    (1.914602 - T * (0.004817 + 0.000014 * T)) * Math.sin(deg2rad(M)) +
    (0.019993 - 0.000101 * T) * Math.sin(deg2rad(2 * M)) +
    0.000289 * Math.sin(deg2rad(3 * M));

  const trueLong = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const lambda = trueLong - 0.00569 - 0.00478 * Math.sin(deg2rad(omega));

  const epsilon0 =
    23 +
    (26 +
      ((21.448 -
        T *
          (46.815 +
            T * (0.00059 - T * 0.001813))) /
        60)) /
      60;

  const epsilon = epsilon0 + 0.00256 * Math.cos(deg2rad(omega));

  const declination = rad2deg(
    Math.asin(
      Math.sin(deg2rad(epsilon)) * Math.sin(deg2rad(lambda))
    )
  );

  const y = Math.tan(deg2rad(epsilon / 2)) ** 2;

  const eqTime =
    4 *
    rad2deg(
      y * Math.sin(2 * deg2rad(L0)) -
        2 * e * Math.sin(deg2rad(M)) +
        4 * e * y * Math.sin(deg2rad(M)) * Math.cos(2 * deg2rad(L0)) -
        0.5 * y * y * Math.sin(4 * deg2rad(L0)) -
        1.25 * e * e * Math.sin(2 * deg2rad(M))
    );

  return { declination, eqTime };
}

function sunAngleTime(lat, decl, angle) {
  const cosH = (Math.sin(deg2rad(angle)) - Math.sin(deg2rad(lat)) * Math.sin(deg2rad(decl))) /
               (Math.cos(deg2rad(lat)) * Math.cos(deg2rad(decl)));
  
  if (cosH < -1 || cosH > 1) return null;
  
  const H = rad2deg(Math.acos(cosH)) / 15;
  return H;
}

function asrTime(lat, decl) {
  const phi = deg2rad(lat);
  const delta = deg2rad(decl);
  
  const shadow = 1;
  const cotA = shadow + Math.tan(Math.abs(phi - delta));
  if (cotA <= 0) return null;
  
  const A = Math.atan(1 / cotA);
  const angle = rad2deg(A);
  
  const cosH = (Math.sin(deg2rad(angle)) - Math.sin(phi) * Math.sin(delta)) /
               (Math.cos(phi) * Math.cos(delta));
  
  if (cosH < -1 || cosH > 1) return null;
  
  const H = rad2deg(Math.acos(cosH)) / 15;
  return H;
}

function toClock(t) {
  if (t == null || isNaN(t)) return "--:--";
  const h = (Math.floor(t) + 24) % 24;
  const m = Math.floor((t - Math.floor(t)) * 60);
  return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`;
}

function solarNoon(lng, tz, eqTime) {
  return 12 + tz - lng/15 - eqTime/60;
}

function showTimes() {
  let lat = parseFloat(document.getElementById("latitude").value);
  let lng = parseFloat(document.getElementById("longitude").value);
  let tz  = parseFloat(document.getElementById("timeZone").value);

  if (isNaN(lat) || isNaN(lng) || isNaN(tz)) {
    lat = 34.6416; lng = 50.8746; tz = 3.5;
  }

  const date = new Date();
  const jd = julianDay(date);
  const { declination, eqTime } = solarPosition(jd);
  const noon = solarNoon(lng, tz, eqTime);

  const imsakHA = sunAngleTime(lat, declination, -18);
  const fajrHA = sunAngleTime(lat, declination, -12);
  const sunriseHA = sunAngleTime(lat, declination, -0.833);
  const asrHA = asrTime(lat, declination);
  const maghribHA = sunAngleTime(lat, declination, -4.5);
  const ishaHA = sunAngleTime(lat, declination, -9);

  const imsak = imsakHA !== null ? noon - imsakHA : null;
  const fajr = fajrHA !== null ? noon - fajrHA : null;
  const sunrise = sunriseHA !== null ? noon - sunriseHA : null;
  const sunset = sunriseHA !== null ? noon + sunriseHA : null;
  const asr = asrHA !== null ? noon + asrHA : null;
  const maghrib = maghribHA !== null ? noon + maghribHA : null;
  const isha = ishaHA !== null ? noon + ishaHA : null;

  let midnight = null;
  if (sunset !== null && fajr !== null) {
    let nightDuration;
    if (fajr > sunset) {
      nightDuration = (24 - sunset) + fajr;
    } else {
      nightDuration = fajr - sunset;
    }
    midnight = (sunset + nightDuration / 2) % 24;
  }

  // نمایش اوقات با فرمت جدید
  document.getElementById("output").innerHTML = `
    <div class="prayer-times">
        <div class="prayer-row">
        <span class="prayer-name">امساک</span>
        <span class="prayer-time">${toClock(imsak)}</span>
      </div>
      <div class="prayer-row">
        <span class="prayer-name">اذان صبح (فجر)</span>
        <span class="prayer-time">${toClock(fajr)}</span>
      </div>
      <div class="prayer-row">
        <span class="prayer-name">طلوع آفتاب</span>
        <span class="prayer-time">${toClock(sunrise)}</span>
      </div>
      <div class="prayer-row">
        <span class="prayer-name">اذان ظهر</span>
        <span class="prayer-time">${toClock(noon)}</span>
      </div>
      <div class="prayer-row">
        <span class="prayer-name">اذان عصر</span>
        <span class="prayer-time">${toClock(asr)}</span>
      </div>
      <div class="prayer-row">
        <span class="prayer-name">غروب آفتاب</span>
        <span class="prayer-time">${toClock(sunset)}</span>
      </div>
      <div class="prayer-row">
        <span class="prayer-name">اذان مغرب</span>
        <span class="prayer-time">${toClock(maghrib)}</span>
      </div>
      <div class="prayer-row">
        <span class="prayer-name">اذان عشا</span>
        <span class="prayer-time">${toClock(isha)}</span>
      </div>
      <div class="prayer-row">
        <span class="prayer-name">نیمه شب شرعی</span>
        <span class="prayer-time">${toClock(midnight)}</span>
      </div>
    </div>`;
}

/* ===========================
   بارگذاری اولیه
=========================== */
document.addEventListener('DOMContentLoaded', function() {
  loadUserCities();
  updateCitySelect();
  
  const savedCity = localStorage.getItem("selectedCity");
  if (savedCity) {
    if (cities[savedCity]) {
      document.getElementById('citySelect').value = savedCity;
      const city = cities[savedCity];
      document.getElementById('latitude').value = city.lat;
      document.getElementById('longitude').value = city.lng;
      document.getElementById('timeZone').value = city.tz;
    } else {
      const userCity = userCities.find(city => city.name === savedCity);
      if (userCity) {
        document.getElementById('citySelect').value = savedCity;
        document.getElementById('latitude').value = userCity.lat;
        document.getElementById('longitude').value = userCity.lng;
        document.getElementById('timeZone').value = userCity.tz;
      }
    }
    showTimes();
  }
});

/* ===========================
   ذخیره تنظیمات هنگام خروج
=========================== */
window.addEventListener('beforeunload', function() {
  const currentCity = document.getElementById('citySelect').value;
  if (currentCity) {
    localStorage.setItem('selectedCity', currentCity);
  }
});
