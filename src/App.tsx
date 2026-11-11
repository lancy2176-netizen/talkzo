import { useState, type FormEvent, type ReactNode } from 'react';
import { siteConfig } from './config';

type RazorpayResult = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayOptions = {
  key: string; amount: number; currency: string; name: string; description: string; order_id: string;
  handler: (result: RazorpayResult) => void; modal: { ondismiss: () => void };
  theme: { color: string };
};
declare global { interface Window { Razorpay?: new (options: RazorpayOptions) => { open: () => void } } }

const paymentApiBase = (import.meta.env.VITE_RAZORPAY_API_URL || '').replace(/\/$/, '');
const razorpayPaymentLink = (import.meta.env.VITE_RAZORPAY_PAYMENT_LINK || '').trim();

async function readPaymentJson<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('The payment API returned a web page instead of payment data. GitHub Pages cannot run the Razorpay API; configure a Razorpay Payment Link or a hosted API URL.');
  }
  return response.json() as Promise<T>;
}

type IconName =
  | 'arrow-up-right'
  | 'arrow-right'
  | 'check'
  | 'bug'
  | 'code'
  | 'cloud'
  | 'zap'
  | 'shield'
  | 'smartphone'
  | 'api'
  | 'terminal'
  | 'gauge'
  | 'message'
  | 'menu'
  | 'close'
  | 'plus'
  | 'minus'
  | 'copy'
  | 'send'
  | 'sparkles'
  | 'clock';

function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  let content: ReactNode;

  switch (name) {
    case 'arrow-up-right':
      content = <><path d="M7 17 17 7" /><path d="M7 7h10v10" /></>;
      break;
    case 'arrow-right':
      content = <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>;
      break;
    case 'check':
      content = <path d="m5 12 4 4L19 6" />;
      break;
    case 'bug':
      content = <><path d="M8 9h8v8a4 4 0 0 1-8 0V9Z" /><path d="M10 5.5 12 4l2 1.5M4 10h4m8 0h4M4 16h4m8 0h4M6 4l2 3m10-3-2 3M12 9v10" /></>;
      break;
    case 'code':
      content = <><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" /></>;
      break;
    case 'cloud':
      content = <><path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9.5 4.5 4.5 0 0 0 7 18Z" /><path d="m9 13 2 2 4-4" /></>;
      break;
    case 'zap':
      content = <path d="m13 2-3 9h7l-6 11 2-9H6l7-11Z" />;
      break;
    case 'shield':
      content = <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>;
      break;
    case 'smartphone':
      content = <><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M11 18h2" /></>;
      break;
    case 'api':
      content = <><path d="M8 8 4 12l4 4M16 8l4 4-4 4M14 5l-4 14" /><path d="M3 3h18v18H3z" opacity=".15" /></>;
      break;
    case 'terminal':
      content = <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m7 9 3 3-3 3m6 0h4" /></>;
      break;
    case 'gauge':
      content = <><path d="M4.5 19a9 9 0 1 1 15 0" /><path d="m12 13 4-4M7 19h10" /></>;
      break;
    case 'message':
      content = <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" /></>;
      break;
    case 'menu':
      content = <><path d="M4 7h16M4 12h16M4 17h16" /></>;
      break;
    case 'close':
      content = <><path d="m18 6-12 12M6 6l12 12" /></>;
      break;
    case 'plus':
      content = <><path d="M12 5v14M5 12h14" /></>;
      break;
    case 'minus':
      content = <path d="M5 12h14" />;
      break;
    case 'copy':
      content = <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>;
      break;
    case 'send':
      content = <><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" /></>;
      break;
    case 'sparkles':
      content = <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14ZM5 2l.7 1.8L7.5 4.5l-1.8.7L5 7l-.7-1.8-1.8-.7 1.8-.7L5 2Z" /></>;
      break;
    case 'clock':
      content = <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>;
      break;
    default:
      content = null;
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {content}
    </svg>
  );
}

