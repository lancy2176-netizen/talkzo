
import { useState } from 'react';
import { siteConfig } from './config';
import { startRazorpayCheckout } from './services/razorpayService';

type Product = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  category: string;
  stack: string[];
  repository: string;
  accent: string;
};

const products: Product[] = [
  {
    id: 'portfolio',
    name: 'Portfolio Website',
    subtitle: 'Personal portfolio source code',
    description:
      'A customisable portfolio website codebase for showcasing projects, skills and professional work.',
    price: 35,
    category: 'WEBSITE',
    stack: ['Web', 'Portfolio'],
    repository:
      'https://github.com/AdeebAbubacker/portfolio-2026',
    accent: 'violet',
  },
  {
    id: 'student-lms',
    name: 'Student Learning Management System',
    subtitle: 'Learning management source code',
    description:
      'An LMS project codebase with student, teacher and administrator-oriented functionality.',
    price: 75,
    category: 'EDTECH',
    stack: ['Angular', 'Firebase'],
    repository:
      'https://github.com/AdeebAbubacker/Student-Learning-Management-System',
    accent: 'blue',
  },
  {
    id: 'groone-crm',
    name: 'GroOne CRM Dashboard',
    subtitle: 'CRM dashboard source code',
    description:
      'A dashboard-style web application codebase for CRM-related development and customisation.',
    price: 55,
    category: 'DASHBOARD',
    stack: ['Angular'],
    repository:
      'https://github.com/AdeebAbubacker/GroOneCRM',
    accent: 'green',
  },
  {
    id: 'delivery-admin',
    name: 'Delivery Admin Panel',
    subtitle: 'Delivery management source code',
    description:
      'An admin panel codebase for delivery operations, assignment workflows and management views.',
    price: 65,
    category: 'ADMIN PANEL',
    stack: ['Angular', 'Web'],
    repository:
      'https://github.com/AdeebAbubacker/Delivery-Admin-Panel',
    accent: 'orange',
  },
  {
    id: 'booking-cart',
    name: 'Booking & Shopping Cart',
    subtitle: 'Booking and cart project source code',
    description:
      'A web application codebase with booking and shopping-cart project structure.',
    price: 49,
    category: 'E-COMMERCE',
    stack: ['ASP.NET Core', 'MVC'],
    repository:
      'https://github.com/AdeebAbubacker/Booking-Shop-Cart',
    accent: 'pink',
  },
];

function CodeArtwork({ product }: { product: Product }) {
  return (
    <div className={`artwork artwork-${product.accent}`}>
      <div className="artwork-top">
        <span />
        <span />
        <span />
        <small>PROJECT SOURCE</small>
      </div>

      <div className="artwork-code">
        <div>
          <i>01</i> <b>const</b> project = {'{'}
        </div>
        <div>
          <i>02</i> &nbsp;name: <em>'{product.id}'</em>,
        </div>
        <div>
          <i>03</i> &nbsp;status: <strong>'ready'</strong>,
        </div>
        <div>
          <i>04</i> &nbsp;type: <u>'source-code'</u>
        </div>
        <div>
          <i>05</i> {'}'};
        </div>
      </div>

      <div className="artwork-number">{'</>'}</div>

      <div className="artwork-bottom">
        <span>● DIGITAL PRODUCT</span>
        <span>◆ SOURCE CODE</span>
      </div>
    </div>
  );
}

