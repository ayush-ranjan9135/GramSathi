import { BrevoClient } from '@getbrevo/brevo';

async function test() {
    const client = new BrevoClient({ apiKey: 'YOUR_API_KEY' });
    
    function getAllMethodNames(obj) {
        let methods = new Set();
        while (obj = Object.getPrototypeOf(obj)) {
            let keys = Object.getOwnPropertyNames(obj);
            keys.forEach(k => {
                if (typeof obj[k] === 'function') methods.add(k);
            });
        }
        return Array.from(methods);
    }

    console.log('TransactionalEmails methods:', getAllMethodNames(client.transactionalEmails));
}

test();
