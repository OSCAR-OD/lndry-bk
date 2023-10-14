import ReferralRepo from "@repos/ReferralRepo";
import Service from "./Service";
class ReferralService extends Service{
    constructor() {
        super(ReferralRepo)
    }
}

export default new ReferralService();