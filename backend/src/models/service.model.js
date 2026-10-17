import { query } from "../db/index.js";

const toService = (r) => ({
  id: r.id,
  name: r.name,
  description: r.description,
  price: Number(r.price),
});

export async function getAllActiveServices() {
  const { rows } = await query(
    "SELECT id, name, description, price FROM services WHERE is_active = true ORDER BY id",
  );
  return rows.map(toService);
}

export async function getActiveServicesByIds(ids) {
  const { rows } = await query(
    "SELECT id, name, description, price FROM services WHERE id = ANY($1) AND is_active = true",
    [ids],
  );
  return rows.map(toService);
}

export async function getServiceById(id) {
  const { rows } = await query(
    "SELECT id, name, description, price, is_active FROM services WHERE id = $1",
    [id],
  );
  return rows.map(toService)[0];
}