function App() {
  const [paymentBusy, setPaymentBusy] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState('');

  async function buyProduct(product: Product) {
    setPaymentBusy(product.id);
    setPaymentStatus('');

    try {
      // Uses your existing Razorpay checkout and verification service.
      // The current backend does not yet receive product-specific pricing.
      const outcome = await startRazorpayCheckout(
        siteConfig.brandName,
      );

      if (outcome.status === 'success') {
        setPaymentStatus(
          `Payment verified. Reference: ${outcome.paymentId}`,
        );
      } else if (outcome.status === 'failure') {
        setPaymentStatus(
          `Payment failed: ${outcome.message}`,
        );
      } else {
        setPaymentStatus(
          'Payment cancelled. No payment was completed.',
        );
      }
    } catch (error) {
      setPaymentStatus(
        error instanceof Error
          ? error.message
          : 'Could not start payment. Please try again.',
      );
    } finally {
      setPaymentBusy(null);
    }
  }

  const whatsappNumber =
    siteConfig.whatsappNumber.replace(/\D/g, '');

  const whatsappUrl = /^\d{10,15}$/.test(whatsappNumber)
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Hi, I would like to know more about your source code products.',
      )}`
    : '#products';

  return (
    <div className="market-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700;800&display=swap');

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #f7f8fc;
          color: #17182a;
          font-family: 'DM Sans', sans-serif;
        }

        .market-shell {
          min-height: 100vh;
          overflow: hidden;
        }

        .market-top {
          background: #17182a;
          color: #c9c9d8;
          padding: 10px;
          text-align: center;
          font-size: 10px;
          letter-spacing: .12em;
        }

        .market-top b {
          color: #b8a7ff;
        }

        .market-header {
          max-width: 1160px;
          height: 76px;
          margin: auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .market-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          color: #17182a;
          text-decoration: none;
        }

        .market-logo {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #6d5ce8;
          color: white;
          display: grid;
          place-items: center;
          font-weight: 800;
          font-size: 15px;
        }

        .market-brand strong {
          display: block;
          font-size: 15px;
        }

        .market-brand small {
          display: block;
          margin-top: 3px;
          color: #85869a;
          font: 9px 'DM Mono', monospace;
          letter-spacing: .13em;
        }

        .market-nav {
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .market-nav a {
          color: #65667a;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }

        .market-nav a:hover {
          color: #6d5ce8;
        }

        .market-nav .nav-cta {
          background: #6d5ce8;
          color: white;
          padding: 11px 17px;
          border-radius: 9px;
        }

        .market-hero {
          max-width: 1160px;
          margin: auto;
          padding: 80px 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 55px;
          align-items: center;
        }

        .market-eyebrow {
          color: #6d5ce8;
          font: 11px 'DM Mono', monospace;
          letter-spacing: .15em;
        }

        .market-hero h1 {
          font-size: clamp(43px, 5.5vw, 68px);
          line-height: 1.04;
          letter-spacing: -.065em;
          margin: 22px 0;
          font-weight: 800;
        }

        .market-hero h1 span,
        .section-top h2 span {
          color: #6d5ce8;
        }

        .market-lead {
          color: #6e7084;
          font-size: 15px;
          line-height: 1.8;
          max-width: 520px;
        }

        .market-actions {
          display: flex;
          gap: 12px;
          margin-top: 28px;
          flex-wrap: wrap;
        }

        .market-button {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          gap: 9px;
          padding: 13px 18px;
          border-radius: 9px;
          background: #6d5ce8;
          color: white;
          text-decoration: none;
          border: 0;
          font: 700 12px 'DM Sans', sans-serif;
          cursor: pointer;
          transition: .2s;
        }

        .market-button:hover {
          background: #5745d0;
          transform: translateY(-1px);
        }

        .market-button:disabled {
          opacity: .6;
          cursor: wait;
          transform: none;
        }

        .market-button.secondary {
          background: white;
          color: #27283b;
          border: 1px solid #e6e6ef;
        }

        .market-trust {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          margin-top: 25px;
          color: #7c7d8f;
          font-size: 11px;
        }

        .market-trust span:before {
          content: '✓';
          color: #319b75;
          margin-right: 6px;
          font-weight: 800;
        }

        .hero-preview {
          background: #17182a;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 28px 70px #22204426;
          transform: rotate(1deg);
        }

        .preview-head,
        .preview-footer {
          display: flex;
          justify-content: space-between;
          color: #a9aabd;
          font: 10px 'DM Mono', monospace;
        }

        .preview-main {
          margin-top: 22px;
          background: #22243b;
          border: 1px solid #383a55;
          border-radius: 15px;
          padding: 22px;
        }

        .preview-label {
          color: #a7a0ff;
          font: 10px 'DM Mono', monospace;
        }

        .preview-title {
          font-size: 26px;
          color: white;
          font-weight: 800;
          margin: 12px 0;
        }

        .preview-sub {
          color: #9a9bb0;
          font-size: 11px;
        }

        .preview-bars {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 9px;
          margin-top: 22px;
        }

        .preview-bars span {
          height: 55px;
          border-radius: 8px;
          background: linear-gradient(145deg, #7665ed, #35365b);
        }

        .preview-bars span:nth-child(2) {
          background: linear-gradient(145deg, #41b99b, #284e58);
        }

        .preview-bars span:nth-child(3) {
          background: linear-gradient(145deg, #e8a45d, #694b59);
        }

        .preview-code {
          margin-top: 15px;
          padding: 14px;
          background: #191a2c;
          border-radius: 9px;
          color: #aaaac1;
          font: 10px/2 'DM Mono', monospace;
        }

        .preview-code b {
          color: #b4a9ff;
        }

        .preview-code em {
          color: #8fd7ba;
          font-style: normal;
        }

        .preview-footer {
          margin-top: 17px;
        }

        .market-section {
          max-width: 1160px;
          margin: auto;
          padding: 55px 24px 85px;
        }

        .section-top {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 25px;
          margin-bottom: 30px;
        }

        .section-top h2 {
          font-size: 38px;
          line-height: 1.1;
          letter-spacing: -.055em;
          margin: 13px 0 0;
        }

        .section-note {
          max-width: 360px;
          color: #77798c;
          font-size: 13px;
          line-height: 1.7;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .product-card {
          background: white;
          border: 1px solid #e9eaf1;
          border-radius: 17px;
          overflow: hidden;
          transition: .2s;
          display: flex;
          flex-direction: column;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 40px #26234a12;
          border-color: #d9d4ff;
        }

        .artwork {
          height: 185px;
          position: relative;
          overflow: hidden;
          padding: 17px;
          color: white;
          font-family: 'DM Mono', monospace;
        }

        .artwork-violet {
          background: linear-gradient(135deg, #282044, #5142a4);
        }

        .artwork-blue {
          background: linear-gradient(135deg, #142c49, #315e9b);
        }

        .artwork-green {
          background: linear-gradient(135deg, #153c39, #2b7667);
        }

        .artwork-orange {
          background: linear-gradient(135deg, #492d25, #a85e3e);
        }

        .artwork-pink {
          background: linear-gradient(135deg, #48283f, #995b86);
        }

        .artwork-top {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .artwork-top span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ffffff70;
        }

        .artwork-top small {
          margin-left: auto;
          font-size: 8px;
          letter-spacing: .12em;
        }

        .artwork-code {
          position: relative;
          margin-top: 22px;
          display: grid;
          gap: 6px;
          font-size: 10px;
        }

        .artwork-code i {
          display: inline-block;
          width: 22px;
          color: #ffffff60;
          font-style: normal;
          font-size: 8px;
        }

        .artwork-code b {
          color: #c2b6ff;
        }

        .artwork-code em {
          color: #a6e4c8;
          font-style: normal;
        }

        .artwork-code strong {
          color: #ffd18c;
        }

        .artwork-code u {
          color: #9edbff;
          text-decoration: none;
        }

        .artwork-number {
          position: absolute;
          right: 17px;
          bottom: 16px;
          font-size: 32px;
          color: #ffffff40;
        }

        .artwork-bottom {
          position: absolute;
          left: 17px;
          bottom: 12px;
          font-size: 8px;
          letter-spacing: .1em;
          color: #ffffffa0;
        }

        .artwork-bottom span {
          margin-left: 10px;
        }

        .product-content {
          padding: 19px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .product-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }

        .product-category {
          font: 9px 'DM Mono', monospace;
          color: #8175dc;
          background: #f1efff;
          padding: 6px 8px;
          border-radius: 5px;
        }

        .product-price {
          font-size: 21px;
          font-weight: 800;
        }

        .product-content h3 {
          font-size: 17px;
          line-height: 1.35;
          margin: 15px 0 5px;
          letter-spacing: -.03em;
        }

        .product-subtitle {
          color: #8a8b9c;
          font-size: 11px;
          font-weight: 600;
        }

        .product-description {
          color: #77798b;
          font-size: 12px;
          line-height: 1.7;
          margin: 12px 0;
        }

        .product-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 17px;
        }

        .product-tags span {
          font-size: 9px;
          color: #77798b;
          background: #f5f5f9;
          padding: 6px 8px;
          border-radius: 5px;
        }

        .product-actions {
          display: flex;
          gap: 9px;
          margin-top: auto;
        }

        .product-actions .market-button {
          flex: 1;
          padding: 11px 8px;
          font-size: 11px;
        }

        .repo-link {
          display: grid;
          place-items: center;
          width: 42px;
          min-width: 42px;
          border: 1px solid #e8e8ef;
          border-radius: 9px;
          color: #55566a;
          text-decoration: none;
          font-size: 17px;
        }

        .repo-link:hover {
          border-color: #b9b0ff;
          color: #6d5ce8;
        }

        .payment-notice {
          margin-top: 24px;
          padding: 14px 16px;
          border: 1px solid #f0dfb7;
          background: #fffaf0;
          border-radius: 10px;
          color: #79633a;
          font-size: 11px;
          line-height: 1.7;
        }

        .payment-status {
          margin-top: 15px;
          color: #356d57;
          font-size: 12px;
          min-height: 18px;
        }

        .market-bottom {
          background: #191a2c;
          color: white;
          padding: 50px 24px;
        }

        .market-bottom-inner {
          max-width: 1112px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }

        .market-bottom h2 {
          font-size: 28px;
          margin: 0 0 8px;
          letter-spacing: -.04em;
        }

        .market-bottom p {
          color: #aaaabd;
          font-size: 13px;
          line-height: 1.7;
        }

        .market-footer {
          max-width: 1160px;
          margin: auto;
          padding: 22px 24px;
          display: flex;
          justify-content: space-between;
          gap: 15px;
          color: #85869a;
          font-size: 10px;
        }

        .market-footer a {
          color: #6d5ce8;
          text-decoration: none;
        }

        @media (max-width: 850px) {
          .market-hero {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .hero-preview {
            max-width: 560px;
            width: 100%;
            margin: auto;
          }

          .product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .section-top {
            align-items: start;
            flex-direction: column;
          }
        }

        @media (max-width: 560px) {
          .market-header {
            height: 66px;
            padding: 0 18px;
          }

          .market-nav {
            gap: 12px;
          }

          .market-nav a:not(.nav-cta) {
            display: none;
          }

          .market-hero {
            padding: 48px 19px;
          }

          .market-hero h1 {
            font-size: 44px;
          }

          .market-section {
            padding: 42px 18px 65px;
          }

          .section-top h2 {
            font-size: 31px;
          }

          .product-grid {
            grid-template-columns: 1fr;
          }

          .market-bottom-inner {
            align-items: flex-start;
            flex-direction: column;
          }

          .market-footer {
            flex-direction: column;
          }

          .market-top {
            font-size: 9px;
          }
        }
      `}</style>

      <div className="market-top">
        INDEPENDENT DIGITAL PRODUCTS <b>· SOURCE CODE COLLECTION</b>
      </div>

      <header className="market-header">
        <a className="market-brand" href="#top">
          <span className="market-logo">{'</>'}</span>
          <span>
            <strong>{siteConfig.brandName}</strong>
            <small>CODE MARKETPLACE</small>
          </span>
        </a>

        <nav className="market-nav" aria-label="Main navigation">
          <a href="#products">Browse code</a>
          <a href="#about">About</a>
          <a
            className="nav-cta"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            Contact us ↗
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="market-hero">
          <div>
            <div className="market-eyebrow">
              DIGITAL SOURCE CODE STORE
            </div>

            <h1>
              Build faster.
              <br />
              <span>Start with code.</span>
            </h1>

            <p className="market-lead">
              Browse practical software project source code for
              learning, customisation and development. Choose a
              project, review its details and get in touch if you
              need more information.
            </p>

            <div className="market-actions">
              <a className="market-button" href="#products">
                Explore source code ↗
              </a>

              <a
                className="market-button secondary"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                Ask a question
              </a>
            </div>

            <div className="market-trust">
              <span>Digital source code</span>
              <span>Clear product listings</span>
              <span>Secure checkout flow</span>
            </div>
          </div>

          <div
            className="hero-preview"
            aria-label="Source code preview illustration"
          >
            <div className="preview-head">
              <span>● ● ●</span>
              <span>PROJECT_OVERVIEW</span>
              <span>•••</span>
            </div>

            <div className="preview-main">
              <div className="preview-label">
                DEVELOPER TOOLKIT / 2026
              </div>

              <div className="preview-title">
                Your next project
                <br />
                starts here.
              </div>

              <div className="preview-sub">
                Reusable foundations. Your own ideas.
              </div>

              <div className="preview-bars">
                <span />
                <span />
                <span />
              </div>

              <div className="preview-code">
                <b>const</b> source = {'{'}
                <br />
                &nbsp;&nbsp;quality: <em>'digital'</em>,
                <br />
                &nbsp;&nbsp;format: <em>'source-code'</em>
                <br />
                {'}'};
              </div>
            </div>

            <div className="preview-footer">
              <span>GIT · SOURCE FILES</span>
              <span>01 — 05</span>
            </div>
          </div>
        </section>

        <section className="market-section" id="products">
          <div className="section-top">
            <div>
              <div className="market-eyebrow">
                THE CODE COLLECTION
              </div>

              <h2>
                Find your next
                <br />
                <span>starting point.</span>
              </h2>
            </div>

            <p className="section-note">
              Explore the available project listings. Each product
              includes a repository reference so you can review
              the project before making a decision.
            </p>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <CodeArtwork product={product} />

                <div className="product-content">
                  <div className="product-meta">
                    <span className="product-category">
                      {product.category}
                    </span>

                    <span className="product-price">
                      ₹{product.price}
                    </span>
                  </div>

                  <h3>{product.name}</h3>

                  <div className="product-subtitle">
                    {product.subtitle}
                  </div>

                  <p className="product-description">
                    {product.description}
                  </p>

                  <div className="product-tags">
                    {product.stack.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <div className="product-actions">
                    <button
                      className="market-button"
                      type="button"
                      onClick={() => buyProduct(product)}
                      disabled={paymentBusy !== null}
                    >
                      {paymentBusy === product.id
                        ? 'Opening checkout…'
                        : 'Continue to checkout ↗'}
                    </button>

                    <a
                      className="repo-link"
                      href={product.repository}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View ${product.name} repository`}
                      title="View GitHub repository"
                    >
                      ⌘
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="payment-notice">
            <strong>Important checkout information:</strong>{' '}
            Your existing Razorpay integration creates orders
            using the amount configured by your payment server.
            The individual catalogue prices displayed here are
            not yet passed to the backend. Confirm the amount
            displayed in Razorpay before completing payment.
            Product-specific payment amounts will require a
            backend update.
          </div>

          <p
            className="payment-status"
            role="status"
            aria-live="polite"
          >
            {paymentStatus}
          </p>
        </section>

        <section className="market-bottom" id="about">
          <div className="market-bottom-inner">
            <div>
              <h2>Have a question about a project?</h2>
              <p>
                Contact us for product details, compatibility
                questions or purchase assistance.
              </p>
            </div>

            <a
              className="market-button"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              Chat on WhatsApp ↗
            </a>
          </div>
        </section>
      </main>

      <footer className="market-footer">
        <span>
          © {new Date().getFullYear()} {siteConfig.brandName}.
          All rights reserved.
        </span>

        <span>
          Digital source code products ·{' '}
          <a href="#products">Browse collection ↑</a>
        </span>
      </footer>
    </div>
  );
}

export default App;
