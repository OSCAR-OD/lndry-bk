import GiftCardRepo from "@repos/GiftCardRepo";
import Service from "./Service";
import STRIPE from "@util/stripe";
class GiftCardService extends Service{
    constructor() {
        super(GiftCardRepo)
    }

    public async addAndReturn(data:any): Promise<any>{
        const stripe = await STRIPE((data.userGet - data.bonus), data.fromEmail, data.fromName);
        data.payment = false;
        data.paymentIntent = stripe.client_secret;
        return await GiftCardRepo.addAndReturn(data);
    }
}

export default new GiftCardService();