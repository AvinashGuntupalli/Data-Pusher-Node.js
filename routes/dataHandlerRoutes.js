import url from "url";
import dataHandlerController from "../controller/dataHandlerController.js";

async function dataHandlerRoutes(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathParts = parsedUrl.pathname.split("/").filter(Boolean);

  // POST /accounts/:account_id/data
  if (
    req.method === "POST" &&
    pathParts.length === 3 &&
    pathParts[0] === "accounts" &&
    pathParts[2] === "data"
  ) {
    const account_id = pathParts[1];
    return dataHandlerController.forwardData(req, res, account_id);
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Route not found" }));
}

export default dataHandlerRoutes;
