import GiftAmountRepo from "@repos/GiftAmountRepo";
import Service from "./Service";
class GiftAmountService extends Service{
    constructor() {
        super(GiftAmountRepo)
    }
}

export default new GiftAmountService();