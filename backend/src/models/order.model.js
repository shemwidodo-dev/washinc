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
