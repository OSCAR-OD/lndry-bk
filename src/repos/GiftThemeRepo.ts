import Repo from './Repo';
import GiftTheme from "@models/GiftTheme";
class GiftThemeRepo extends Repo {
    constructor() {
        super(GiftTheme);
    }
}
export default new GiftThemeRepo();