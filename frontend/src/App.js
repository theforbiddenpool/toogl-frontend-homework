import React, { useState } from 'react';

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

function App() {
  const [files, setFiles] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState({ message: '', emails: [] });
  const [loading, setLoading] = useState(false);

  const handleFiles = async (e) => {
    setError('');

    const inputFiles = Array.from(e.currentTarget.files);
    const fileContents = await Promise.all(
      Object.values(inputFiles).map(readFileContents)
    );

    const anana = inputFiles.map((file, i) => ({
      name: file.name,
      emails: fileContents[i],
    }));

    setFiles(anana);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ message: '', emails: [] });
    setSuccess(false);
    setLoading(false);

    const emails = { emails: files.map((file) => file.emails).flat() };
    setLoading(true);
    try {
      const res = await fetch(
        'https://toggl-hire-frontend-homework.vercel.app/api/send',
        {
          method: 'POST',
          body: JSON.stringify(emails),
          headers: { 'content-type': 'application/json' },
        }
      );

      if (res.ok) {
        setSuccess(true);
        e.target.reset();
        setFiles([]);
        return;
      }

      const errorData = await res.json();
      setError(formatError(errorData));
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="form-files">Files to Upload:</label>
        <input
          type="file"
          name="files"
          id="form-files"
          accept=".txt"
          multiple
          onChange={handleFiles}
          required
        />
        <button type="submit" disabled={files.length === 0}>
          Send emails
        </button>
      </form>
      <ul>
        {files.map((file) => (
          <li key={file.name}>
            {file.name} - {file.emails.length} emails
          </li>
        ))}
      </ul>
      {loading && <div>Loading...</div>}
      {success && <div>Emails sent successfully</div>}
      {error.message && (
        <div>
          There was an error: {error.message}
          <ul>
            {error.emails.map((email) => (
              <li key={email}>{email}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
