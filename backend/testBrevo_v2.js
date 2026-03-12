import Brevo from '@getbrevo/brevo';

async function test() {
    console.log('Brevo object keys:', Object.keys(Brevo));

    // Try to find TransactionalEmailsApi or equivalent
    if (Brevo.TransactionalEmailsApi) {
        console.log('Found Brevo.TransactionalEmailsApi');
    } else {
        // Search in sub-keys if it's nested
        for (const key of Object.keys(Brevo)) {
            try {
                if (Brevo[key] && typeof Brevo[key] === 'object') {
                    console.log(`Checking sub-keys of Brevo.${key}:`, Object.keys(Brevo[key]));
                }
            } catch (e) {}
        }
    }

    // Try the "SibApiV3Sdk" style if it was just exported differently
    const SibApiV3Sdk = Brevo;
    console.log('SibApiV3Sdk keys:', Object.keys(SibApiV3Sdk));

    // Many modern SDKs use a Client pattern
    if (Brevo.BrevoClient) {
        try {
            console.log('Attempting BrevoClient initialization...');
            // In modern SDKs, Client might be the entry point
        } catch (e) {
            console.log('BrevoClient init failed (expected):', e.message);
        }
    }
}

test().catch(console.error);
