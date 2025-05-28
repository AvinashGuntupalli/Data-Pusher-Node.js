import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert { type: "json" };

import accountRoutes from "./routes/accountRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import dataHandlerRoutes from "./routes/dataHandlerRoutes.js";
import incomingDataRoutes from "./routes/incomingDataRoutes.js";

// Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3013;

// Middleware to parse JSON body
app.use(express.json());

// Swagger UI setup on /docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/accounts", accountRoutes); // handles /accounts and /accounts/:id
app.use("/accounts", destinationRoutes); // handles /accounts/:accountId/destinations and destinations/:id
app.use("/data", dataHandlerRoutes); // if needed
app.use(incomingDataRoutes); ////middleware

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
});
