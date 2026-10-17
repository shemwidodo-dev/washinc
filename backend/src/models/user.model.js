import { query } from "../db/index.js";

export async function getUserByPhone(phone) {
  const { rows } = await query(
    "SELECT id, name, role, password_hash from users where phone = $1",
    [phone],
  );
  return rows[0] ?? null;
}

export async function getUserById(id) {
  const { rows } = await query(
    "SELECT id, name, phone, role FROM users WHERE id=$1",
    [id],
  );
  return rows[0] ?? null;
}

export async function insertUser(name, phone, passwordHash, role) {
  const { rows } = await query(
    "INSERT INTO users (name, phone, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, phone, role",
    [name, phone, passwordHash, role],
  );
  return rows[0];
}
