import WalletRepo from "@repos/WalletRepo";
import Service from "./Service";
class WalletService extends Service{
    constructor() {
        super(WalletRepo)
    }
}

export default new WalletService();