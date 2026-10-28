import { randomInt } from "node:crypto";
import { withTransaction } from "../db/index.js";
import { HttpError } from "../utils/HttpError.js";
import * as serviceModel from "../models/service.model.js";
import * as orderModel from "../models/order.model.js";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const makeTrackingSuffix = () =>
  Array.from({ length: 6 }, () => CHARS[randomInt(CHARS.length)]).join("");

export async function createOrder(userId, pickupAddress, pickupNotes, items) {
  const ids = new Set();
  for (const item of items) {
    ids.add(item.serviceId);
    if (item.addonId) ids.add(item.addonId);
  }

  const services = await serviceModel.getActiveServicesByIds([...ids]);
  const byId = new Map(services.map((s) => [s.id, s]));
  let totalPrice = 0;
  const validatedItems = [];

  for (const item of items) {
    const service = byId.get(item.serviceId);
    if (!service) {
      throw new HttpError(400, `Service with ID:${item.serviceId} not found`);
    }

    if (service.category !== "shoes" && service.category !== "bag") {
      throw new HttpError(
        400,
        `Service with ID:${item.serviceId} category is wrong`,
      );
    }

    let addon = null;
    if (item.addonId) {
      addon = byId.get(item.addonId);
      if (!addon) {
        throw new HttpError(400, `Addon with ID:${item.addonId} not found`);
      }

      if (addon.category !== "addon") {
        throw new HttpError(
          400,
          `Addon with ID:${item.addonId} category is wrong`,
        );
      }
    }

    validatedItems.push({
      serviceId: item.serviceId,
      itemDesc: item.itemDesc.trim(),
      price: service.price,
      addonServiceId: addon ? addon.id : null,
      addonPrice: addon ? addon.price : null,
    });

    totalPrice += service.price + (addon?.price ?? 0);
  }

  return withTransaction(async (client) => {
    const order = await orderModel.insertOrder(
      client,
      userId,
      pickupAddress,
      pickupNotes || null,
      totalPrice,
      makeTrackingSuffix(),
    );

    for (const valItem of validatedItems) {
      await orderModel.insertItem(
        client,
        order.id,
        valItem.serviceId,
        valItem.itemDesc,
        valItem.price,
        valItem.addonServiceId,
        valItem.addonPrice,
      );
    }

    await orderModel.insertHistory(
      client,
      order.id,
      "pending",
      "Order has been placed",
      userId,
    );

    return {
      id: order.id,
      trackingCode: order.tracking_code,
      status: order.status,
      totalPrice: Number(order.total_price),
      createdAt: order.created_at,
    };
  });
}

export async function getTracking(trackingCode) {
  const order = await orderModel.findByTrackingCode(trackingCode);

  if (!order) throw new HttpError(404, "Tracking code not found");

  const [items, history] = await Promise.all([
    orderModel.findItemsByOrderId(order.id),
    orderModel.findHistoryByOrderId(order.id),
  ]);

  return {
    trackingCode: order.trackingCode,
    status: order.status,
    createdAt: order.createdAt,
    totalPrice: order.totalPrice,
    items: items,
    history: history.map((h) => ({
      status: h.status,
      note: h.note,
      changedAt: h.changedAt,
    })),
  };
}
