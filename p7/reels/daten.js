/* Physik-Reels für Physik 7a: Themen und Reihenfolge der Videos.
   Die Texte zu den Videos stehen in assets/reels-katalog.js.
   Neues Thema: Block kopieren. icon: tacho, traegheit, kraft, dichte, licht, spiegel, linse, magnet, ladung, strom,
   druck, luft, gas, auftrieb, thermo, flamme, aggregat, motor, spule, trafo, atom, strahlung, energie, fall, messen
   farbe: f-blau, f-orange, f-lila, f-petrol, f-gelb, f-gruen */
var REELS_KLASSE = { name: "Physik 7a" };
var REELS_THEMEN = [
  { id: "geschwindigkeit", titel: "Messen & Geschwindigkeit", text: "Messgenauigkeit, km/h und m/s", icon: "tacho", farbe: "f-blau",
    reels: ["R129", "R180", "R304", "R301", "R121"] },
  { id: "traegheit", titel: "Trägheit", text: "Warum Dinge weiterrollen", icon: "traegheit", farbe: "f-orange",
    reels: ["R156", "R157", "R149", "R172", "R052"] },
  { id: "kraefte", titel: "Kräfte & Reibung", text: "Feder, Gleichgewicht, Reibung", icon: "kraft", farbe: "f-lila",
    reels: ["R108", "R084", "R215", "R031", "R151", "R335"] },
  { id: "gravitation", titel: "Gewichtskraft & Gravitation", text: "Masse, Waage, Planeten", icon: "fall", farbe: "f-gruen",
    reels: ["R319", "R173", "R171", "R329"] },
  { id: "dichte", titel: "Dichte", text: "Was schwimmt, was sinkt?", icon: "dichte", farbe: "f-petrol",
    reels: ["R030", "R265", "R225", "R049"] },
  { id: "licht", titel: "Licht & Farben", text: "Schatten, Farbmischung, Regenbogen", icon: "licht", farbe: "f-gelb",
    reels: ["R111", "R009", "R093", "R135", "R026"] },
  { id: "spiegel", titel: "Spiegel & Brechung", text: "Reflexion, Brechung, Totalreflexion", icon: "spiegel", farbe: "f-blau",
    reels: ["R155", "R238", "R220", "R182"] },
  { id: "linsen", titel: "Linsen & Auge", text: "Sammellinse, Brennpunkt, blinder Fleck", icon: "linse", farbe: "f-gruen",
    reels: ["R158", "R130", "R313", "R067"] },
  { id: "magnetismus", titel: "Magnetismus", text: "Magnete, Elementarmagnete, Erdmagnetfeld", icon: "magnet", farbe: "f-orange",
    reels: ["R347", "R014", "R133", "R219"] },
  { id: "ladung", titel: "Elektrische Ladung", text: "Anziehen, Abstoßen, Influenz", icon: "ladung", farbe: "f-lila",
    reels: ["R292", "R124", "R305", "R299", "R185"] },
  { id: "strom", titel: "Strom & Sicherheit", text: "Schaltungen, Sicherungen, Gefahren", icon: "strom", farbe: "f-petrol",
    reels: ["R017", "R066", "R339", "R213", "R154"] }
];
