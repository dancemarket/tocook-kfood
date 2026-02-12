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
                    <Link href="/" className="nav-link">Home</Link>
                    <Link href="/recipes" className="nav-link">Recipes</Link>
                    <Link href="/seasonal" className="nav-link">Seasonal</Link>
                    <Link href="/about" className="nav-link">About</Link>
                </nav>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Open menu"
                >
                    {mobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            <div className={`mobile-nav ${mobileMenuOpen ? 'active' : ''}`}>
                <Link href="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>🏠 Home</Link>
                <Link href="/recipes" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>📖 Recipes</Link>
                <Link href="/seasonal" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>🌿 Seasonal</Link>
                <Link href="/about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>💬 About</Link>
            </div>
        </header>
    );
}
