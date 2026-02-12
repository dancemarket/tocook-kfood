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
            🌿 {currentSeasonal?.season || 'Seasonal'} Season
          </div>
          <h1 className="hero-title">
            Discover Korean<br />
            <em>Seasonal</em> Cooking
          </h1>
          <p className="hero-description">
            Fresh, healthy, and delicious Korean recipes updated daily,<br />
            crafted with seasonal ingredients from Korea&apos;s four seasons.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">{totalRecipes}+</span>
              <span className="hero-stat-label">Recipes</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">12</span>
              <span className="hero-stat-label">Seasonal Ingredients</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">365</span>
              <span className="hero-stat-label">Daily Updates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Featured Recipe */}
      {todayRecipe && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Today&apos;s Recipe</h2>
            <p className="section-subtitle">Discover a new Korean seasonal dish every day</p>

            <div className="featured-recipe">
              <div className="featured-image">
                {todayRecipe.image ? (
                  <img src={todayRecipe.image} alt={todayRecipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span className="emoji">{todayRecipe.emoji || '🍽️'}</span>
                )}
              </div>
              <div className="featured-content">
                <span className="featured-tag">⭐ Today&apos;s Pick</span>
                <h2 className="featured-title">{todayRecipe.title}</h2>
                <p className="featured-title-en" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{todayRecipe.titleKo}</p>
                <p className="featured-description">
                  {todayRecipe.description}
                </p>
                <div className="featured-info">
                  <div className="featured-info-item">
                    <div className="featured-info-icon">⏱️</div>
                    <div className="featured-info-value">{todayRecipe.cookTime}</div>
                    <div className="featured-info-label">Cook Time</div>
                  </div>
                  <div className="featured-info-item">
                    <div className="featured-info-icon">👨‍🍳</div>
                    <div className="featured-info-value">{todayRecipe.difficulty}</div>
                    <div className="featured-info-label">Difficulty</div>
                  </div>
                  <div className="featured-info-item">
                    <div className="featured-info-icon">🍽️</div>
                    <div className="featured-info-value">{todayRecipe.servings}</div>
                    <div className="featured-info-label">Servings</div>
                  </div>
                </div>
                <Link href={`/recipes/${todayRecipe.slug}`} className="btn btn-primary">
                  View Recipe →
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
              {currentSeasonal.icon} {currentSeasonal.nameEn} Seasonal Ingredients
            </h2>
            <p className="section-subtitle">
              {currentSeasonal.name}
            </p>

            <div className="seasonal-grid">
              {currentSeasonal.ingredients.map((item, idx) => (
                <Link href={`/recipes?ingredient=${encodeURIComponent(item.name)}`} key={idx} className="seasonal-item">
                  <span className="seasonal-emoji">{item.emoji}</span>
                  <span className="seasonal-name">{item.nameEn}</span>
                  <span className="seasonal-name-en">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Recipes */}
      <section className="section" style={{ background: 'var(--color-snow)' }}>
        <div className="container">
          <h2 className="section-title">Recent Recipes</h2>
          <p className="section-subtitle">Fresh Korean dishes crafted with seasonal ingredients</p>

          <div className="recipes-grid">
            {recentRecipes.map((recipe, idx) => (
              <RecipeCard key={recipe.slug} recipe={recipe} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}>
            <Link href="/recipes" className="btn btn-primary">
              View All Recipes →
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
