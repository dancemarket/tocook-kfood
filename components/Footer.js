import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            🍲 Make K-Food
                        </div>
                        <p className="footer-description">
                            Sharing healthy Korean recipes with seasonal ingredients, updated daily.
                        </p>
                    </div>

                    <div>
                        <h4 className="footer-title">Explore</h4>
                        <div className="footer-links">
                            <Link href="/recipes" className="footer-link">📖 Recipes</Link>
                            <Link href="/seasonal" className="footer-link">🌿 Seasonal Guide</Link>
                            <Link href="/about" className="footer-link">💬 About</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-title">Seasons</h4>
                        <div className="footer-links">
                            <Link href="/seasonal#spring" className="footer-link">🌸 Spring</Link>
                            <Link href="/seasonal#summer" className="footer-link">☀️ Summer</Link>
                            <Link href="/seasonal#autumn" className="footer-link">🍂 Autumn</Link>
                            <Link href="/seasonal#winter" className="footer-link">❄️ Winter</Link>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {currentYear} Make K-Food. All rights reserved. Authentic Korean recipes daily 🇰🇷</p>
                </div>
            </div>
        </footer>
    );
}
