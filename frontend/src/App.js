import React, { useState } from 'react';
import FileForm from './components/FileForm';

function App() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState({ message: '', emails: [] });
  const [loading, setLoading] = useState(false);

  return (
    <div className="container">
      <h1 className="title">Send Emails</h1>
      <FileForm
        setSuccess={setSuccess}
        setError={setError}
        setLoading={setLoading}
      />
      {loading && <div className="donut" aria-label="loading..."></div>}
      {success && <div className="message">Emails sent successfully</div>}
      {error.message && (
        <div className="message">
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
