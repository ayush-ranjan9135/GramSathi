try {
  const SibApiV3Sdk = await import('@getbrevo/brevo');
  const Brevo = SibApiV3Sdk.default;
  console.log('Main object keys:', Object.keys(Brevo));
  console.log('TransactionalEmailsApi type:', typeof Brevo.TransactionalEmailsApi);
  
  if (Brevo.TransactionalEmailsApi) {
    try {
      const instance = new Brevo.TransactionalEmailsApi();
      console.log('Successfully instantiated TransactionalEmailsApi');
    } catch (e) {
      console.log('Failed to instantiate TransactionalEmailsApi:', e.message);
    }
  }

  // Check for SendSmtpEmail
  console.log('SendSmtpEmail type:', typeof Brevo.SendSmtpEmail);
} catch (error) {
  console.error('Error loading Brevo:', error.message);
}