const services: { icon: IconName; title: string; description: string; tag: string }[] = [
  {
    icon: 'bug',
    title: 'App crashes & runtime bugs',
    description: 'Track down unexpected crashes, exceptions, freezes and issues that interrupt the user journey.',
    tag: 'Stability',
  },
  {
    icon: 'smartphone',
    title: 'UI & layout issues',
    description: 'Fix overflow, responsive layouts, navigation glitches, spacing and platform-specific UI behaviour.',
    tag: 'Interface',
  },
  {
    icon: 'api',
    title: 'API & data integration',
    description: 'Investigate API errors, parsing problems, loading states, authentication and unreliable data flows.',
    tag: 'Integrations',
  },
  {
    icon: 'cloud',
    title: 'Firebase & notifications',
    description: 'Troubleshoot Firebase Auth, Firestore, Storage, push notifications and configuration issues.',
    tag: 'Backend',
  },
  {
    icon: 'terminal',
    title: 'Build & release errors',
    description: 'Resolve common Android and iOS build failures, dependency conflicts and release configuration issues.',
    tag: 'Builds',
  },
  {
    icon: 'gauge',
    title: 'Performance improvements',
    description: 'Look into slow screens, unnecessary rebuilds, memory concerns and performance bottlenecks.',
    tag: 'Performance',
  },
];

const steps = [
  {
    number: '01',
    title: 'Tell us what is broken',
    description: 'Share the error, a short screen recording or the steps needed to reproduce the issue.',
  },
  {
    number: '02',
    title: 'Get a clear estimate',
    description: 'We review the scope and confirm the likely effort, price and next steps before work begins.',
  },
  {
    number: '03',
    title: 'Fix, test & hand back',
    description: 'The agreed fix is implemented, checked against the reported issue and handed back with an update.',
  },
];

