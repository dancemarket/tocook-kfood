export const metadata = {
    title: 'About Our Mission | Make K-Food',
    description: 'Welcome to Make K-Food. We are on a mission to share the healthy, seasonal, and deep flavors of Korean home cooking with the world.',
};

export default function AboutPage() {
    return (
        <div className="container" style={{ padding: 'var(--space-4xl) 0', maxWidth: '800px' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-4xl)' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: 'var(--space-md)' }}>🍲</span>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: 'var(--space-md)' }}>
                    Healing with K-Food
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', lineHeight: '1.6' }}>
                    A journey into the heart of Korean seasonal cooking.
                </p>
            </div>

            <section style={{ marginBottom: 'var(--space-4xl)' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-lg)' }}>Our Philosophy: Nature on a Plate</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-md)' }}>
                    In Korea, there is a saying: <strong>"Yaksikdongwon" (藥食同源)</strong>, which means "Medicine and food share the same source." We believe that the best health comes from eating what nature provides in each specific season.
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                    At <strong>Make K-Food</strong>, we document the vibrant cycle of Korea's four seasons. From the tender sprouts of spring to the hearty roots of winter, we bring you traditional recipes that have nourished Korean families for generations.
                </p>
            </section>

            <section style={{ marginBottom: 'var(--space-4xl)', backgroundColor: 'var(--bg-subtle)', padding: 'var(--space-2xl)', borderRadius: 'var(--radius-lg)' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-lg)' }}>Why Seasonal?</h2>
                <ul style={{ fontSize: '1.1rem', lineHeight: '1.8', paddingLeft: '20px' }}>
                    <li><strong>Peak Nutrition:</strong> Ingredients contain the highest concentration of vitamins at their seasonal peak.</li>
                    <li><strong>Sustainability:</strong> Eating seasonally supports local farmers and reduces carbon footprints.</li>
                    <li><strong>Deep Flavor:</strong> There is no substitute for the taste of ingredients gathered at the right moment.</li>
                </ul>
            </section>

            <section>
                <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-lg)' }}>Join Our Community</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                    Whether you are a professional chef or a home cook looking for healthy inspirations, we are here to support your journey. We update our database daily with recipes that match the current month's produce.
                </p>
                <p style={{ marginTop: 'var(--space-xl)', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    Let's explore the delicious world of Korean food together.
                </p>
            </section>
        </div>
    );
}
