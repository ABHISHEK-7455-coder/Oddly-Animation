// Footer.jsx
import React from "react";
import "./Footer.css";


export default function Footer() {
    return (
        <footer className="os-footer">
            <div className="os-footer__inner">
                <div className="os-footer__brand">
                    <div className="os-logo" aria-hidden>
                        {/* simple pleasant logo mark */}
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.12" />
                            <path d="M7 12c1.5-3 4.5-4 7-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>


                    <div>
                        <h3 className="os-footer__title">MeloMotion</h3>
                        <p className="os-footer__tag">Tiny joys. Big feelings.</p>
                    </div>
                </div>


                <nav className="os-footer__nav" aria-label="Footer navigation">
                    <div className="os-footer__col">
                        <h4 className="os-footer__colTitle">Product</h4>
                        <ul>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#pricing">Pricing</a></li>
                            <li><a href="#download">Download</a></li>
                        </ul>
                    </div>


                    <div className="os-footer__col">
                        <h4 className="os-footer__colTitle">Company</h4>
                        <ul>
                            <li><a href="#about">About</a></li>
                            <li><a href="#careers">Careers</a></li>
                            <li><a href="#press">Press</a></li>
                        </ul>
                    </div>


                    <div className="os-footer__col">
                        <h4 className="os-footer__colTitle">Support</h4>
                        <ul>
                            <li><a href="#help">Help Center</a></li>
                            <li><a href="#privacy">Privacy</a></li>
                            <li><a href="#terms">Terms</a></li>
                        </ul>
                    </div>


                    <div className="os-footer__subscribe">
                        <h4 className="os-footer__colTitle">Stay in the loop</h4>
                        <p className="os-footer__subscribeText">Get tiny delights and product updates — no spam.</p>
                        <form className="os-subscribeForm" onSubmit={(e) => e.preventDefault()}>
                            <label htmlFor="os-email" className="sr-only">Email address</label>
                            <input id="os-email" name="email" type="email" placeholder="your@email.com" required />
                            <button className="os-btn" aria-label="Subscribe">Subscribe</button>
                        </form>
                    </div>
                </nav>
            </div>


            <div className="os-footer__bar">
                <p>© {new Date().getFullYear()} MeloMotions — Made with care ✨</p>
                <div className="os-footer__social" aria-hidden>
                    <a href="#" className="os-social"><span className="sr-only">Twitter</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 7.5c-.6.3-1.3.5-2 .6.7-.4 1.2-1.2 1.4-2-.7.4-1.6.7-2.5.9C16.8 6 15.6 5.5 14.3 5.5c-2.3 0-4.1 1.9-4.1 4.2 0 .3 0 .6.1.9-3.4-.2-6.4-1.8-8.4-4.4-.4.8-.6 1.7-.6 2.6 0 1.4.7 2.6 1.8 3.3-.6 0-1.1-.2-1.6-.4v.1c0 2.1 1.5 3.9 3.5 4.3-.4.1-.9.2-1.3.2-.3 0-.6 0-.9-.1.6 1.8 2.3 3.1 4.3 3.1-1.6 1.3-3.6 2-5.8 2-.4 0-.8 0-1.1-.1 2.1 1.4 4.6 2.2 7.2 2.2 8.6 0 13.3-7.3 13.3-13.7v-.6c.9-.6 1.6-1.3 2.2-2.1-.8.4-1.7.6-2.6.7z" fill="currentColor" /></svg>
                    </a>
                    <a href="#" className="os-social"><span className="sr-only">Instagram</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.2" /><path d="M16 11.8c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="17.7" cy="6.3" r="0.6" fill="currentColor" /></svg>
                    </a>
                    <a href="#" className="os-social"><span className="sr-only">Dribbble</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" /><path d="M4.8 10.7c3 1.1 6.4 1.6 9.5 1.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}