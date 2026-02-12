import Link from 'next/link';

export default function RecipeCard({ recipe }) {
    return (
        <Link href={`/recipes/${recipe.slug}`} className="recipe-card">
            <div className="recipe-card-image">
                <span className="recipe-card-emoji">{recipe.emoji || '🍽️'}</span>
                <span className="recipe-card-badge">{recipe.season}</span>
                <span className="recipe-card-time">⏱️ {recipe.cookTime}</span>
            </div>
            <div className="recipe-card-body">
                <h3 className="recipe-card-title">{recipe.titleKo}</h3>
                <p className="recipe-card-title-en">{recipe.title}</p>
                <p className="recipe-card-description">{recipe.descriptionKo || recipe.description}</p>
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
