'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`} style={scrolled ? { boxShadow: '0 4px 20px rgba(0,0,0,0.08)' } : {}}>
            <div className="header-inner">
                <Link href="/" className="logo">
                    <span className="logo-icon">🍲</span>
                    <span className="logo-text">Make <span>K-Food</span></span>
                </Link>

                <nav className="nav">
                    <Link href="/" className="nav-link">홈 Home</Link>
                    <Link href="/recipes" className="nav-link">레시피 Recipes</Link>
                    <Link href="/seasonal" className="nav-link">제철 식재료 Seasonal</Link>
                    <Link href="/about" className="nav-link">소개 About</Link>
                </nav>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="메뉴 열기"
                >
                    {mobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            <div className={`mobile-nav ${mobileMenuOpen ? 'active' : ''}`}>
                <Link href="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>🏠 홈 Home</Link>
                <Link href="/recipes" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>📖 레시피 Recipes</Link>
                <Link href="/seasonal" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>🌿 제철 식재료 Seasonal</Link>
                <Link href="/about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>💬 소개 About</Link>
            </div>
        </header>
    );
}
