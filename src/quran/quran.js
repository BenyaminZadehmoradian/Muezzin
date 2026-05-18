function navigateTo(url) {
    window.location.assign(url);
}

let lang;
let quran;
let playMode = 'arabic'; // 'arabic' | 'translation' | 'both'
let riaeiSurahs = {};
let currentSurah = null;

let audioElement = new Audio();
let playingAll = false;
let ttsAvailable = null; // null=unknown, true=works, false=broken/unavailable


window.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    await loadRiaeiSurahs();
    setupPlayModeSelector();
    buttonListeners();
    loadQuranList();
    setupPreviousNextButtons()
    setupPlayStopButtons()
    loadFont()
})

//Generates the div for 1 single verse.
//Calls the function to generate the arabText as well
function generateVerse(number, audioURL){
    let verseContainer = createDiv("verseContainer")

    const sidebarDiv = createDiv("sidebar")
    const verseNumberDiv = createDiv("verseNumber")
    const textContainerDiv = createDiv("textContainer")
    const arabTextDiv = createDiv("arabText")
    arabTextDiv.id = `verse${number}`

    verseNumberDiv.innerHTML = number;

    playAudioButton = document.createElement("i")
    playAudioButton.classList.add("fa-solid")
    playAudioButton.classList.add("fa-circle-play")
    playAudioButton.classList.add("versePlay")
    playAudioButton.addEventListener("click", () => {
        playAudio(`https://verses.quran.com/${audioURL}`)
        playingAll = false;
    })

    forwardAudioButton = document.createElement("i")
    forwardAudioButton.classList.add("fa-solid")
    forwardAudioButton.classList.add("fa-forward")
    forwardAudioButton.classList.add("versePlay")
    forwardAudioButton.addEventListener("click", () => {
        const verses = document.getElementsByClassName('verseContainer');
        let progress = parseInt(number.split(":")[1]);
        playingAll = true;
        playAllFromIdx(verses, progress);
    })

    

    sidebarDiv.appendChild(verseNumberDiv)
    sidebarDiv.appendChild(playAudioButton)
    sidebarDiv.appendChild(forwardAudioButton)
    textContainerDiv.dataset.audioURL = audioURL
    textContainerDiv.appendChild(arabTextDiv)

    textContainerDiv.id = `textContainer${number}`

    verseContainer.appendChild(sidebarDiv)
    verseContainer.appendChild(textContainerDiv)

    document.getElementById("reader").appendChild(verseContainer)
}

//Generates the div for 1 single verse. It goes into the local quran.json for that.
//Calls the function to generate the arabText as well
function generateOfflineVerse(number, verse){
    let verseContainer = createDiv("verseContainer")

    const sidebarDiv = createDiv("sidebar")
    const verseNumberDiv = createDiv("verseNumber")
    const textContainerDiv = createDiv("textContainer")
    const arabTextDiv = createDiv("arabText")
    arabTextDiv.id = `verse${number}`
    arabTextDiv.style.fontFamily = "text_uthmani"
    arabTextDiv.style.fontSize = `${quran.fontsize}px`;

    verseNumberDiv.innerHTML = number;
    arabTextDiv.innerHTML = verse;

    sidebarDiv.appendChild(verseNumberDiv)
    textContainerDiv.appendChild(arabTextDiv)

    textContainerDiv.id = `textContainer${number}`

    verseContainer.appendChild(sidebarDiv)
    verseContainer.appendChild(textContainerDiv)

    document.getElementById("reader").appendChild(verseContainer)
}


function playAudio(url){
    if (!audioElement.paused) audioElement.pause()
    audioElement = new Audio(url)
    audioElement.volume = quran.recitation.volume/100
    audioElement.play()
}

function playAudioWithCallback(url, onEnded){
    if (!audioElement.paused) audioElement.pause();
    audioElement = new Audio(url);
    audioElement.volume = quran.recitation.volume / 100;

    // fireOnce ensures onEnded is called exactly once regardless of how the audio ends
    let fired = false;
    function fireOnce(){
        if (!fired){ fired = true; if (onEnded) onEnded(); }
    }

    audioElement.addEventListener('ended', fireOnce, { once: true });
    audioElement.addEventListener('error', () => {
        const err = audioElement.error;
        console.error(`Audio load error [${url.split('/').pop()}]: code=${err?.code} msg=${err?.message}`);
        fireOnce(); // continue the playback chain even on error
    }, { once: true });

    audioElement.play().catch(e => console.error(`Audio play() rejected: ${e.message}`));
}

async function loadRiaeiSurahs(){
    try {
        const res = await fetch('../../ressources/data/riaei_surahs.json');
        riaeiSurahs = await res.json();
    } catch(e) {
        console.error(`Could not load Riaei surah list: ${e}`);
        riaeiSurahs = {};
    }
}

