function readFileContents(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onloadend = () => {
      resolve(fr.result.split('\n').filter((email) => email));
    };
    fr.readAsText(file);
  });
}

function formatError(errorData) {
  let message;
  switch (errorData.error) {
    case 'send_failure':
      message = 'Failed to send emails to some addresses';
      break;
    case 'invalid_email_address':
      message = 'Some addresses were not valid';
      break;
    default:
      message = 'It was not possible to complete your request';
  }

  return { message, emails: errorData.emails || [] };
}

export { readFileContents, formatError };
