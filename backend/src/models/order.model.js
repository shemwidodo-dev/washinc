import { query } from "../db/index.js";

export async function insertOrder(
  client,
  userId,
  pickupAddress,
  pickupNotes,
  totalPrice,
  trackingSuffix,
) {
  const { rows } = await client.query(
    "INSERT INTO orders (user_id, pickup_address, pickup_notes, total_price, tracking_code) VALUES ($1, $2, $3, $4, 'WSH-'|| to_char(now() AT TIME ZONE 'Asia/Jakarta', 'YYYYMMDD') || '-' || $5) RETURNING id, tracking_code, status, total_price, created_at",
    [userId, pickupAddress, pickupNotes, totalPrice, trackingSuffix],
  );
  return rows[0];
}

export async function insertItem(
  client,
  orderId,
  serviceId,
  itemDesc,
  price,
  addonServiceId,
  addonPrice,
) {
  await client.query(
    "INSERT INTO order_items (order_id, service_id, item_desc, price, addon_service_id, addon_price) VALUES ($1, $2, $3, $4, $5, $6)",
    [orderId, serviceId, itemDesc, price, addonServiceId, addonPrice],
  );
}

export async function insertHistory(client, orderId, status, note, changedBy) {
  await client.query(
    "INSERT INTO order_status_history (order_id, status, note, changed_by) VALUES ($1, $2, $3, $4)",
    [orderId, status, note, changedBy],
  );
}

export async function findByTrackingCode(trackingCode) {
  const { rows } = await query(
    "SELECT id, tracking_code, status, total_price, created_at FROM orders WHERE tracking_code = $1",
    [trackingCode],
  );

  if (!rows[0]) return null;

  return rows.map((r) => ({
    id: Number(r.id),
    trackingCode: r.tracking_code,
    status: r.status,
    totalPrice: Number(r.total_price),
    createdAt: r.created_at,
  }))[0];
}

export async function findItemsByOrderId(orderId) {
  const { rows } = await query(
    "SELECT s1.name as service, oi.item_desc, oi.price, s2.name as addon_service, oi.addon_price FROM order_items oi JOIN services s1 ON s1.id = oi.service_id LEFT JOIN services s2 ON s2.id = oi.addon_service_id WHERE oi.order_id = $1 ORDER BY oi.id",
    [orderId],
  );

  return rows.map((r) => ({
    service: r.service,
    itemDesc: r.item_desc,
    price: Number(r.price),
    addonService: r.addon_service,
    addonPrice: r.addon_price === null ? null : Number(r.addon_price),
  }));
}

export async function findHistoryByOrderId(orderId) {
  const { rows } = await query(
    "SELECT id, status, note, changed_at FROM order_status_history WHERE order_id = $1 ORDER BY changed_at ASC, id ASC",
    [orderId],
  );

  return rows.map((r) => ({
    id: Number(r.id),
    status: r.status,
    note: r.note,
    changedAt: r.changed_at,
  }));
}

export async function findByIdForUpdate(client, orderId) {
  const { rows } = await client.query(
    "SELECT id, status FROM orders WHERE id=$1 FOR UPDATE",
    [orderId],
  );

  const r = rows[0];
  if (!r) return null;

  return { id: Number(r.id), status: r.status };
}

export async function updateStatus(client, orderId, status) {
  await client.query("UPDATE orders SET status = $1 WHERE id = $2", [
    status,
    orderId,
  ]);
}