const faqs = [
  {
    question: 'Is ₹999 the final price for every bug?',
    answer:
      '₹999 is the starting price for a small, clearly scoped issue. The final estimate depends on the cause, complexity and time needed. You will receive a quote for approval before any paid work starts.',
  },
  {
    question: 'What should I share to get an estimate?',
    answer:
      'A short description, the exact steps that cause the issue, the error message or logs, and a screen recording if the problem is visual. Please remove passwords, API secrets and real user data before sharing anything.',
  },
  {
    question: 'Can you work on an existing Flutter project?',
    answer:
      'Yes. Existing Flutter projects can be reviewed once the relevant source files and steps to reproduce the issue are available. Access should be limited to what is needed for the agreed task.',
  },
  {
    question: 'Do you fix both Android and iOS issues?',
    answer:
      'The service can cover Flutter issues on Android and iOS. Some fixes depend on platform-specific setup, certificates, devices or third-party services, so those requirements are confirmed during the review.',
  },
  {
    question: 'Will you start fixing immediately after I submit?',
    answer:
      'No work is assumed or started just because you send an enquiry. First the issue is reviewed, then the scope and estimate are shared for your approval.',
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [draftMessage, setDraftMessage] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [copied, setCopied] = useState(false);
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');

  async function startPayment() {
    setPaymentBusy(true);
    setPaymentStatus('');
    try {
      if (razorpayPaymentLink) {
        const link = new URL(razorpayPaymentLink);
        if (link.protocol !== 'https:') throw new Error('The configured Razorpay Payment Link must use HTTPS.');
        window.location.assign(link.toString());
        return;
      }
      if (import.meta.env.PROD && !paymentApiBase) {
        throw new Error('Razorpay is not connected on this GitHub Pages site. Add VITE_RAZORPAY_PAYMENT_LINK from your Razorpay Dashboard, then rebuild and redeploy.');
      }
      const loadCheckout = () => new Promise<void>((resolve, reject) => {
        if (window.Razorpay) return resolve();
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Razorpay checkout could not be loaded. Check your connection and try again.'));
        document.body.appendChild(script);
      });
      await loadCheckout();
      const orderResponse = await fetch(`${paymentApiBase}/api/razorpay/create-order`, { method: 'POST' });
      const order = await readPaymentJson<{ orderId?: string; amount?: number; currency?: string; keyId?: string; error?: string }>(orderResponse);
      if (!orderResponse.ok || !order.orderId || !order.keyId || !order.amount || !order.currency) {
        throw new Error(order.error || 'Could not start checkout. Confirm Razorpay server credentials are configured.');
      }
      const checkout = new window.Razorpay!({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: siteConfig.brandName,
        description: 'Flutter bug fixing — starting payment',
        order_id: order.orderId,
        theme: { color: '#1f755d' },
        modal: { ondismiss: () => setPaymentBusy(false) },
        handler: async (result) => {
          try {
            const verifyResponse = await fetch(`${paymentApiBase}/api/razorpay/verify-payment`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result),
            });
            const verification = await readPaymentJson<{ verified?: boolean; error?: string }>(verifyResponse);
            if (!verifyResponse.ok || !verification.verified) throw new Error(verification.error || 'Payment verification failed. Contact support before retrying.');
            setPaymentStatus(`Payment verified. Reference: ${result.razorpay_payment_id}`);
          } catch (error) {
            setPaymentStatus(error instanceof Error ? error.message : 'Could not verify payment. Contact support with your payment reference.');
          } finally {
            setPaymentBusy(false);
          }
        },
      });
      checkout.open();
    } catch (error) {
      setPaymentStatus(error instanceof Error ? error.message : 'Could not start payment. Please try again.');
      setPaymentBusy(false);
    }
  }

  const closeMenu = () => setMenuOpen(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const issueType = String(data.get('issueType') ?? '').trim();
    const details = String(data.get('details') ?? '').trim();

    const message = [
      `Hi ${siteConfig.brandName}, I would like help with a Flutter app issue.`,
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Issue type: ${issueType}`,
      '',
      'Issue details:',
      details,
      '',
      'Please share the next steps and an estimate. Thank you.',
    ].join('\n');

    setDraftMessage(message);
    setCopied(false);

    const number = siteConfig.whatsappNumber.replace(/\D/g, '');
    if (/^\d{10,15}$/.test(number)) {
      const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setFormStatus('Your enquiry is ready in WhatsApp. Review it there and send when ready.');
    } else {
      setFormStatus('Your enquiry is prepared below. Copy it and send it through your preferred contact channel.');
    }
  }

  async function copyMessage() {
    if (!draftMessage) return;
    try {
      await navigator.clipboard.writeText(draftMessage);
      setCopied(true);
    } catch {
      setFormStatus('Clipboard access was unavailable. Select and copy the message below.');
    }
  }

  return (
    <div className="site-shell">
      <div className="announcement-bar">
        <span className="announcement-dot" />
        Flutter app bug fixing & support
        <span className="announcement-divider">·</span>
        Starting at <strong>₹999</strong>
        <a href="#contact" className="announcement-link">Get an estimate <Icon name="arrow-up-right" /></a>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label={`${siteConfig.brandName} home`} onClick={closeMenu}>
          <span className="brand-mark"><span>F</span><i /></span>
          <span className="brand-copy">
            <strong>{siteConfig.brandName}</strong>
            <small>FLUTTER APP SUPPORT</small>
          </span>
        </a>

        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <a href="#services" onClick={closeMenu}>What we fix</a>
          <a href="#process" onClick={closeMenu}>How it works</a>
          <a href="#pricing" onClick={closeMenu}>Pricing</a>
          <a href="#faq" onClick={closeMenu}>FAQs</a>
          <a className="mobile-nav-cta" href="#contact" onClick={closeMenu}>Get an estimate <Icon name="arrow-up-right" /></a>
        </nav>

        <a className="header-cta" href="#contact">Get an estimate <Icon name="arrow-up-right" /></a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>
      </header>

      <main>
        <section className="hero-section" id="top">
          <div className="hero-grid-bg" />
          <div className="hero-content">
            <div className="eyebrow"><span className="eyebrow-line" /> FLUTTER BUG FIXING, MADE SIMPLE</div>
            <h1>Let’s get your app<br /><span>back on track.</span></h1>
            <p className="hero-description">
              Stuck with a Flutter error, broken screen or build issue? Get practical debugging help and a clear estimate before the fix begins.
            </p>
            <div className="hero-actions">
              <a href="#contact" className="button button-primary">Tell us what’s broken <Icon name="arrow-up-right" /></a>
              <a href="#services" className="text-link">Explore what we fix <Icon name="arrow-right" /></a>
            </div>
            <div className="hero-assurances">
              <div><span className="assurance-icon"><Icon name="check" /></span><span>Estimate before work starts</span></div>
              <div><span className="assurance-icon"><Icon name="check" /></span><span>Clear issue-by-issue scope</span></div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Illustration of a Flutter debugging workspace">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="code-window">
              <div className="window-topbar">
                <div className="window-dots"><i /><i /><i /></div>
                <span>debug_session.dart</span>
                <span className="window-status"><i /> REVIEW</span>
              </div>
              <div className="code-body">
                <div className="code-line"><span className="line-no">01</span><code><b>class</b> AppIssue <em>extends</em> DebugTask {'{'}</code></div>
                <div className="code-line"><span className="line-no">02</span><code>&nbsp;&nbsp;<b>final</b> status = <i>'identified'</i>;</code></div>
                <div className="code-line"><span className="line-no">03</span><code>&nbsp;&nbsp;<b>final</b> approach = <i>'understand first'</i>;</code></div>
                <div className="code-line"><span className="line-no">04</span><code>&nbsp;</code></div>
                <div className="code-line code-highlight"><span className="line-no">05</span><code>&nbsp;&nbsp;<b>Future</b>&lt;Fix&gt; resolve() <em>async</em> {'{'}</code></div>
                <div className="code-line"><span className="line-no">06</span><code>&nbsp;&nbsp;&nbsp;&nbsp;<b>return</b> testAndVerify();</code></div>
                <div className="code-line"><span className="line-no">07</span><code>&nbsp;&nbsp;{'}'}</code></div>
                <div className="code-line"><span className="line-no">08</span><code>{'}'}</code></div>
              </div>
              <div className="window-footer"><span><i className="status-pulse" /> Ready for review</span><span>Flutter · Dart</span></div>
            </div>
            <div className="floating-note note-top"><span className="note-icon note-icon-green"><Icon name="shield" /></span><span><strong>Careful diagnosis</strong><small>Understand the root cause</small></span></div>
            <div className="floating-note note-bottom"><span className="note-icon note-icon-purple"><Icon name="zap" /></span><span><strong>Focused fixes</strong><small>One issue at a time</small></span></div>
            <div className="hero-price-chip"><span>STARTING FROM</span><strong>₹999<small> onwards</small></strong></div>
          </div>

          <div className="hero-bottom-line">
            <span>HELP FOR YOUR FLUTTER PROJECT</span>
            <div className="tech-tags"><span>Flutter</span><i /> <span>Dart</span><i /> <span>Firebase</span><i /> <span>REST APIs</span><i /> <span>Android & iOS</span></div>
          </div>
        </section>

        <section className="problem-strip" aria-label="Common Flutter issues">
          <div className="problem-strip-label">WHEN YOUR APP…</div>
          <div className="problem-item"><span className="problem-symbol">!</span> Crashes unexpectedly</div>
          <div className="problem-item"><span className="problem-symbol">↗</span> Has a broken layout</div>
          <div className="problem-item"><span className="problem-symbol">⌁</span> Fails to build</div>
          <div className="problem-item"><span className="problem-symbol">⌘</span> Can’t reach an API</div>
        </section>

        <section className="section services-section" id="services">
          <div className="section-heading-row">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> WHAT WE CAN HELP WITH</div>
              <h2>Small bug or stubborn error.<br /><span>Let’s untangle it.</span></h2>
            </div>
            <p className="section-intro">Practical help for the problems that slow down your Flutter app. Share the symptoms and we’ll help define the next step.</p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <article className="service-card" key={service.title}>
                <div className={`service-icon service-icon-${index + 1}`}><Icon name={service.icon} /></div>
                <div className="service-tag">{service.tag}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a href="#contact" className="card-link" aria-label={`Ask about ${service.title}`}>Discuss this issue <Icon name="arrow-up-right" /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="process-section" id="process">
          <div className="process-inner">
            <div className="process-heading">
              <div className="eyebrow eyebrow-light"><span className="eyebrow-line" /> A CLEAR, SIMPLE PROCESS</div>
              <h2>From “it’s not working”<br />to <span>“that’s fixed.”</span></h2>
              <p>No vague promises. Just a straightforward process, a clear estimate and an update on the issue you reported.</p>
              <a href="#contact" className="button button-light">Start with your issue <Icon name="arrow-up-right" /></a>
            </div>
            <div className="process-steps">
              {steps.map((step, index) => (
                <div className="process-step" key={step.number}>
                  <div className="step-number">{step.number}</div>
                  <div className="step-content"><h3>{step.title}</h3><p>{step.description}</p></div>
                  {index < steps.length - 1 && <div className="step-connector" />}
                </div>
              ))}
            </div>
            <div className="process-decoration"><span>F</span><i /><i /><i /></div>
          </div>
        </section>

        <section className="section pricing-section" id="pricing">
          <div className="pricing-heading">
            <div className="eyebrow"><span className="eyebrow-line" /> STRAIGHTFORWARD PRICING</div>
            <h2>Start small.<br /><span>Know the cost first.</span></h2>
            <p>Every issue is different. The starting price gives you a reference point; the exact quote is confirmed after we understand the bug.</p>
          </div>
          <div className="pricing-layout">
            <div className="price-feature-card">
              <div className="price-card-top"><span className="price-label">FLUTTER BUG FIXING</span><span className="price-badge"><Icon name="sparkles" /> STARTING PRICE</span></div>
              <div className="price-amount"><span>₹</span>999<span className="price-onwards"> onwards</span></div>
              <p className="price-description">For a small, clearly scoped Flutter bug. Complex issues are estimated separately after review.</p>
              <div className="price-divider" />
              <div className="price-includes-title">A clear start, with:</div>
              <ul className="price-list">
                <li><Icon name="check" /> Initial issue review</li>
                <li><Icon name="check" /> Scope and estimate before work</li>
                <li><Icon name="check" /> Focused work on the agreed issue</li>
                <li><Icon name="check" /> Update on the fix and verification</li>
              </ul>
              <button type="button" className="button button-primary price-button" onClick={startPayment} disabled={paymentBusy}>
                {paymentBusy ? 'Connecting to Razorpay…' : 'Pay ₹999 securely'} <Icon name="arrow-up-right" />
              </button>
              <p className="payment-status" role="status" aria-live="polite">{paymentStatus}</p>
              <small className="price-footnote">No work begins until you approve the estimate.</small>
            </div>
            <div className="pricing-side">
              <div className="pricing-side-card">
                <span className="side-card-icon"><Icon name="code" /></span>
                <div><h3>Multiple screens or feature flows?</h3><p>We’ll review the affected screens and dependencies, then provide a scoped estimate.</p></div>
                <span className="side-card-arrow"><Icon name="arrow-up-right" /></span>
              </div>
              <div className="pricing-side-card">
                <span className="side-card-icon side-card-icon-orange"><Icon name="terminal" /></span>
                <div><h3>Build, release or deep debugging?</h3><p>Platform setup, native configuration and complex root-cause work may need a separate quote.</p></div>
                <span className="side-card-arrow"><Icon name="arrow-up-right" /></span>
              </div>
              <div className="quote-note"><span className="quote-note-icon"><Icon name="shield" /></span><p><strong>Your approval comes first.</strong><br />We’ll explain the proposed scope and cost before starting any paid work.</p></div>
            </div>
          </div>
        </section>

        <section className="faq-section" id="faq">
          <div className="faq-inner">
            <div className="faq-heading">
              <div className="eyebrow"><span className="eyebrow-line" /> GOOD TO KNOW</div>
              <h2>Questions before<br /><span>you get started?</span></h2>
              <p>Here are a few things people usually want to know before sharing a Flutter issue.</p>
              <a href="#contact" className="text-link">Still have a question? <Icon name="arrow-right" /></a>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <article className={`faq-item ${isOpen ? 'faq-open' : ''}`} key={faq.question}>
                    <button
                      type="button"
                      className="faq-question"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                    >
                      <span>{faq.question}</span>
                      <span className="faq-toggle"><Icon name={isOpen ? 'minus' : 'plus'} /></span>
                    </button>
                    {isOpen && <div className="faq-answer"><p>{faq.answer}</p></div>}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-grid" />
          <div className="contact-copy">
            <div className="eyebrow eyebrow-light"><span className="eyebrow-line" /> LET’S LOOK AT THE ISSUE</div>
            <h2>One bug at a time.<br /><span>One step closer.</span></h2>
            <p>Tell us what’s happening in your Flutter app. Share enough detail for an initial review and we’ll help you figure out the next step.</p>
            <div className="contact-points">
              <div><span><Icon name="check" /></span> No obligation to proceed</div>
              <div><span><Icon name="check" /></span> Scope and quote before paid work</div>
              <div><span><Icon name="check" /></span> Never share passwords or secret keys</div>
            </div>
            <div className="contact-price-note"><strong>₹999+</strong><span>Starting price for small bug fixes</span></div>
          </div>

          <div className="contact-form-card">
            <div className="form-heading"><span className="form-heading-icon"><Icon name="message" /></span><div><h3>Tell us about your bug</h3><p>Share the details and request an estimate.</p></div></div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>Your name<input name="name" type="text" placeholder="e.g. Alex Thomas" autoComplete="name" required maxLength={80} /></label>
                <label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required maxLength={120} /></label>
              </div>
              <label>What do you need help with?
                <select name="issueType" defaultValue="" required>
                  <option value="" disabled>Select an issue type</option>
                  <option>App crash or runtime error</option>
                  <option>UI or layout issue</option>
                  <option>API or Firebase integration</option>
                  <option>Android or iOS build issue</option>
                  <option>Performance issue</option>
                  <option>Other Flutter issue</option>
                </select>
              </label>
              <label>Describe the issue<textarea name="details" rows={4} placeholder="What happens, what did you expect, and when does it happen?" required minLength={12} maxLength={1500} /></label>
              <button className="button button-primary form-submit" type="submit">Prepare my enquiry <Icon name="send" /></button>
              <p className="form-privacy">Please don’t include passwords, API keys, private certificates or real customer data.</p>
            </form>
            {formStatus && (
              <div className="form-result" role="status" aria-live="polite">
                <div className="form-result-title"><Icon name="check" /> Enquiry prepared</div>
                <p>{formStatus}</p>
                {draftMessage && (
                  <>
                    <textarea className="message-preview" aria-label="Prepared enquiry message" readOnly value={draftMessage} rows={8} />
                    <button className="copy-button" type="button" onClick={copyMessage}><Icon name="copy" /> {copied ? 'Copied' : 'Copy enquiry message'}</button>
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark"><span>F</span><i /></span>
          <span className="brand-copy"><strong>{siteConfig.brandName}</strong><small>FLUTTER APP SUPPORT</small></span>
        </a>
        <p>Thoughtful debugging for Flutter apps.</p>
        <div className="footer-right"><span>Flutter bug fixing from ₹999</span><a href="#top" aria-label="Back to top">Back to top ↑</a></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.</span><span>Built for better app days.</span></div>
      </footer>
    </div>
  );
}

export default App;
