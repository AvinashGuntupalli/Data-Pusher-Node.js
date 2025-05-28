// import accountsModel from "../models/accountsModel.js";
// import destinationModel from "../models/destinationModel.js";
// import sendDataToDestination from "../utils/httpClient.js";

// async function forwardData(req, res, account_id) {
//   // Authenticate using app_secret_token in header
//   const token = req.headers["x-app-secret-token"];
//   if (!token) {
//     res.writeHead(401, { "Content-Type": "application/json" });
//     return res.end(JSON.stringify({ error: "Missing app secret token" }));
//   }

//   try {
//     const account = await accountsModel.getAccountByToken(token);
//     if (!account || account.account_id !== account_id) {
//       res.writeHead(401, { "Content-Type": "application/json" });
//       return res.end(JSON.stringify({ error: "Invalid app secret token" }));
//     }

//     const data = await require("../utils/requestParser").parseJSONBody(req);

//     // Get all destinations for this account
//     const destinations = await destinationModel.getDestinationsByAccount(
//       account_id
//     );

//     // Forward data asynchronously, no need to wait
//     destinations.forEach((dest) => {
//       sendDataToDestination(dest, data);
//     });

//     res.writeHead(200, { "Content-Type": "application/json" });
//     res.end(JSON.stringify({ message: "Data forwarded to destinations" }));
//   } catch (err) {
//     res.writeHead(400, { "Content-Type": "application/json" });
//     res.end(JSON.stringify({ error: err.message }));
//   }
// }

// export default forwardData;

import accountsModel from "../models/accountsModel.js";
import destinationModel from "../models/destinationModel.js";
import sendDataToDestination from "../utils/httpClient.js";

async function forwardData(req, res, account_id) {
  // Correct header key: CL-X-TOKEN → cl-x-token
  const token = req.headers["cl-x-token"];
  if (!token) {
    res.writeHead(401, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Missing app secret token" }));
  }

  try {
    const account = await accountsModel.getAccountByToken(token);
    if (!account || account.account_id !== account_id) {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Invalid app secret token" }));
    }

    const data = await require("../utils/requestParser").parseJSONBody(req);

    // Fetch destinations and forward data
    const destinations = await destinationModel.getDestinationsByAccount(
      account_id
    );

    destinations.forEach((dest) => {
      sendDataToDestination(dest, data);
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Data forwarded to destinations" }));
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
}

export default forwardData;
