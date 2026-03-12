require('dotenv').config();
const cacheService = require('./services/cacheService');

async function testRedis() {
  console.log('🧪 Testing Upstash Redis Connection...\n');

  try {
    // Test 1: Basic Set/Get
    console.log('Test 1: Basic Set/Get');
    await cacheService.set('test:key', { message: 'Hello Redis!' }, 60);
    const data = await cacheService.get('test:key');
    console.log('✅ Set/Get:', data);

    // Test 2: OTP Storage
    console.log('\nTest 2: OTP Storage');
    await cacheService.setOTP('1234567890', '123456', 300);
    const otp = await cacheService.getOTP('1234567890');
    console.log('✅ OTP Stored:', otp);

    // Test 3: Rate Limiting
    console.log('\nTest 3: Rate Limiting');
    for (let i = 1; i <= 6; i++) {
      const allowed = await cacheService.checkRateLimit('test:user', 5, 60);
      console.log(`Attempt ${i}: ${allowed ? '✅ Allowed' : '❌ Rate Limited'}`);
    }

    // Test 4: User Caching
    console.log('\nTest 4: User Caching');
    await cacheService.cacheUser('user123', { name: 'Test User', role: 'admin' }, 3600);
    const user = await cacheService.getCachedUser('user123');
    console.log('✅ User Cached:', user);

    // Test 5: Pattern Clear
    console.log('\nTest 5: Pattern Clear');
    await cacheService.set('gramsathi:stats:test1', { count: 1 }, 60);
    await cacheService.set('gramsathi:stats:test2', { count: 2 }, 60);
    await cacheService.clearPattern('stats');
    console.log('✅ Pattern cleared');

    // Cleanup
    await cacheService.del('test:key');
    await cacheService.deleteOTP('1234567890');
    
    console.log('\n✅ All Redis tests passed! 🎉');
    console.log('\n📊 Redis is working correctly with Upstash');
    
  } catch (error) {
    console.error('\n❌ Redis test failed:', error.message);
    console.log('\n🔧 Check your .env file:');
    console.log('   UPSTASH_REDIS_REST_URL=your_url');
    console.log('   UPSTASH_REDIS_REST_TOKEN=your_token');
  }
}

testRedis();
