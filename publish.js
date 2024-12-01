const client = require("./connections/mqtt");

let lastTemps = Array(10).fill(-24);

function generateTemperature(deviceIndex) {
  const randTemp =
    parseFloat(
      (lastTemps[deviceIndex] + (Math.random() * 0.5 - 0.25)).toFixed(1)
    ) || lastTemps[deviceIndex];
  const smoothTemp = Math.max(-29, Math.min(-18, randTemp));
  lastTemps[deviceIndex] = smoothTemp;
  return smoothTemp;
}

setInterval(() => {
  for (let deviceID = 1; deviceID <= 10; deviceID++) {
    const data = {
      deviceID,
      time: new Date(),
      temperature: generateTemperature(deviceID - 1),
    };

    client.publish("data", JSON.stringify(data), (err) => {
      if (err) {
        console.error(`Publish error for device ${deviceID}:`, err);
      } else {
        console.log(`Sent from device ${deviceID}:`, data);
      }
    });
  }
}, 1000);
