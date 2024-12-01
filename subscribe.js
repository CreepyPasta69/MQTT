const mqttClient = require("./connections/mqtt");
const dbClient = require("./connections/postgreDB");

const createdTables = new Set(); // Track created tables to avoid redundant creation

async function createTableIfNotExists(deviceID) {
  const tableName = `device_${deviceID}`;
  if (!createdTables.has(tableName)) {
    const query = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        temperature DECIMAL(5,2) NOT NULL
      );
    `;

    try {
      await dbClient.query(query);
      createdTables.add(tableName);
      console.log(`Table ${tableName} ensured.`);
    } catch (err) {
      console.error(`Error ensuring table ${tableName}:`, err);
    }
  }
}

mqttClient.subscribe("data", (err) => {
  if (err) {
    console.error("Subscription Error:", err);
  } else {
    console.log("Subscribed to data");
  }
});

mqttClient.on("message", async (topic, message) => {
  let data;

  try {
    data = JSON.parse(message.toString());
    console.log(`Received from device ${data.deviceID}: ${message.toString()}`);
  } catch (err) {
    console.error("Error parsing message:", err);
    return;
  }

  const { deviceID, temperature } = data;
  const timestamp = new Date();

  if (typeof deviceID !== "number" || typeof temperature !== "number") {
    console.error(
      "Invalid data format. Expected { deviceID: number, temperature: number }"
    );
    return;
  }

  const tableName = `device_${deviceID}`;

  try {
    await createTableIfNotExists(deviceID);

    const insertQuery = `
      INSERT INTO ${tableName} (timestamp, temperature)
      VALUES ($1, $2);
    `;
    await dbClient.query(insertQuery, [timestamp, temperature]);

    console.log(`Data inserted for device ${deviceID}`);
  } catch (err) {
    console.error(`Database insert error for device ${deviceID}:`, err);
  }
});
