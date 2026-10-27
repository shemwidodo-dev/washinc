import { withTransaction, query } from "../db/index.js";

function generateTrackingCode(created_at) {
  const orderDate = new Date(created_at);
  const year = orderDate.getFullYear();
  const month = String(orderDate.getMonth() + 1).padStart(2, "0");
  const date = String(orderDate.getDate()).padStart(2, "0");
  const datePart = `${year}${month}${date}`;

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `WSH-${datePart}-${randomPart}`;
}

export async function createOrder(
  user_id,
  pickup_address,
  pickup_notes,
  orderItems,
) {
  const hasil = await withTransaction(async (client) => {
    let calculatedTotalPrice = 0;
    const validatedItems = [];

    for (const item of orderItems) {
      const serviceResult = await client.query(
        "SELECT price FROM services WHERE id = $1 AND is_active = true",
        [item.service_id],
      );

      if (serviceResult.rows.length === 0) {
        throw new Error(`Service with ID ${item.service_id} is not found`);
      }

      const servicePrice = Number(serviceResult.rows[0].price);
      let addonPrice = 0;
      let addonServiceId = item.addon_service_id || null;

      if (addonServiceId) {
        const addonResult = await client.query(
          "SELECT price FROM services WHERE id = $1 AND is_active = true",
          [item.addon_service_id],
        );
        if (addonResult.rows.length === 0) {
          throw new Error(
            `Add-on service with ID ${item.service_id} is not found`,
          );
        }
        addonPrice = Number(addonResult.rows[0].price);
      }

      calculatedTotalPrice += servicePrice + addonPrice;

      validatedItems.push({
        service_id: item.service_id,
        item_desc: item.item_desc,
        price: servicePrice,
        addon_service_id: addonServiceId,
        addon_price: addonPrice > 0 ? addonPrice : null,
      });
    }

    //INSERT TABLE ORDERS
    const orderResult = await client.query(
      "INSERT INTO orders (user_id, pickup_address, pickup_notes, total_price) VALUES ($1, $2, $3, $4) RETURNING id, status, created_at",
      [user_id, pickup_address, pickup_notes, calculatedTotalPrice],
    );

    //UPDATE TABLE ORDERS FOR tracking_code
    const newOrderId = orderResult.rows[0].id;
    const newOrderCreatedAt = orderResult.rows[0].created_at;
    const tracking_code = generateTrackingCode(newOrderCreatedAt);
    await client.query("UPDATE orders SET tracking_code = $1 WHERE id = $2", [
      tracking_code,
      newOrderId,
    ]);

    //INSERT TABLE ORDER_ITEMS
    for (const item of validatedItems) {
      await client.query(
        "INSERT INTO order_items (order_id, service_id, item_desc, price, addon_service_id,addon_price) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          newOrderId,
          item.service_id,
          item.item_desc,
          item.price,
          item.addon_service_id,
          item.addon_price,
        ],
      );
    }
    await client.query(
      "INSERT INTO order_status_history (order_id, status, note, changed_by) VALUES ($1, $2, $3, $4)",
      [newOrderId, "pending", "Order has been placed", user_id],
    );

    return {
      success: true,
      order_id: newOrderId,
      tracking_code: tracking_code,
      total_price: calculatedTotalPrice,
      message: "Order has been placed!",
    };
  });
  return hasil;
}

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
