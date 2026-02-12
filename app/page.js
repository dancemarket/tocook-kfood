import Link from 'next/link';
import RecipeCard from '@/components/RecipeCard';
import AdBanner from '@/components/AdBanner';
import { getRecentRecipes, getAllRecipes } from '@/lib/recipes';
import seasonalData from '@/data/seasonal-ingredients.json';

export default function Home() {
  const recentRecipes = getRecentRecipes(6);
  const todayRecipe = recentRecipes[0];
  const currentMonth = new Date().getMonth() + 1;
  const currentSeasonal = seasonalData.months[String(currentMonth)];
  const totalRecipes = getAllRecipes().length;

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-badge">
            🌿 {currentSeasonal?.season || '제철 식재료'} Season
          </div>
          <h1 className="hero-title">
            Discover Korean<br />
            <em>Seasonal</em> Cooking
          </h1>
          <p className="hero-description">
            한국 제철 식재료로 만드는 건강하고 맛있는 요리 레시피를 매일 공유합니다.<br />
            Fresh, healthy, and delicious Korean recipes updated daily.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">{totalRecipes}+</span>
              <span className="hero-stat-label">레시피 Recipes</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">12</span>
              <span className="hero-stat-label">제철 식재료 Seasonal</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">365</span>
              <span className="hero-stat-label">매일 업데이트 Daily</span>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Featured Recipe */}
      {todayRecipe && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">오늘의 레시피 Today&apos;s Recipe</h2>
            <p className="section-subtitle">매일 새로운 한국 제철 레시피를 만나보세요</p>

            <div className="featured-recipe">
              <div className="featured-image">
                <span className="emoji">{todayRecipe.emoji || '🍽️'}</span>
              </div>
              <div className="featured-content">
                <span className="featured-tag">⭐ 오늘의 레시피 Today&apos;s Pick</span>
                <h2 className="featured-title">{todayRecipe.titleKo}</h2>
                <p className="featured-title-en">{todayRecipe.title}</p>
                <p className="featured-description">
                  {todayRecipe.descriptionKo || todayRecipe.description}
                </p>
                <div className="featured-info">
                  <div className="featured-info-item">
                    <div className="featured-info-icon">⏱️</div>
                    <div className="featured-info-value">{todayRecipe.cookTime}</div>
                    <div className="featured-info-label">조리시간</div>
                  </div>
                  <div className="featured-info-item">
                    <div className="featured-info-icon">👨‍🍳</div>
                    <div className="featured-info-value">{todayRecipe.difficulty}</div>
                    <div className="featured-info-label">난이도</div>
                  </div>
                  <div className="featured-info-item">
                    <div className="featured-info-icon">🍽️</div>
                    <div className="featured-info-value">{todayRecipe.servings}</div>
                    <div className="featured-info-label">인분</div>
                  </div>
                </div>
                <Link href={`/recipes/${todayRecipe.slug}`} className="btn btn-primary">
                  레시피 보기 View Recipe →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Ad Banner */}
      <div className="container">
        <AdBanner type="large" />
      </div>

      {/* Seasonal Ingredients */}
      {currentSeasonal && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">
              {currentSeasonal.icon} {currentSeasonal.name} 제철 식재료
            </h2>
            <p className="section-subtitle">
              {currentSeasonal.nameEn} Seasonal Ingredients
            </p>

            <div className="seasonal-grid">
              {currentSeasonal.ingredients.map((item, idx) => (
                <Link href={`/recipes?ingredient=${encodeURIComponent(item.name)}`} key={idx} className="seasonal-item">
                  <span className="seasonal-emoji">{item.emoji}</span>
                  <span className="seasonal-name">{item.name}</span>
                  <span className="seasonal-name-en">{item.nameEn}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Recipes */}
      <section className="section" style={{ background: 'var(--color-snow)' }}>
        <div className="container">
          <h2 className="section-title">최근 레시피 Recent Recipes</h2>
          <p className="section-subtitle">매일 새로운 한국 제철 요리를 만나보세요</p>

          <div className="recipes-grid">
            {recentRecipes.map((recipe, idx) => (
              <RecipeCard key={recipe.slug} recipe={recipe} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}>
            <Link href="/recipes" className="btn btn-primary">
              모든 레시피 보기 View All Recipes →
            </Link>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="container">
        <AdBanner type="inline" />
      </div>
    </>
  );
}