function speakTranslation(text, onEnd){
    if (!('speechSynthesis' in window)) {
        if (onEnd) onEnd();
        return;
    }

    // If TTS already known broken, skip immediately
    if (ttsAvailable === false){
        if (onEnd) onEnd();
        return;
    }

    function doSpeak(){
        let finished = false;
        function done(success){
            if (!finished){
                finished = true;
                clearTimeout(guard);
                if (ttsAvailable === null) ttsAvailable = !!success;
                if (onEnd) onEnd();
            }
        }

        // Hard 6-second cap — avoids hanging the chain when TTS stalls silently
        const guard = setTimeout(() => {
            console.warn('TTS timeout after 6s, marking TTS as unavailable');
            ttsAvailable = false;
            done(false);
        }, 6000);

        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'fa-IR';
        utter.rate = 0.88;
        utter.onend = () => done(true);
        utter.onerror = (e) => { console.error('TTS error:', e.error); ttsAvailable = false; done(false); };

        // Small delay after cancel() to avoid Chromium race condition
        setTimeout(() => window.speechSynthesis.speak(utter), 80);
    }

    // If voices haven't loaded yet, wait up to 1 s for voiceschanged; then proceed anyway
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0){
        doSpeak();
    } else {
        let waited = false;
        const waitTimer = setTimeout(() => {
            if (!waited){ waited = true; doSpeak(); }
        }, 1000);
        window.speechSynthesis.addEventListener('voiceschanged', () => {
            if (!waited){ waited = true; clearTimeout(waitTimer); doSpeak(); }
        }, { once: true });
    }
}

function playTranslationMode(surahNumber){
    if (!surahNumber) return;
    const url = riaeiSurahs[String(surahNumber)];
    if (!url){ console.error(`No Riaei audio for surah ${surahNumber}`); return; }
    playingAll = true;
    playAudioWithCallback(url, () => { playingAll = false; });
}

function playAllFromIdx(verses, startIdx){
    playingAll = true;
    let idx = startIdx;

    function step(){
        if (!playingAll || idx >= verses.length) return;
        const container = document.getElementById(verses[idx].childNodes[1].id);
        const audioURL = container.dataset.audioURL;
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        idx++;

        if (playMode === 'both'){
            const transText = container.dataset.transText || '';
            playAudioWithCallback(`https://verses.quran.com/${audioURL}`, () => {
                if (!playingAll) return;
                if (transText){
                    speakTranslation(transText, () => { if (playingAll) step(); });
                } else {
                    step();
                }
            });
        } else {
            playAudioWithCallback(`https://verses.quran.com/${audioURL}`, () => {
                if (playingAll) step();
            });
        }
    }

    step();
}

function setupPlayModeSelector(){
    const idMap = { arabic: 'modeArabic', translation: 'modeTranslation', both: 'modeBoth' };
    const el = document.getElementById(idMap[playMode] || 'modeArabic');
    if (el) el.checked = true;

    document.querySelectorAll('input[name="playMode"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (!radio.checked) return;
            playMode = radio.value;
            playingAll = false;
            audioElement.pause();
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            window.api.setToStore('quran.playMode', playMode);
        });
    });
}


/**
 * Loads the list of Surahs
 */
async function loadQuranList(){
    let chaptersList = document.getElementById("chaptersList")
    try{
        response = await fetch('../../ressources/quran/chapters.json')
        .then(res => res.json())
        .then((json) => {
            for (let chapter of json["chapters"]){
                const option = document.createElement("option")
                option.value = chapter["id"];
                option.innerText = `[${chapter["id"]}] ${chapter["name_simple"]} - ${chapter["name_arabic"]}`;
                chaptersList.appendChild(option)
            }
            chaptersList.addEventListener("change", () => {
                loadSurah(chaptersList.options[chaptersList.selectedIndex].value)
            })
            chaptersList.selectedIndex = -1
        });
    }catch(e){
        console.error(`Error while loading list of Surahs => ${e}`)
    }
}   

