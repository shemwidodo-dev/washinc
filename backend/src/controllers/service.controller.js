import * as serviceModel from "../models/service.model.js";

export async function getAllServices(req, res, next) {
  try {
    const services = await serviceModel.getAllActiveServices();
    res.json(services);
  } catch (error) {
    next(error);
  }
}
