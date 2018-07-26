# Demokoffer

Visualisierung der Temperatur der Picoflasher.

Verbindet sich per Websocket direkt mit dem passendem Mqtt-Server.

# Bugs

react-google-charts greift nicht aufs google-charts npm Paket zurück,
sondern versucht google-charts aus dem Netz nachzuladen. Das ist
natürlich bei einer Lösung die offline laufen soll etwas suboptimal.