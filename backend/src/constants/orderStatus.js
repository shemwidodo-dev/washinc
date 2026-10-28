export const ORDER_STATUSES = [
  "pending",
  "picked_up",
  "washing",
  "drying",
  "ready",
  "delivered",
  "cancelled",
];

export const TRANSITIONS = {
  pending: ["picked_up", "cancelled"],
  picked_up: ["washing"],
  washing: ["drying"],
  drying: ["ready"],
  ready: ["delivered"],
};
