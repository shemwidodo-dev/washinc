import * as authService from "../services/auth.services.js";
import * as userModel from "../models/user.model.js";

export async function login(req, res, next) {
  try {
    const { phone, password } = req.body;
    if (!phone || !password)
      return res.status(400).json({ message: "All fields are required." });

    const result = await authService.login(phone, password);
    if (!result)
      return res.status(401).json({ message: "Phone or password wrong" });

    res.json({ result });
  } catch (error) {
    next(error);
  }
}

export async function getUserLogin(req, res, next) {
  try {
    const user = await userModel.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
}
