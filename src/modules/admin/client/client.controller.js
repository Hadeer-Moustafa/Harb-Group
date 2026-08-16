import e from "express";
import { Clients } from "../../../../DB/models/admin/client.model.js";
import { catchError } from "../../../utils/catchError.js";
import { sendSuccess } from "../../../utils/successResponse.js";
import { v2 as cloudinary } from "cloudinary";

export const addClient = catchError(async (req, res, next) => {
  const { name} = req.body;
  let displayOrder = req.body.displayOrder;
  const client = await Clients.findOne({
   name,
    isActive: true,
  });
  if (client) {
    return next({
      statusCode: 422,
      message: "client with this name already exists",
      errors: [
        {
          code: "DUPLICATE_NAME",
          message: "client with this name already exists",
          field: "name",
          details:"A client with this name already exists"
        },
      ],
    });
  }
  if (displayOrder && Number(displayOrder) > 0) {
    displayOrder = Number(displayOrder);
    await Clients.updateMany(
      { displayOrder: { $gte: displayOrder } },
      { $inc: { displayOrder: 1 } },
    );
  } else {
    const lastClient = await Clients.findOne().sort({
      displayOrder: -1,
    });
    displayOrder =
      lastClient && lastClient.displayOrder ? lastClient.displayOrder + 1 : 1;
  }
  const newClient = await Clients.create({
    name,
    displayOrder,
  });
  return sendSuccess(res, 201, "Client created successfully", newClient);
});

export const updateClient = catchError(async (req, res, next) => {
  const { clientId } = req.params;
  const client = await Clients.findByIdAndUpdate(
    clientId,
    { $set: req.body },
    { returnDocument: "after", runValidators: true },
  );
  if (!client) {
    return next({
      statusCode: 404,
      message: "client not found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "client not found",
        },
      ],
    });
  }
  return sendSuccess(res, 200, "Client updated successfully", client);
});

export const uploadClientLogo = catchError(async (req, res, next) => {
  const client = req.client;
  if (req.uploadedfiles && req.uploadedfiles.length > 0) {
    if (client.logo?.public_id) {
      await cloudinary.uploader.destroy(client.logo.public_id, {
        resource_type: "image",
        invalidate: true,
      });
    }
    client.logo = {
      url: req.uploadedfiles[0].url,
      public_id: req.uploadedfiles[0].public_id,
    };
  }
  await client.save();
  return sendSuccess(res, 201, "client image uploaded successfully", {
    clientId: client._id,
    logoUrl: client.logo.url,
  });
});

export const deleteClientLogo = catchError(async (req, res, next) => {
  const client = req.client;
  if (!client.logo?.public_id) {
    return next({
      statusCode: 404,
      message: "logo not found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "logo not found",
          details: "Client with this ID does not have logo",
        },
      ],
    });
  }
  const logoPublicId = client.logo.public_id;
  (async () => {
    try {
      await cloudinary.uploader.destroy(logoPublicId, {
        resource_type: "image",
        invalidate: true,
      });
    } catch (err) {
      console.error("Cloudinary logo Delete Error:", err.message);
    }
  })();

  client.logo = undefined;
  await client.save();
  return res.status(204).send();
});

export const deleteClient = catchError(async (req, res, next) => {
  const client = req.client;
  const folderPath = `Clients/${client._id}`;
  (async () => {
    try {
      await cloudinary.api.delete_resources_by_prefix(folderPath);
      await cloudinary.api.delete_folder(folderPath);
      console.log(`Folder ${folderPath} deleted successfully from Cloudinary`);
    } catch (error) {
      console.error("Cloudinary Folder Delete Error:", error.message || error);
    }
  })();

  await Clients.findByIdAndDelete(client._id);
  return res.status(204).send();
});
