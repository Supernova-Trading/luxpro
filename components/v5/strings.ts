import type { Lang } from "@/lib/translations";

// The one words file for v5. Screen text is translated; everything spoken to
// Amish stays English (owner decision, 2026-10-04) so he always understands.
// Spanish uses "usted"; Urdu uses polite آپ forms. Both need a native-speaker
// review before go-live (council round 4).

export type RequestKey = "charger" | "snacks" | "wipes" | "mints" | "fastest" | "motorway" | "changeDest" | "bluetooth";
export type GameKey = "quiz" | "riddles" | "snake" | "blocks" | "mines";
export type TipKey = "cash" | "uber" | "revolut";

export interface V5Strings {
  settings: string;
  radio: string;
  playlists: string;
  bluetooth: string;
  nowPlaying: string;
  tapPlay: string;
  chooseStation: string;
  choosePlaylist: string;
  live: string;
  loading: string;
  offline: string;
  needInternet: string;
  tryAgain: string;
  volume: string;
  btTitle: string;
  btSub: string;
  btAsk: string;
  btHow: string;
  btSteps: string[];
  tipTitle: string;
  tipHint: string;
  tipThanksTitle: string;
  tipThanksSub: string;
  tip: Record<TipKey, { label: string; sub: string }>;
  qrTitle: string;
  qrSub: string;
  done: string;
  askAmish: string;
  requests: Record<Exclude<RequestKey, "bluetooth">, string>;
  didntHear: string;
  cooler: string;
  warmer: string;
  play: string;
  games: Record<GameKey, string>;
  gameSoon: string;
  newRide: string;
  newRideSub: string;
  newRideConfirm: string;
  confirmClear: string;
  cancel: string;
  fullScreen: string;
  exitFullScreen: string;
  close: string;
}

