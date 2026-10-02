export type Lang = "en" | "es" | "ur";

export interface Translation {
  welcomeAboard: string;
  exploreTagline: string;
  entertainment: string;
  bluetooth: string;
  radio: string;
  playlist: string;
  nowPlaying: string;
  selectStation: string;
  selectPlaylist: string;
  stop: string;
  volume: string;
  journey: string;
  fastRoute: string;
  changeDest: string;
  games: string;
  gamesSub: string;
  openChat: string;
  chatSub: string;
  playGame: string;
  gameSub: string;
  payCash: string;
  payUber: string;
  uberPrompt: string;
  payBank: string;
  scanToTip: string;
  qrCaption: string;
  tapToChoose: string;
  topicsTab: string;
  quizTab: string;
  riddlesTab: string;
  tapNext: string;
  nextTopic: string;
  redo: string;
  playDriver: string;
  easy: string;
  medium: string;
  hard: string;
  chooseLevel: string;
  selectEasyMedHard: string;
  answer: string;
  showAnswer: string;
  nextQuestion: string;
  nextRiddle: string;
  tapNextRiddle: string;
  warm: string;
  cold: string;
  comfortItems: string;
  motorway: string;
  charger: string;
  specialSnacks: string;
  wipes: string;
  mints: string;
  tipYourDriver: string;
  tipQuote: string;
  tips: string;
  cashTip: string;
  recommended: string;
  uberTip: string;
  viaUber: string;
  contactDriver: string;
  replyDriver: string;
  adminPanel: string;
  fullScreen: string;
  close: string;
  vr: string;
  btConnect: string;
  btDeviceName: string;
  btStep1: string;
  btStep2: string;
  btStep3: string;
  btStep4: string;
  btStep5: string;
  // Classic Games gallery (replaces the old "Quiet" trigger)
  gamesGalleryTitle: string;
  ticTacToe: string;
  rockPaperScissors: string;
  memoryMatch: string;
  backToGames: string;
  newGame: string;
  yourTurn: string;
  carTurn: string;
  youWin: string;
  youLose: string;
  itsADraw: string;
  rock: string;
  paper: string;
  scissors: string;
  youPicked: string;
  carPicked: string;
  allMatched: string;
  tapToFlip: string;
}

