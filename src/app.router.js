import crypto from "crypto";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import authRouter from "./modules/admin/auth/auth.router.js";
import categoryRouter from "./modules/admin/category/category.router.js";
import productRouter from "./modules/admin/product/product.router.js";
import serviceRouter from "./modules/admin/service/service.router.js";
import projectRouter from "./modules/admin/project/project.router.js";
import clientRouter from "./modules/admin/client/client.router.js";
import companyRouter from "./modules/admin/company info/company.router.js";
import homePageRouter from "./modules/admin/home page/homepage.router.js";
import contactUsAdminRouter from "./modules/admin/contact us/contact.router.js"
import statisticRouter from "./modules/admin/Dashboard Statistics/statistics.router.js"
import contactUsPublicRouter from "./modules/public/contactUs/contactUs.router.js"
import cors from "cors";
import { corsOptions } from "./utils/corsOptions.js";
export const appRouter = (app, express) => {
// Essential for rate-limiting to block individual users instead of the entire proxy server
  app.set("trust proxy", 1);
  // Middleware to parse JSON requests
  app.use(express.json());
  //cors middleware
  app.use(cors(corsOptions));
  // Middleware to generate a unique traceId for each request
  app.use((req, res, next) => {
    req.traceId = crypto.randomUUID();
    next();
  });
  // Middleware to parse cookies
  app.use(cookieParser());

  // admin routers 

  // user routes
  app.use("/api/v1/auth", authRouter);
  // category router
  app.use("/api/v1/admin/categories", categoryRouter);
  // product router
  app.use("/api/v1/admin/products", productRouter);
  // service router
  app.use("/api/v1/admin/services", serviceRouter);
  // project router
  app.use("/api/v1/admin/projects", projectRouter);
  // client router
  app.use("/api/v1/admin/clients", clientRouter);
  // company info router
  app.use("/api/v1/admin/company-info", companyRouter);
  // homePage router
  app.use("/api/v1/admin/homepage", homePageRouter);
// contact us
app.use("/api/v1/admin/contact-messages",contactUsAdminRouter);
//Dashboard Statistics
app.use("/api/v1/admin/dashboard", statisticRouter)


  // public routers

  // contact us public router
app.use("/api/v1/contact" , contactUsPublicRouter);

  //not found route handler
  app.use(notFoundHandler);
  // Global error handling middleware
  app.use(globalErrorHandler);
};
