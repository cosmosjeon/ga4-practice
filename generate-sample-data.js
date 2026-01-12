const https = require('https');

const MIXPANEL_TOKEN = '25ae0cf24ebef4cca92200d7ecb3dadb';

// 샘플 사용자 데이터
const users = [];
for (let i = 1; i <= 100; i++) {
    users.push({
        id: `user_${i}`,
        name: `사용자${i}`,
        email: `user${i}@example.com`,
        company: i % 3 === 0 ? `회사${i}` : null
    });
}

const trafficSources = ['google', 'facebook', 'instagram', 'direct', 'naver', 'kakao', 'twitter', 'linkedin'];
const signupMethods = ['email', 'google', 'kakao'];
const plans = ['free', 'pro', 'enterprise'];
const shareChannels = ['kakao', 'twitter', 'copy_link'];
const features = ['menu_dashboard', 'menu_projects', 'menu_tasks', 'menu_team', 'menu_analytics', 'create_task', 'create_project', 'project_view'];

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomDaysAgo(maxDays) {
    const now = Date.now();
    const daysAgo = Math.floor(Math.random() * maxDays);
    return now - (daysAgo * 24 * 60 * 60 * 1000) + Math.floor(Math.random() * 86400000);
}

// Mixpanel Track API
function trackEvent(event, properties, callback) {
    const data = {
        event: event,
        properties: {
            token: MIXPANEL_TOKEN,
            ...properties
        }
    };

    const base64Data = Buffer.from(JSON.stringify(data)).toString('base64');

    const options = {
        hostname: 'api.mixpanel.com',
        path: `/track?data=${base64Data}`,
        method: 'GET'
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => callback(null, body));
    });

    req.on('error', callback);
    req.end();
}

// 배치 트래킹
function trackBatch(events, callback) {
    const data = events.map(e => ({
        event: e.event,
        properties: {
            token: MIXPANEL_TOKEN,
            ...e.properties
        }
    }));

    const postData = JSON.stringify(data);

    const options = {
        hostname: 'api.mixpanel.com',
        path: '/track',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => callback(null, body));
    });

    req.on('error', callback);
    req.write(postData);
    req.end();
}

// 이벤트 생성
const allEvents = [];

console.log('🎲 샘플 데이터 생성 중...\n');

