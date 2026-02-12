import AdBanner from '@/components/AdBanner';

export const metadata = {
    title: '소개 | About toCook kFood',
    description: 'About toCook kFood - Korean seasonal recipe blog sharing authentic Korean cooking with the world.',
};

export default function AboutPage() {
    return (
        <div className="about-page">
            <div className="container">
                <div className="about-hero">
                    <h1 style={{ marginBottom: 'var(--space-md)' }}>
                        🍲 toCook <span style={{ color: 'var(--color-nature-green)' }}>kFood</span>
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        color: 'var(--text-muted)',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        한국 제철 식재료로 만드는 건강한 요리를 전세계와 공유합니다<br />
                        Sharing healthy Korean cooking with seasonal ingredients worldwide
                    </p>
                </div>

                <div className="about-content">
                    <h2 style={{ marginBottom: 'var(--space-lg)' }}>우리의 이야기 Our Story</h2>
                    <p>
                        <strong>toCook kFood</strong>는 한국의 사계절이 선물하는 신선한 제철 식재료로 만드는
                        요리 레시피를 전세계 사람들과 나누기 위해 시작되었습니다.
                    </p>
                    <p>
                        <strong>toCook kFood</strong> was created to share Korean cooking recipes made with
                        fresh seasonal ingredients gifted by Korea&apos;s four seasons, with people all around the world.
                    </p>
                    <p>
                        한국에는 "제철 음식이 보약이다"라는 말이 있습니다. 계절에 맞는 식재료를 사용하면
                        가장 맛있고, 영양가도 풍부하며, 자연과 조화를 이루는 식사를 할 수 있습니다.
                    </p>
                    <p>
                        In Korea, there&apos;s a saying: &quot;Seasonal food is the best medicine.&quot; Using ingredients
                        in their peak season means the most flavorful, nutritious, and nature-harmonious meals.
                    </p>

                    <h2 style={{ marginBottom: 'var(--space-lg)', marginTop: 'var(--space-3xl)' }}>
                        이런 것들을 공유합니다 What We Share
                    </h2>
                    <p>
                        매일 하나씩 새로운 레시피가 자동으로 등록됩니다. 현재 달의 제철 식재료를 메인으로 하여,
                        전통 한식부터 현대적인 퓨전 요리까지 다양한 레시피를 소개합니다.
                    </p>
                    <p>
                        A new recipe is automatically published every day. Featuring the current month&apos;s seasonal
                        ingredients, we introduce diverse recipes from traditional Korean dishes to modern fusion cuisine.
                    </p>
                </div>

                <div className="about-features">
                    <div className="about-feature">
                        <div className="about-feature-icon">🌿</div>
                        <h4>제철 식재료<br />Seasonal</h4>
                        <p>매월 가장 신선한 제철 재료를 사용한 레시피</p>
                    </div>
                    <div className="about-feature">
                        <div className="about-feature-icon">📅</div>
                        <h4>매일 업데이트<br />Daily Updates</h4>
                        <p>매일 자동으로 새로운 레시피가 등록됩니다</p>
                    </div>
                    <div className="about-feature">
                        <div className="about-feature-icon">🌍</div>
                        <h4>글로벌 공유<br />Global Sharing</h4>
                        <p>한국어와 영어로 전세계와 공유합니다</p>
                    </div>
                </div>

                <AdBanner type="inline" />

                <div className="about-content" style={{ marginTop: 'var(--space-4xl)' }}>
                    <h2 style={{ marginBottom: 'var(--space-lg)' }}>한국의 사계절 Korea&apos;s Four Seasons</h2>
                    <p>
                        🌸 <strong>봄 Spring (3-5월)</strong>: 달래, 냉이, 두릅, 쑥 등 향긋한 봄나물의 계절<br />
                        Fragrant spring greens like wild chive, shepherd&apos;s purse, and mugwort
                    </p>
                    <p>
                        ☀️ <strong>여름 Summer (6-8월)</strong>: 수박, 옥수수, 복숭아와 보양식의 계절<br />
                        Watermelon, corn, peach, and nourishing summer dishes
                    </p>
                    <p>
                        🍂 <strong>가을 Autumn (9-11월)</strong>: 배, 사과, 감, 고구마와 김장의 계절<br />
                        Pear, apple, persimmon, sweet potato, and kimjang season
                    </p>
                    <p>
                        ❄️ <strong>겨울 Winter (12-2월)</strong>: 딸기, 귤, 시래기, 굴과 따뜻한 국물의 계절<br />
                        Strawberry, mandarin, dried greens, oyster, and warm soups
                    </p>
                </div>
            </div>
        </div>
    );
}
