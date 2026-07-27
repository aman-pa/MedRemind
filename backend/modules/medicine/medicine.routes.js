import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createMedicineSchema, updateMedicineSchema } from "./medicine.validation.js";
import {
    createMedicine,
    getMedicines,
    getMedicineById,
    updateMedicine,
    deleteMedicine,
} from "./medicine.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", validate(createMedicineSchema), createMedicine);
router.get("/", getMedicines);
router.get("/:id", getMedicineById);
router.patch("/:id", validate(updateMedicineSchema), updateMedicine);
router.delete("/:id", deleteMedicine);

export default router;
