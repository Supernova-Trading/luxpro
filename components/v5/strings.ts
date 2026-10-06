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
  backToRide: string;
  askDriver: string;
  askDriverHint: string;
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
  playWithDriver: string;
  playWithDriverSub: string;
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
  pointsWord: string;    // "{n}"
  pointsToWin: string;   // "{n}", "{tier}"
  boardCleared: string;  // "{level}"
  keptPrize: string;     // "{tier}" — the better prize already won this ride
  replacesPrize: string; // "{tier}" — the prize it replaces
  quizShort: string;
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
  lastCallTitle: string;  // "{tier}"
  prizeWhat: string;
  farewellPrize: string;  // "{tier}"
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
  contactDriver: string;
  contactSub: string;
  driverTitle: string;
  driverTrips: string;   // "{trips}"
  driverToday: string;
  yourDriver: string;
  chooseLanguageTitle: string;
  nightMode: string;
  welcomeTitle: string;
  welcomeDriver: string;
  chooseLanguage: string;
  welcomeNote: string;
  farewellTitle: string;
  farewellBelongings: string;
  farewellTipped: string;
  farewellBye: string;
  farewellByeEvening: string; // after 5 pm (v5.40)
  nearlyThere: string;
  nearlySub: string;
  gameError: string;
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
    btAsk: "Ask {driver} to connect",
    btHow: "How to connect",
    btSteps: [
      "Open Settings on your phone.",
      "Tap Bluetooth and switch it on.",
      "Choose “My Volvo Car”.",
      "Confirm the code on both screens.",
      "Play music from your phone.",
    ],
    tipTitle: "Leave {driver} a tip",
    tipHint: "Tap one · {driver} will know",
    tip: {
      cash: { label: "Cash", sub: "At drop-off" },
      uber: { label: "Uber", sub: "In the Uber app" },
      revolut: { label: "Revolut", sub: "Scan QR code" },
    },
    qrTitle: "Tip {driver} with Revolut",
    qrSub: "Scan with your phone's camera or the Revolut app. Any amount is appreciated, and it goes straight to {driver}.",
    done: "Done",
    backToRide: "Back to the ride",
    askDriver: "Ask {driver}",
    askDriverHint: "Tap again to cancel",
    climateTitle: "Cabin temperature",
    climateHint: "{driver} will adjust it",
    gamesTitle: "Games",
    gamesHint: "Quiz and Riddles: win a treat from {driver}",
    requests: {
      charger: "Phone charger",
      snacks: "Snacks",
      wipes: "Wet wipes",
      mints: "Sweets and mints",
      fastest: "Fastest route",
      motorway: "Motorway",
      changeDest: "Change destination",
    },
    didntHear: "{driver} didn't hear that. Please tell him directly.",
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
    playWithDriver: "Play with {driver}",
    playWithDriverSub: "{driver} will join in",
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
    pointsWord: "{n} points",
    pointsToWin: "Score {n} points to win {tier}",
    boardCleared: "{level} board cleared",
    keptPrize: "You keep your {tier} prize. Only the best prize of the ride counts.",
    replacesPrize: "Better than your {tier}, so it replaces it.",
    quizShort: "Quiz",
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
    claimedTitle: "{driver} will bring your {tier} prize",
    claimedBanner: "Prize won: {tier} · keep playing for fun",
    bustTitle: "Out of lives",
    bustLost: "Your {tier} prize slipped away.",
    bustSub: "Start again for another go.",
    lastCallTitle: "Take your {tier} prize before you go?",
    prizeWhat: "A treat from {driver}",
    farewellPrize: "Enjoy your {tier} treat.",
    startAgain: "Start again",
    correctWord: "Correct!",
    wrongWord: "Not this one",
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
    voiceTo: "Voice to {driver}",
    voiceEnglish: "English",
    voiceWhy: "So {driver} understands every request",
    voiceVolume: "Voice volume",
    musicVolume: "Music volume",
    testVoice: "Test",
    contactDriver: "Contact {driver}",
    contactSub: "Lost property",
    driverTitle: "Executive driver",
    driverTrips: "{trips}+ trips",
    driverToday: "Your driver today",
    yourDriver: "Your driver",
    chooseLanguageTitle: "Choose your language",
    nightMode: "Night mode",
    welcomeTitle: "Welcome aboard",
    welcomeDriver: "Your driver today is {driver}",
    chooseLanguage: "Continue in English",
    welcomeNote: "Music, games and requests for {driver} are on the next screen. Answer 5 questions to win a treat from {driver}.",
    farewellTitle: "It was a pleasure driving you",
    farewellBelongings: "Please check you have all your belongings.",
    farewellTipped: "{driver} knows about your tip. Thank you!",
    farewellBye: "Enjoy the rest of your day",
    farewellByeEvening: "Enjoy the rest of your evening",
    nearlyThere: "Nearly there",
    nearlySub: "We'll be there shortly. Please gather your belongings.",
    gameError: "That game stopped. Please open it again.",
    nightSub: "Dimmer screen after sunset",
    nightModes: { auto: "Auto", on: "On", off: "Off" },
    qrFailed: "The QR code didn't load. Cash or Uber still work.",
    qrHandle: "Or open Revolut and send to @{revolut}",
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
    btAsk: "Pedir a {driver} que lo conecte",
    btHow: "Cómo conectarse",
    btSteps: [
      "Abra Ajustes en su teléfono.",
      "Toque Bluetooth y actívelo.",
      "Elija “My Volvo Car”.",
      "Confirme el código en ambas pantallas.",
      "Reproduzca música desde su teléfono.",
    ],
    tipTitle: "Déjele una propina a {driver}",
    tipHint: "Toque uno · {driver} lo sabrá",
    tip: {
      cash: { label: "Efectivo", sub: "Al llegar" },
      uber: { label: "Uber", sub: "En la app de Uber" },
      revolut: { label: "Revolut", sub: "Escanee el QR" },
    },
    qrTitle: "Propina para {driver} con Revolut",
    qrSub: "Escanee con la cámara de su teléfono o la app de Revolut. Cualquier importe se agradece, y va directo a {driver}.",
    done: "Listo",
    backToRide: "Volver al viaje",
    askDriver: "Pedir a {driver}",
    askDriverHint: "Toque de nuevo para cancelar",
    climateTitle: "Temperatura",
    climateHint: "{driver} la ajustará",
    gamesTitle: "Juegos",
    gamesHint: "Quiz y Adivinanzas: gane un detalle de {driver}",
    requests: {
      charger: "Cargador",
      snacks: "Algo de picar",
      wipes: "Toallitas",
      mints: "Caramelos y mentas",
      fastest: "Ruta más rápida",
      motorway: "Autopista",
      changeDest: "Cambiar destino",
    },
    didntHear: "{driver} no lo oyó. Dígaselo directamente, por favor.",
    cooler: "Más fresco",
    warmer: "Más cálido",
    play: "Jugar",
    games: { quiz: "Quiz", riddles: "Adivinanzas", snake: "Serpiente", blocks: "Bloques", mines: "Minas" },
    home: "Inicio",
    levels: { easy: "Fácil", medium: "Media", hard: "Difícil" },
    questionN: "Pregunta {n}",
    riddleN: "Adivinanza {n}",
    nextQuestion: "Siguiente pregunta",
    nextRiddle: "Siguiente adivinanza",
    playWithDriver: "Jugar con {driver}",
    playWithDriverSub: "{driver} se unirá",
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
    pointsWord: "{n} puntos",
    pointsToWin: "Consiga {n} puntos para ganar {tier}",
    boardCleared: "Tablero {level} completado",
    keptPrize: "Conserva su premio {tier}. Solo cuenta el mejor premio del viaje.",
    replacesPrize: "Mejor que su {tier}, así que lo sustituye.",
    quizShort: "Quiz",
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
    claimedTitle: "{driver} le dará su premio {tier}",
    claimedBanner: "Premio ganado: {tier} · siga jugando por diversión",
    bustTitle: "Sin vidas",
    bustLost: "Su premio {tier} se ha escapado.",
    bustSub: "Empiece de nuevo para otra oportunidad.",
    lastCallTitle: "¿Se lleva su premio {tier} antes de irse?",
    prizeWhat: "Un detalle de {driver}",
    farewellPrize: "Disfrute de su premio {tier}.",
    startAgain: "Empezar de nuevo",
    correctWord: "¡Correcto!",
    wrongWord: "Esta no",
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
    voiceTo: "Voz para {driver}",
    voiceEnglish: "Inglés",
    voiceWhy: "Para que {driver} entienda cada petición",
    voiceVolume: "Volumen de la voz",
    musicVolume: "Volumen de la música",
    testVoice: "Probar",
    contactDriver: "Contactar con {driver}",
    contactSub: "Objetos perdidos",
    driverTitle: "Conductor ejecutivo",
    driverTrips: "más de {trips} viajes",
    driverToday: "Su conductor de hoy",
    yourDriver: "Su conductor",
    chooseLanguageTitle: "Elija su idioma",
    nightMode: "Modo noche",
    welcomeTitle: "Le damos la bienvenida",
    welcomeDriver: "Su conductor hoy es {driver}",
    chooseLanguage: "Continuar en español",
    welcomeNote: "La música, los juegos y las peticiones a {driver} están en la siguiente pantalla. Responda 5 preguntas y gane un detalle de {driver}.",
    farewellTitle: "Ha sido un placer llevarle",
    farewellBelongings: "Por favor, compruebe que lleva todas sus pertenencias.",
    farewellTipped: "{driver} ya sabe lo de su propina. ¡Gracias!",
    farewellBye: "Que disfrute del resto del día",
    farewellByeEvening: "Que disfrute del resto de la noche",
    nearlyThere: "Casi hemos llegado",
    nearlySub: "Llegaremos en breve. Vaya recogiendo sus cosas.",
    gameError: "El juego se ha detenido. Ábralo de nuevo.",
    nightSub: "Pantalla más tenue al anochecer",
    nightModes: { auto: "Auto", on: "Sí", off: "No" },
    qrFailed: "El código QR no se cargó. El efectivo o Uber siguen funcionando.",
    qrHandle: "O abra Revolut y envíe a @{revolut}",
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
    btAsk: "{driver} سے جوڑنے کو کہیں",
    btHow: "کیسے جوڑیں",
    btSteps: [
      "اپنے فون میں سیٹنگز کھولیں۔",
      "بلوٹوتھ پر ٹیپ کر کے اسے آن کریں۔",
      "“My Volvo Car” منتخب کریں۔",
      "دونوں اسکرینوں پر کوڈ کی تصدیق کریں۔",
      "اپنے فون سے موسیقی چلائیں۔",
    ],
    tipTitle: "{driver} کو ٹپ دیں",
    tipHint: "ایک منتخب کریں · {driver} کو پتہ چل جائے گا",
    tip: {
      cash: { label: "نقد", sub: "منزل پر" },
      uber: { label: "اوبر", sub: "اوبر ایپ میں" },
      revolut: { label: "Revolut", sub: "QR کوڈ اسکین کریں" },
    },
    qrTitle: "Revolut سے {driver} کو ٹپ دیں",
    qrSub: "اپنے فون کے کیمرے یا Revolut ایپ سے اسکین کریں۔ ہر رقم کی قدر ہے، اور یہ سیدھی {driver} کو جاتی ہے۔",
    done: "ٹھیک ہے",
    backToRide: "سفر پر واپس",
    askDriver: "{driver} سے کہیں",
    askDriverHint: "منسوخ کرنے کے لیے دوبارہ ٹچ کریں",
    climateTitle: "کیبن کا درجہ حرارت",
    climateHint: "{driver} اسے ٹھیک کر دیں گے",
    gamesTitle: "گیمز",
    gamesHint: "کوئز اور پہیلیاں: {driver} سے تحفہ جیتیں",
    requests: {
      charger: "فون چارجر",
      snacks: "اسنیکس",
      wipes: "گیلے وائپس",
      mints: "ٹافیاں اور منٹس",
      fastest: "تیز ترین راستہ",
      motorway: "موٹروے",
      changeDest: "منزل تبدیل کریں",
    },
    didntHear: "{driver} نے نہیں سنا۔ براہ کرم انہیں خود بتائیں۔",
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
    playWithDriver: "{driver} کے ساتھ کھیلیں",
    playWithDriverSub: "{driver} ساتھ کھیلیں گے",
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
    pointsWord: "{n} پوائنٹس",
    pointsToWin: "{tier} جیتنے کے لیے {n} پوائنٹس بنائیں",
    boardCleared: "{level} بورڈ مکمل",
    keptPrize: "آپ کا {tier} انعام برقرار ہے۔ سفر کا صرف سب سے اچھا انعام شمار ہوتا ہے۔",
    replacesPrize: "یہ آپ کے {tier} سے بہتر ہے، اس لیے اس کی جگہ لے گا۔",
    quizShort: "کوئز",
    wellPlayed: "بہت خوب",
    notThisTime: "اس بار نہیں",
    undoBump: "واپس کریں، کیا یہ جھٹکا تھا؟",
    tiers: { bronze: "کانسی", silver: "چاندی", gold: "سونا", platinum: "پلاٹینم", diamond: "ہیرا" },
    wonPrize: "آپ نے {tier} انعام جیت لیا!",
    correctCount: "{n} درست",
    takePrize: "انعام لے لیں",
    keepPlayingFor: "{tier} کے لیے کھیلتے رہیں",
    riskNote: "اگر {tier} سے پہلے تینوں جانیں ختم ہو گئیں تو آپ کو کچھ نہیں ملے گا۔",
    topPrize: "یہ سب سے بڑا انعام ہے!",
    claimedTitle: "{driver} آپ کو {tier} انعام دیں گے",
    claimedBanner: "انعام جیت لیا: {tier} · مزے کے لیے کھیلتے رہیں",
    bustTitle: "جانیں ختم",
    bustLost: "آپ کا {tier} انعام ہاتھ سے نکل گیا۔",
    bustSub: "ایک اور موقع کے لیے دوبارہ شروع کریں۔",
    lastCallTitle: "جانے سے پہلے اپنا {tier} انعام لے لیں؟",
    prizeWhat: "{driver} کی طرف سے ایک تحفہ",
    farewellPrize: "اپنے {tier} انعام کا لطف اٹھائیں۔",
    startAgain: "دوبارہ شروع کریں",
    correctWord: "درست!",
    wrongWord: "یہ نہیں",
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
    voiceTo: "{driver} کے لیے آواز",
    voiceEnglish: "انگریزی",
    voiceWhy: "تاکہ {driver} ہر درخواست سمجھ سکیں",
    voiceVolume: "آواز کا والیوم",
    musicVolume: "موسیقی کا والیوم",
    testVoice: "سنیں",
    contactDriver: "{driver} سے رابطہ",
    contactSub: "گمشدہ سامان",
    driverTitle: "ایگزیکٹو ڈرائیور",
    driverTrips: "{trips} سے زیادہ سفر",
    driverToday: "آج آپ کے ڈرائیور",
    yourDriver: "آپ کے ڈرائیور",
    chooseLanguageTitle: "اپنی زبان منتخب کریں",
    nightMode: "نائٹ موڈ",
    welcomeTitle: "خوش آمدید",
    welcomeDriver: "آج آپ کے ڈرائیور {driver} ہیں",
    chooseLanguage: "اردو میں جاری رکھیں",
    welcomeNote: "موسیقی، گیمز اور {driver} سے درخواستیں اگلی اسکرین پر ہیں۔ پانچ سوالوں کے جواب دیں اور {driver} سے تحفہ جیتیں۔",
    farewellTitle: "آپ کی خدمت کر کے خوشی ہوئی",
    farewellBelongings: "براہ کرم اپنا تمام سامان ساتھ لے جانا یقینی بنائیں۔",
    farewellTipped: "{driver} کو آپ کی ٹپ کا علم ہے۔ شکریہ!",
    farewellBye: "آپ کا باقی دن خوشگوار گزرے",
    farewellByeEvening: "آپ کی شام خوشگوار گزرے",
    nearlyThere: "ہم تقریباً پہنچ گئے",
    nearlySub: "ہم جلد پہنچ جائیں گے۔ براہ کرم اپنا سامان سمیٹ لیں۔",
    gameError: "گیم رک گئی۔ براہ کرم دوبارہ کھولیں۔",
    nightSub: "غروبِ آفتاب کے بعد اسکرین مدھم",
    nightModes: { auto: "خودکار", on: "آن", off: "آف" },
    qrFailed: "کیو آر کوڈ لوڈ نہیں ہوا۔ نقد یا اوبر اب بھی کام کرتے ہیں۔",
    qrHandle: "یا ریولٹ کھولیں اور @{revolut} کو بھیجیں",
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
  gamePrize: (tier: string, game: string, detail: string) => string;
  prizeUpgrade: (tier: string, old: string, game: string, detail: string) => string;
} = {
  requests: {
    charger:    { on: "{driver}, could I use the phone charger, please?",       off: "{driver}, no need for the charger now, thank you." },
    snacks:     { on: "{driver}, could I have some snacks, please?",             off: "{driver}, no snacks for now, thank you." },
    wipes:      { on: "{driver}, could I have some wet wipes, please?",          off: "{driver}, no need for the wipes now, thank you." },
    mints:      { on: "{driver}, could I have some sweets and mints, please?",   off: "{driver}, no sweets for now, thank you." },
    fastest:    { on: "{driver}, could we take the fastest route, please?",      off: "{driver}, any route is fine, thank you." },
    motorway:   { on: "{driver}, could we take the motorway, please?",           off: "{driver}, no need for the motorway, thank you." },
    changeDest: { on: "{driver}, I'd like to change the destination.",           off: "{driver}, the destination stays the same, thank you." },
    bluetooth:  { on: "{driver}, could you connect my phone to the car's Bluetooth, please?", off: "{driver}, no need for Bluetooth now, thank you." },
  },
  climate: {
    cool: "{driver}, could you make it a little cooler, please?",
    warm: "{driver}, could you make it a little warmer, please?",
    off: "{driver}, the temperature is fine now, thank you.",
  },
  // Never a spoken cancellation for tips (owner decision).
  tip: {
    cash: "{driver}, I'd like to give you a cash tip at the end of the trip.",
    uber: "{driver}, I'll leave you a tip in the Uber app after the trip.",
    revolut: "{driver}, I'll send you a tip with Revolut.",
  },
  games: {
    quiz: "{driver}, would you like to play a quiz with me?",
    riddles: "{driver}, would you like to do some riddles with me?",
  },
  // Settings → Voice volume → Test
  test: "{driver}, this is only a volume test.",
  // Said when the passenger takes a prize, so it can't be faked with a screenshot
  prize: (tier, n) => `{driver}, the passenger has won the ${tier} prize, with ${n} correct answers.`,
  // Blocks / Mines prize (v5.39): e.g. "in Blocks, with 320 points"
  gamePrize: (tier, game, detail) => `{driver}, the passenger has won the ${tier} prize in ${game}, ${detail}.`,
  // Only the best prize of the ride counts (v5.41)
  prizeUpgrade: (tier, old, game, detail) => `{driver}, the passenger's prize is now ${tier} instead of ${old}, won in ${game}, ${detail}.`,
};

