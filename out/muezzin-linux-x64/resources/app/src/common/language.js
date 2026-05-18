module.exports = {
    loadTrans: function loadTranslation(lang, value) {
        return dict[lang][value];
    },
    langAvailable: function langAvailable(lang){
        return (lang in dict);
    }
}

var dict = {
    en: {  
        'settings': 'Settings', //settingsTitle
        'language': 'Language', //langText
        'timeformat': 'Time format', //tfText
        '24hour': '24 Hour', //24hTimeFormatText
        '12hour': '12 Hour', //12hTimeFormatText
        'showSseconds': 'Show seconds', //showSecondsText
        'dateFormat': 'Date format', //dfText
        'dateFormat1': 'DD/MM/YYYY', //id="df1Text"
        'dateFormat2': 'MM/DD/YYYY', //id="df2Text"
        'dateFormat3': 'YYYY/MM/DD', //id="df3Text"
        'notifications': 'Notifications', //notifText
        'notifCheck': 'Enable notifications', //notifCheckText
        'coordinates': 'Coordinates', //coordinatesText
        'latitude': 'Latitude', //latText
        'longitude': 'Longitude', //lonText
        'timezone': 'Time zone', // tzText
        'adhan': 'Adhan', //adhanText and others in main
        'adhanCheck': 'Enable Adhan', //adhanCheckText
        'AdhanMecca': 'Adhan Mecca', //adhanMeccaText //Traduire juste Mecca
        'adhanAqsa': 'Adhan al-Aqsa', //adhanAqsaText
        'customAdhan': 'Custom Adhan', //customAdhanText
        'duaAfterAdhan': "Du'a after Adhan", //duaAfterText
        'theme': 'Theme', //themeText
        'darkMode': 'Dark Mode', //darkModeText
        'bgImage': 'Background Image', //bgImageText
        'bgImageCheck': 'Enable Background Image', //bgImageCheckText
        'calcMethods': 'Calculation Methods', //calcMethodsText
        'mwl': 'Muslim World League', //MWL
        'egyptian': 'Egyptian', //Egyptian
        'karachi': 'Karachi', //Karachi
        'uaq': 'Umm al-Qura', //UAQ
        'dubai': 'Dubai', //Dubai
        'qatar': 'Qatar', //Qatar
        'kuwait': 'Kuwait', //Kuwait
        'mc': 'Moonsighting Committee', //MC //pas traduire ça
        'singapore': 'Singapore', //Singapore
        'turkey': 'Turkey', //Turkey
        'tehran': 'Tehran', //Tehran
        'isna': 'ISNA (NA)', //ISNA
        'madhab': 'Madhab', //MadhabText
        'shafi': 'Shafi', //shafi
        'hanafi': 'Hanafi', //Hanafi
        'hlr': 'High Latitude Rule', //hlrText
        'motn': 'Middle of the Night', //MOTN
        'sotn': 'Seventh of the Night', //SOTN
        'ta': 'Twilight Angle', //TA
        'pcr': 'Polar Circle Resolution', //pcrText
        'cc': 'Closest City', //CC
        'cd': 'Closest Date', //CD
        'und': 'Do not calculate', //UND
        'shafaq': 'Shafaq', //ShafaqText
        'general': 'General', //shafaqG
        'ahmer': 'Red Twilight (ahmer)', //shafaqR
        'abyad': 'White Twilight (abyad)', //shafaqW
        'return': 'Return', //return
        'general': 'General', //v-pills-general-tab
        'location': 'Location', //v-pills-location-tab
        'audio': 'Audio', //v-pills-audio-tab
        'appearance': 'Appearance', //v-pills-appearance-tab
        'advanced': 'Advanced', //v-pills-advanced-tab
        'azan': 'Azan',
        'autoStart': 'Auto Start', //autoStartText
        'startAtLaunch': 'Start at launch', //autoStartCheckText
        'copyright': 'Copyright 2022, Azan, All rights reserved.', //copyright
        'quote': '... Indeed, prayer has been decreed upon the believers a decree of specified times.', //quote //à rechercher sur internet, la traduction sur internet est très mauvaise
        'source': "Qur'an: 4/103", //source
        'fajr': 'Fajr',
        'sunrise': 'Sunrise',
        'dhuhr': 'Dhuhr',
        'asr': 'Asr',
        'maghrib': 'Maghrib',
        'isha': 'Isha',
        'now': 'Now',
        'timeUntil': 'Time until',
        'startUpSound': 'Start Up Sound', //startUpSoundText
        'playSound': 'Play sound on startup', //startUpSoundText2
        'sysTray': 'System tray', //systrayText
        'minToTray': 'Minimize to tray', //systrayCheckText
        'customSettings': 'Custom settings', //customSettText
        'enableCS': 'Enable Custom Calculation Settings', //enableCalcText
        'fAngle': 'Fajr Angle', //fajrAngleText
        'mAngle': 'Maghrib Angle', //maghribAngleText
        'iAngle': 'Isha Angle', //ishaAngleText
        'delayAfterM': 'Delay after Maghrib', //delayText
        'delayMin': 'Delay (minutes)', //delayFormText
        'france': 'France', //France12 15 & 18
        'russia': 'Russia', //Russia
        'gulf': 'Gulf Region', //Gulf
        'preferences': 'Preferences', //menu label
        'resetSettings': 'Reset settings', //menu label
        'adjustements': 'Adjustments', //adjustmentsText
        'here': 'here',
        'enableAdj': 'Enable adjustments', //adjCheckText
        'fajrAdj': 'Fajr Adjustments', //fajrAdjText
        'dhuhrAdj': 'Dhurh Adjustments', //fajrAdjText
        'asrAdj': 'Asr Adjustments', //fajrAdjText
        'maghribAdj': 'Maghrib Adjustments', //fajrAdjText
        'ishaAdj': 'Isha Adjustments', //fajrAdjText
        'showSunnah': 'Show Sunnah times', //sunnahTimesText
        'motn': 'Middle of the night',  //MOTNCheckText
        'totn': 'Third of the night', //TOTNCheckText
        'minStart': 'Start minimized', //minStartCheckText
        'updateAvailable': 'Update available',
        'version': 'Version',
        'available': 'is available for download on GitHub',
        'download': 'Download',
        'later': 'Later',
        'quran': "Qur'an",
        'font': 'Font',
        'fontsize': 'Font size',
        'translation': 'Translation',
        'showTrans': 'Show translation',
        'diffLang': 'Different language from app',
        'transliteration': 'Transliteration',
        'showTransliteration': 'Show transliteration',
        'previous': 'Previous Surah',
        'next': 'Next Surah',
        'weather': 'Weather',
        'showWeather': 'Show weather',
        'units': 'Units',
        'celsius': 'Celsius',
        'kelvin': 'Kelvin',
        'fahrenheit': 'Fahrenheit',
        'playDua': "Play Du'a after Adhan",
        'open': 'Open',
        'quit': 'Quit',
        'ahmedNufeis': 'Ahmed Al-Nufais',
        'customFajr': 'Custom Fajr Adhan',
        'recitation': 'Recitation',
        'reciter': 'Reciter',
        "customTimes": "Custom Times",
        "enableCustomTimes" : "Enable custom times",
        "jumuah" : "Jumuah",
        "jumuahTime": "Jumuah Time",
        "enableJumuahTime": "Enable Jumuah Time",
        "shortAllahuAkbar": "Short sound - Mishary Rashid Alafasy",
        "hijriAdjTitle" : "Hijri date adjustments",
        "hijriAdjText" : "Hijri date difference",

    },
    ar: {
        'settings': 'الإعدادات', //settingsTitle
        'language': 'لغة', //langText
        'timeformat': 'تنسيق الوقت', //tfText
        '24hour': '24', //24hTimeFormatText  
        '12hour': '12', //12hTimeFormatText
        'showSseconds': 'عرض الثواني', //showSecondsText
        'dateFormat': 'صيغة التاريخ', //dfText
        'dateFormat1': 'DD/MM/YYYY', //id="df1Text"
        'dateFormat2': 'MM/DD/YYYY', //id="df2Text"
        'dateFormat3': 'YYYY/MM/DD', //id="df3Text"
        'notifications': 'إشعارات', //notifText
        'notifCheck': 'تمكين الإخطارات', //notifCheckText
        'coordinates': ' إحداثيات', //coordinatesText
        'latitude': 'خط العرض', //latText
        'longitude': ' خط الطول', //lonText
        'timezone': 'وحدة زمنية', // tzText
        'adhan': 'الأذان', //adhanText and others in main
        'adhanCheck': 'تمكين الأذان', //adhanCheckText
        'AdhanMecca': 'أذان مكة', //adhanMeccaText //Traduire juste Mecca
        'adhanAqsa': 'أذان الأقصى', //adhanAqsaText
        'customAdhan': 'مخصص الأذان', //customAdhanText
        'duaAfterAdhan': "دعاء بعد الأذان", //duaAfterText
        'theme': 'سمة', //themeText
        'darkMode': 'الوضع الداكن', //darkModeText
        'bgImage': 'الصورة الخلفية', //bgImageText
        'bgImageCheck': 'تمكين صورة الخلفية', //bgImageCheckText
        'calcMethods': 'طرق الحساب', //calcMethodsText
        'mwl': 'رابطة العالم الإسلامي', //MWL
        'egyptian': 'مصرية', //Egyptian
        'karachi': 'كراتشي', //Karachi
        'uaq': 'أم القرى', //UAQ
        'dubai': 'دبي', //Dubai
        'qatar': 'دولة قطر', //Qatar
        'kuwait': 'الكويت', //Kuwait
        'mc': 'لجنة الهلال', //MC //pas traduire ça
        'singapore': 'سنغافورة', //Singapore
        'turkey': 'ديك رومى', //Turkey
        'tehran': 'طهران', //Tehran
        'isna': 'ISNA (أمريكا)', //ISNA
        'madhab': 'مدهب', //MadhabText
        'shafi': 'شافي', //shafi
        'hanafi': 'حنفي', //Hanafi
        'hlr': 'قاعدة خط العرض العليا', //hlrText
        'motn': 'منتصف الليل', //MOTN
        'sotn': 'السابع من الليل', //SOTN
        'ta': 'زاوية الشفق', //TA
        'pcr': 'قرار الدائرة القطبية', //pcrText
        'cc': 'اقرب مدينة', //CC
        'cd': 'أقرب تاريخ', //CD
        'und': 'لا تحسب', //UND
        'shafaq': 'شفق', //ShafaqText
        'general': 'عام', //shafaqG
        'ahmer': 'أحمر', //shafaqR
        'abyad': 'أبيض', //shafaqW
        'return': 'إرجاع', //return
        'general': 'عام', //v-pills-general-tab
        'location': 'موقع', //v-pills-location-tab
        'audio': 'صوتي', //v-pills-audio-tab
        'appearance': 'مظهر', //v-pills-appearance-tab
        'advanced': 'متقدم', //v-pills-advanced-tab
        'azan': 'مؤذن',
        'autoStart': 'بدء تلقائي', //autoStartText
        'startAtLaunch': 'ابدأ عند الإطلاق', //autoStartCheckText
        'copyright': 'Copyright 2022, Azan, All rights reserved.', //copyright
        'quote': 'إِنَّ الصَّلاةَ كانَت عَلَى المُؤمِنينَ كِتابًا مَوقوتًا ...', //quote //à rechercher sur internet, la traduction sur internet est très mauvaise
        'source': "القرآن: 4/103", //source
        'fajr': 'الفجر',
        'sunrise': 'شروق',
        'dhuhr': 'الظهر',
        'asr': 'العصر',
        'maghrib': 'المغرب',
        'isha': 'العشاء ',
        'now': 'الآن',
        'timeUntil': 'الوقت حتى',
        'startUpSound': 'بدء الصوت', //startUpSoundText
        'playSound': 'تشغيل الصوت عند بدء التشغيل', //startUpSoundText2
        'sysTray': 'علبة النظام', //systrayText
        'minToTray': 'تقليل الدرج', //systrayCheckText
        'customSettings': 'إعدادات مخصصة', //customSettText
        'enableCS': 'تمكين إعدادات حساب مخصص', //enableCalcText
        'fAngle': 'زاوية الفجر', //fajrAngleText
        'mAngle': 'زاوية المغرب', //maghribAngleText
        'iAngle': 'زاوية الاسما', //ishaAngleText
        'delayAfterM': 'تأخير بعد المغرب', //delayText
        'delayMin': 'تأخير (دقائق) ', //delayFormText
        'france': 'فرنسا', //France12 15 & 18
        'russia': 'روسيا', //Russia
        'gulf': 'منطقة الخليج ', //Gulf
        'preferences': 'تفضيلات', //menu label
        'resetSettings': 'اعادة الضبط', //menu label
        'adjustements': 'التعديلات', //adjustmentsText
        'enableAdj': 'تمكين التعديلات', //adjCheckText
        'fajrAdj': 'تعديلات الفجر', //fajrAdjText
        'dhuhrAdj': 'دوس تعديلات', //fajrAdjText
        'asrAdj': 'تعديلات العصر', //fajrAdjText
        'maghribAdj': 'تعديلات المغربs', //fajrAdjText
        'ishaAdj': 'تعديلات العشاء', //fajrAdjText
        'showSunnah': 'أظهر سناه مرات', //sunnahTimesText
        'motn': 'منتصف الليل',  //MOTNCheckText
        'totn': 'ثالثا من الليل', //TOTNCheckText
        'minStart': 'بداية الحد الادنى ', //minStartCheckText
        'updateAvailable': 'التحديث متاح',
        'version': 'الإصدار',
        'available': 'متاح للتحميل على جيثب',
        'download': 'تحميل',
        'later': 'فيما بعد',
        'quran': "القرآن",
        'font': 'الخط',
        'fontsize': 'حجم الخط',
        'translation': 'ترجمة',
        'showTrans': 'إظهار الترجمة',
        'diffLang': 'لغة مختلفة عن التطبيق',
        'transliteration': 'التحويل الصوتي',
        'showTransliteration': 'إظهار التحويل الصوتي',
        'previous': 'السورة السابقة',
        'next': 'السورة القادمة',
        'weather': 'الطقس',
        'showWeather': 'عرض الطقس',
        'units': 'الوحدات',
        'celsius': 'درجة مئوية',
        'kelvin': 'كيلفن',
        'fahrenheit': 'فهرنهايت',
        'playDua': "لعب الدعاء بعد الأذان",
        'open': "افتح",
        'quit': "اغلاق",
        'ahmedNufeis': 'أحمد النفيس',
        'customFajr': 'مخصص فجر آذان',
        'recitation': 'التلاوة',
        'reciter': 'القارئ',
        "customTimes": "الأوقات المخصصة",
        "enableCustomTimes" : "تفعيل الأوقات المخصصة",
        "jumuah" : "جمعة",
        "jumuahTime": "وقت الجمعة",
        "enableJumuahTime": "تفعيل وقت الجمعة",
        "shortAllahuAkbar": "صوت قصير",
        "hijriAdjTitle" : "تعديلات التاريخ الهجري",
        "hijriAdjText" : "فرق التاريخ الهجري",
    },
    fa: {  
        'settings': 'تنظیمات', //settingsTitle
        'language': 'ژبان', //langText
        'timeformat': 'قالب زمان', //tfText
        '24hour': '۲۴ ساعت', //24hTimeFormatText
        '12hour': '۱۲ ساعت', //12hTimeFormatText
        'showSseconds': 'نمایش ثانیه ها', //showSecondsText
        'dateFormat': 'قالب تاریخ', //dfText
        'dateFormat1': 'DD/MM/YYYY', //id="df1Text"
        'dateFormat2': 'MM/DD/YYYY', //id="df2Text"
        'dateFormat3': 'YYYY/MM/DD', //id="df3Text"
        'notifications': 'اعلان ها', //notifText
        'notifCheck': 'فعال کردن اعلان ها', //notifCheckText
        'coordinates': 'مختصات', //coordinatesText
        'latitude': 'عرض جغرافیایی', //latText
        'longitude': 'طول جغرافیایی', //lonText
        'timezone': 'منطقه زمانی', // tzText
        'adhan': 'اذان', //adhanText and others in main
        'adhanCheck': 'فعال کردن اذان', //adhanCheckText
        'AdhanMecca': 'اذان مکه', //adhanMeccaText //Traduire juste Mecca
        'adhanAqsa': 'اذان مسجد الاقصی', //adhanAqsaText
        'customAdhan': 'اذان دلخواه', //customAdhanText
        'duaAfterAdhan': "دعا بعد از اذان", //duaAfterText
        'theme': 'رنگ بندی', //themeText
        'darkMode': 'حالت تاریک', //darkModeText
        'bgImage': 'عکس زمینه', //bgImageText
        'bgImageCheck': 'فعال کردن عکس زمینه', //bgImageCheckText
        'calcMethods': 'روش های محاسبه', //calcMethodsText
        'mwl': 'لیگ جهانی مسلمانان', //MWL
        'egyptian': 'مصری', //Egyptian
        'karachi': 'کراچی', //Karachi
        'uaq': 'ام القری', //UAQ
        'dubai': 'دبی', //Dubai
        'qatar': 'قطر', //Qatar
        'kuwait': 'کویت', //Kuwait
        'mc': 'کمیته رویت هلال ماه', //MC //pas traduire ça
        'singapore': 'سنگاپور', //Singapore
        'turkey': 'ترکیه', //Turkey
        'tehran': 'تهران', //Tehran
        'isna': 'روش ایسنا', //ISNA
        'madhab': 'مذهب', //MadhabText
        'shafi': 'شافی', //shafi
        'hanafi': 'حنفی', //Hanafi
        'hlr': 'شرط عرض جغرافیایی بالا', //hlrText
        'motn': 'نیمه شب', //MOTN
        'sotn': 'یک هفتم شب', //SOTN
        'ta': 'زاویه گرگ و میش', //TA
        'pcr': 'محاسبه مناطق قطبی', //pcrText
        'cc': 'نزدیک ترین شهر', //CC
        'cd': 'نزدیک ترین تاریخ', //CD
        'und': 'محاسبه نکن', //UND
        'shafaq': 'شفق', //ShafaqText
        'general': 'عمومی', //shafaqG
        'ahmer': 'گرگ و میش قرمز (احمر)', //shafaqR
        'abyad': 'گرگ و میش سفید (ابیض)', //shafaqW
        'return': 'بازگشت', //return
        'general': 'عمومی', //v-pills-general-tab
        'location': 'موقعیت مکانی', //v-pills-location-tab
        'audio': 'صدا', //v-pills-audio-tab
        'appearance': 'ظاهر', //v-pills-appearance-tab
        'advanced': 'پیشرفته', //v-pills-advanced-tab
        'azan': 'مؤذن',
        'autoStart': 'باز شدن خودکار', //autoStartText
        'startAtLaunch': 'باز شدن هنگان راه اندازی', //autoStartCheckText
        'copyright': 'Copyright 2022, Azan, All rights reserved.', //copyright
        'quote': 'همانا نماز بر مؤمنان، در اوقات معین مقرر شده است ...', //quote //à rechercher sur internet, la traduction sur internet est très mauvaise
        'source': "قرآن: سوره نساء، آیه ۱۰۳", //source
        'fajr': 'فجر',
        'sunrise': 'طلوع',
        'dhuhr': 'ظهر',
        'asr': 'عصر',
        'maghrib': 'مغرب',
        'isha': 'عشاء',
        'now': 'الآن',
        'timeUntil': 'مانده تا',
        'startUpSound': 'صدای راه اندازی', //startUpSoundText
        'playSound': 'پخش صدا هنگام راه اندازی', //startUpSoundText2
        'sysTray': 'تنظیمات سیستم', //systrayText
        'minToTray': 'پنهان کردن برنامه به جای بستن', //systrayCheckText
        'customSettings': 'تنظیمات دلخواه', //customSettText
        'enableCS': 'فعال کردن تنظیمات دلخواه محاسبه', //enableCalcText
        'fAngle': 'زاویه فجر', //fajrAngleText
        'mAngle': 'زاویه مغرب', //maghribAngleText
        'iAngle': 'زاویه عشاء', //ishaAngleText
        'delayAfterM': 'تاخیر پس از مغرب', //delayText
        'delayMin': 'تاخیر (دقیقه)', //delayFormText
        'france': 'فرانسه', //France12 15 & 18
        'russia': 'روسیه', //Russia
        'gulf': 'منطقة الخليج', //Gulf
        'preferences': 'تنظیمات', //menu label
        'resetSettings': 'بازنشانی تنظیمات', //menu label
        'adjustements': 'تنظیمات زمان', //adjustmentsText
        'here': 'اینجا',
        'enableAdj': 'فعال کردن تنظیمات زمان', //adjCheckText
        'fajrAdj': 'تغییرات فجر', //fajrAdjText
        'dhuhrAdj': 'تغییرات ظهر', //fajrAdjText
        'asrAdj': 'تغییرات عصر', //fajrAdjText
        'maghribAdj': 'تغییرات مغرب', //fajrAdjText
        'ishaAdj': 'تغییرات عشاء', //fajrAdjText
        'showSunnah': 'نمایش زمان های سنت', //sunnahTimesText
        'motn': 'نیمه شب',  //MOTNCheckText
        'totn': 'یک سوم نهایی شب', //TOTNCheckText
        'minStart': 'شروع به صورت کمینه', //minStartCheckText
        'updateAvailable': 'آپدیت موجود است',
        'version': 'نسخه',
        'available': 'برای دانلود بر روی گیت هاب موجود است',
        'download': 'دانلود',
        'later': 'بعداً',
        'quran': "قرآن",
        'font': 'فونت',
        'fontsize': 'اندازه فونت',
        'translation': 'ترجمه',
        'showTrans': 'نمایش ترجمه',
        'diffLang': 'زبان متفاوت از برنامه',
        'transliteration': 'آوانگاری',
        'showTransliteration': 'نمایش آوانگاری',
        'previous': 'سوره قبلی',
        'next': 'سوره بعدی',
        'weather': 'آب و هوا',
        'showWeather': 'نمایش آب و هوا',
        'units': 'واحد',
        'celsius': 'سلسیوس',
        'kelvin': 'کلوین',
        'fahrenheit': 'فارنهایت',
        'playDua': "پخش دعا پس از اذان",
        'open': 'باز کردن',
        'quit': 'خارج شدن',
        'ahmedNufeis': 'أحمد النفيس',
        'customFajr': 'اذان دلخوله فجر',
        'recitation': 'قرائت',
        'reciter': 'قاری',
        "customTimes": "زمان های دلخواه",
        "enableCustomTimes" : "فعال کردن زمان های دلخواه",
        "jumuah" : "جماعت",
        "jumuahTime": "زمان جماعت",
        "enableJumuahTime": "فعال کردن زمان جماعت",
        "shortAllahuAkbar": "صدای کوتاه - مشاری بن راشد العفاسی",
        "hijriAdjTitle" : "تغییرات تاریخ هجری",
        "hijriAdjText" : "اختلاف تاریخ هجری",
    },
}
