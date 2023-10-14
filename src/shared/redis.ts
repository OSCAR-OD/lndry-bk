import {createClient} from 'redis';
import envVars from "@shared/env-vars";

let redisClient:any;

(async () => {
    redisClient = createClient({
        url: envVars.redis
    });
    redisClient.on('error', (error:any) => console.error(`Error : ${error}`));
    await redisClient.connect();
})();

export default redisClient;