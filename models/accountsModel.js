import db from "../db.js";
import { v4 as uuidv4 } from "uuid";

function createAccount({ email, account_name, website }) {
  return new Promise((resolve, reject) => {
    const account_id = uuidv4();
    const app_secret_token = uuidv4();
    const sql =
      "INSERT INTO accounts (account_id, email, account_name, app_secret_token, website) VALUES (?, ?, ?, ?, ?)";
    db.run(
      sql,
      [account_id, email, account_name, app_secret_token, website || null],
      function (err) {
        if (err) return reject(err);
        resolve({
          account_id,
          email,
          account_name,
          app_secret_token,
          website: website || null,
        });
      }
    );
  });
}

function getAccountById(account_id) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT account_id, email, account_name, app_secret_token, website FROM accounts WHERE account_id = ?";
    db.get(sql, [account_id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function getAccountByToken(token) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT account_id, email, account_name, app_secret_token, website FROM accounts WHERE app_secret_token = ?";
    db.get(sql, [token], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function updateAccount(account_id, { email, account_name, website }) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE accounts SET email = ?, account_name = ?, website = ? WHERE account_id = ?";
    db.run(
      sql,
      [email, account_name, website || null, account_id],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
}

function deleteAccount(account_id) {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM accounts WHERE account_id = ?";
    db.run(sql, [account_id], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
}

const accountsModel = {
  createAccount,
  getAccountById,
  getAccountByToken,
  updateAccount,
  deleteAccount,
};

export {
  createAccount,
  getAccountById,
  getAccountByToken,
  updateAccount,
  deleteAccount,
};

export default accountsModel;
