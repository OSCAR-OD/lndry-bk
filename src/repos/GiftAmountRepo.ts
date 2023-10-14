import Repo from './Repo';
import GiftAmount from "@models/GiftAmount";
class GiftAmountRepo extends Repo {
    constructor() {
        super(GiftAmount);
    }
}
export default new GiftAmountRepo();