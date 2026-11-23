/* Physik-Reels für Physik 10: Themen und Reihenfolge der Videos.
   Die Texte zu den Videos stehen in assets/reels-katalog.js.
   Neues Thema: Block kopieren. icon: tacho, traegheit, kraft, dichte, licht, spiegel, linse, magnet, ladung, strom,
   druck, luft, gas, auftrieb, thermo, flamme, aggregat, motor, spule, trafo, atom, strahlung, energie, fall, messen
   farbe: f-blau, f-orange, f-lila, f-petrol, f-gelb, f-gruen */
var REELS_KLASSE = { name: "Physik 10" };
var REELS_THEMEN = [
  { id: "bewegung", titel: "Bewegung & Trägheit", text: "Geschwindigkeit und Newton", icon: "tacho", farbe: "f-blau",
    reels: ["R304", "R121", "R172", "R173", "R021"] },
  { id: "fall", titel: "Freier Fall & Wurf", text: "Beschleunigung, Fall, Wurf", icon: "fall", farbe: "f-orange",
    reels: ["R089", "R057", "R044", "R073", "R226", "R203", "R190"] },
  { id: "induktion", titel: "Induktion & Wirbelströme", text: "Regel von Lenz im Alltag", icon: "spule", farbe: "f-petrol",
    reels: ["R352", "R150", "R099", "R322", "R233", "R006"] },
  { id: "generator", titel: "Generator & Transformator", text: "Strom erzeugen und umspannen", icon: "trafo", farbe: "f-lila",
    reels: ["R303", "R206", "R037", "R188", "R036", "R231", "R296"] },
  { id: "atom", titel: "Atombau", text: "Kern, Hülle und Ladung", icon: "atom", farbe: "f-gruen",
    reels: ["R055", "R270", "R041", "R175"] },
  { id: "strahlung", titel: "Radioaktivität", text: "Strahlung sichtbar machen", icon: "strahlung", farbe: "f-gelb",
    reels: ["R269", "R351", "R350", "R153", "R209"] },
  { id: "energie", titel: "Energieversorgung", text: "Kraftwerke, Wirkungsgrad, Wärmepumpe", icon: "energie", farbe: "f-orange",
    reels: ["R104", "R229", "R070", "R163"] }
];
