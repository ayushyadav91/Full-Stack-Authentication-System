import redis from 'redis';
import dotenv from 'dotenv';
dotenv.config();

if(!process.env.REDIS_HOST){
    console.log('REDIS_HOST is not defined in environment variables');
    process.exit(1);
}

const redisClient = redis.createClient({
    url: process.env.REDIS_HOST,

});

export default redisClient;