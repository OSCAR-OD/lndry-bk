import {Router} from 'express';
import {auth, authAdmin} from "@util/auth";
import adminApi, {p as adminPaths} from "@routes/admin-api";
import authRouter, {p as authPaths} from "@routes/auth-router";
import customerApi, {p as customerPath} from "@routes/customer-api";
import paymentApi, {p as paymentPath} from "@routes/payment-routes";
import freelancerClientRouter, {p as freelancerClientPath} from "@routes/freelancer/freelancer-router";

// Init
const apiRouter = Router();
apiRouter.get('/',(req, res)=>{
  return res.status(200).send({msg: "Ouch Charly!!! Why would you do that?"})
})
// Add api routes
apiRouter.use(authPaths.basePath, authRouter);
apiRouter.use(adminPaths.basePath, auth, authAdmin, adminApi);
apiRouter.use(customerPath.basePath, customerApi);
apiRouter.use(paymentPath.basePath, paymentApi);
apiRouter.use(freelancerClientPath.basePath, auth, freelancerClientRouter);

// **** Export default **** //

export default apiRouter;
