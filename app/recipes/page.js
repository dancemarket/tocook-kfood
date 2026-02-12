import Link from 'next/link';
import RecipeCard from '@/components/RecipeCard';
import AdBanner from '@/components/AdBanner';
import { getAllRecipes } from '@/lib/recipes';

export const metadata = {
    title: 'All Recipes | Korean Seasonal Dishes',
    description: 'Browse all Korean seasonal recipes. Authentic Korean dishes made with fresh seasonal ingredients, updated daily.',
};

export default function RecipesPage() {
    const allRecipes = getAllRecipes();

    // Get unique seasons for filtering
    const seasons = [...new Set(allRecipes.map(r => r.season))];

    return (
        <>
            <div className="recipe-list-header">
                <div className="container">
                    <h1>📖 All Recipes</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-md)' }}>
                        {allRecipes.length} authentic Korean recipes with seasonal ingredients
                    </p>

                    <div className="filter-bar">
                        <span className="filter-btn active">All</span>
                        {seasons.map((season, idx) => (
                            <span key={idx} className="filter-btn">{season}</span>
                        ))}
                    </div>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    {/* Ad Banner */}
                    <AdBanner type="inline" />

                    <div className="recipes-grid" style={{ marginTop: 'var(--space-xl)' }}>
                        {allRecipes.map((recipe, idx) => (
                            <div key={recipe.slug}>
                                <RecipeCard recipe={recipe} />
                                {/* Insert ad every 6 recipes */}
                                {(idx + 1) % 6 === 0 && idx < allRecipes.length - 1 && (
                                    <div style={{ gridColumn: '1 / -1', marginTop: 'var(--space-xl)' }}>
                                        <AdBanner type="inline" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
