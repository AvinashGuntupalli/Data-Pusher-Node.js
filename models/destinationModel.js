import db from "../db.js";
import { v4 as uuidv4 } from "uuid";

function createDestination({ account_id, url, http_method, headers }) {
  return new Promise((resolve, reject) => {
    const destination_id = uuidv4();
    const sql =
      "INSERT INTO destinations (destination_id, account_id, url, http_method, headers) VALUES (?, ?, ?, ?, ?)";
    db.run(
      sql,
      [destination_id, account_id, url, http_method, JSON.stringify(headers)],
      function (err) {
        if (err) return reject(err);
        resolve({ destination_id, account_id, url, http_method, headers });
      }
    );
  });
}

function getDestinationsByAccount(account_id) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT destination_id, account_id, url, http_method, headers FROM destinations WHERE account_id = ?";
    db.all(sql, [account_id], (err, rows) => {
      if (err) return reject(err);
      // Parse headers JSON string to object
      rows.forEach((r) => (r.headers = JSON.parse(r.headers)));
      resolve(rows);
    });
  });
}

function getDestinationById(destination_id) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT destination_id, account_id, url, http_method, headers FROM destinations WHERE destination_id = ?";
    db.get(sql, [destination_id], (err, row) => {
      if (err) return reject(err);
      if (row) row.headers = JSON.parse(row.headers);
      resolve(row);
    });
  });
}

function updateDestination(destination_id, { url, http_method, headers }) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE destinations SET url = ?, http_method = ?, headers = ? WHERE destination_id = ?";
    db.run(
      sql,
      [url, http_method, JSON.stringify(headers), destination_id],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
}

// deleteDestination
function deleteDestination(destination_id) {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM destinations WHERE destination_id = ?";
    db.run(sql, [destination_id], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
}
const destinationModel = {
  createDestination,
  getDestinationsByAccount,
  getDestinationById,
  updateDestination,
  deleteDestination,
};

export {
  createDestination,
  getDestinationsByAccount,
  getDestinationById,
  updateDestination,
  deleteDestination,
};
export default destinationModel;
