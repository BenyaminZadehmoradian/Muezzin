function navigateTo(url) {
    window.location.assign(url);
}

let lat = 0;
let lon = 0;

let timezone, timeFormat, shortTimeFormat, lang, dateFormat;

let prayerTimes, calPrayers, tomorrowPrayers, sunnahTimes, prayers;
let datePick, volume;
let loadedUI = false;
let langFajr, langSunrise, langDhuhr, langAsr, langMaghrib, langIsha, langAdhan, langNow, langTimeUntil, selectedPrayer;
let motnCheckOG, totnCheckOG, totn, motn;
let athanProgress = 0;
let hijriAdj;
let occasions = {};
let dailyDhikr = {};
let darkmode = false;

const loaded = true;
const event1 = new Event('loadedSettings');
const event2 = new Event('loadedUI');
loadHandles()
loadSettings()

window.api.send('prayers');

window.addEventListener('loadedSettings', async () => {
  loadBackgroundImage()
  await loadOccasions()
  await loadDhikrData()

  loadClock();
  loadHijriDate();
  setupDhikrSection();

  datePick = document.getElementById('calendar');
  loadCalendar()

  getTomorrowPrayers()
  prayers = nextPrayer();
  loadPrayers()

  loadFont()


  const interval = setInterval(() => {
    loadClock()
    loadNextPrayer()
    setProgress()
  }, 1000)
})

window.addEventListener('loadedUI', () => {
  addEffects()

  volumeSlider()
  setKeyPress()
  setupButtonListeners()
  setupUpdateModal()
  setupBorders()
  setProgress()
  loadedUI = true;
  hideLoader()

  setupTasbih()

  window.api.send('loadedUI');
})



function loadClock(){
  document.getElementById("clock").innerText = changeclockDisplay(new Date, timeFormat)
}


/**
 * Changes the format of the Date to a string (hours)
 * @param {Date} date 
 * @param {String} timeformat 
 */
function changeclockDisplay(date, timeformat){
  function show0(number){
    return number < 10 ? `0${number}` : `${number}`
  }

  if (timeformat[0] == 'H'){
    if (timeformat[6] == 's'){
      return `${show0(date.getHours())}:${show0(date.getMinutes())}:${show0(date.getSeconds())}`
    }
    return `${show0(date.getHours())}:${show0(date.getMinutes())}`
  }
  else{
    const amPm = date.getHours() < 12 ? 'am' : 'pm'
    if (amPm == 'am'){
      if (timeformat[6] == 's'){
        return `${show0(date.getHours())}:${show0(date.getMinutes())}:${show0(date.getSeconds())} AM`
      }
      return `${show0(date.getHours())}:${show0(date.getMinutes())} AM`
    }
    else{
      const h12 = date.getHours()%12 == 0 ? 12 : date.getHours()%12
      if (timeformat[6] == 's'){
        return `${show0(h12)}:${show0(date.getMinutes())}:${show0(date.getSeconds())} PM`
      }
      return `${show0(h12)}:${show0(date.getMinutes())} PM`
    }
  }
}



async function loadOccasions(){
  try {
    const res = await fetch('../../ressources/data/hijri_occasions.json');
    occasions = await res.json();
  } catch(e) {
    occasions = {};
  }
}

async function loadDhikrData(){
  try {
    const res = await fetch('../../ressources/data/daily_dhikr.json');
    dailyDhikr = await res.json();
  } catch(e) {
    dailyDhikr = {};
  }
}

function getDailyDhikrEntry(){
  const day = new Date().getDay(); // 0=Sun … 6=Sat
  return dailyDhikr[String(day)] || null;
}

function speakDhikr(text){
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ar-SA';
  utter.rate = 0.75;
  utter.pitch = 1.0;
  const btn = document.getElementById('dhikrSpeakBtn');
  if (btn) btn.classList.add('speaking');
  utter.onend = () => { if (btn) btn.classList.remove('speaking'); };
  window.speechSynthesis.speak(utter);
}

function setupDhikrSection(){
  const entry = getDailyDhikrEntry();
  const container = document.getElementById('dhikrContainer');
  if (!entry || !container) return;

  const label = `Daily Dhikr · Day ${entry.day}`;
  document.getElementById('dhikrDayLabel').textContent = label;
  document.getElementById('dhikrText').textContent = entry.dhikr;
}

