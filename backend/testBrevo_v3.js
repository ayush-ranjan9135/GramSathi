import { BrevoClient, Brevo } from '@getbrevo/brevo';

async function test() {
    try {
        console.log('Brevo.transactionalEmails:', typeof Brevo.transactionalEmails);
        if (typeof Brevo.transactionalEmails === 'function') {
           // Maybe it's a factory?
        }
        
        // Let's check the Client
        const client = new BrevoClient({
            apiKey: 'YOUR_API_KEY' // placeholder
        });
        
        console.log('Client keys:', Object.keys(client));
        if (client.transactionalEmails) {
            console.log('Client.transactionalEmails keys:', Object.keys(client.transactionalEmails));
        }

    } catch (e) {
        console.error('Test error:', e.message);
    }
}

test();
