const redis = require('redis');

// Redis 연결
const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
    // legacyMode 옵션은 Redis v2 호환성 모드를 사용합니다.
    // 따라서, Redis v4 사용시에는 필요 없습니다.
    //legacyMode: true, 
});

// Redis 연결 이벤트 핸들러 등록
redisClient.on('connect', () => {
    console.info('Redis connected!');
});

// Redis 오류 이벤트 핸들러 등록
redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

// Redis 연결
redisClient.connect();

// 다른 모듈에서 RedisClient를 사용할 수 있도록 export
module.exports = redisClient;

