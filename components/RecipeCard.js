import Link from 'next/link';

export default function RecipeCard({ recipe }) {
    return (
        <Link href={`/recipes/${recipe.slug}`} className="recipe-card">
            <div className="recipe-card-image">
                {recipe.image ? (
                    <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
                ) : (
                    <span className="recipe-card-emoji">{recipe.emoji || '🍽️'}</span>
                )}
                <span className="recipe-card-badge">{recipe.season}</span>
                <span className="recipe-card-time">⏱️ {recipe.cookTime}</span>
            </div>
            <div className="recipe-card-body">
                <h3 className="recipe-card-title">{recipe.title}</h3>
                <p className="recipe-card-title-en" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>{recipe.titleKo}</p>
                <p className="recipe-card-description">{recipe.description}</p>
                <div className="recipe-card-meta">
                    <span className="recipe-card-meta-item">
                        <span className="icon">👨‍🍳</span> {recipe.difficulty}
                    </span>
                    <span className="recipe-card-meta-item">
                        <span className="icon">🍽️</span> {recipe.servings}
                    </span>
                    <span className="recipe-card-meta-item">
                        <span className="icon">🌿</span> {recipe.mainIngredient}
                    </span>
                </div>
            </div>
        </Link>
    );
}
