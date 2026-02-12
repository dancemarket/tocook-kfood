import { getAllRecipes } from '@/lib/recipes';

export default function sitemap() {
    const recipes = getAllRecipes();
    const baseUrl = 'https://tocook-kfood.vercel.app';

    const recipeUrls = recipes.map(recipe => ({
        url: `${baseUrl}/recipes/${recipe.slug}`,
        lastModified: new Date(recipe.date),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/recipes`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/seasonal`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...recipeUrls,
    ];
}