export const STRINGS: Record<Lang, V5Strings> = {
  en: {
    settings: "Settings",
    radio: "Radio",
    playlists: "Playlists",
    bluetooth: "Bluetooth",
    nowPlaying: "Now playing",
    tapPlay: "Tap play",
    chooseStation: "Choose a station",
    choosePlaylist: "Choose a playlist",
    live: "Live",
    loading: "Loading…",
    offline: "Offline · tap play to try again",
    needInternet: "Playlists need internet",
    tryAgain: "Try again",
    volume: "Volume",
    btTitle: "Your phone",
    btSub: "Connect to My Volvo Car",
    btAsk: "Ask Amish to connect",
    btHow: "How to connect",
    btSteps: [
      "Open Settings on your phone.",
      "Tap Bluetooth and switch it on.",
      "Choose “My Volvo Car”.",
      "Confirm the code on both screens.",
      "Play music from your phone.",
    ],
    tipTitle: "Tips go straight to Amish",
    tipHint: "Tap one · Amish will know",
    tipThanksTitle: "Thank you",
    tipThanksSub: "Amish knows it's coming",
    tip: {
      cash: { label: "Cash", sub: "At drop-off" },
      uber: { label: "Uber", sub: "In the Uber app" },
      revolut: { label: "Revolut", sub: "Scan QR code" },
    },
    qrTitle: "Tip Amish with Revolut",
    qrSub: "Scan with your phone's camera or the Revolut app. Choose any amount.",
    done: "Done",
    askAmish: "Ask Amish",
    requests: {
      charger: "Phone charger",
      snacks: "Snacks",
      wipes: "Wet wipes",
      mints: "Sweets and mints",
      fastest: "Fastest route",
      motorway: "Motorway",
      changeDest: "Change destination",
    },
    didntHear: "Amish didn't hear that. Please tell him directly.",
    cooler: "Cooler",
    warmer: "Warmer",
    play: "Play",
    games: { quiz: "Quiz", riddles: "Riddles", snake: "Snake", blocks: "Blocks", mines: "Mines" },
    gameSoon: "Games arrive in a later build.",
    newRide: "New ride",
    newRideSub: "Clears requests, tip and climate for the next passenger.",
    newRideConfirm: "Start a new ride?",
    confirmClear: "Yes, clear",
    cancel: "Cancel",
    fullScreen: "Full screen",
    exitFullScreen: "Exit full screen",
    close: "Close",
  },
  es: {
    settings: "Ajustes",
    radio: "Radio",
    playlists: "Listas",
    bluetooth: "Bluetooth",
    nowPlaying: "Sonando",
    tapPlay: "Toque para reproducir",
    chooseStation: "Elija una emisora",
    choosePlaylist: "Elija una lista",
    live: "En directo",
    loading: "Cargando…",
    offline: "Sin señal · toque para reintentar",
    needInternet: "Las listas necesitan internet",
    tryAgain: "Reintentar",
    volume: "Volumen",
    btTitle: "Su teléfono",
    btSub: "Conéctese a My Volvo Car",
    btAsk: "Pedir a Amish que lo conecte",
    btHow: "Cómo conectarse",
    btSteps: [
      "Abra Ajustes en su teléfono.",
      "Toque Bluetooth y actívelo.",
      "Elija “My Volvo Car”.",
      "Confirme el código en ambas pantallas.",
      "Reproduzca música desde su teléfono.",
    ],
    tipTitle: "La propina es íntegramente para Amish",
    tipHint: "Toque uno · Amish lo sabrá",
    tipThanksTitle: "Gracias",
    tipThanksSub: "Amish ya lo sabe",
    tip: {
      cash: { label: "Efectivo", sub: "Al llegar" },
      uber: { label: "Uber", sub: "En la app de Uber" },
      revolut: { label: "Revolut", sub: "Escanee el QR" },
    },
    qrTitle: "Propina para Amish con Revolut",
    qrSub: "Escanee con la cámara de su teléfono o la app de Revolut. Elija cualquier importe.",
    done: "Listo",
    askAmish: "Pedir a Amish",
    requests: {
      charger: "Cargador",
      snacks: "Aperitivos",
      wipes: "Toallitas",
      mints: "Caramelos y mentas",
      fastest: "Ruta más rápida",
      motorway: "Autopista",
      changeDest: "Cambiar destino",
    },
    didntHear: "Amish no lo oyó. Dígaselo directamente, por favor.",
    cooler: "Más fresco",
    warmer: "Más calor",
    play: "Jugar",
    games: { quiz: "Quiz", riddles: "Adivinanzas", snake: "Serpiente", blocks: "Bloques", mines: "Minas" },
    gameSoon: "Los juegos llegan en una próxima versión.",
    newRide: "Nuevo viaje",
    newRideSub: "Borra las peticiones, la propina y el clima para el siguiente pasajero.",
    newRideConfirm: "¿Empezar un nuevo viaje?",
    confirmClear: "Sí, borrar",
    cancel: "Cancelar",
    fullScreen: "Pantalla completa",
    exitFullScreen: "Salir de pantalla completa",
    close: "Cerrar",
  },
  ur: {
    settings: "سیٹنگز",
    radio: "ریڈیو",
    playlists: "پلے لسٹس",
    bluetooth: "بلوٹوتھ",
    nowPlaying: "ابھی چل رہا ہے",
    tapPlay: "چلانے کے لیے ٹچ کریں",
    chooseStation: "اسٹیشن منتخب کریں",
    choosePlaylist: "پلے لسٹ منتخب کریں",
    live: "براہ راست",
    loading: "لوڈ ہو رہا ہے…",
    offline: "آف لائن · دوبارہ کوشش کے لیے ٹچ کریں",
    needInternet: "پلے لسٹس کے لیے انٹرنیٹ چاہیے",
    tryAgain: "دوبارہ کوشش کریں",
    volume: "آواز",
    btTitle: "آپ کا فون",
    btSub: "My Volvo Car سے جوڑیں",
    btAsk: "امیش سے جوڑنے کو کہیں",
    btHow: "کیسے جوڑیں",
    btSteps: [
      "اپنے فون میں سیٹنگز کھولیں۔",
      "بلوٹوتھ پر ٹیپ کر کے اسے آن کریں۔",
      "“My Volvo Car” منتخب کریں۔",
      "دونوں اسکرینوں پر کوڈ کی تصدیق کریں۔",
      "اپنے فون سے موسیقی چلائیں۔",
    ],
    tipTitle: "ٹپ پوری کی پوری امیش کو جاتی ہے",
    tipHint: "ایک منتخب کریں · امیش کو پتہ چل جائے گا",
    tipThanksTitle: "شکریہ",
    tipThanksSub: "امیش کو معلوم ہو گیا ہے",
    tip: {
      cash: { label: "نقد", sub: "منزل پر" },
      uber: { label: "اوبر", sub: "اوبر ایپ میں" },
      revolut: { label: "Revolut", sub: "QR کوڈ اسکین کریں" },
    },
    qrTitle: "Revolut سے امیش کو ٹپ دیں",
    qrSub: "اپنے فون کے کیمرے یا Revolut ایپ سے اسکین کریں۔ کوئی بھی رقم منتخب کریں۔",
    done: "ٹھیک ہے",
    askAmish: "امیش سے کہیں",
    requests: {
      charger: "فون چارجر",
      snacks: "اسنیکس",
      wipes: "گیلے وائپس",
      mints: "ٹافیاں اور منٹس",
      fastest: "تیز ترین راستہ",
      motorway: "موٹروے",
      changeDest: "منزل تبدیل کریں",
    },
    didntHear: "امیش نے نہیں سنا۔ براہ کرم انہیں خود بتائیں۔",
    cooler: "ٹھنڈا",
    warmer: "گرم",
    play: "کھیلیں",
    games: { quiz: "کوئز", riddles: "پہیلیاں", snake: "سانپ", blocks: "بلاکس", mines: "مائنز" },
    gameSoon: "گیمز بعد کے ورژن میں آئیں گی۔",
    newRide: "نیا سفر",
    newRideSub: "اگلے مسافر کے لیے درخواستیں، ٹپ اور درجہ حرارت صاف کریں۔",
    newRideConfirm: "نیا سفر شروع کریں؟",
    confirmClear: "ہاں، صاف کریں",
    cancel: "منسوخ",
    fullScreen: "فل اسکرین",
    exitFullScreen: "فل اسکرین بند کریں",
    close: "بند کریں",
  },
};

