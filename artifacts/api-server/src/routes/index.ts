import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import dishesRouter from "./dishes";
import qrRouter from "./qr";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(categoriesRouter);
router.use(dishesRouter);
router.use(qrRouter);
router.use(statsRouter);

export default router;
