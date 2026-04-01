import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('show'), index * 70);
          }
        });
      },
      { threshold: 0.08 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`landing-nav ${scrolled ? 'landing-nav-scrolled' : ''}`}>
      <div className="landing-nav-left">
        <span className="landing-logo font-syne">Planora</span>
      </div>

      <ul className="landing-nav-links">
        {['Features', 'How It Works', 'Pricing'].map((item) => (
          <li key={item}>
            <a href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="landing-nav-link">
              {item}
            </a>
          </li>
        ))}
        <li>
          <Link
            to="/login"
            className="landing-button landing-button-solid"
          >
            Login
          </Link>
        </li>
      </ul>

      <button className="landing-burger" onClick={() => setOpen((prev) => !prev)}>
        ☰
      </button>

      {open && (
        <div className="landing-mobile-menu">
          {['Features', 'How It Works', 'Pricing'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="landing-mobile-link"
              onClick={() => setOpen(false)}
            >
              {item}
            </a>
          ))}
          <Link
            to="/login"
            className="landing-button landing-button-solid landing-mobile-github"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}

function DashboardMock() {
  const navItems = [
    { icon: '📊', label: 'Overview', active: true },
    { icon: '✅', label: 'My Tasks' },
    { icon: '📋', label: 'Projects' },
    { icon: '📅', label: 'Calendar' },
    { icon: '👥', label: 'Team' },
  ];

  const tasks = [
    { done: true, text: 'Design onboarding flow' },
    { done: true, text: 'Review pull request #42' },
    { done: false, text: 'Update API documentation' },
    { done: false, text: 'Weekly standup @ 3PM' },
  ];

  const stats = [
    { label: 'Tasks Today', val: '12', color: '#7c6dfa', w: '67%', g: 'linear-gradient(90deg,#7c6dfa,#f06aff)' },
    { label: 'In Progress', val: '5', color: '#f06aff', w: '42%', g: 'linear-gradient(90deg,#f06aff,#ff8c60)' },
    { label: 'Completed', val: '8', color: '#3de8b0', w: '80%', g: 'linear-gradient(90deg,#3de8b0,#7c6dfa)' },
  ];

  return (
    <div className="dashboard-mock">
      <div className="dashboard-mock-glow" />
      <div className="window-top">
        <span className="window-dot red" />
        <span className="window-dot yellow" />
        <span className="window-dot green" />
        <span className="window-title">Planora · My Workspace</span>
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-sidebar">
          {navItems.map(({ icon, label, active }) => (
            <div key={label} className={`dashboard-nav-item ${active ? 'active' : ''}`}>
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="dashboard-main">
          <p className="dashboard-caption">Good morning! Here's your day 🌟</p>
          <div className="dashboard-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="dashboard-stat-card">
                <p className="dashboard-stat-label">{stat.label}</p>
                <p className="dashboard-stat-value" style={{ color: stat.color }}>
                  {stat.val}
                </p>
                <div className="dashboard-progress-bar">
                  <div className="dashboard-progress-fill" style={{ width: stat.w, background: stat.g }} />
                </div>
              </div>
            ))}
          </div>
          <div className="dashboard-tasks-card">
            <p className="dashboard-task-heading">Today's Tasks</p>
            {tasks.map((task, index) => (
              <div key={index} className="dashboard-task-row">
                <span className={`task-checkbox ${task.done ? 'checked' : ''}`}>
                  {task.done ? '✓' : ''}
                </span>
                <span className={`task-text ${task.done ? 'done' : ''}`}>{task.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="landing-hero">
      <div className="hero-orbs">
        <div className="hero-orb orb-large" />
        <div className="hero-orb orb-medium" />
        <div className="hero-orb orb-small" />
      </div>
      <div className="hero-content">
        <div className="hero-badge reveal">Open Source · Built with ❤️</div>
        <h1 className="hero-title font-syne reveal">
          Plan smarter.
          <br />
          <span className="gradient-text">Build together.</span>
        </h1>
        <p className="hero-copy reveal">
          Planora is the all-in-one workspace that turns chaos into clarity — tasks,
          timelines, and teams in perfect sync.
        </p>
        <div className="hero-actions reveal">
          <Link to="/login" className="landing-button landing-button-solid">
            Start for free
          </Link>
          <a href="#features" className="landing-button landing-button-outline">
            Explore Features →
          </a>
        </div>
        <div className="hero-showcase reveal">
          <DashboardMock />
        </div>
      </div>
    </section>
  );
}

function Logos() {
  const brands = ['Vercel', 'Notion', 'Linear', 'Figma', 'Railway', 'Supabase'];
  return (
    <section className="landing-logos reveal">
      <p className="landing-logos-label">Trusted by builders at</p>
      <div className="landing-logos-list">
        {brands.map((brand) => (
          <span key={brand} className="landing-logo-badge">
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: '📋', title: 'Smart Task Management', desc: 'Create, assign, and organize tasks effortlessly.', bg: '#7c6dfa22' },
    { icon: '👥', title: 'Real-Time Collaboration', desc: 'See who is working on what and stay aligned.', bg: '#f06aff22' },
    { icon: '📊', title: 'Progress Tracking', desc: 'Track velocity and spot bottlenecks instantly.', bg: '#3de8b022' },
    { icon: '🗓️', title: 'Calendar & Timeline', desc: 'Plan sprints, set milestones, and stay on schedule.', bg: '#50a0ff22' },
    { icon: '🔗', title: 'Integrations', desc: 'Connect GitHub, Slack, Notion, and more workflows.', bg: '#ff965222' },
    { icon: '🔒', title: 'Roles & Permissions', desc: 'Control who can view, edit, or manage each project.', bg: '#ffd25222' },
  ];

  return (
    <section id="features" className="landing-section">
      <div className="landing-section-header reveal">
        <span className="landing-section-tag">Features</span>
        <h2 className="landing-section-title font-syne">
          Everything your team needs.
          <br />
          Nothing it doesn't.
        </h2>
        <p className="landing-section-copy">
          Planora brings the best of task management, collaboration, and analytics into one beautiful interface.
        </p>
      </div>
      <div className="landing-grid reveal">
        {features.map((feature) => (
          <div key={feature.title} className="feature-card">
            <div className="feature-icon" style={{ background: feature.bg }}>
              {feature.icon}
            </div>
            <h3 className="feature-title font-syne">{feature.title}</h3>
            <p className="feature-copy">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function KanbanMock() {
  const columns = [
    {
      title: 'To Do', color: '#8884a0', cards: [
        { text: 'Write unit tests for auth', tag: 'Backend', color: '#3de8b0' },
        { text: 'Design settings page', tag: 'UI', color: '#7c6dfa' },
        { text: 'Add dark mode toggle', tag: 'Feature', color: '#f06aff' },
      ],
    },
    {
      title: 'In Progress', color: '#7c6dfa', cards: [
        { text: 'Fix login redirect bug', tag: 'Bug', color: '#ff6b6b' },
        { text: 'Update landing page', tag: 'UI', color: '#7c6dfa' },
      ],
    },
    {
      title: 'Done', color: '#3de8b0', cards: [
        { text: 'Set up CI/CD pipeline', tag: 'Backend', color: '#3de8b0' },
        { text: 'Create onboarding flow', tag: 'Feature', color: '#f06aff' },
        { text: 'Database schema v1', tag: 'Backend', color: '#3de8b0' },
      ],
    },
  ];

  return (
    <div className="kanban-mock">
      {columns.map((col) => (
        <div key={col.title} className="kanban-column">
          <p className="kanban-column-title" style={{ color: col.color }}>
            {col.title}
          </p>
          {col.cards.map((card, index) => (
            <div key={index} className="kanban-card">
              <p>{card.text}</p>
              <span className="kanban-tag" style={{ background: `${card.color}22`, color: card.color }}>
                {card.tag}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { step: '1', title: 'Create your workspace', text: 'Set up your project, invite your team, and define your goals in under 2 minutes.' },
    { step: '2', title: 'Organize with boards', text: 'Drag and drop tasks across Kanban columns, assign owners, set priorities and deadlines.' },
    { step: '3', title: 'Ship and celebrate 🎉', text: 'Track progress in real-time, hit your milestones, and watch the confetti fly.' },
  ];

  return (
    <section id="how-it-works" className="landing-section landing-section-alt">
      <div className="how-grid">
        <div>
          <span className="landing-section-tag reveal">How It Works</span>
          <h2 className="landing-section-title font-syne reveal">
            From idea to done
            <br />
            in 3 steps.
          </h2>
          <div className="how-steps">
            {steps.map((item, index) => (
              <div key={item.step} className="how-step reveal">
                <div className="how-step-number">{item.step}</div>
                <div>
                  <h4 className="how-step-title">{item.title}</h4>
                  <p className="how-step-copy">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="reveal">
          <KanbanMock />
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    { stars: 5, text: '"Planora completely changed how our startup plans features. The kanban board alone saved us hours of meetings every week."', name: 'Sneha R.', role: 'Product Manager · TechCo', badge: 'SR', gradient: 'linear-gradient(135deg,#7c6dfa,#f06aff)' },
    { stars: 5, text: '"The UI is genuinely beautiful. It\'s the only planning tool I actually enjoy opening. Progress tracking is chef\'s kiss."', name: 'Arjun K.', role: 'Full Stack Dev · Freelance', badge: 'AK', gradient: 'linear-gradient(135deg,#3de8b0,#7c6dfa)' },
    { stars: 4, text: '"We onboarded our entire 12-person team in a day. The role management is intuitive and the GitHub integration just works."', name: 'Priya M.', role: 'Engineering Lead · DevHouse', badge: 'PM', gradient: 'linear-gradient(135deg,#f06aff,#ff8c60)' },
  ];

  return (
    <section className="landing-section">
      <div className="landing-section-header reveal">
        <span className="landing-section-tag">Testimonials</span>
        <h2 className="landing-section-title font-syne">Loved by builders.</h2>
      </div>
      <div className="testimonial-grid reveal">
        {testimonials.map((item) => (
          <div key={item.name} className="testimonial-card">
            <div className="testimonial-stars">{'★'.repeat(item.stars)}{'☆'.repeat(5 - item.stars)}</div>
            <p className="testimonial-text">{item.text}</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar" style={{ background: item.gradient }}>
                {item.badge}
              </div>
              <div>
                <p className="testimonial-name">{item.name}</p>
                <p className="testimonial-role">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: 'Starter', tagline: 'Perfect for solo builders', price: 'Free', period: '/ forever', button: 'Get Started Free', featured: false,
      items: ['3 Projects', 'Kanban Boards', 'Basic Analytics'], extras: ['Team Collaboration', 'Integrations'],
    },
    {
      name: 'Pro', tagline: 'For growing teams', price: '$12', period: '/mo per user', button: 'Start Free Trial', featured: true,
      items: ['Unlimited Projects', 'All Board Views', 'Advanced Analytics', 'Team Collaboration', '10+ Integrations'],
      extras: [],
    },
    {
      name: 'Enterprise', tagline: 'For large organizations', price: 'Custom', period: '', button: 'Contact Sales', featured: false,
      items: ['Everything in Pro', 'SSO & SAML', 'Audit Logs', 'SLA Guarantee', 'Dedicated Support'],
      extras: [],
    },
  ];

  return (
    <section id="pricing" className="landing-section landing-section-alt">
      <div className="landing-section-header reveal">
        <span className="landing-section-tag">Pricing</span>
        <h2 className="landing-section-title font-syne">Simple, transparent pricing.</h2>
        <p className="landing-section-copy">Start free, scale as you grow. No hidden fees.</p>
      </div>
      <div className="pricing-grid reveal">
        {plans.map((plan) => (
          <div key={plan.name} className={`pricing-card ${plan.featured ? 'pricing-card-featured' : ''}`}>
            {plan.featured && <div className="pricing-badge">Most Popular</div>}
            <p className="pricing-name font-syne">{plan.name}</p>
            <p className="pricing-tagline">{plan.tagline}</p>
            <div className="pricing-price">
              {plan.price} <span className="pricing-period">{plan.period}</span>
            </div>
            <div className="pricing-list">
              {plan.items.map((item) => (
                <div key={item} className="pricing-feature">✓ {item}</div>
              ))}
              {plan.extras.map((item) => (
                <div key={item} className="pricing-feature pricing-feature-muted">✗ {item}</div>
              ))}
            </div>
            <Link to="/register" className={`landing-button ${plan.featured ? 'landing-button-solid' : 'landing-button-outline'}`}>
              {plan.button}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="landing-cta reveal">
      <h2 className="cta-title font-syne">Your best work<br />starts here.</h2>
      <p className="cta-copy">Open source, beautifully designed, and free to get started.</p>
      <div className="cta-actions">
        <a href="https://github.com/Anushka-0210/Planora" target="_blank" rel="noreferrer" className="landing-button landing-button-solid">
          ⭐ View on GitHub
        </a>
        <Link to="#features" className="landing-button landing-button-outline">
          Learn More
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="landing-footer">
      <div className="footer-top">
        <div>
          <span className="landing-logo font-syne">Planora</span>
          <p className="footer-copy">An open-source planning tool built for developers, designers, and their teams.</p>
        </div>
        <div className="footer-links">
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
            { title: 'Developers', links: ['GitHub', 'Documentation', 'API Reference', 'Contributing'] },
            { title: 'Company', links: ['About', 'Blog', 'Privacy', 'Terms'] },
          ].map((column) => (
            <div key={column.title}>
              <p className="footer-title">{column.title}</p>
              <div className="footer-link-list">
                {column.links.map((link) => (
                  <a
                    key={link}
                    href={link === 'GitHub' ? 'https://github.com/Anushka-0210/Planora' : '#'}
                    target={link === 'GitHub' ? '_blank' : undefined}
                    rel={link === 'GitHub' ? 'noreferrer' : undefined}
                    className="footer-link"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Planora · Built by <a href="https://github.com/Anushka-0210" target="_blank" rel="noreferrer" className="footer-link">Anushka</a> · MIT License</p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  useReveal();

  return (
    <div className="landing-root">
      <Nav />
      <main className="landing-main">
        <Hero />
        <Logos />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
