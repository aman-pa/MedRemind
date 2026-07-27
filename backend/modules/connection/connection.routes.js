import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { sendRequestSchema, acceptRequestSchema, rejectRequestSchema, disconnectSchema} from "./connection.validation.js";

import { sendConnectionRequest, acceptConnectionRequest, rejectConnectionRequest, getPendingRequests, getConnections, disconnectConnection } from "./connection.controller.js";

const router = express.Router();

// Send a connection request
router.post("/request", authenticate, validate(sendRequestSchema), sendConnectionRequest);

// Accept a connection request
router.patch("/:id/accept",authenticate,validate(acceptRequestSchema),acceptConnectionRequest);

// Reject a connection request
router.patch("/:id/reject",authenticate,validate(rejectRequestSchema),rejectConnectionRequest);

// Get all pending requests
router.get("/pending",authenticate,getPendingRequests);

// Get all accepted connections
router.get("/",authenticate,getConnections);

// Disconnect
router.delete("/:id",authenticate,validate(disconnectSchema),disconnectConnection);

export default router;