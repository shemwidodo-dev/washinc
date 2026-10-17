import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userModel from "../models/user.model.js";
import { HttpError } from "../utils/HttpError.js";

export async function login(phone, password) {
  const user = await userModel.getUserByPhone(phone);

  const ok = user && (await bcrypt.compare(password, user.password_hash));
  if (!ok) return null;

  const token = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  return {
    token,
    user: { id: user.id, name: user.name, role: user.role },
  };
}

export async function register(name, phone, password) {
  const existing = await userModel.getUserByPhone(phone);

  if (existing) throw new HttpError(409, "Phone already registered");

  const passwordHash = await bcrypt.hash(password, 12);
  return userModel.insertUser(name, phone, passwordHash, "customer");
}
