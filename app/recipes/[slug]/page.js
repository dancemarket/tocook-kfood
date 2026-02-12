import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import RecipeCard from '@/components/RecipeCard';
import { getRecipeBySlug, getAllRecipeSlugs, getRelatedRecipes } from '@/lib/recipes';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const slugs = getAllRecipeSlugs();
    return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const recipe = await getRecipeBySlug(slug);
    if (!recipe) return {};

    return {
        title: `${recipe.title} | ${recipe.titleKo}`,
        description: recipe.description,
        openGraph: {
            title: `${recipe.title} — ${recipe.titleKo}`,
            description: recipe.description,
            type: 'article',
        },
    };
}

export default async function RecipeDetailPage({ params }) {
    const { slug } = await params;
    const recipe = await getRecipeBySlug(slug);

    if (!recipe) {
        notFound();
    }

    const relatedRecipes = getRelatedRecipes(slug, recipe.mainIngredient, 3);

    // Schema.org structured data for recipes
    const recipeSchema = {
        '@context': 'https://schema.org/',
        '@type': 'Recipe',
        name: recipe.title,
        description: recipe.description,
        datePublished: recipe.date,
        prepTime: `PT${parseInt(recipe.cookTime)}M`,
        cookTime: `PT${parseInt(recipe.cookTime)}M`,
        recipeYield: recipe.servings,
        recipeCategory: 'Korean Food',
        recipeCuisine: 'Korean',
        keywords: recipe.tags?.join(', '),
        recipeIngredient: recipe.ingredients?.map(i => `${i.name} ${i.amount}`),
        recipeInstructions: recipe.steps?.map((step, idx) => ({
            '@type': 'HowToStep',
            position: idx + 1,
            text: step,
        })),
        nutrition: recipe.nutrition ? {
            '@type': 'NutritionInformation',
            calories: recipe.nutrition.calories,
            proteinContent: recipe.nutrition.protein,
            carbohydrateContent: recipe.nutrition.carbs,
            fatContent: recipe.nutrition.fat,
        } : undefined,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
            />

            <article className="recipe-detail">
                <div className="container">
                    {/* Header */}
                    <div className="recipe-detail-header">
                        <span className="recipe-detail-badge">🌿 {recipe.season} · {recipe.mainIngredient}</span>
                        <h1 className="recipe-detail-title">{recipe.title}</h1>
                        <p className="recipe-detail-title-en" style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>{recipe.titleKo}</p>
                        <div className="recipe-detail-meta">
                            <span className="recipe-detail-meta-item">⏱️ {recipe.cookTime}</span>
                            <span className="recipe-detail-meta-item">👨‍🍳 {recipe.difficulty}</span>
                            <span className="recipe-detail-meta-item">🍽️ {recipe.servings}</span>
                            <span className="recipe-detail-meta-item">📅 {recipe.date}</span>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="recipe-detail-hero">
                        {recipe.image ? (
                            <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-xl)' }} />
                        ) : (
                            <span className="emoji">{recipe.emoji || '🍽️'}</span>
                        )}
                    </div>

                    {/* Ad Banner */}
                    <AdBanner type="inline" />

                    {/* Content Grid */}
                    <div className="recipe-detail-content">
                        {/* Sidebar */}
                        <aside className="recipe-sidebar">
                            {/* Ingredients */}
                            <div className="ingredients-card">
                                <h3 className="ingredients-title">🥘 Ingredients</h3>
                                {recipe.ingredients?.map((item, idx) => (
                                    <div key={idx} className="ingredient-item">
                                        <span className="ingredient-name">{item.name}</span>
                                        <span className="ingredient-amount">{item.amount}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Nutrition */}
                            {recipe.nutrition && (
                                <div className="nutrition-card">
                                    <h3 className="nutrition-title">📊 Nutrition</h3>
                                    <div className="nutrition-item">
                                        <span>Calories</span>
                                        <span>{recipe.nutrition.calories}</span>
                                    </div>
                                    <div className="nutrition-item">
                                        <span>Protein</span>
                                        <span>{recipe.nutrition.protein}</span>
                                    </div>
                                    <div className="nutrition-item">
                                        <span>Carbs</span>
                                        <span>{recipe.nutrition.carbs}</span>
                                    </div>
                                    <div className="nutrition-item">
                                        <span>Fat</span>
                                        <span>{recipe.nutrition.fat}</span>
                                    </div>
                                </div>
                            )}

                            {/* Ad */}
                            <AdBanner type="sidebar" />
                        </aside>

                        {/* Steps */}
                        <div className="steps-section">
                            <h3>📝 Cooking Steps</h3>
                            {recipe.steps?.map((step, idx) => (
                                <div key={idx} className="step-item">
                                    <span className="step-number">{idx + 1}</span>
                                    <div className="step-content">
                                        <p>{step}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Tip */}
                            {recipe.tip && (
                                <div className="step-tip" style={{ marginTop: 'var(--space-xl)' }}>
                                    <span>💡</span>
                                    <p>{recipe.tip}</p>
                                </div>
                            )}

                            {/* Markdown Content */}
                            {recipe.contentHtml && (
                                <div
                                    style={{ marginTop: 'var(--space-2xl)', lineHeight: 1.8 }}
                                    dangerouslySetInnerHTML={{ __html: recipe.contentHtml }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Ad Banner */}
                    <AdBanner type="large" />

                    {/* Related Recipes */}
                    {relatedRecipes.length > 0 && (
                        <section style={{ marginTop: 'var(--space-4xl)' }}>
                            <h2 className="section-title">Related Recipes</h2>
                            <p className="section-subtitle">More dishes with similar ingredients</p>
                            <div className="recipes-grid">
                                {relatedRecipes.map(r => (
                                    <RecipeCard key={r.slug} recipe={r} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Back to recipes */}
                    <div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}>
                        <Link href="/recipes" className="btn btn-secondary">
                            ← Back to Recipes
                        </Link>
                    </div>
                </div>
            </article>
        </>
    );
}