//When selecting a Surah, this is launched.
//Calls the apis for the arabText, latins and translations and applies them.
async function loadSurah(number){
    //stop any audio playing
    playingAll = false;
    audioElement.pause();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    currentSurah = number;
    ttsAvailable = null; // re-probe on each new surah load
    console.debug(`Loading Surah #${number}`);
    document.getElementById("reader").innerHTML = ""
    addBismillahTitle(number)

    // Always include Persian translation (135) for TTS alongside the display translation
    const userTrans = String(quran.translation.trans);
    const transParam = userTrans === '135' ? '135' : `${userTrans},135`;
    // quran.translation.lang is an object {enabled, lang} — extract the lang string
    const langParam = (quran.translation.lang && quran.translation.lang.lang) || quran.translation.lang || 'en';

    let numberPages = 2;
    let page = 1;
    while (page <= numberPages){
        try{
        response = await fetch(
        `https://api.quran.com/api/v4/verses/by_chapter/${number}?language=${langParam}&words=true&translations=${transParam}&word_fields=${quran.font}&page=${page}&audio=${quran.recitation.reciter}`,
        {method: "GET"})
        .then(res => res.json())
        .then((json) => {
            numberPages = json["pagination"]["total_pages"]
            for (let verse of json["verses"]){
                generateVerse(verse["verse_key"], verse["audio"]["url"])
                generateArabText(verse)
                if (quran.transliteration.show){
                    addLatinText(verse)
                }
                addTranslation(verse)
            }
            page++
        });
        }catch(e){
            console.error(`Couldn't load the translation: ${e}`)
            document.getElementById("reader").innerHTML = ""
            addBismillahTitle(number)
            try{
                response = await fetch('../../ressources/quran/quran_en.json'
                , {method: "GET"})
                .then(res => res.json())
                .then((json) => {
                    let verseNumber = 1;
                    for (verse of json[number]["verses"]){
                        generateOfflineVerse(`${number}:${verseNumber}`, json[number-1]["verses"][verseNumber]["text"])
                        if (quran.translation.show) addOfflineLatinText(`${number}:${verseNumber}`, json[number-1]["verses"][verseNumber]["translation"])
                        verseNumber ++;
                    }
                });
            }catch(e){
                console.error(`Couldn't load the offline translation: ${e}`)
            }

            break; //Get out of the loop, because it is not needed offline
        }
    }
}

async function addBismillahTitle(number){
    if (number != 9 && number != 1){
        wordDiv = createDiv("bismillahTitle")
        wordDiv.id = "bismillahTitle"
        wordDiv.innerHTML = "\uf046"
        document.getElementById("reader").appendChild(wordDiv)
    }
}

//Takes the div and the text, divides the text into divs and puts them into the mother div
function generateArabText(verse){
    const textContainerDiv = document.getElementById(`verse${verse["verse_key"]}`)
    for (let word of verse["words"]){
        wordDiv = document.createElement("div");
        wordDiv.style.fontFamily = quran.font
        wordDiv.style.fontSize = `${quran.fontsize}px`;
        wordDiv.classList.add("word")
        wordDiv.innerText = word[quran.font];
        textContainerDiv.appendChild(wordDiv)
    }
}


//Takes a verse made up of words and adds them separatly to the verseContainer
//Possibility to add mouseOver events later on.
function addLatinText(verse){
    const textContainerDiv = document.getElementById(`textContainer${verse["verse_key"]}`)
    const latinTextDiv = createDiv("latinText")
    
    for (let word of verse["words"]){
        const wordDiv = document.createElement("div")
        wordDiv.classList.add("wordLatin")
        wordDiv.innerText = word["transliteration"]["text"]
        latinTextDiv.appendChild(wordDiv)
    }
    latinTextDiv.style.fontSize = `${quran.transliteration.fontsize}px`;
    textContainerDiv.appendChild(latinTextDiv)
}

//Takes a verse made up of words and adds them separatly to the verseContainer
//Possibility to add mouseOver events later on.
function addOfflineLatinText(key, verse){
    const textContainerDiv = document.getElementById(`textContainer${key}`)
    const latinTextDiv = createDiv("latinText")
    
    latinTextDiv.innerText = verse

    latinTextDiv.style.fontSize = `${quran.transliteration.fontsize}px`;
    textContainerDiv.appendChild(latinTextDiv)
}

//Takes a verse and loads the translation to the textContainerDiv.
//Always stores Persian (ID 135) text in dataset for TTS; only displays if quran.translation.show is true.
function addTranslation(verse){
    const textContainerDiv = document.getElementById(`textContainer${verse["verse_key"]}`)
    const translations = verse["translations"] || [];

    // Store clean Persian text for TTS (translation ID 135)
    const persianTrans = translations.find(t => t.resource_id === 135);
    if (persianTrans){
        const tmp = document.createElement('div');
        tmp.innerHTML = persianTrans.text;
        textContainerDiv.dataset.transText = tmp.textContent;
    }

    // Only display if setting is enabled
    if (!quran.translation.show || translations.length === 0) return;

    const displayTrans = translations.find(t => t.resource_id === quran.translation.trans) || translations[0];
    if (!displayTrans) return;

    const transTextDiv = createDiv("transText")
    transTextDiv.innerHTML = displayTrans.text;
    transTextDiv.style.fontSize = `${quran.translation.fontsize}px`;
    textContainerDiv.appendChild(transTextDiv)
}


//Creates a div with the class name = divClass
function createDiv(divClass){
    const divv = document.createElement("div");
    divv.classList.add(divClass);
    return divv;
}

