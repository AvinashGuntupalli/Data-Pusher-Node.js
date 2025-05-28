// import axios from "axios";

// async function sendDataToDestination(destination, data) {
//   const { url, http_method, headers } = destination;
//   const parsedHeaders = JSON.parse(headers);

//   try {
//     if (http_method.toUpperCase() === "GET") {
//       // Send data as query params
//       await axios.get(url, { params: data, headers: parsedHeaders });
//     } else if (["POST", "PUT"].includes(http_method.toUpperCase())) {
//       // Send data as JSON body
//       await axios({
//         method: http_method,
//         url,
//         headers: parsedHeaders,
//         data,
//       });
//     } else {
//       throw new Error(`Unsupported HTTP method: ${http_method}`);
//     }
//   } catch (err) {
//     console.error(`Error sending data to destination ${url}:`, err.message);
//   }
// }

// export default sendDataToDestination;

import http from "http";
import https from "https";
import { URL } from "url";
import querystring from "querystring";

function sendDataToDestination(destination, data) {
  const { url: destUrl, http_method, headers } = destination;
  const method = (http_method || "POST").toUpperCase();
  const parsedUrl = new URL(destUrl);
  const isHttps = parsedUrl.protocol === "https:";

  let path = parsedUrl.pathname + parsedUrl.search;
  let body = null;
  const finalHeaders = {
    ...headers,
  };

  if (method === "GET") {
    //Append data as query parameters
    const queryParams = querystring.stringify(data);
    path += (path.includes("?") ? "&" : "?") + queryParams;
  } else if (method === "POST" || method === "PUT") {
    //Send data as JSON in body
    body = JSON.stringify(data);
    finalHeaders["Content-Type"] = "application/json";
    finalHeaders["Content-Length"] = Buffer.byteLength(body);
  }

  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || (isHttps ? 443 : 80),
    path,
    method,
    headers: finalHeaders,
  };

  const lib = isHttps ? https : http;

  const req = lib.request(options, (res) => {
    console.log(`Forwarded to ${method} ${parsedUrl.href} → ${res.statusCode}`);
  });

  req.on("error", (err) => {
    console.error(`Failed to forward to ${parsedUrl.href}:`, err.message);
  });

  if (body) {
    req.write(body);
  }

  req.end();
}

export default sendDataToDestination;