users.forEach((user, index) => {
    const source = randomItem(trafficSources);
    const baseTime = randomDaysAgo(14);

    // 1. Acquisition (100%)
    allEvents.push({
        event: 'Acquisition',
        properties: {
            distinct_id: user.id,
            time: Math.floor(baseTime / 1000),
            traffic_source: source,
            funnel_stage: 'acquisition'
        }
    });

    allEvents.push({
        event: 'Page View',
        properties: {
            distinct_id: user.id,
            time: Math.floor(baseTime / 1000),
            page: 'landing',
            utm_source: source
        }
    });

    // 2. Activation - 70%만 진행
    if (Math.random() < 0.7) {
        const activationTime = baseTime + 30000;

        allEvents.push({
            event: 'Activation',
            properties: {
                distinct_id: user.id,
                time: Math.floor(activationTime / 1000),
                activation_type: 'signup_page_view',
                funnel_stage: 'activation'
            }
        });

        // 회원가입 단계
        ['name_focus', 'email_focus', 'password_focus'].forEach((step, i) => {
            if (Math.random() < 0.9) {
                allEvents.push({
                    event: 'Signup Step',
                    properties: {
                        distinct_id: user.id,
                        time: Math.floor((activationTime + (i + 1) * 5000) / 1000),
                        step_name: step,
                        funnel_stage: 'activation'
                    }
                });
            }
        });

        // 회원가입 완료 - 60%
        if (Math.random() < 0.6) {
            const method = randomItem(signupMethods);
            allEvents.push({
                event: 'Sign Up',
                properties: {
                    distinct_id: user.id,
                    time: Math.floor((activationTime + 30000) / 1000),
                    method: method,
                    funnel_stage: 'activation',
                    has_company: user.company ? 'yes' : 'no'
                }
            });

            // 3. Retention - 가입자 중 80%
            if (Math.random() < 0.8) {
                const retentionTime = activationTime + 60000;
                const sessionCount = Math.floor(Math.random() * 5) + 1;

                allEvents.push({
                    event: 'Dashboard Visit',
                    properties: {
                        distinct_id: user.id,
                        time: Math.floor(retentionTime / 1000),
                        session_number: sessionCount,
                        is_returning: sessionCount > 1,
                        funnel_stage: 'retention'
                    }
                });

                // 기능 사용
                const featureCount = Math.floor(Math.random() * 4) + 1;
                for (let f = 0; f < featureCount; f++) {
                    allEvents.push({
                        event: 'Retention',
                        properties: {
                            distinct_id: user.id,
                            time: Math.floor((retentionTime + (f + 1) * 10000) / 1000),
                            feature_used: randomItem(features),
                            funnel_stage: 'retention'
                        }
                    });
                }

                // 4. Revenue - 활성 사용자 중 30%
                if (Math.random() < 0.3) {
                    const revenueTime = retentionTime + 120000;
                    const plan = randomItem(plans);
                    const amount = plan === 'free' ? 0 : plan === 'pro' ? 15000 : 50000;

                    allEvents.push({
                        event: 'Begin Checkout',
                        properties: {
                            distinct_id: user.id,
                            time: Math.floor(revenueTime / 1000),
                            plan: plan,
                            amount: amount,
                            currency: 'KRW',
                            funnel_stage: 'revenue'
                        }
                    });

                    // 체크아웃 단계
                    ['card_number_focus', 'expiry_focus', 'cvc_focus', 'cardholder_focus'].forEach((step, i) => {
                        if (Math.random() < 0.85) {
                            allEvents.push({
                                event: 'Checkout Step',
                                properties: {
                                    distinct_id: user.id,
                                    time: Math.floor((revenueTime + (i + 1) * 3000) / 1000),
                                    step_name: step,
                                    funnel_stage: 'revenue'
                                }
                            });
                        }
                    });

                    // 결제 완료 - 70%
                    if (Math.random() < 0.7 && amount > 0) {
                        allEvents.push({
                            event: 'Revenue',
                            properties: {
                                distinct_id: user.id,
                                time: Math.floor((revenueTime + 20000) / 1000),
                                plan: plan,
                                amount: amount,
                                currency: 'KRW',
                                transaction_id: `TXN_${Date.now()}_${user.id}`,
                                funnel_stage: 'revenue'
                            }
                        });
                    }
                }

                // 5. Referral - 활성 사용자 중 20%
                if (Math.random() < 0.2) {
                    allEvents.push({
                        event: 'Referral',
                        properties: {
                            distinct_id: user.id,
                            time: Math.floor((retentionTime + 180000) / 1000),
                            share_method: randomItem(shareChannels),
                            funnel_stage: 'referral'
                        }
                    });
                }
            }
        }
    }

    if ((index + 1) % 20 === 0) {
        console.log(`✅ ${index + 1}명 사용자 데이터 생성 완료`);
    }
});

console.log(`\n📊 총 ${allEvents.length}개 이벤트 생성됨`);
console.log('🚀 Mixpanel로 전송 중...\n');

// 배치로 전송 (50개씩)
const batchSize = 50;
let sent = 0;
let success = 0;

function sendBatch(startIndex) {
    const batch = allEvents.slice(startIndex, startIndex + batchSize);
    if (batch.length === 0) {
        console.log(`\n✅ 완료! ${success}/${sent} 배치 전송 성공`);
        console.log('📈 Mixpanel 대시보드에서 확인하세요!');
        return;
    }

    trackBatch(batch, (err, result) => {
        sent++;
        if (!err && result === '1') {
            success++;
            process.stdout.write(`📤 배치 ${sent} 전송 완료 (${Math.min(startIndex + batchSize, allEvents.length)}/${allEvents.length} 이벤트)\r`);
        } else {
            console.log(`❌ 배치 ${sent} 실패:`, err || result);
        }

        // 다음 배치 (rate limit 방지를 위해 100ms 대기)
        setTimeout(() => sendBatch(startIndex + batchSize), 100);
    });
}

sendBatch(0);
