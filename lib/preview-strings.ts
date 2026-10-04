import type { Lang } from "./translations";

// Copy for the Bugatti-direction preview (/preview). Sentence case throughout —
// display case is applied by the mono label style, not baked into the strings.
export interface PreviewStrings {
  greeting: { morning: string; afternoon: string; evening: string };
  listen: string;
  radio: string;
  playlist: string;
  bluetooth: string;
  nowPlaying: string;
  nothingPlaying: string;
  chooseStation: string;
  choosePlaylist: string;
  offline: string;
  tapToChoose: string;
  volume: string;
  climate: string;
  warmer: string;
  cooler: string;
  passTheTime: string;
  passTheTimeSub: string;
  tipAmish: string;
  tipSub: string;
  askAmish: string;
  route: string;
  charger: string;
  snacks: string;
  wipes: string;
  mints: string;
  fastest: string;
  changeDest: string;
  motorway: string;
  toldAmish: string;
  sent: string;
  close: string;
  back: string;
  games: string;
  gamesSub: string;
  trivia: string;
  triviaSub: string;
  chat: string;
  chatSub: string;
  cash: string;
  cashSub: string;
  uber: string;
  uberSub: string;
  revolut: string;
  revolutSub: string;
  settings: string;
  contactAmish: string;
  fullScreen: string;
  exitFullScreen: string;
  voiceOutput: string;
  voiceDriver: string;
  voicePassenger: string;
  btTitle: string;
  btLookFor: string;
  call: string;
}

