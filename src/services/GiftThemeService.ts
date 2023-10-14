import GiftThemeRepo from "@repos/GiftThemeRepo";
import Service from "./Service";
class GiftThemeService extends Service{
    constructor() {
        super(GiftThemeRepo)
    }
}

export default new GiftThemeService();