//Loads all the necessary settings
async function loadSettings(){
    lang = await window.api.getFromStore('language', 'en')
    translate()
    
    quran = await window.api.getFromStore('quran', {
        font: "text_uthmani",
        fontsize: 42,
        recitation:{
            reciter: "7",
            volume: 50
          },
        translation:{
            show: true,
            lang: {
              enabled: false,
              lang: "en"
            },
            trans: 131,
            fontsize: 14
        },
        transliteration:{
            show: true,
            fontsize: 14
        },
    })

    playMode = await window.api.getFromStore('quran.playMode', 'arabic');

    const darkmode = await window.api.getFromStore('darkMode', false)
    window.api.setTheme(darkmode, "quran.css");

    document.getElementById("volSlider").value = quran.recitation.volume
}

function buttonListeners(){
    document.getElementById("settings").addEventListener("click", async () => {
        await Promise.all([
            window.api.setToStore("quran.recitation.volume", document.getElementById("volSlider").value),
            window.api.setToStore("quran.playMode", playMode)
        ]);
        navigateTo("../settings/settings.html?page=quran");
    })

    document.getElementById("return").addEventListener("click", async () => {
        await Promise.all([
            window.api.setToStore("quran.recitation.volume", document.getElementById("volSlider").value),
            window.api.setToStore("quran.playMode", playMode)
        ]);
        navigateTo("../main/index.html");
    })

    document.getElementById("toTheTop").addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    })
}

//Does not work yet, I'll have to work on this one.
function downloadOrFetch(link, path, filename){
    const absolutePath = appDataPath + path
    const file = new File(absolutePath + filename)

    if (file.exists()){
        console.log("yes")
    }

    else{
        window.api.send("download", {
        url: link,
        properties: {
            directory: absolutePath,
            filename: filename
            }
        });
    }
}

function translate(){
    document.title = `${window.api.getLanguage(lang, "azan")} - ${window.api.getLanguage(lang, "quran")}`;
    document.getElementById("title").innerHTML = window.api.getLanguage(lang, "quran");
    document.getElementById("settings").innerHTML = '<i class="fa-solid fa-gear"></i>  ' + window.api.getLanguage(lang, "settings");
    document.getElementById("return").innerHTML = '<i class="fa fa-arrow-circle-left"></i>    ' + window.api.getLanguage(lang, "return");
    document.getElementById("previousSurah").innerHTML = window.api.getLanguage(lang, "previous");
    document.getElementById("nextSurah").innerHTML = window.api.getLanguage(lang, "next");
}

function setupPreviousNextButtons(){
    let chapterList = document.getElementById("chaptersList")
    let previous = document.getElementById("previousSurah")
    let next = document.getElementById("nextSurah")
    previous.disabled = true;
    chapterList.addEventListener("change", () => {
        previous.disabled = false;
        next.disabled = false;
        if (chaptersList.options[chaptersList.selectedIndex].value == 1){
            previous.disabled = true;
        } else if (chaptersList.options[chaptersList.selectedIndex].value == 114){
            next.disabled = true;
        }
    })

    previous.addEventListener("click", () => {
        if (!previous.disabled){
            chapterList.selectedIndex -= 1;
            chapterList.dispatchEvent(new Event('change'))
        }
    })

    next.addEventListener("click", () => {
        if (!next.disabled){
            chapterList.selectedIndex += 1;
            chapterList.dispatchEvent(new Event('change'))
        }
    })
}

function setupPlayStopButtons(){
    document.getElementById("playB").addEventListener("click", () => {
        const verses = document.getElementsByClassName('verseContainer');
        if (verses.length === 0) return;

        // Always stop anything currently playing before starting fresh
        playingAll = false;
        audioElement.pause();
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();

        if (playMode === 'translation'){
            playTranslationMode(currentSurah);
            return;
        }

        // arabic or both: play surah from beginning
        const surahNumber = verses[0].childNodes[1].id.split(":")[0].replace("textContainer", "");

        if (surahNumber != 9 && surahNumber != 1){
            document.getElementById("bismillahTitle").scrollIntoView();
            playAudioWithCallback("https://verses.quran.com/Shuraym/mp3/001001.mp3", () => {
                playAllFromIdx(verses, 0);
            });
        } else {
            playAllFromIdx(verses, 0);
        }
    })

    document.getElementById("stopB").addEventListener("click", () => {
        playingAll = false;
        audioElement.pause();
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    })

    const volSlider = document.getElementById("volSlider");
    volSlider.addEventListener("change", () => {
        audioElement.volume = volSlider.value / 100;
        quran.recitation.volume = volSlider.value;
    });
}

function loadFont(){
    if (lang != "ar" && lang != "bn"){
        document.body.style.fontFamily = 'quicksand'
    }
}