import adminRouter, { p as adminPath } from "@routes/admin/admin-router";
import bannerRouter, { p as bannerPath } from "@routes/admin/banner-router";
import blogRouter, { p as blogPath } from "@routes/admin/blog-router";
import contactRouter, { p as contactPath } from "@routes/admin/contact-router";
import couponRouter, { p as couponPath } from "@routes/admin/coupon-router";
import customerRouter, {
  p as customerPath,
} from "@routes/admin/customer-router";
import driverOrderRouter, {
  p as driverOrderPath,
} from "@routes/admin/driver-order-router";
import faqRouter, { p as faqPath } from "@routes/admin/faq-router";
import giftCardRouter, {
  p as giftCardPath,
} from "@routes/admin/gift-card-router";
import giftPriceRouter, {
  p as giftPricePath,
} from "@routes/admin/gift-price-router";
import giftThemeRouter, {
  p as giftThemePath,
} from "@routes/admin/gift-theme-router";
import itemRouter, { p as itemPath } from "@routes/admin/item-router";
import orderRouter, { p as orderPath } from "@routes/admin/order-router";
import reviewRouter, { p as reviewPath } from "@routes/admin/review-router";
import rolePermissionRouter, {
  p as rolePermissionPath,
} from "@routes/admin/role-permission-router";
import serviceAreaRouter, {
  p as serviceAreaPath,
} from "@routes/admin/service-area-router";
import serviceContentRouter, {
  p as serviceContentPath,
} from "@routes/admin/service-content-router";
import serviceRouter, { p as servicePath } from "@routes/admin/service-router";
import settingsRouter, {
  p as settingsPath,
} from "@routes/admin/settings-router";
import subServiceRouter, {
  p as subServicePath,
} from "@routes/admin/sub-service-router";
import userRouter, { p as userPath } from "@routes/admin/user-router";
import videoRouter, { p as videoPath } from "@routes/admin/video-router";
import { Router } from "express";
// Paths
export const p = {
  basePath: "/admin",
} as const;
// Init
const apiRouter = Router();

// Add api routes
apiRouter.use(adminPath.basePath, adminRouter);
apiRouter.use(bannerPath.basePath, bannerRouter);
apiRouter.use(blogPath.basePath, blogRouter);
apiRouter.use(couponPath.basePath, couponRouter);
apiRouter.use(faqPath.basePath, faqRouter);
apiRouter.use(itemPath.basePath, itemRouter);
apiRouter.use(reviewPath.basePath, reviewRouter);
apiRouter.use(servicePath.basePath, serviceRouter);
apiRouter.use(serviceAreaPath.basePath, serviceAreaRouter);
apiRouter.use(serviceContentPath.basePath, serviceContentRouter);
apiRouter.use(subServicePath.basePath, subServiceRouter);
apiRouter.use(videoPath.basePath, videoRouter);
apiRouter.use(userPath.basePath, userRouter);
apiRouter.use(customerPath.basePath, customerRouter);
apiRouter.use(rolePermissionPath.basePath, rolePermissionRouter);
apiRouter.use(settingsPath.basePath, settingsRouter);
apiRouter.use(orderPath.basePath, orderRouter);
apiRouter.use(contactPath.basePath, contactRouter);
apiRouter.use(driverOrderPath.basePath, driverOrderRouter);
apiRouter.use(giftPricePath.basePath, giftPriceRouter);
apiRouter.use(giftThemePath.basePath, giftThemeRouter);
apiRouter.use(giftCardPath.basePath, giftCardRouter);

// **** Export default **** //

export default apiRouter;
