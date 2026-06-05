import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

function WelcomePage() {
  const navigate = useNavigate();
  const { currentUser, saveCurrentUser } = useOutletContext();
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    emailOrPhone: currentUser?.emailOrPhone || '',
  });

  function handleSubmit(event) {
    event.preventDefault();
    const saved = saveCurrentUser(form);
    if (saved) {
      navigate('/app');
    }
  }

  return (
    <section className="welcome-page">
      <div className="page-shell">
        <Card className="welcome-card">
          <div>
            <span className="chip">Demo welcome</span>
            <h1>Enter Hssabna</h1>
            <p>Use your name and phone or email to personalize the demo. Your data stays in localStorage.</p>
          </div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                value={form.name}
                onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
                placeholder="Amira"
                required
              />
            </label>
            <label>
              Phone or email
              <input
                value={form.emailOrPhone}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, emailOrPhone: event.target.value }))
                }
                placeholder="+212 6 00 00 00 00"
                required
              />
            </label>
            <Button type="submit" fullWidth>
              Enter Hssabna
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}

export default WelcomePage;
