import type { Lang } from "@/lib/translations";

// The one words file for v5. Screen text is translated; everything spoken to
// Amish stays English (owner decision, 2026-10-04) so he always understands.
// Spanish uses "usted"; Urdu uses polite آپ forms. Both need a native-speaker
// review before go-live (council round 4).

export type RequestKey = "charger" | "snacks" | "wipes" | "mints" | "fastest" | "motorway" | "changeDest" | "bluetooth";
export type GameKey = "quiz" | "riddles" | "snake" | "blocks" | "mines";
export type TipKey = "cash" | "uber" | "revolut";
export type QuizLevel = "easy" | "medium" | "hard";
export type TierKey = "bronze" | "silver" | "gold" | "platinum" | "diamond";

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
  genresBtn: string;
  stationsBtn: string;
  chooseMusic: string;
  byStyle: string;
  aroundWorld: string;
  btTitle: string;
  btSub: string;
  btAsk: string;
  btHow: string;
  btSteps: string[];
  tipTitle: string;
  tipHint: string;
  tip: Record<TipKey, { label: string; sub: string }>;
  qrTitle: string;
  qrSub: string;
  done: string;
  askAmish: string;
  askAmishHint: string;
  climateTitle: string;
  climateHint: string;
  gamesTitle: string;
  gamesHint: string;
  requests: Record<Exclude<RequestKey, "bluetooth">, string>;
  didntHear: string;
  cooler: string;
  warmer: string;
  play: string;
  games: Record<GameKey, string>;
  home: string;
  levels: Record<QuizLevel, string>;
  questionN: string; // "{n}" is replaced with the number
  riddleN: string;
  nextQuestion: string;
  nextRiddle: string;
  playWithAmish: string;
  playWithAmishSub: string;
  dig: string;
  flag: string;
  newGame: string;
  minesLeft: string;
  minesStart: string;
  speeds: Record<"relaxed" | "normal" | "fast", string>;
  score: string;
  best: string;
  pause: string;
  resume: string;
  paused: string;
  snakeStart: string;
  playAgain: string;
  wellPlayed: string;
  notThisTime: string;
  undoBump: string;
  tiers: Record<TierKey, string>;
  wonPrize: string;       // "{tier}"
  correctCount: string;   // "{n}"
  takePrize: string;
  keepPlayingFor: string; // "{tier}"
  riskNote: string;       // "{tier}"
  topPrize: string;
  claimedTitle: string;   // "{tier}"
  claimedBanner: string;  // "{tier}"
  bustTitle: string;
  bustLost: string;       // "{tier}"
  bustSub: string;
  startAgain: string;
  correctWord: string;
  wrongWord: string;
  lives: string;
  nextPrize: string;      // "{n}", "{tier}"
  thinkTime: string;
  tapToStart: string;
  showOptions: string;
  hint: string;
  hintText: string;       // "{x}"
  rotate: string;
  down: string;
  nextPiece: string;
  lines: string;
  level: string;
  blocksStart: string;
  voiceTo: string;
  voiceEnglish: string;
  voiceWhy: string;
  voiceVolume: string;
  musicVolume: string;
  testVoice: string;
  contactAmish: string;
  contactSub: string;
  nightMode: string;
  welcomeTitle: string;
  welcomeDriver: string;
  chooseLanguage: string;
  welcomeNote: string;
  farewellTitle: string;
  farewellBelongings: string;
  farewellTipped: string;
  farewellBye: string;
  nearlyThere: string;
  nearlySub: string;
  nightSub: string;
  nightModes: Record<"auto" | "on" | "off", string>;
  qrFailed: string;
  qrHandle: string;
  questionsFailed: string;
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
    genresBtn: "Genres",
    stationsBtn: "Stations",
    chooseMusic: "Choose your music",
    byStyle: "By style",
    aroundWorld: "From around the world",
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
    tipTitle: "Leave Amish a tip",
    tipHint: "Tap one · Amish will know",
    tip: {
      cash: { label: "Cash", sub: "At drop-off" },
      uber: { label: "Uber", sub: "In the Uber app" },
      revolut: { label: "Revolut", sub: "Scan QR code" },
    },
    qrTitle: "Tip Amish with Revolut",
    qrSub: "Scan with your phone's camera or the Revolut app. Choose any amount.",
    done: "Done",
    askAmish: "Ask Amish",
    askAmishHint: "Tap again to cancel",
    climateTitle: "Cabin temperature",
    climateHint: "Amish will adjust it",
    gamesTitle: "Games",
    gamesHint: "One tap to start",
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
    home: "Home",
    levels: { easy: "Easy", medium: "Medium", hard: "Hard" },
    questionN: "Question {n}",
    riddleN: "Riddle {n}",
    nextQuestion: "Next question",
    nextRiddle: "Next riddle",
    playWithAmish: "Play with Amish",
    playWithAmishSub: "Amish will join in",
    dig: "Dig",
    flag: "Flag",
    newGame: "New game",
    minesLeft: "Mines left",
    minesStart: "Tap any square to start",
    speeds: { relaxed: "Relaxed", normal: "Normal", fast: "Fast" },
    score: "Score",
    best: "Best",
    pause: "Pause",
    resume: "Resume",
    paused: "Paused",
    snakeStart: "Tap an arrow to start",
    playAgain: "Play again",
    wellPlayed: "Well played",
    notThisTime: "Not this time",
    undoBump: "Undo, was that a bump?",
    tiers: { bronze: "Bronze", silver: "Silver", gold: "Gold", platinum: "Platinum", diamond: "Diamond" },
    wonPrize: "You've won the {tier} prize!",
    correctCount: "{n} correct",
    takePrize: "Take my prize",
    keepPlayingFor: "Keep playing for {tier}",
    riskNote: "If you lose all 3 lives before {tier}, you leave with nothing.",
    topPrize: "That's the top prize!",
    claimedTitle: "Amish will bring your {tier} prize",
    claimedBanner: "Prize won: {tier} · keep playing for fun",
    bustTitle: "Out of lives",
    bustLost: "You lost the {tier} prize.",
    bustSub: "Start again to play for a prize.",
    startAgain: "Start again",
    correctWord: "Correct!",
    wrongWord: "Not quite",
    lives: "Lives",
    nextPrize: "{n} to {tier}",
    thinkTime: "Think it over…",
    tapToStart: "Tap ▶ in the player once to start the music",
    showOptions: "Show the options",
    hint: "Hint",
    hintText: "Starts with “{x}”",
    rotate: "Rotate",
    down: "Down",
    nextPiece: "Next",
    lines: "Lines",
    level: "Level",
    blocksStart: "Tap any button to start",
    voiceTo: "Voice to Amish",
    voiceEnglish: "English",
    voiceWhy: "So Amish understands every request",
    voiceVolume: "Voice volume",
    musicVolume: "Music volume",
    testVoice: "Test",
    contactAmish: "Contact Amish",
    contactSub: "Lost property, or to book Amish again",
    nightMode: "Night mode",
    welcomeTitle: "Welcome aboard",
    welcomeDriver: "Your driver today is Amish",
    chooseLanguage: "Choose your language to begin",
    welcomeNote: "Music, games and requests for Amish are on the next screen.",
    farewellTitle: "Thank you for riding with Amish",
    farewellBelongings: "Please check you have all your belongings.",
    farewellTipped: "Amish knows about your tip. Thank you!",
    farewellBye: "Have a wonderful day",
    nearlyThere: "Nearly there",
    nearlySub: "About 5 minutes to go. Please gather your belongings.",
    nightSub: "Dimmer screen after sunset",
    nightModes: { auto: "Auto", on: "On", off: "Off" },
    qrFailed: "The QR code didn't load. Cash or Uber still work.",
    qrHandle: "Or open Revolut and send to @amishg4sqm",
    questionsFailed: "Questions didn't load. Try Snake or Mines.",
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
    genresBtn: "Géneros",
    stationsBtn: "Emisoras",
    chooseMusic: "Elija su música",
    byStyle: "Por estilo",
    aroundWorld: "Del mundo",
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
    tipTitle: "Deje una propina a Amish",
    tipHint: "Toque uno · Amish lo sabrá",
    tip: {
      cash: { label: "Efectivo", sub: "Al llegar" },
      uber: { label: "Uber", sub: "En la app de Uber" },
      revolut: { label: "Revolut", sub: "Escanee el QR" },
    },
    qrTitle: "Propina para Amish con Revolut",
    qrSub: "Escanee con la cámara de su teléfono o la app de Revolut. Elija cualquier importe.",
    done: "Listo",
    askAmish: "Pedir a Amish",
    askAmishHint: "Toque de nuevo para cancelar",
    climateTitle: "Temperatura",
    climateHint: "Amish la ajustará",
    gamesTitle: "Juegos",
    gamesHint: "Un toque para empezar",
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
    home: "Inicio",
    levels: { easy: "Fácil", medium: "Media", hard: "Difícil" },
    questionN: "Pregunta {n}",
    riddleN: "Adivinanza {n}",
    nextQuestion: "Siguiente pregunta",
    nextRiddle: "Siguiente adivinanza",
    playWithAmish: "Jugar con Amish",
    playWithAmishSub: "Amish se unirá",
    dig: "Excavar",
    flag: "Bandera",
    newGame: "Nueva partida",
    minesLeft: "Minas restantes",
    minesStart: "Toque cualquier casilla para empezar",
    speeds: { relaxed: "Tranquila", normal: "Normal", fast: "Rápida" },
    score: "Puntos",
    best: "Récord",
    pause: "Pausa",
    resume: "Seguir",
    paused: "En pausa",
    snakeStart: "Toque una flecha para empezar",
    playAgain: "Jugar otra vez",
    wellPlayed: "Bien jugado",
    notThisTime: "Esta vez no",
    undoBump: "Deshacer: ¿fue un bache?",
    tiers: { bronze: "Bronce", silver: "Plata", gold: "Oro", platinum: "Platino", diamond: "Diamante" },
    wonPrize: "¡Ha ganado el premio {tier}!",
    correctCount: "{n} aciertos",
    takePrize: "Quiero mi premio",
    keepPlayingFor: "Seguir jugando por el {tier}",
    riskNote: "Si pierde las 3 vidas antes del {tier}, se queda sin nada.",
    topPrize: "¡Es el premio máximo!",
    claimedTitle: "Amish le dará su premio {tier}",
    claimedBanner: "Premio ganado: {tier} · siga jugando por diversión",
    bustTitle: "Sin vidas",
    bustLost: "Ha perdido el premio {tier}.",
    bustSub: "Empiece de nuevo para jugar por un premio.",
    startAgain: "Empezar de nuevo",
    correctWord: "¡Correcto!",
    wrongWord: "Casi",
    lives: "Vidas",
    nextPrize: "{n} para el {tier}",
    thinkTime: "Piénselo…",
    tapToStart: "Toque ▶ una vez en el reproductor para empezar la música",
    showOptions: "Ver las opciones",
    hint: "Pista",
    hintText: "Empieza por «{x}»",
    rotate: "Girar",
    down: "Bajar",
    nextPiece: "Siguiente",
    lines: "Líneas",
    level: "Nivel",
    blocksStart: "Toque cualquier botón para empezar",
    voiceTo: "Voz para Amish",
    voiceEnglish: "Inglés",
    voiceWhy: "Para que Amish entienda cada petición",
    voiceVolume: "Volumen de la voz",
    musicVolume: "Volumen de la música",
    testVoice: "Probar",
    contactAmish: "Contactar con Amish",
    contactSub: "Objetos perdidos, o para reservar otra vez con Amish",
    nightMode: "Modo noche",
    welcomeTitle: "Bienvenido a bordo",
    welcomeDriver: "Su conductor hoy es Amish",
    chooseLanguage: "Elija su idioma para empezar",
    welcomeNote: "La música, los juegos y las peticiones a Amish están en la siguiente pantalla.",
    farewellTitle: "Gracias por viajar con Amish",
    farewellBelongings: "Por favor, compruebe que lleva todas sus pertenencias.",
    farewellTipped: "Amish ya sabe lo de su propina. ¡Gracias!",
    farewellBye: "Que tenga un buen día",
    nearlyThere: "Casi hemos llegado",
    nearlySub: "Faltan unos 5 minutos. Vaya recogiendo sus cosas.",
    nightSub: "Pantalla más tenue al anochecer",
    nightModes: { auto: "Auto", on: "Sí", off: "No" },
    qrFailed: "El código QR no se cargó. El efectivo o Uber siguen funcionando.",
    qrHandle: "O abra Revolut y envíe a @amishg4sqm",
    questionsFailed: "Las preguntas no se cargaron. Pruebe Serpiente o Minas.",
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
    genresBtn: "اصناف",
    stationsBtn: "اسٹیشنز",
    chooseMusic: "اپنی موسیقی منتخب کریں",
    byStyle: "انداز کے لحاظ سے",
    aroundWorld: "دنیا بھر سے",
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
    tipTitle: "امیش کو ٹپ دیں",
    tipHint: "ایک منتخب کریں · امیش کو پتہ چل جائے گا",
    tip: {
      cash: { label: "نقد", sub: "منزل پر" },
      uber: { label: "اوبر", sub: "اوبر ایپ میں" },
      revolut: { label: "Revolut", sub: "QR کوڈ اسکین کریں" },
    },
    qrTitle: "Revolut سے امیش کو ٹپ دیں",
    qrSub: "اپنے فون کے کیمرے یا Revolut ایپ سے اسکین کریں۔ کوئی بھی رقم منتخب کریں۔",
    done: "ٹھیک ہے",
    askAmish: "امیش سے کہیں",
    askAmishHint: "منسوخ کرنے کے لیے دوبارہ ٹچ کریں",
    climateTitle: "کیبن کا درجہ حرارت",
    climateHint: "امیش اسے ٹھیک کر دیں گے",
    gamesTitle: "گیمز",
    gamesHint: "شروع کرنے کے لیے ایک ٹچ",
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
    home: "ہوم",
    levels: { easy: "آسان", medium: "درمیانہ", hard: "مشکل" },
    questionN: "سوال {n}",
    riddleN: "پہیلی {n}",
    nextQuestion: "اگلا سوال",
    nextRiddle: "اگلی پہیلی",
    playWithAmish: "امیش کے ساتھ کھیلیں",
    playWithAmishSub: "امیش ساتھ کھیلیں گے",
    dig: "کھودیں",
    flag: "جھنڈا",
    newGame: "نیا گیم",
    minesLeft: "باقی مائنز",
    minesStart: "شروع کرنے کے لیے کوئی بھی خانہ چھوئیں",
    speeds: { relaxed: "آرام سے", normal: "نارمل", fast: "تیز" },
    score: "اسکور",
    best: "بہترین",
    pause: "روکیں",
    resume: "جاری رکھیں",
    paused: "رکا ہوا",
    snakeStart: "شروع کرنے کے لیے کوئی تیر دبائیں",
    playAgain: "دوبارہ کھیلیں",
    wellPlayed: "بہت خوب",
    notThisTime: "اس بار نہیں",
    undoBump: "واپس کریں، کیا یہ جھٹکا تھا؟",
    tiers: { bronze: "کانسی", silver: "چاندی", gold: "سونا", platinum: "پلاٹینم", diamond: "ہیرا" },
    wonPrize: "آپ نے {tier} انعام جیت لیا!",
    correctCount: "{n} درست",
    takePrize: "میرا انعام",
    keepPlayingFor: "{tier} کے لیے کھیلتے رہیں",
    riskNote: "اگر {tier} سے پہلے تینوں جانیں ختم ہو گئیں تو آپ کو کچھ نہیں ملے گا۔",
    topPrize: "یہ سب سے بڑا انعام ہے!",
    claimedTitle: "امیش آپ کو {tier} انعام دیں گے",
    claimedBanner: "انعام جیت لیا: {tier} · مزے کے لیے کھیلتے رہیں",
    bustTitle: "جانیں ختم",
    bustLost: "آپ {tier} انعام کھو بیٹھے۔",
    bustSub: "انعام کے لیے دوبارہ شروع کریں۔",
    startAgain: "دوبارہ شروع کریں",
    correctWord: "درست!",
    wrongWord: "غلط",
    lives: "جانیں",
    nextPrize: "{tier} تک {n}",
    thinkTime: "سوچیے…",
    tapToStart: "موسیقی شروع کرنے کے لیے پلیئر میں ایک بار ▶ دبائیں",
    showOptions: "جوابات دکھائیں",
    hint: "اشارہ",
    hintText: "پہلا حرف: {x}",
    rotate: "گھمائیں",
    down: "نیچے",
    nextPiece: "اگلا",
    lines: "لائنیں",
    level: "لیول",
    blocksStart: "شروع کرنے کے لیے کوئی بھی بٹن دبائیں",
    voiceTo: "امیش کے لیے آواز",
    voiceEnglish: "انگریزی",
    voiceWhy: "تاکہ امیش ہر درخواست سمجھ سکیں",
    voiceVolume: "آواز کا والیوم",
    musicVolume: "موسیقی کا والیوم",
    testVoice: "سنیں",
    contactAmish: "امیش سے رابطہ",
    contactSub: "گمشدہ سامان، یا امیش کے ساتھ دوبارہ سفر کے لیے",
    nightMode: "نائٹ موڈ",
    welcomeTitle: "خوش آمدید",
    welcomeDriver: "آج آپ کے ڈرائیور امیش ہیں",
    chooseLanguage: "شروع کرنے کے لیے اپنی زبان منتخب کریں",
    welcomeNote: "موسیقی، گیمز اور امیش سے درخواستیں اگلی اسکرین پر ہیں۔",
    farewellTitle: "امیش کے ساتھ سفر کرنے کا شکریہ",
    farewellBelongings: "براہ کرم اپنا تمام سامان ساتھ لے جانا یقینی بنائیں۔",
    farewellTipped: "امیش کو آپ کی ٹپ کا علم ہے۔ شکریہ!",
    farewellBye: "آپ کا دن اچھا گزرے",
    nearlyThere: "ہم تقریباً پہنچ گئے",
    nearlySub: "تقریباً 5 منٹ باقی ہیں۔ براہ کرم اپنا سامان سمیٹ لیں۔",
    nightSub: "غروبِ آفتاب کے بعد اسکرین مدھم",
    nightModes: { auto: "خودکار", on: "آن", off: "آف" },
    qrFailed: "کیو آر کوڈ لوڈ نہیں ہوا۔ نقد یا اوبر اب بھی کام کرتے ہیں۔",
    qrHandle: "یا ریولٹ کھولیں اور @amishg4sqm کو بھیجیں",
    questionsFailed: "سوالات لوڈ نہیں ہوئے۔ سانپ یا مائنز آزمائیں۔",
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
  games: Record<"quiz" | "riddles", string>;
  test: string;
  prize: (tier: string, n: number) => string;
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
  games: {
    quiz: "Amish, would you like to play a quiz with me?",
    riddles: "Amish, would you like to do some riddles with me?",
  },
  // Settings → Voice volume → Test
  test: "Amish, this is only a volume test.",
  // Said when the passenger takes a prize, so it can't be faked with a screenshot
  prize: (tier, n) => `Amish, the passenger has won the ${tier} prize, with ${n} correct answers.`,
};

