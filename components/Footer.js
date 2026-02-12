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
                            한국 제철 식재료로 만드는 건강한 요리 레시피를 매일 공유합니다.
                            Sharing healthy Korean recipes with seasonal ingredients daily.
                        </p>
                    </div>

                    <div>
                        <h4 className="footer-title">Explore</h4>
                        <div className="footer-links">
                            <Link href="/recipes" className="footer-link">📖 레시피 Recipes</Link>
                            <Link href="/seasonal" className="footer-link">🌿 제철 식재료 Seasonal</Link>
                            <Link href="/about" className="footer-link">💬 소개 About</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-title">Seasons</h4>
                        <div className="footer-links">
                            <Link href="/seasonal#spring" className="footer-link">🌸 봄 Spring</Link>
                            <Link href="/seasonal#summer" className="footer-link">☀️ 여름 Summer</Link>
                            <Link href="/seasonal#autumn" className="footer-link">🍂 가을 Autumn</Link>
                            <Link href="/seasonal#winter" className="footer-link">❄️ 겨울 Winter</Link>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {currentYear} Make K-Food. All rights reserved. 매일 새로운 한국 제철 레시피 🇰🇷</p>
                </div>
            </div>
        </footer>
    );
}
