import { Router, type IRouter } from "express";
import healthRouter from "./health";
import tasteRouter from "./taste";

const router: IRouter = Router();

router.use(healthRouter);
router.use(tasteRouter);

export default router;
