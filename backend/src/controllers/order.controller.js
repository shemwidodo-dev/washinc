import * as orderService from "../services/order.services.js";
import { ORDER_STATUSES } from "../constants/orderStatus.js";

function validateCreateOrder(body) {
  const { pickupAddress, pickupNotes, items } = body;

  if (
    typeof pickupAddress !== "string" ||
    pickupAddress.trim() === "" ||
    pickupAddress.length > 300
  ) {
    return "Pickup address is required (max 300 characters)";
  }

  if (pickupNotes != null) {
    if (
      typeof pickupNotes !== "string" ||
      pickupNotes.trim() === "" ||
      pickupNotes.length > 300
    ) {
      return "pickupNotes must be a non-empty string up to 300 characters";
    }
  }

  if (!Array.isArray(items)) {
    return "Items is not Array";
  }

  if (items.length > 20 || items.length === 0) {
    return "Items is missing";
  }
  for (const item of items) {
    if (typeof item !== "object" || item === null) {
      return "Item is not object";
    }
    if (!Number.isInteger(item.serviceId) || item.serviceId <= 0) {
      return "Service ID is missing";
    }
    if (
      typeof item.itemDesc !== "string" ||
      item.itemDesc.trim() === "" ||
      item.itemDesc.length > 100
    ) {
      return "Item desc is required (max 100 characters)";
    }
    if (item.addonId != null) {
      if (!Number.isInteger(item.addonId) || item.addonId <= 0) {
        return "Addon ID must be a positive integer";
      }
    }
  }
  return null;
}

export async function createOrder(req, res, next) {
  try {
    const body = req.body ?? {};
    const userId = req.user.id;
    const { pickupAddress, pickupNotes, items } = body;

    const error = validateCreateOrder(body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const result = await orderService.createOrder(
      userId,
      pickupAddress.trim(),
      pickupNotes?.trim() ?? null,
      items,
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getTracking(req, res, next) {
  try {
    const trackingCode = req.params.trackingCode.trim().toUpperCase();
    const regex = /^WSH-\d{8}-[A-Z0-9]{6}$/;
    if (!regex.test(trackingCode))
      return res.status(400).json({ message: "Invalid tracking code format" });

    const result = await orderService.getTracking(trackingCode);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const body = req.body ?? {};
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0)
      return res.status(400).json({ message: "Invalid type of ID" });

    const { newStatus, note } = body;

    if (!ORDER_STATUSES.includes(newStatus)) {
      return res.status(400).json({
        message: `newStatus must be one of: ${ORDER_STATUSES.join(", ")}`,
      });
    }

    if (note != null && (typeof note !== "string" || note.length > 300)) {
      return res.status(400).json({
        message: "note must be a string up to 300 characters",
      });
    }

    const changedBy = req.user.id;

    const result = await orderService.updateOrderStatus(
      orderId,
      newStatus,
      note,
      changedBy,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
