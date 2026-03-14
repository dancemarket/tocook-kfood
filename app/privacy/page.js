import Link from 'next/link';

export const metadata = {
    title: 'Privacy Policy | Make K-Food',
    description: 'Privacy Policy for Make K-Food. Learn how we handle your data and our use of cookies and advertisements.',
};

export default function PrivacyPage() {
    return (
        <div className="container" style={{ padding: 'var(--space-4xl) 0', maxWidth: '800px' }}>
            <h1 style={{ marginBottom: 'var(--space-xl)' }}>Privacy Policy</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-2xl)' }}>Last Updated: March 14, 2026</p>

            <section style={{ marginBottom: 'var(--space-3xl)' }}>
                <h2>1. Introduction</h2>
                <p>Welcome to Make K-Food (https://make-k-food.vercel.app). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>
            </section>

            <section style={{ marginBottom: 'var(--space-3xl)' }}>
                <h2>2. Information We Collect</h2>
                <p>We do not require users to register or provide personal information to browse our recipes. However, like most websites, we automatically collect certain information when you visit, such as your IP address, browser type, and operating system, through cookies and similar technologies.</p>
            </section>

            <section style={{ marginBottom: 'var(--space-3xl)' }}>
                <h2>3. Google AdSense and Cookies</h2>
                <p>We use Google AdSense to serve ads on our website. Google, as a third-party vendor, uses cookies to serve ads based on your prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our sites and/or other sites on the Internet.</p>
                <p>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Ads Settings</a>.</p>
            </section>

            <section style={{ marginBottom: 'var(--space-3xl)' }}>
                <h2>4. Data Security</h2>
                <p>We use reasonable administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>
            </section>

            <section style={{ marginBottom: 'var(--space-3xl)' }}>
                <h2>5. Contact Us</h2>
                <p>If you have questions or comments about this Privacy Policy, please contact us through our GitHub repository or official channels.</p>
            </section>

            <Link href="/" className="btn btn-primary">Back to Home</Link>
        </div>
    );
}
