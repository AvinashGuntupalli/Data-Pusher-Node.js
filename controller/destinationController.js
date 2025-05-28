import destinationModel from "../models/destinationModel.js";
import accountsModel from "../models/accountsModel.js";
import parseJSONBody from "../utils/requestParser.js";

async function createDestination(req, res, account_id) {
  try {
    // Validate account exists
    const account = await accountsModel.getAccountById(account_id);
    if (!account) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Account not found" }));
    }

    const data = await parseJSONBody(req);
    const { url, http_method, headers } = data;

    if (!url || !http_method || !headers || typeof headers !== "object") {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          error: "url, http_method and headers (object) are required",
        })
      );
    }

    const destination = await destinationModel.createDestination({
      account_id,
      url,
      http_method,
      headers,
    });

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(destination));
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
}

async function getDestinations(req, res, account_id) {
  try {
    const destinations = await destinationModel.getDestinationsByAccount(
      account_id
    );
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(destinations));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
}

async function updateDestination(req, res, account_id, destination_id) {
  try {
    // Validate destination belongs to account
    const destination = await destinationModel.getDestinationById(
      destination_id
    );
    if (!destination || destination.account_id !== account_id) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Destination not found" }));
    }

    const data = await parseJSONBody(req);
    const { url, http_method, headers } = data;

    if (!url || !http_method || !headers || typeof headers !== "object") {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          error: "url, http_method and headers (object) are required",
        })
      );
    }

    await destinationModel.updateDestination(destination_id, {
      url,
      http_method,
      headers,
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Destination updated successfully" }));
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
}

async function deleteDestination(req, res, account_id, destination_id) {
  try {
    const destination = await destinationModel.getDestinationById(
      destination_id
    );
    if (!destination || destination.account_id !== account_id) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Destination not found" }));
    }

    await destinationModel.deleteDestination(destination_id);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Destination deleted successfully" }));
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
}

const destinationController = {
  createDestination,
  getDestinations,
  updateDestination,
  deleteDestination,
};

export {
  createDestination,
  getDestinations,
  updateDestination,
  deleteDestination,
};
export default destinationController;