// Spoken to Amish — always English. Off lines name the item (owner decision).
export const SPEECH: {
  requests: Record<RequestKey, { on: string; off: string }>;
  climate: { cool: string; warm: string; off: string };
  tip: Record<TipKey, string>;
} = {
  requests: {
    charger:    { on: "Amish, could I use the phone charger, please?",       off: "Amish, no need for the charger now, thank you." },
    snacks:     { on: "Amish, could I have some snacks, please?",             off: "Amish, no snacks for now, thank you." },
    wipes:      { on: "Amish, could I have some wet wipes, please?",          off: "Amish, no need for the wipes now, thank you." },
    mints:      { on: "Amish, could I have some sweets and mints, please?",   off: "Amish, no sweets for now, thank you." },
    fastest:    { on: "Amish, could we take the fastest route, please?",      off: "Amish, any route is fine, thank you." },
    motorway:   { on: "Amish, could we take the motorway, please?",           off: "Amish, no need for the motorway, thank you." },
    changeDest: { on: "Amish, I'd like to change the destination.",           off: "Amish, the destination stays the same, thank you." },
    bluetooth:  { on: "Amish, could you connect my phone to the car's Bluetooth, please?", off: "Amish, no need for Bluetooth now, thank you." },
  },
  climate: {
    cool: "Amish, could you make it a little cooler, please?",
    warm: "Amish, could you make it a little warmer, please?",
    off: "Amish, the temperature is fine now, thank you.",
  },
  // Never a spoken cancellation for tips (owner decision).
  tip: {
    cash: "Amish, I'd like to give you a cash tip at the end of the trip.",
    uber: "Amish, I'll leave you a tip in the Uber app after the trip.",
    revolut: "Amish, I'm sending you a tip with Revolut.",
  },
};
