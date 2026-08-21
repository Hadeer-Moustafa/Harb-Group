import { catchError } from "../../../utils/catchError.js";
import { Clients } from "../../../../DB/models/admin/client.model.js";
import { sendSuccess } from "../../../utils/successResponse.js";

export const getAllClients = catchError(async (req, res, next) => {
  const { status } = req.query; // 'active' | 'inactive'

  const filter = {
    isActive: status === "inactive" ? false : true,
  };
  const clients = await Clients.find(filter)
    .select("_id logo name isActive")
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean();

  const clientsData = clients.map((client) => ({
    _id: client._id,
    name:client.name,
    logo: client.logo?.url,
    isActive:client.isActive
  }));

  return sendSuccess(res, 200, "Clients retrieved successfully", {
    clients: clientsData,
  });
});

