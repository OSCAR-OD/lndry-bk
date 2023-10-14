import FreelancerClientRepo from "@repos/FreelancerClientRepo";
import Service from "./Service";
class FreelancerClientService extends Service{
    constructor() {
        super(FreelancerClientRepo)
    }
}

export default new FreelancerClientService();