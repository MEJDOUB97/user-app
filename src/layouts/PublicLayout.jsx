import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/Button';

function PublicLayout({ hssabna }) {
  return (
    <div className="public-layout">
      <header className="public-header">
        <div className="page-shell public-header-inner">
          <Logo />
          <nav className="public-nav">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#footer">Contact</a>
          </nav>
          <div className="public-header-actions">
            <Link to="/welcome">
              <Button variant="ghost" size="sm">
                View demo
              </Button>
            </Link>
            <Link to={hssabna.currentUser ? '/app' : '/welcome'}>
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main>
        <Outlet context={hssabna} />
      </main>
    </div>
  );
}

export default PublicLayout;