// Said to the passenger when Amish presses Nearly there / End ride / New
// passenger (phone or Driver panel). In the passenger's language when the
// tablet has that voice, otherwise English (v5.24, owner).
// "nearly" names no number of minutes (v5.37): the driver can press Nearly
// there at any time, so it must stay true whenever it is said.
export const ANNOUNCE: Record<"nearly" | "arrived" | "welcome", Record<Lang, string>> = {
  nearly: {
    en: "We're nearly there. Please start gathering your belongings.",
    es: "Casi hemos llegado. Vaya recogiendo sus pertenencias, por favor.",
    ur: "ہم تقریباً پہنچ گئے ہیں۔ براہ کرم اپنا سامان سمیٹ لیں۔",
  },
  arrived: {
    en: "We've arrived. Thank you for riding with {driver}. Please check you have all your belongings. Have a wonderful day.",
    es: "Hemos llegado. Gracias por viajar con {driver}. Compruebe que lleva todas sus pertenencias. Que tenga un buen día.",
    ur: "ہم پہنچ گئے ہیں۔ {driver} کے ساتھ سفر کرنے کا شکریہ۔ براہ کرم اپنا سامان چیک کر لیں۔ آپ کا دن اچھا گزرے۔",
  },
  welcome: {
    en: "Welcome aboard. Your driver today is {driver}. Please choose your language on the screen.",
    es: "Welcome aboard. Your driver today is {driver}. Please choose your language on the screen.",
    ur: "Welcome aboard. Your driver today is {driver}. Please choose your language on the screen.",
  },
};