export const PREVIEW_STRINGS: Record<Lang, PreviewStrings> = {
  en: {
    greeting: {
      morning: "Good morning. Amish is your driver.",
      afternoon: "Good afternoon. Amish is your driver.",
      evening: "Good evening. Amish is your driver.",
    },
    listen: "Listen",
    radio: "Radio",
    playlist: "Playlists",
    bluetooth: "Bluetooth",
    nowPlaying: "Now playing",
    nothingPlaying: "Nothing playing",
    chooseStation: "Choose a station",
    choosePlaylist: "Choose a playlist",
    offline: "Offline",
    tapToChoose: "Tap to choose",
    volume: "Volume",
    climate: "Climate",
    warmer: "Warmer",
    cooler: "Cooler",
    passTheTime: "Pass the time",
    passTheTimeSub: "Games · Trivia · Chat",
    tipAmish: "Leave a tip for Amish",
    tipSub: "Cash · Uber · Revolut",
    askAmish: "Ask Amish",
    route: "Route",
    charger: "Phone charger",
    snacks: "Snacks",
    wipes: "Wet wipes",
    mints: "Sweets and mints",
    fastest: "Fastest route",
    changeDest: "Change destination",
    motorway: "Take the motorway",
    toldAmish: "Told Amish",
    sent: "Sent",
    close: "Close",
    back: "Back",
    games: "Games",
    gamesSub: "Tic-tac-toe · Rock paper scissors · Memory",
    trivia: "Trivia",
    triviaSub: "Quiz · Riddles",
    chat: "Chat",
    chatSub: "A topic to talk about",
    cash: "Cash",
    cashSub: "Hand it to Amish at drop-off",
    uber: "Through Uber",
    uberSub: "Tip in the app after your ride",
    revolut: "Revolut",
    revolutSub: "Scan a QR code",
    settings: "Settings",
    contactAmish: "Contact Amish",
    fullScreen: "Full screen",
    exitFullScreen: "Exit full screen",
    voiceOutput: "Voice to Amish",
    voiceDriver: "English",
    voicePassenger: "Your language",
    btTitle: "Connect by Bluetooth",
    btLookFor: "Look for",
    call: "Call",
  },
  es: {
    greeting: {
      morning: "Buenos días. Amish es su conductor.",
      afternoon: "Buenas tardes. Amish es su conductor.",
      evening: "Buenas noches. Amish es su conductor.",
    },
    listen: "Escuchar",
    radio: "Radio",
    playlist: "Listas",
    bluetooth: "Bluetooth",
    nowPlaying: "Sonando",
    nothingPlaying: "Nada sonando",
    chooseStation: "Elija una emisora",
    choosePlaylist: "Elija una lista",
    offline: "Sin señal",
    tapToChoose: "Toque para elegir",
    volume: "Volumen",
    climate: "Clima",
    warmer: "Más cálido",
    cooler: "Más fresco",
    passTheTime: "Para pasar el rato",
    passTheTimeSub: "Juegos · Trivia · Charla",
    tipAmish: "Dejar propina a Amish",
    tipSub: "Efectivo · Uber · Revolut",
    askAmish: "Pedir a Amish",
    route: "Ruta",
    charger: "Cargador de teléfono",
    snacks: "Aperitivos",
    wipes: "Toallitas húmedas",
    mints: "Caramelos y mentas",
    fastest: "Ruta más rápida",
    changeDest: "Cambiar destino",
    motorway: "Ir por autopista",
    toldAmish: "Avisado a Amish",
    sent: "Enviado",
    close: "Cerrar",
    back: "Volver",
    games: "Juegos",
    gamesSub: "Tres en raya · Piedra papel tijera · Memoria",
    trivia: "Trivia",
    triviaSub: "Quiz · Adivinanzas",
    chat: "Charla",
    chatSub: "Un tema de conversación",
    cash: "Efectivo",
    cashSub: "Entréguela a Amish al llegar",
    uber: "Por Uber",
    uberSub: "Desde la app tras el viaje",
    revolut: "Revolut",
    revolutSub: "Escanee un código QR",
    settings: "Ajustes",
    contactAmish: "Contactar a Amish",
    fullScreen: "Pantalla completa",
    exitFullScreen: "Salir de pantalla completa",
    voiceOutput: "Voz para Amish",
    voiceDriver: "Inglés",
    voicePassenger: "Su idioma",
    btTitle: "Conectar por Bluetooth",
    btLookFor: "Busque",
    call: "Llamar",
  },
  ur: {
    greeting: {
      morning: "صبح بخیر۔ امیش آپ کے ڈرائیور ہیں۔",
      afternoon: "سہ پہر بخیر۔ امیش آپ کے ڈرائیور ہیں۔",
      evening: "شام بخیر۔ امیش آپ کے ڈرائیور ہیں۔",
    },
    listen: "سنیں",
    radio: "ریڈیو",
    playlist: "پلے لسٹ",
    bluetooth: "بلوٹوتھ",
    nowPlaying: "ابھی چل رہا ہے",
    nothingPlaying: "کچھ نہیں چل رہا",
    chooseStation: "اسٹیشن منتخب کریں",
    choosePlaylist: "پلے لسٹ منتخب کریں",
    offline: "آف لائن",
    tapToChoose: "منتخب کرنے کے لیے ٹچ کریں",
    volume: "آواز",
    climate: "درجہ حرارت",
    warmer: "گرم",
    cooler: "ٹھنڈا",
    passTheTime: "وقت گزاریں",
    passTheTimeSub: "گیمز · ٹریویا · گفتگو",
    tipAmish: "امیش کو ٹپ دیں",
    tipSub: "نقد · اوبر · Revolut",
    askAmish: "امیش سے کہیں",
    route: "راستہ",
    charger: "فون چارجر",
    snacks: "اسنیکس",
    wipes: "گیلے وائپس",
    mints: "ٹافیاں اور منٹس",
    fastest: "تیز ترین راستہ",
    changeDest: "منزل تبدیل کریں",
    motorway: "موٹروے سے جائیں",
    toldAmish: "امیش کو بتا دیا",
    sent: "بھیج دیا",
    close: "بند کریں",
    back: "واپس",
    games: "گیمز",
    gamesSub: "ٹک ٹیک ٹو · پتھر کاغذ قینچی · میموری",
    trivia: "ٹریویا",
    triviaSub: "کوئز · پہیلیاں",
    chat: "گفتگو",
    chatSub: "بات کرنے کے لیے ایک موضوع",
    cash: "نقد",
    cashSub: "منزل پر امیش کو دیں",
    uber: "اوبر کے ذریعے",
    uberSub: "سفر کے بعد ایپ میں",
    revolut: "Revolut",
    revolutSub: "QR کوڈ اسکین کریں",
    settings: "سیٹنگز",
    contactAmish: "امیش سے رابطہ",
    fullScreen: "فل اسکرین",
    exitFullScreen: "فل اسکرین بند کریں",
    voiceOutput: "امیش کے لیے آواز",
    voiceDriver: "انگریزی",
    voicePassenger: "آپ کی زبان",
    btTitle: "بلوٹوتھ سے جوڑیں",
    btLookFor: "تلاش کریں",
    call: "کال کریں",
  },
};
