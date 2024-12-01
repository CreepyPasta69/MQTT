const mqtt = require("mqtt");

const mqttClient = mqtt.connect(process.env.MQTT_URL);

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
});

mqttClient.on("error", (err) => {
  console.error("MQTT connection error:", err);
});

module.exports = mqttClient;