function getHijriParts(date){
  const day   = parseInt(new Intl.DateTimeFormat('en-u-ca-islamic', {day:   'numeric'}).format(date));
  const month = parseInt(new Intl.DateTimeFormat('en-u-ca-islamic', {month: 'numeric'}).format(date));
  const year  = parseInt(new Intl.DateTimeFormat('en-u-ca-islamic', {year:  'numeric'}).format(date));
  return { day, month, year };
}

function getOccasion(month, day){
  const m = occasions[String(month)];
  return m ? (m[String(day)] || '') : '';
}

function loadHijriDate(){
  function update(){
    let date = new Date();
    date.setDate(date.getDate() + hijriAdj);
    if (prayers && prayers[2] && (prayers[2] == langMaghrib || prayers[2] == langIsha) && date.getHours() >= 12){
      date = new Date(date);
      date.setDate(date.getDate() + 1);
    }

    const hijriDay = new Intl.DateTimeFormat('en-u-ca-islamic', {day: 'numeric'}).format(date);
    const locale = lang === 'fa' ? 'fa-u-ca-islamic' : 'en-u-ca-islamic';
    const hijriFormatted = new Intl.DateTimeFormat(locale,
      {day: 'numeric', month: 'long', year: 'numeric'}).format(date);

    document.getElementById("dateLoc").innerHTML = `${loadMoonIcon(hijriDay)} ${hijriFormatted}`;

    const parts = getHijriParts(date);
    const occ = getOccasion(parts.month, parts.day);
    const occEl = document.getElementById("occasionText");
    if (occEl){
      occEl.textContent = occ;
      occEl.style.display = occ ? '' : 'none';
    }
  }

  update();
  // Update every 30s — enough for Hijri date accuracy
  const hijriInterval = setInterval(update, 30000);
}

Object.defineProperty(String.prototype, 'capitalize', {
  value: function() {
    return this.replace(/(^|\s)\S/g, c => c.toUpperCase());
  },
  enumerable: false
});