// Said to the passenger when Amish presses Nearly there / End ride / New
// passenger (phone or Driver panel). In the passenger's language when the
// tablet has that voice, otherwise English (v5.24, owner).
export const ANNOUNCE: Record<"nearly" | "arrived" | "welcome", Record<Lang, string>> = {
  nearly: {
    en: "We're nearly there. About five minutes to your destination. Please gather your belongings.",
    es: "Casi hemos llegado. Faltan unos cinco minutos. Vaya recogiendo sus pertenencias, por favor.",
    ur: "ہم تقریباً پہنچ گئے ہیں۔ تقریباً پانچ منٹ باقی ہیں۔ براہ کرم اپنا سامان سمیٹ لیں۔",
  },
  arrived: {
    en: "We've arrived. Thank you for riding with Amish. Please check you have all your belongings. Have a wonderful day.",
    es: "Hemos llegado. Gracias por viajar con Amish. Compruebe que lleva todas sus pertenencias. Que tenga un buen día.",
    ur: "ہم پہنچ گئے ہیں۔ امیش کے ساتھ سفر کرنے کا شکریہ۔ براہ کرم اپنا سامان چیک کر لیں۔ آپ کا دن اچھا گزرے۔",
  },
  welcome: {
    en: "Welcome aboard. Your driver today is Amish. Please choose your language on the screen.",
    es: "Welcome aboard. Your driver today is Amish. Please choose your language on the screen.",
    ur: "Welcome aboard. Your driver today is Amish. Please choose your language on the screen.",
  },
};
