import React from 'react';
import { ArrowRight, ChartPie, ShieldCheck, Sparkles, Users2 } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Logo from '../components/Logo';

const features = [
  {
    title: 'Instant Split',
    text: 'Add dinner, travel, rent, coffee, or taxis and see the math handled instantly.',
    icon: Sparkles,
  },
  {
    title: 'Group Friendly',
    text: 'Keep roommates, trips, and friend groups aligned without chasing people for updates.',
    icon: Users2,
  },
  {
    title: 'Gentle Reminders',
    text: 'See what still needs to be settled without turning money into an awkward conversation.',
    icon: ArrowRight,
  },
  {
    title: 'Spending Insights',
    text: 'Follow totals by group and category in a clean dashboard built for real-life usage.',
    icon: ChartPie,
  },
  {
    title: 'Secure Data',
    text: 'Local demo storage today, structured like a real product and ready for a secure backend next.',
    icon: ShieldCheck,
  },
];

function LandingPage() {
  const { currentUser } = useOutletContext();

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="page-shell hero-grid">
          <div className="hero-copy">
            <span className="chip">Available in Morocco - MAD everywhere</span>
            <h1 className="section-heading">Split expenses. Keep it simple.</h1>
            <p className="section-copy">
              Hssabna helps friends, roommates, and travel groups split dinners, coffee runs, rent,
              taxis, and trip costs without the spreadsheet spiral. No spreadsheets. No awkward conversations.
            </p>
            <div className="hero-actions">
              <Link to={currentUser ? '/app' : '/welcome'}>
                <Button>Get started</Button>
              </Link>
              <Link to="/welcome">
                <Button variant="ghost">View demo</Button>
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <strong>4.9</strong>
                <span>friendly product feel</span>
              </div>
              <div>
                <strong>MAD</strong>
                <span>default currency</span>
              </div>
              <div>
                <strong>3 steps</strong>
                <span>create, add, settle</span>
              </div>
            </div>
          </div>

          <Card className="hero-phone-card">
            <div className="phone-topbar">
              <span>9:41</span>
              <span>Good evening</span>
            </div>
            <div className="phone-balance-card">
              <small>Your Group</small>
              <strong>235.00 MAD</strong>
              <p>You are owed</p>
            </div>
            <div className="phone-expenses">
              <div>
                <span>🍴 Dinner</span>
                <strong>120 MAD</strong>
              </div>
              <div>
                <span>🚕 Taxi</span>
                <strong>40 MAD</strong>
              </div>
              <div>
                <span>☕ Coffee</span>
                <strong>75 MAD</strong>
              </div>
            </div>
            <div className="phone-nav-preview">
              <span>Home</span>
              <span>Groups</span>
              <span className="active">Add</span>
              <span>Activity</span>
            </div>
          </Card>
        </div>
      </section>

      <section id="features" className="landing-section">
        <div className="page-shell">
          <span className="chip">Everything you need</span>
          <h2 className="section-heading">Friendly expense tracking with a real app feel.</h2>
          <div className="feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="feature-card">
                  <span className="feature-icon">
                    <Icon size={20} />
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="landing-section">
        <div className="page-shell">
          <span className="chip">How it works</span>
          <h2 className="section-heading">Create a group. Add expenses. Settle up.</h2>
          <div className="steps-grid">
            <Card>
              <strong>01</strong>
              <h3>Create a group</h3>
              <p>Start a trip, apartment, dinner, or office coffee circle in seconds.</p>
            </Card>
            <Card>
              <strong>02</strong>
              <h3>Add expenses</h3>
              <p>Choose who paid, who joined, and whether the split is equal or custom.</p>
            </Card>
            <Card>
              <strong>03</strong>
              <h3>Settle up</h3>
              <p>Use minimized settlement suggestions so the fewest transfers solve the whole group.</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="page-shell">
          <Card className="final-cta">
            <div>
              <span className="chip">Built with care in Morocco.</span>
              <h2>Start splitting the smart way.</h2>
              <p>No spreadsheets. No awkward conversations. Just clear balances in MAD.</p>
            </div>
            <Link to={currentUser ? '/app' : '/welcome'}>
              <Button>Enter Hssabna</Button>
            </Link>
          </Card>
        </div>
      </section>

      <footer id="footer" className="landing-footer">
        <div className="page-shell footer-inner">
          <Logo />
          <p>The simplest way to split expenses with friends. Built with care in Morocco.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