function loadCalendar(){
  // Use local date to avoid UTC off-by-one
  Date.prototype.toDateInputValue = function(){
    const y = this.getFullYear();
    const m = String(this.getMonth() + 1).padStart(2, '0');
    const d = String(this.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  datePick.value = new Date().toDateInputValue();

  function localDateFromInput(str){
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function updatePickerDisplay(){
    const date = localDateFromInput(datePick.value);
    const locale = lang === 'fa' ? 'fa-u-ca-islamic' : 'en-u-ca-islamic';
    const hijriFormatted = new Intl.DateTimeFormat(locale,
      {day: 'numeric', month: 'long', year: 'numeric'}).format(date);
    document.getElementById('hijriPickerDate').textContent = hijriFormatted;

    const parts = getHijriParts(date);
    const occ = getOccasion(parts.month, parts.day);
    const occEl = document.getElementById('pickerOccasion');
    occEl.textContent = occ;
    occEl.style.display = occ ? '' : 'none';

    // Dim if not today
    const isToday = datePick.value === new Date().toDateInputValue();
    document.getElementById('hijriPickerDate').style.opacity = isToday ? '1' : '0.75';
  }

  function shiftDay(delta){
    const date = localDateFromInput(datePick.value);
    date.setDate(date.getDate() + delta);
    datePick.value = date.toDateInputValue();
    updatePickerDisplay();
    window.api.send('date-request', datePick.value);
  }

  document.getElementById('prevDayBtn').addEventListener('click', () => shiftDay(-1));
  document.getElementById('nextDayBtn').addEventListener('click', () => shiftDay(1));

  // Pick a date from the native month calendar
  datePick.addEventListener('change', () => {
    updatePickerDisplay();
    window.api.send('date-request', datePick.value);
  });

  // Click the display area to open the native month picker
  document.getElementById('hijriPickerDisplay').addEventListener('click', () => {
    datePick.showPicker ? datePick.showPicker() : datePick.click();
  });

  updatePickerDisplay();
}


//Load all the prayers of the day and shows them on the screen
function loadPrayers(){
  if (datePick.value == new Date().toDateInputValue()){
    if (prayers != undefined){
      if (prayers[3] == langFajr && new Date().getHours() <= 24){
        calPrayers = tomorrowPrayers
      }
      else{
        calPrayers = prayerTimes
      }
    }
    else{
      calPrayers = prayerTimes
    }
  }
  if (calPrayers != undefined){
    const fmt = t => changeclockDisplay(t, shortTimeFormat);
    document.getElementById("fajrTime").innerText    = fmt(calPrayers.fajr);
    document.getElementById("sunriseTime").innerText = fmt(calPrayers.sunrise);
    document.getElementById("dhuhrTime").innerText   = fmt(calPrayers.dhuhr);
    document.getElementById("asrTime").innerText     = fmt(calPrayers.asr);
    document.getElementById("maghribTime").innerText = fmt(calPrayers.maghrib);
    document.getElementById("ishaTime").innerText    = fmt(calPrayers.isha);
    if (sunnahTimes.totn && totn != undefined)
      document.getElementById("totnTime").innerText = fmt(totn);
    if (sunnahTimes.motn && motn != undefined)
      document.getElementById("motnTime").innerText = fmt(motn);
  }
}



//Checks the store for saved settings, or gets default values
async function loadSettings(){
    [lat, lon, timezone, lang, volume, sunnahTimes, hijriAdj] = await Promise.all([
        window.api.getFromStore('latitude', 0.00),
        window.api.getFromStore('longitude', 0.00),
        window.api.getFromStore('timezone', 'US/Central'),
        window.api.getFromStore('language', "en"),
        window.api.getFromStore('volume', 50),
        window.api.getFromStore("sunnahTimes", { motn: false, totn: false }),
        window.api.getFromStore('hijriAdj', 0)
    ]);

    darkmode = await window.api.getFromStore('darkMode', false);
    window.api.setTheme(darkmode, "styles.css");

    motnCheckOG = sunnahTimes.motn;
    totnCheckOG = sunnahTimes.totn;

    loadLang();
    await hidePlayer();
    await loadClockDisplay();
    window.dispatchEvent(event1);
}



//Loads the next prayers text: Prayer X in Y time;
function loadNextPrayer(){
  prayers = nextPrayer()
  if (prayers[0] != undefined){
    const timeUntilCurrentPrayer = timeUntilPrayer(prayers[0])
    if (athanProgress != 0 && timeUntilCurrentPrayer[0] == -1 && timeUntilCurrentPrayer[1] >= -5){
      document.getElementById("timeLeft").innerText = langAdhan
    }
    else if(timeUntilCurrentPrayer[0] == -1 && timeUntilCurrentPrayer[1] >= -10){ //-1 because math.floor
        document.getElementById("timeLeft").innerHTML = langNow + ": " + prayers[2];
    }
    else{
      const timeUntilNextPrayer = timeUntilPrayer(prayers[1])
      const timeSpan = `<span style="font-family:quicksandMono">${intToHour(timeUntilNextPrayer)}</span`
      if (lang != 'bn' && lang != 'uz') document.getElementById("timeLeft").innerHTML = `${langTimeUntil} ${prayers[3]}: ${timeSpan}`
      else document.getElementById("timeLeft").innerHTML = `${prayers[3]} ${langTimeUntil}: ${timeSpan}`
    }   
  } 
  if (!loadedUI){
    window.dispatchEvent(event2)
  }
}



function setProgress(){
  let porcent
  if (athanProgress != 0){
    porcent = athanProgress
  } else{
    let now = new Date()
    if (prayers[2] != langIsha) porcent = ((now - prayers[0]) /  (prayers[1] - prayers[0])) * 100;
    else if (prayers[1] - prayers[0] > 0) porcent = ((now.getTime() - prayers[0].getTime()) / (prayers[1] - prayers[0])) * 100;
    else porcent = ((((1000 * 60 * 60 * 24) - prayers[0].getTime()) + now.getTime()) /  (((1000 * 60 * 60 * 24) - prayers[0].getTime()) + prayers[1].getTime())) * 100;
  } 
  const progressEl = document.getElementById("prayerProgress");
  if (progressEl) progressEl.style.width = porcent + "%";
}



function nextPrayer(){
  const now = new Date();
  let currentPrayer, nextPrayer, currentName, nextName;
  if (prayerTimes != undefined && langFajr != undefined && tomorrowPrayers != undefined){
    if (now >= prayerTimes.isha){
      currentPrayer = prayerTimes.isha;
      nextPrayer = tomorrowPrayers.fajr
      currentName = langIsha
      nextName = langFajr
    }
    else if (now >= prayerTimes.maghrib){
        currentPrayer = prayerTimes.maghrib;
        nextPrayer = prayerTimes.isha;
        currentName = langMaghrib
        nextName = langIsha
    }
    else if (now >= prayerTimes.asr){
        currentPrayer = prayerTimes.asr;
        nextPrayer = prayerTimes.maghrib;
        currentName = langAsr
        nextName = langMaghrib
    }
    else if (now >= prayerTimes.dhuhr){
        currentPrayer = prayerTimes.dhuhr;
        nextPrayer = prayerTimes.asr;
        currentName = langDhuhr
        nextName = langAsr
    }
    else if (now >= prayerTimes.fajr){
        currentPrayer = prayerTimes.fajr;
        nextPrayer = prayerTimes.dhuhr;
        
        currentName = langFajr
        nextName = langDhuhr
    }
    else{
        currentPrayer = prayerTimes.isha; //Should go look at yerterday's prayer, but for the progress bar, this is enough.
        nextPrayer = prayerTimes.fajr;
        currentName = langIsha
        nextName = langFajr
    }
    if (selectedPrayer != nextName){
      loadPrayers();
      selectPrayer(nextName)
    } 
    
    return [currentPrayer, nextPrayer, currentName, nextName]
  }
}



function selectPrayer(prayerName){
  selectedPrayer = prayerName
  const color = darkmode? "rgba(7, 7, 7, 0.95)" : "rgba(255, 255, 255, 0.95)"
  switch(prayerName){
    case langFajr:
      highlight("isha", "fajr")
      break;
    case langDhuhr:
      highlight("fajr", "dhuhr")
      break;
    case langAsr:
      highlight("dhuhr", "asr")
      break;
    case langMaghrib:
      highlight("asr", "maghrib")
      break;
    case langIsha:
      highlight("maghrib", "isha")
      break;
  }

  function highlight(previous, next){
    document.getElementById(`${previous}Time`).style.backgroundColor = "";
    document.getElementById(previous).style.backgroundColor = "";
    document.getElementById(`${previous}Time`).style.fontWeight = "normal";
    document.getElementById(previous).style.fontWeight = "normal";

    document.getElementById(`${next}Time`).style.backgroundColor = color;
    document.getElementById(next).style.backgroundColor = color;
    document.getElementById(`${next}Time`).style.fontWeight = "bold";
    document.getElementById(next).style.fontWeight = "bold";
  }

}



function timeUntilPrayer(prayer) {
  const now = new Date()
  if (prayer != undefined){
      return msToTime(prayer - now);
  }
  else{
      return null;
  }
}



function msToTime(duration){ //https://stackoverflow.com/questions/19700283/how-to-convert-time-in-milliseconds-to-hours-min-sec-format-in-javascript
  let seconds = Math.floor((duration / 1000) % 60) + 1,
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  if (seconds == 60){
    minutes ++;
    seconds = 0;
  }
  if (minutes == 60){
    hours ++;
    minutes = 0;
  }
  const res = [hours, minutes, seconds];
  return res;
}



function getTomorrowPrayers(){
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    window.api.send('tomorrow-request', tomorrow);
}



function intToHour(time){
    const pad = n => n < 10 ? `0${n}` : `${n}`
    const hours = pad(time[0]);
    const minutes = pad(time[1]);
    const seconds = pad(time[2]);
    if (timeFormat[6] != 's' && (time[0] > 0 || time[1] > 0)){
      return `${hours}:${minutes}`
    }
    else{
      return `${hours}:${minutes}:${seconds}`
    }
}


function loadHandles(){
  window.api.handle('date-reply', msg => {
    calPrayers = msg;
    if (timezone != undefined){
      if (calPrayers.date.getDate() == new Date().getDate() && calPrayers.date.getMonth() == new Date().getMonth() && calPrayers.date.getFullYear() == new Date().getFullYear()){
        sunnahTimes.motn =  motnCheckOG;
        sunnahTimes.totn =  totnCheckOG;
        setupBorders()
      }
      else{
        sunnahTimes.motn = false;
        sunnahTimes.totn = false;
        setupBorders(true)
      }
      setupSunnah();
      loadPrayers();
    }
  })

  window.api.handle('prayersReply', msg => {
    prayerTimes = msg
    nextPrayer()
  })

  window.api.handle('tomorrow-reply', msg => {
    tomorrowPrayers = msg
    setupSunnah()
  })
  window.api.handle('progress-reply', msg => {
    athanProgress = msg;
  })

  window.api.handle('playDhikr', () => {
    const entry = getDailyDhikrEntry();
    if (entry) speakDhikr(entry.dhikr);
  })

  window.api.handle('update', msg => {
    loadSettings()
  })

  window.api.handle('reloadTheme', () => {
    loadBackgroundImage()
  })
}


//Loads time format (for now date format does nothing)
async function loadClockDisplay(){
  const clockDisplay = await window.api.getFromStore("timeDisplay", {
    clockFormat: 12,
    dateFormat: 'DD/MM/YYYY',
    showSeconds: true
  })
  dateFormat = clockDisplay.dateFormat
  timeFormat = "hh:mm"
  if (clockDisplay.showSeconds){
    timeFormat += ":ss"
  }
  if (clockDisplay.clockFormat == 12){
    timeFormat += " A"
  }
  else{
    timeFormat = timeFormat.replace("hh", 'HH')
  }
  shortTimeFormat = timeFormat.replace(":ss", "")
}


//Sets event listeners and IPCRenderers to make volume sliders work
function volumeSlider(){
  const volSlider = document.getElementById('volSlider');
  volSlider.value = volume
  volSlider.addEventListener('change', () => {
    window.api.send('volume-request', volSlider.value);
    window.api.setToStore('volume', volSlider.value)
  })
}


//Hides the media player in case the Adhan is disabled
async function hidePlayer(){
  const enableAdhan = await window.api.getFromStore('settings.adhanCheck', true)
  if (!enableAdhan){
    document.getElementById('audioControls').style.display = "none";
  }
}


/**
 * If a bgImage is set in the settings, it gets applied, otherwise it disables the shaders
 */ 
async function loadBackgroundImage(){
  const bgImage = await window.api.getFromStore('bgImage', [true, '../../ressources/images/Qamar_Bani_Hashim_(AS).jpg'])
  if (bgImage[0]){
    document.getElementById('bgBlur').style.backgroundImage = `url('${bgImage[1]}')`;
  }
  else{
    document.getElementById('bgBlur').style.backgroundImage = "none";
  }
}


/**
*Adds listener that brings you to the settings page when you press "Crtl + O"
*/
function setKeyPress(){
  document.addEventListener('keydown', function(key){
    if ((key.key == "o" || key.key == "O") && key.ctrlKey){
      navigateTo("../settings/settings.html");
    }
  })
}

function hideLoader(){
  document.getElementById('loader').style.display = "none"
}

function loadLang(){
  langFajr =  window.api.getLanguage(lang, 'fajr')
  langSunrise =  window.api.getLanguage(lang, 'sunrise')
  if ((new Date()).getDay() == 5){
    langDhuhr = window.api.getLanguage(lang, 'jumuah')
  } else  langDhuhr = window.api.getLanguage(lang, 'dhuhr')
  langAsr= window.api.getLanguage(lang, 'asr')
  langMaghrib = window.api.getLanguage(lang, 'maghrib')
  langIsha = window.api.getLanguage(lang, 'isha')
  langAdhan = window.api.getLanguage(lang, 'adhan')
  langNow = window.api.getLanguage(lang, 'now')
  langTimeUntil = window.api.getLanguage(lang, 'timeUntil')
  document.getElementById('fajr').innerText = langFajr
  document.getElementById('sunrise').innerText = langSunrise
  document.getElementById('dhuhr').innerText = langDhuhr
  document.getElementById('asr').innerText = langAsr
  document.getElementById('maghrib').innerText = langMaghrib
  document.getElementById('isha').innerText = langIsha
  document.getElementById('settingsWheel').innerHTML = '<i class="fa fa-cog" aria-hidden="true"></i>  ' +  window.api.getLanguage(lang, 'settings')
  document.getElementById('motn').innerText = window.api.getLanguage(lang, 'motn')
  document.getElementById('totn').innerText = window.api.getLanguage(lang, 'totn')
  document.getElementById('quranButton').innerHTML = '<i class="fa-solid fa-book-quran"></i>  ' + window.api.getLanguage(lang, 'quran')
}

function setupButtonListeners(){
  document.getElementById('playB').addEventListener("click", () => {
    window.api.send("play");
  })
  document.getElementById('stopB').addEventListener("click", () => {
    window.api.send("stop");
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  })
  document.getElementById('settingsWheel').addEventListener("click", () => {
    window.api.send("settingsO");
    navigateTo("../settings/settings.html");
  })
  document.getElementById('quranButton').addEventListener("click", () => {
    navigateTo("../quran/quran.html");
  })
}

function setupTasbih(){
  let tasbih = 0
  let countdown;
  document.getElementById('title').addEventListener("click", () => {
    startTasbih()}
  )

  document.addEventListener('keydown', function(key){
    if (key.key == "Enter" || key.key == " ") startTasbih()
    else if (key.key == "Escape" || key.key == "Backspace" || key.key == "Delete") resetTasbih()
  })

  document.getElementById('title').addEventListener("contextmenu", () => {
    resetTasbih()
  })

  function startTasbih(){
    tasbih ++
    document.getElementById('tasbih').innerHTML = '  | ' + '<i class="fa-solid fa-star-and-crescent"></i>  ' + tasbih
    if (countdown != undefined) clearTimeout(countdown)
    countdown = setTimeout(() =>{
      resetTasbih()
    }, 10000)
  }

  function resetTasbih(){
    tasbih = 0
    document.getElementById('tasbih').innerHTML = ""
  }
}

function setupSunnah(){
  if (prayerTimes != undefined && tomorrowPrayers != undefined){

    if (sunnahTimes.motn || sunnahTimes.totn){
      calculateSunnah()
      document.getElementById("box").style.marginTop = "0"
      if (sunnahTimes.motn && sunnahTimes.totn) document.getElementById("clock").style.marginTop = "1vh";
      else document.getElementById("clock").style.marginTop = "2.5vh";
    }
    else {
      document.getElementById("clock").style.marginTop = "3.5vh"
      document.getElementById("box").style.marginTop = "1.5vh"
    }

    const motnDisplay = sunnahTimes.motn ? "block" : "none";
    for (const el of document.getElementsByClassName("motn")) el.style.display = motnDisplay;

    const totnDisplay = sunnahTimes.totn ? "block" : "none";
    for (const el of document.getElementsByClassName("totn")) el.style.display = totnDisplay;
  }
}

function calculateSunnah(){
  const nightDuration = (tomorrowPrayers.fajr.getTime() - prayerTimes.maghrib.getTime());
  motn = new Date(prayerTimes.maghrib.getTime() +  nightDuration / 2);
  totn = new Date(prayerTimes.maghrib.getTime() +  nightDuration * (2 / 3));
  if (sunnahTimes.totn || sunnahTimes.motn){
    loadPrayers()
  }
}


/**
 * Sets up the update availible modal
 */
function setupUpdateModal(){
  const myModal = new bootstrap.Modal(document.getElementById('updateModal'), {
  })

  const modalButton1 = document.getElementById('modalButton1')
  const modalButton2 = document.getElementById('modalButton2')
  const modalClose = document.getElementById('modalClose')

  window.api.handle('update-available', msg => {
    /*modalTitle.innerText = window.api.getLanguage(lang, 'updateAvalible')
    modalBody.innerText = window.api.getLanguage(lang, 'downloadSoon')
    modalButton1.innerText = window.api.getLanguage(lang, 'ok')*/

    document.getElementById("updateModalLabel").innerText = window.api.getLanguage(lang, 'updateAvailable')
    document.getElementById('modalBody').innerText = `${window.api.getLanguage(lang, 'version')} ${msg[1]} ${window.api.getLanguage(lang, 'available')}`
    modalButton1.innerText = window.api.getLanguage(lang, 'download')
    modalButton2.innerText = window.api.getLanguage(lang, 'later')

    modalButton1.addEventListener("click", () => {
      window.api.openExternal("https://github.com/BenyaminZadehmoradian/Muezzin/releases/latest")
    })
    modalButton2.addEventListener("click", () => {
      myModal.hide()
    })
    modalClose.addEventListener("click", () => {
      myModal.hide()
    })
    
    myModal.show()
  })
}


/**
 * Depending on the hijri day, it loads the icon moon
 * @param {String} day 
 * @returns '<i class="wi wi-whatever-moon"></i>'
 */
function loadMoonIcon(day){
  switch (day){
    case "1":
      return '<i class="wi wi-moon-new"></i>'
    case "2":
        return '<i class="wi wi-moon-waxing-crescent-1"></i>'
    case "3":
      return '<i class="wi wi-moon-waxing-crescent-2"></i>'
    case "4":
      return '<i class="wi wi-moon-waxing-crescent-3"></i>'
    case "5":
      return '<i class="wi wi-moon-waxing-crescent-4"></i>'
    case "6":
      return '<i class="wi wi-moon-waxing-crescent-5"></i>'
    case "7":
      return '<i class="wi wi-moon-waxing-crescent-6"></i>'
    case "8":
      return '<i class="wi wi-moon-first-quarter"></i>'
    case "9":
      return '<i class="wi wi-moon-waxing-gibbous-1"></i>'
    case "10":
      return '<i class="wi wi-moon-waxing-gibbous-2"></i>'
    case "11":
      return '<i class="wi wi-moon-waxing-gibbous-3"></i>'
    case "12":
      return '<i class="wi wi-moon-waxing-gibbous-4"></i>'
    case "13":
      return '<i class="wi wi-moon-waxing-gibbous-5"></i>'
    case "14":
      return '<i class="wi wi-moon-waxing-gibbous-6"></i>'
    case "15":
      return '<i class="wi wi-moon-full"></i>'
    case "16":
      return '<i class="wi wi-moon-waning-gibbous-1"></i>'
    case "17":
      return '<i class="wi wi-moon-waning-gibbous-2"></i>'
    case "18":
      return '<i class="wi wi-moon-waning-gibbous-3"></i>'
    case "19":
      return '<i class="wi wi-moon-waning-gibbous-4"></i>'
    case "20":
      return '<i class="wi wi-moon-waning-gibbous-5"></i>'
    case "21":
      return '<i class="wi wi-moon-waning-gibbous-6"></i>'
    case "22":
      return '<i class="wi wi-wi-moon-third-quarter"></i>'
    case "23":
      return '<i class="wi wi-moon-waning-crescent-1"></i>'
    case "24":
      return '<i class="wi wi-moon-waning-crescent-2"></i>'
    case "25":
      return '<i class="wi wi-moon-waning-crescent-3"></i>'
    case "26":
      return '<i class="wi wi-moon-waning-crescent-4"></i>'
    case "27":
      return '<i class="wi wi-moon-waning-crescent-5"></i>'
    case "28":
      return '<i class="wi wi-moon-waning-crescent-6"></i>'
    case "29":
      return '<i class="wi wi-moon-waning-crescent-6"></i>'
    case "30":
      return '<i class="wi wi-moon-new"></i>'
  }
}

function loadFont(){
  if (lang != "ar" && lang != "bn" && lang != "ru"){
    document.body.style.fontFamily = 'quicksand'
  }

  document.getElementById("clock").style.fontFamily = 'quicksandMono'
  document.getElementById("boxContainer").style.fontFamily = 'quicksandMono'
  
}

function setupBorders(inCalendar = false){
  if (!inCalendar){
    document.getElementById("prayerGrid").style.borderRadius = "0 0 0.5vh 0.5vh"
    if (!totnCheckOG && !motnCheckOG){
      document.getElementById("isha").style.borderBottom = "none"
      document.getElementById("ishaTime").style.borderBottom = "none"
    }
    else if (totnCheckOG){
      document.getElementById("totn").style.borderBottom = "none"
      document.getElementById("totnTime").style.borderBottom = "none"
    }
    else {
      document.getElementById("motn").style.borderBottom = "none"
      document.getElementById("motnTime").style.borderBottom = "none"
    }
  }
  else{
    document.getElementById("prayerGrid").style.borderRadius = "0"
  }
}

function addEffects(){}
