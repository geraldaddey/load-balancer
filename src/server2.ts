import http from "http";

import { SERVER_TWO_PORT } from "./constants";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Response from Server 2");
});

server.listen(SERVER_TWO_PORT, () => {
  console.log(`Server 2 is running on http://localhost:${SERVER_TWO_PORT}`);
});
