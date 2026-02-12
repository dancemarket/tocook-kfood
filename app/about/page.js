import AdBanner from '@/components/AdBanner';

export const metadata = {
    title: 'About | Make K-Food',
    description: 'About Make K-Food - A Korean seasonal recipe blog sharing authentic Korean cooking with the world.',
};

export default function AboutPage() {
    return (
        <div className="about-page">
            <div className="container">
                <div className="about-hero">
                    <h1 style={{ marginBottom: 'var(--space-md)' }}>
                        🍲 Make <span style={{ color: 'var(--color-nature-green)' }}>K-Food</span>
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        color: 'var(--text-muted)',
                        maxWidth: '600px',
                        margin: '0 auto',
                    }}>
                        Authentic Korean Recipes with Seasonal Ingredients
                    </p>
                </div>

                <div className="about-content">
                    <h2 style={{ marginBottom: 'var(--space-lg)' }}>Our Story</h2>
                    <p>
                        <strong>Make K-Food</strong> was created to share Korean cooking recipes made with
                        fresh seasonal ingredients gifted by Korea&apos;s four seasons, with people all around the world.
                    </p>
                    <p>
                        Korean cuisine is deeply connected to nature&apos;s rhythms. Each season brings unique ingredients
                        that are at their peak of freshness and flavor. We believe the best Korean dishes start with
                        the right seasonal produce.
                    </p>
                    <p>
                        Every day, we publish a new recipe featuring a seasonal ingredient, complete with
                        step-by-step instructions, nutritional information, and cooking tips.
                    </p>
                </div>

                <AdBanner type="inline" />

                <div className="about-features" style={{ marginTop: 'var(--space-3xl)' }}>
                    <h2 style={{ marginBottom: 'var(--space-2xl)', textAlign: 'center' }}>What We Offer</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <span className="feature-icon">📅</span>
                            <h3>Daily Updates</h3>
                            <p>A new seasonal Korean recipe every single day</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">🌿</span>
                            <h3>Seasonal Focus</h3>
                            <p>Recipes crafted around Korea&apos;s freshest seasonal produce</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">🌍</span>
                            <h3>Global Friendly</h3>
                            <p>Bilingual recipes accessible to Korean food lovers worldwide</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">📊</span>
                            <h3>Nutrition Info</h3>
                            <p>Detailed nutritional information for every recipe</p>
                        </div>
                    </div>
                </div>

                <div className="about-seasons" style={{ marginTop: 'var(--space-3xl)' }}>
                    <h2 style={{ marginBottom: 'var(--space-2xl)', textAlign: 'center' }}>Korean Seasons</h2>
                    <div className="seasons-grid">
                        <div className="season-card">
                            <h3>🌸 Spring</h3>
                            <p>Wild herbs, fresh greens, and the first catch of the season</p>
                        </div>
                        <div className="season-card">
                            <h3>☀️ Summer</h3>
                            <p>Refreshing fruits, vibrant vegetables, and cooling dishes</p>
                        </div>
                        <div className="season-card">
                            <h3>🍂 Autumn</h3>
                            <p>Rich mushrooms, harvest grains, and warming comfort food</p>
                        </div>
                        <div className="season-card">
                            <h3>❄️ Winter</h3>
                            <p>Hearty stews, preserved ingredients, and nourishing soups</p>
                        </div>
                    </div>
                </div>

                <AdBanner type="large" />
            </div>
        </div>
    );
}
