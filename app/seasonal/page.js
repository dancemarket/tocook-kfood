import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import seasonalData from '@/data/seasonal-ingredients.json';

export const metadata = {
    title: '제철 식재료 | Seasonal Ingredients Guide',
    description: '월별 한국 제철 식재료 가이드. Monthly Korean seasonal ingredients guide for cooking.',
};

export default function SeasonalPage() {
    const months = seasonalData.months;
    const seasonGroups = {
        spring: { label: '🌸 봄 Spring', months: ['3', '4', '5'] },
        summer: { label: '☀️ 여름 Summer', months: ['6', '7', '8'] },
        autumn: { label: '🍂 가을 Autumn', months: ['9', '10', '11'] },
        winter: { label: '❄️ 겨울 Winter', months: ['12', '1', '2'] },
    };

    return (
        <div className="seasonal-page">
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-4xl)' }}>
                    <h1>🌿 제철 식재료 가이드</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-md)', fontSize: '1.05rem' }}>
                        Korean Seasonal Ingredients Guide<br />
                        매월 가장 신선하고 맛있는 한국 식재료를 만나보세요
                    </p>
                </div>

                {Object.entries(seasonGroups).map(([seasonKey, season]) => (
                    <div key={seasonKey} id={seasonKey} style={{ marginBottom: 'var(--space-4xl)' }}>
                        <h2 style={{
                            fontSize: '1.8rem',
                            marginBottom: 'var(--space-2xl)',
                            textAlign: 'center',
                            fontFamily: 'var(--font-display)'
                        }}>
                            {season.label}
                        </h2>

                        {season.months.map(monthNum => {
                            const monthData = months[monthNum];
                            if (!monthData) return null;

                            return (
                                <div key={monthNum} className="month-section">
                                    <h3 className="month-title">
                                        <span className="icon">{monthData.icon}</span>
                                        {monthData.name} ({monthData.nameEn})
                                        <span style={{
                                            fontSize: '0.8rem',
                                            color: 'var(--text-muted)',
                                            fontWeight: 400,
                                            marginLeft: 'auto'
                                        }}>
                                            {monthData.season}
                                        </span>
                                    </h3>

                                    <div className="month-ingredients">
                                        {monthData.ingredients.map((item, idx) => (
                                            <Link
                                                href={`/recipes?ingredient=${encodeURIComponent(item.name)}`}
                                                key={idx}
                                                className="seasonal-item"
                                            >
                                                <span className="seasonal-emoji">{item.emoji}</span>
                                                <span className="seasonal-name">{item.name}</span>
                                                <span className="seasonal-name-en">{item.nameEn}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Ad between sections */}
                        <AdBanner type="inline" />
                    </div>
                ))}
            </div>
        </div>
    );
}
