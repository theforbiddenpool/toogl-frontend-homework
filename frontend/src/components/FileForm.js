import React, { useState } from 'react';
import { readFileContents, formatError } from '../helpers';

const emptyError = { message: '', emails: [] };

const FileForm = ({ setError, setSuccess, setLoading }) => {
  const [files, setFiles] = useState([]);

  const handleFiles = async (e) => {
    setError(emptyError);
    setSuccess(false);

    const inputFiles = Array.from(e.currentTarget.files);
    const fileContents = await Promise.all(
      Object.values(inputFiles).map(readFileContents)
    );

    const filesArray = inputFiles.map((file, i) => ({
      name: file.name,
      emails: fileContents[i],
    }));

    setFiles(filesArray);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(emptyError);
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
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <div className="form-row">
            <label htmlFor="fm-files" className="form-label">
              Files to Upload:
            </label>
            <input
              type="file"
              name="files"
              id="fm-files"
              className="form-control"
              accept=".txt"
              multiple
              onChange={handleFiles}
              required
            />
          </div>
        </div>
        <button
          className="form-submit"
          type="submit"
          disabled={files.length === 0}
        >
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
    </div>
  );
};

export default FileForm;
