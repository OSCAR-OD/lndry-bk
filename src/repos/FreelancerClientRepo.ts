import Repo from './Repo';
import FreelancerClient from "@models/FreelancerClient";
class FreelancerClientRepo extends Repo {
    constructor() {
        super(FreelancerClient);
    }
}
export default new FreelancerClientRepo();