/* Physik-Reels für Physik 9b: Themen und Reihenfolge der Videos.
   Die Texte zu den Videos stehen in assets/reels-katalog.js.
   Neues Thema: Block kopieren. icon: tacho, traegheit, kraft, dichte, licht, spiegel, linse, magnet, ladung, strom,
   druck, luft, gas, auftrieb, thermo, flamme, aggregat, motor, spule, trafo, atom, strahlung, energie, fall, messen
   farbe: f-blau, f-orange, f-lila, f-petrol, f-gelb, f-gruen */
var REELS_KLASSE = { name: "Physik 9b" };
var REELS_THEMEN = [
  { id: "druck", titel: "Druck in Flüssigkeiten", text: "Schweredruck und Hydraulik", icon: "druck", farbe: "f-blau",
    reels: ["R003", "R018", "R057"] },
  { id: "luftdruck", titel: "Luftdruck", text: "Unsichtbar, aber stark", icon: "luft", farbe: "f-petrol",
    reels: ["R295", "R298", "R096", "R287"] },
  { id: "gase", titel: "Gase", text: "Druck, Volumen und Temperatur", icon: "gas", farbe: "f-lila",
    reels: ["R061", "R125", "R142", "R119"] },
  { id: "auftrieb", titel: "Auftrieb & Dichte", text: "Schwimmen, Schweben, Sinken", icon: "auftrieb", farbe: "f-gruen",
    reels: ["R281", "R265", "R030", "R290"] },
  { id: "temperatur", titel: "Temperatur & Wärme", text: "Teilchen, Wärme, Ausdehnung", icon: "thermo", farbe: "f-orange",
    reels: ["R223", "R176", "R320", "R336", "R325", "R279", "R097", "R095"] },
  { id: "aggregat", titel: "Aggregatzustände", text: "Schmelzen, Sieden, Verdampfen", icon: "aggregat", farbe: "f-blau",
    reels: ["R088", "R029", "R006"] },
  { id: "maschinen", titel: "Wärmekraftmaschinen", text: "Motoren und Wärmepumpe", icon: "motor", farbe: "f-gelb",
    reels: ["R092", "R094", "R311", "R346", "R070", "R302"] },
  { id: "elektromagnetismus", titel: "Elektromotor & Elektromagnet", text: "Kraft auf stromdurchflossene Leiter", icon: "magnet", farbe: "f-lila",
    reels: ["R013", "R312", "R344", "R208", "R234", "R109", "R213", "R077"] },
  { id: "strom", titel: "Strom & Halbleiter", text: "Widerstand, Diode, Solarzelle", icon: "strom", farbe: "f-petrol",
    reels: ["R008", "R154", "R012", "R163"] }
];
