import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

function generateId() {
  return uuidv4();
}

function generateSecret() {
  return crypto.randomBytes(32).toString("hex");
}

function parseJSON(body) {
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

export { generateId, generateSecret, parseJSON };
