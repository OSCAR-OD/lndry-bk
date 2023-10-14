import Repo from './Repo';
import GiftCard from "@models/GiftCard";
class GiftCardRepo extends Repo {
    constructor() {
        super(GiftCard);
    }
}
export default new GiftCardRepo();