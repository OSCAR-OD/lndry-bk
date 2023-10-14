import Repo from './Repo';
import Referral from "@models/Referral";
class ReferralRepo extends Repo {
    constructor() {
        super(Referral);
    }
}
export default new ReferralRepo();