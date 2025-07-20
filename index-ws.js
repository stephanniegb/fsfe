const express = require("express");
const http = require("http");

const app = express();

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

const server = http.createServer(app);
server.listen(3000, () => {
  console.log("server started on port 3000");
});

process.on("SIGINT", () => {
  wss.clients.forEach(function each(client) {
    client.close();
  });

  server.close(() => {
    shutDownDB();
  });
});

/** Begin websocket */

const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ server: server });

wss.on("connection", function connection(ws) {
  const numClients = wss.clients.size;
  console.log("Client connected:", numClients);

  db.run(`INSERT INTO visitors (counts, time) 
      VALUES(${numClients},  datetime('now'))
    
    `);

  wss.broadcast(`current visitors: ${numClients}`);

  if (ws.readyState == ws.OPEN) {
    ws.send("Welcome to my connection");
  }

  ws.on("close", function close() {
    console.log("A client has disconnected");
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};

/** end websocket */

/**begin DB */
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(`

    CREATE TABLE visitors (
      counts INTEGER,
      time TEXT
    )
    
    `);
});

function getCounts() {
  db.each("SELECT * from visitors", (err, row) => {
    console.log(row);
  });
}

function shutDownDB() {
  getCounts();
  console.log("shutting down db");
  db.close();
}
