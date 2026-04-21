with open('static/css/style.css', 'a', encoding='utf-8') as f:
    f.write('''
/* ==========================================
   🏆 ELITE NEURAL FOOTER (AESTHETIC V3)
   ========================================== */
.site-footer {
    position: relative !important;
    background: radial-gradient(circle at 50% 0%, rgba(79, 70, 229, 0.1) 0%, transparent 70%),
                linear-gradient(180deg, #020617 0%, #080d1a 100%) !important;
    border-top: 1px solid rgba(99, 102, 241, 0.2) !important;
    padding: 80px 5% 40px !important;
    margin-top: 100px !important;
    overflow: hidden;
    color: #e2e8f0;
}

.footer-glow {
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--primary), var(--secondary), transparent);
    box-shadow: 0 0 20px 2px var(--primary-glow);
    z-index: 1;
}

.footer-content {
    display: grid !important;
    grid-template-columns: 2fr 1fr 1fr 1.5fr !important;
    gap: 40px !important;
    max-width: 1400px !important;
    margin: 0 auto !important;
    position: relative !important;
    z-index: 2 !important;
    text-align: left !important;
}

@media (max-width: 992px) {
    .footer-content {
        grid-template-columns: 1fr 1fr !important;
    }
}
@media (max-width: 600px) {
    .footer-content {
        grid-template-columns: 1fr !important;
        text-align: center !important;
    }
}

.footer-brand .logo {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 20px;
}

.footer-brand p {
    color: #94a3b8;
    line-height: 1.6;
    margin-bottom: 30px;
    font-size: 0.95rem;
}

.footer-content .social-icons {
    display: flex !important;
    gap: 15px !important;
}
@media (max-width: 600px) {
    .footer-content .social-icons {
        justify-content: center !important;
    }
}

.footer-content .social-icon {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    color: white;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.footer-content .social-icon::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(45deg, var(--primary), var(--secondary));
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 0;
}

.footer-content .social-icon:hover {
    transform: translateY(-5px);
    border-color: transparent;
    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
}

.footer-content .social-icon:hover::before { opacity: 1; }

.footer-content .social-icon * {
    z-index: 1;
    position: relative;
}

.footer-section h4 {
    color: white;
    font-size: 1.2rem;
    margin-bottom: 25px;
    position: relative;
    display: inline-block;
}

.footer-section h4::after {
    content: '';
    position: absolute;
    bottom: -8px; left: 0;
    width: 40%;
    height: 2px;
    background: var(--secondary);
    border-radius: 2px;
}
@media (max-width: 600px) {
    .footer-section h4::after {
        left: 30%;
    }
}

.footer-links {
    list-style: none !important;
    padding: 0 !important;
    margin: 0 !important;
    display: block !important;
}

.footer-links li {
    margin-bottom: 12px !important;
}

.footer-links a {
    color: #94a3b8 !important;
    text-decoration: none;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
}

.footer-links a::before {
    content: '>';
    font-size: 0.7rem;
    color: var(--secondary);
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s ease;
    margin-right: 8px;
}

.footer-links a:hover {
    color: var(--primary) !important;
    transform: translateX(5px);
}

.footer-links a:hover::before {
    opacity: 1;
    transform: translateX(0);
}

.newsletter-form {
    display: flex;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 30px;
    padding: 5px;
    position: relative;
    overflow: hidden;
}

.newsletter-form:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
}

.neon-input {
    flex: 1;
    background: transparent;
    border: none;
    padding: 10px 20px;
    color: white;
    outline: none;
    font-family: inherit;
}

.btn-neon {
    background: linear-gradient(45deg, var(--primary), var(--secondary));
    border: none;
    padding: 10px 25px;
    border-radius: 25px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-neon:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px var(--primary-glow);
}

/* Ticker Ribbon */
.footer-ticker {
    margin-top: 60px !important;
    border-top: 1px solid rgba(255,255,255,0.05) !important;
    border-bottom: 1px solid rgba(255,255,255,0.05) !important;
    background: rgba(0,0,0,0.5) !important;
    padding: 15px 0 !important;
    width: 100% !important;
    overflow: hidden !important;
    position: relative !important;
    white-space: nowrap !important;
    display: block !important;
}

.ticker-wrap {
    display: inline-block;
    padding-left: 100%;
    animation: ticker 30s linear infinite;
}

@keyframes ticker {
    0% { transform: translate3d(0, 0, 0); }
    100% { transform: translate3d(-100%, 0, 0); }
}

.ticker-item {
    display: inline-block;
    padding: 0 40px;
    font-family: "Courier New", Courier, monospace;
    font-size: 0.85rem;
    color: #4ade80;
    letter-spacing: 2px;
}

.status-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    margin-right: 8px;
    box-shadow: 0 0 8px #10b981;
}

.status-dot.blinking {
    animation: blink 1s infinite alternate;
}

@keyframes blink {
    0% { opacity: 1; }
    100% { opacity: 0.3; }
}

/* Footer Bottom */
.footer-bottom {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    margin-top: 40px !important;
    padding-top: 20px !important;
    border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
    font-size: 0.85rem;
    color: #64748b;
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
}

@media (max-width: 768px) {
    .footer-bottom {
        flex-direction: column !important;
        gap: 20px !important;
        text-align: center;
    }
}

.cert-badges {
    display: flex;
    gap: 15px;
}

.cert-badge {
    padding: 5px 12px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    font-size: 0.75rem;
    letter-spacing: 1px;
    color: #94a3b8;
    transition: all 0.3s ease;
}

.cert-badge:hover {
    border-color: var(--secondary);
    color: var(--secondary);
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
}

/* Staggered Animations */
.fade-up {
    opacity: 0;
    transform: translateY(30px);
    animation: fadeUp 0.8s forwards;
}

.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.4s; }
.delay-3 { animation-delay: 0.6s; }
.delay-4 { animation-delay: 0.8s; }

@keyframes fadeUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
''')
