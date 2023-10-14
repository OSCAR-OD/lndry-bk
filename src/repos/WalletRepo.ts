import Repo from './Repo';
import Wallet from "@models/Wallet";
class WalletRepo extends Repo {
    constructor() {
        super(Wallet);
    }
}
export default new WalletRepo();