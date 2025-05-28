import accountsModel from "../models/accountsModel.js";

async function createAccount(req, res) {
  try {
    const data = await require("../utils/requestParser").parseJSONBody(req);
    if (!data.email || !data.account_name) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ error: "email and account_name are required" })
      );
    }
    const account = await accountsModel.createAccount(data);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(account));
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
}

async function getAccount(req, res, id) {
  try {
    const account = await accountsModel.getAccountById(id);
    if (!account) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Account not found" }));
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(account));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
}

async function updateAccount(req, res, id) {
  try {
    const data = await require("../utils/requestParser").parseJSONBody(req);
    if (!data.email || !data.account_name) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ error: "email and account_name are required" })
      );
    }
    const changes = await accountsModel.updateAccount(id, data);
    if (changes === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Account not found" }));
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Account updated successfully" }));
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
}

async function deleteAccount(req, res, id) {
  try {
    const changes = await accountsModel.deleteAccount(id);
    if (changes === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Account not found" }));
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Account deleted successfully" }));
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
}

const accountController = {
  createAccount,
  getAccount,
  updateAccount,
  deleteAccount,
};
export { createAccount, getAccount, updateAccount, deleteAccount };
export default accountController;
