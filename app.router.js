import crypto from "crypto";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./src/middleware/globalErrorHandler.js";
import { notFoundHandler } from "./src/middleware/notFoundHandler.js";
import authRouter from "./src/modules/admin/auth/auth.router.js";
import categoryRouter from "./src/modules/admin/category/category.router.js"
import productRouter from "./src/modules/admin/product/product.router.js"
import cors from "cors";
import {corsOptions} from "./src/utils/corsOptions.js";
export const appRouter = (app, express) => {
    // Middleware to parse JSON requests
 app.use(express.json());
 //cors middleware
 app.use(cors(corsOptions));
 // Middleware to generate a unique traceId for each request
 app.use((req, res, next) => {
   req.traceId = crypto.randomUUID();
   next();
 })
// Middleware to parse cookies
app.use(cookieParser());
 // user routes
app.use("/api/v1/auth", authRouter);
// category router
app.use("/api/v1/admin/categories",categoryRouter);
// product router
app.use("/api/v1/admin/products",productRouter);
  //not found route handler
 app.use(notFoundHandler);
 // Global error handling middleware
 app.use(globalErrorHandler);

};