export const T: Record<Lang, Translation> = {
  en: {
    welcomeAboard: "Welcome Aboard LuxPro 4.1",
    exploreTagline: "Explore Exclusive Service With Just One Touch",
    entertainment: "Entertainment",
    bluetooth: "Bluetooth",
    radio: "Radio",
    playlist: "Playlist",
    nowPlaying: "Now Playing",
    selectStation: "Select a station",
    selectPlaylist: "Select a playlist",
    stop: "■ Stop",
    volume: "Volume",
    journey: "Journey",
    fastRoute: "Fast Route",
    changeDest: "Change Dest.",
    games: "Classic Games",
    gamesSub: "Pick & play",
    openChat: "Open to Chat",
    chatSub: "Conversation topics",
    playGame: "Trivia",
    gameSub: "Quiz · Riddles",
    payCash: "Cash",
    payUber: "Uber",
    uberPrompt: "Please tip through your Uber app after the journey.",
    payBank: "Revolut",
    scanToTip: "Scan to Tip via Revolut",
    qrCaption: "Scan with Revolut to tip your driver",
    tapToChoose: "Tap to choose",
    topicsTab: "Topics",
    quizTab: "Quiz",
    riddlesTab: "Riddles",
    tapNext: "Tap Next to get started!",
    nextTopic: "Next Topic",
    redo: "Redo",
    playDriver: "Play with Driver",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    chooseLevel: "Choose a level",
    selectEasyMedHard: "Select Easy, Medium or Hard",
    answer: "Answer",
    showAnswer: "Show Answer",
    nextQuestion: "Next Question",
    nextRiddle: "Next Riddle",
    tapNextRiddle: "Tap Next Riddle to start!",
    warm: "Warm",
    cold: "Cold",
    comfortItems: "Comfort Items",
    motorway: "Motorway",
    charger: "Phone Charger",
    specialSnacks: "Special Snacks",
    wipes: "Wet Wipes",
    mints: "Sweets & Mints",
    tipYourDriver: "💛 Tip Your Driver",
    tipQuote: '"Tips are appreciated. Quality service requires dedication and maintenance."',
    tips: "Tips",
    cashTip: "Cash Tip",
    recommended: "⭐ Rec.",
    uberTip: "Via Uber",
    viaUber: "Uber",
    contactDriver: "Contact Driver",
    replyDriver: "Reply to Driver",
    adminPanel: "Admin Panel",
    fullScreen: "Full Screen",
    close: "Close",
    vr: "Voice assistant ready",
    btConnect: "Connect Bluetooth",
    btDeviceName: "Car Bluetooth Name",
    btStep1: 'Open <strong>Settings</strong> on your phone',
    btStep2: 'Tap <strong>Bluetooth</strong>',
    btStep3: 'Make sure Bluetooth is <strong>ON</strong>',
    btStep4: 'Find and tap <strong>"My Volvo Car"</strong>',
    btStep5: "Confirm pairing on both devices ✅",
    gamesGalleryTitle: "Choose a Game",
    ticTacToe: "Tic-Tac-Toe",
    rockPaperScissors: "Rock Paper Scissors",
    memoryMatch: "Memory Match",
    backToGames: "← Games",
    newGame: "New Game",
    yourTurn: "Your Turn",
    carTurn: "Amish's Turn",
    youWin: "You Win! 🎉",
    youLose: "Amish Wins!",
    itsADraw: "It's a Draw",
    rock: "Rock",
    paper: "Paper",
    scissors: "Scissors",
    youPicked: "You picked",
    carPicked: "Amish picked",
    allMatched: "All Matched! 🎉",
    tapToFlip: "Tap a card to flip",
  },
  es: {
    welcomeAboard: "Bienvenido a Bordo LuxPro 4.1",
    exploreTagline: "Explore Servicio Exclusivo Con Solo Un Toque",
    entertainment: "Entretenimiento",
    bluetooth: "Bluetooth",
    radio: "Radio",
    playlist: "Lista",
    nowPlaying: "Reproduciendo",
    selectStation: "Selecciona una estación",
    selectPlaylist: "Selecciona una lista",
    stop: "■ Detener",
    volume: "Volumen",
    journey: "Viaje",
    fastRoute: "Ruta Rápida",
    changeDest: "Cambiar Destino",
    games: "Juegos Clásicos",
    gamesSub: "Elige y juega",
    openChat: "Charlar",
    chatSub: "Temas de charla",
    playGame: "Trivia",
    gameSub: "Quiz · Adivinanzas",
    payCash: "Efectivo",
    payUber: "Uber",
    uberPrompt: "Por favor, deja la propina a través de tu app de Uber después del viaje.",
    payBank: "Revolut",
    scanToTip: "Escanea para propina via Revolut",
    qrCaption: "Escanea con Revolut para dar propina a tu conductor",
    tapToChoose: "Toca para elegir",
    topicsTab: "Temas",
    quizTab: "Quiz",
    riddlesTab: "Adivinanzas",
    tapNext: "Toca Siguiente para empezar",
    nextTopic: "Siguiente Tema",
    redo: "Repetir",
    playDriver: "Jugar con Conductor",
    easy: "Fácil",
    medium: "Medio",
    hard: "Difícil",
    chooseLevel: "Elige un nivel",
    selectEasyMedHard: "Selecciona Fácil, Medio o Difícil",
    answer: "Respuesta",
    showAnswer: "Ver Respuesta",
    nextQuestion: "Siguiente Pregunta",
    nextRiddle: "Siguiente Adivinanza",
    tapNextRiddle: "Toca Siguiente para empezar",
    warm: "Caliente",
    cold: "Frío",
    comfortItems: "Comodidades",
    motorway: "Autopista",
    charger: "Cargador",
    specialSnacks: "Snacks Especiales",
    wipes: "Toallitas",
    mints: "Caramelos y Mentas",
    tipYourDriver: "💛 Propina al Conductor",
    tipQuote: '"Las propinas son apreciadas. El servicio de calidad requiere dedicación y mantenimiento."',
    tips: "Propinas",
    cashTip: "Propina Efectivo",
    recommended: "⭐ Rec.",
    uberTip: "Vía Uber",
    viaUber: "Uber",
    contactDriver: "Contactar Conductor",
    replyDriver: "Responder al Conductor",
    adminPanel: "Panel de Admin",
    fullScreen: "Pantalla Completa",
    close: "Cerrar",
    vr: "Asistente de voz listo",
    btConnect: "Conectar Bluetooth",
    btDeviceName: "Nombre Bluetooth del Coche",
    btStep1: 'Abre <strong>Ajustes</strong> en tu teléfono',
    btStep2: 'Toca <strong>Bluetooth</strong>',
    btStep3: 'Asegúrate que Bluetooth esté <strong>activado</strong>',
    btStep4: 'Busca y toca <strong>"My Volvo Car"</strong>',
    btStep5: "Confirma el emparejamiento en ambos dispositivos ✅",
    gamesGalleryTitle: "Elige un Juego",
    ticTacToe: "Tres en Raya",
    rockPaperScissors: "Piedra Papel Tijera",
    memoryMatch: "Memorama",
    backToGames: "← Juegos",
    newGame: "Nuevo Juego",
    yourTurn: "Tu Turno",
    carTurn: "Turno de Amish",
    youWin: "¡Ganaste! 🎉",
    youLose: "¡Gana Amish!",
    itsADraw: "Empate",
    rock: "Piedra",
    paper: "Papel",
    scissors: "Tijera",
    youPicked: "Elegiste",
    carPicked: "Amish eligió",
    allMatched: "¡Todo Emparejado! 🎉",
    tapToFlip: "Toca una carta para voltear",
  },
  ur: {
    welcomeAboard: "LuxPro 4.1 میں خوش آمدید",
    exploreTagline: "صرف ایک ٹچ کے ساتھ خصوصی سروس دریافت کریں",
    entertainment: "تفریح",
    bluetooth: "بلوٹوتھ",
    radio: "ریڈیو",
    playlist: "پلے لسٹ",
    nowPlaying: "ابھی چل رہا ہے",
    selectStation: "اسٹیشن منتخب کریں",
    selectPlaylist: "پلے لسٹ منتخب کریں",
    stop: "■ روکیں",
    volume: "آواز",
    journey: "سفر",
    fastRoute: "تیز ترین راستہ",
    changeDest: "منزل تبدیل کریں",
    games: "کلاسک گیمز",
    gamesSub: "منتخب کریں اور کھیلیں",
    openChat: "بات چیت کے لیے تیار",
    chatSub: "گفتگو کے موضوعات",
    playGame: "ٹریویا",
    gameSub: "کوئز · پہیلیاں",
    payCash: "نقد",
    payUber: "اوبر",
    uberPrompt: "براہ کرم سفر کے بعد اپنی Uber ایپ کے ذریعے ٹپ دیں۔",
    payBank: "Revolut",
    scanToTip: "Revolut کے ذریعے ٹپ دینے کے لیے اسکین کریں",
    qrCaption: "اپنے ڈرائیور کو ٹپ دینے کے لیے Revolut سے اسکین کریں",
    tapToChoose: "منتخب کرنے کے لیے ٹچ کریں",
    topicsTab: "موضوعات",
    quizTab: "کوئز",
    riddlesTab: "پہیلیاں",
    tapNext: "شروع کرنے کے لیے 'اگلا' دبائیں!",
    nextTopic: "اگلا موضوع",
    redo: "دوبارہ",
    playDriver: "ڈرائیور کے ساتھ کھیلیں",
    easy: "آسان",
    medium: "درمیانہ",
    hard: "مشکل",
    chooseLevel: "سطح منتخب کریں",
    selectEasyMedHard: "آسان، درمیانہ یا مشکل منتخب کریں",
    answer: "جواب",
    showAnswer: "جواب دکھائیں",
    nextQuestion: "اگلا سوال",
    nextRiddle: "اگلی پہیلی",
    tapNextRiddle: "شروع کرنے کے لیے 'اگلی پہیلی' دبائیں!",
    warm: "گرم",
    cold: "ٹھنڈا",
    comfortItems: "آرام دہ اشیاء",
    motorway: "موٹروے",
    charger: "فون چارجر",
    specialSnacks: "خصوصی اسنیکس",
    wipes: "گیلے وائپس",
    mints: "ٹافیاں اور منٹس",
    tipYourDriver: "💛 اپنے ڈرائیور کو ٹپ دیں",
    tipQuote: '"ٹپ کی قدر کی جاتی ہے۔ معیاری سروس کے لیے محنت اور دیکھ بھال درکار ہے۔"',
    tips: "ٹپس",
    cashTip: "نقد ٹپ",
    recommended: "⭐ تجویز کردہ",
    uberTip: "Uber کے ذریعے",
    viaUber: "Uber",
    contactDriver: "ڈرائیور سے رابطہ کریں",
    replyDriver: "ڈرائیور کو جواب دیں",
    adminPanel: "ایڈمن پینل",
    fullScreen: "فل اسکرین",
    close: "بند کریں",
    vr: "صوتی معاون تیار ہے",
    btConnect: "بلوٹوتھ منسلک کریں",
    btDeviceName: "کار کا بلوٹوتھ نام",
    btStep1: 'اپنے فون میں <strong>سیٹنگز</strong> کھولیں',
    btStep2: '<strong>بلوٹوتھ</strong> پر ٹیپ کریں',
    btStep3: 'یقینی بنائیں بلوٹوتھ <strong>آن</strong> ہے',
    btStep4: '<strong>"My Volvo Car"</strong> تلاش کر کے ٹیپ کریں',
    btStep5: "دونوں آلات پر جوڑنے کی تصدیق کریں ✅",
    gamesGalleryTitle: "ایک گیم منتخب کریں",
    ticTacToe: "ٹک ٹیک ٹو",
    rockPaperScissors: "پتھر کاغذ قینچی",
    memoryMatch: "میموری میچ",
    backToGames: "← گیمز",
    newGame: "نئی گیم",
    yourTurn: "آپ کی باری",
    carTurn: "امیش کی باری",
    youWin: "آپ جیت گئے! 🎉",
    youLose: "امیش جیت گیا!",
    itsADraw: "برابر",
    rock: "پتھر",
    paper: "کاغذ",
    scissors: "قینچی",
    youPicked: "آپ نے چنا",
    carPicked: "امیش نے چنا",
    allMatched: "سب جوڑے مل گئے! 🎉",
    tapToFlip: "کارڈ پلٹنے کے لیے ٹیپ کریں",
  },
};

export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  es: "Español",
  ur: "اردو",
};

export const LANG_FLAGS: Record<Lang, string> = {
  en: "https://flagcdn.com/w40/gb.png",
  es: "https://flagcdn.com/w40/es.png",
  ur: "https://flagcdn.com/w40/pk.png",
};

export const LANG_VOICE: Record<Lang, string> = {
  en: "en-US",
  es: "es-ES",
  ur: "ur-PK",
};
