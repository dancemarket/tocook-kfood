import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const recipesDirectory = path.join(process.cwd(), 'content', 'recipes');

export function getAllRecipes() {
    if (!fs.existsSync(recipesDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(recipesDirectory).filter(f => f.endsWith('.md'));

    const allRecipes = fileNames.map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(recipesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
            slug,
            ...data,
        };
    });

    // Sort by date descending
    return allRecipes.sort((a, b) => {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return 0;
    });
}

export function getRecipesByMonth(month) {
    const allRecipes = getAllRecipes();
    return allRecipes.filter(recipe => {
        const recipeMonth = new Date(recipe.date).getMonth() + 1;
        return recipeMonth === month;
    });
}

export function getRecipesByIngredient(ingredient) {
    const allRecipes = getAllRecipes();
    return allRecipes.filter(recipe =>
        recipe.mainIngredient?.toLowerCase().includes(ingredient.toLowerCase()) ||
        recipe.tags?.some(tag => tag.toLowerCase().includes(ingredient.toLowerCase()))
    );
}

export function getAllRecipeSlugs() {
    if (!fs.existsSync(recipesDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(recipesDirectory).filter(f => f.endsWith('.md'));
    return fileNames.map((fileName) => ({
        slug: fileName.replace(/\.md$/, ''),
    }));
}

export async function getRecipeBySlug(slug) {
    const fullPath = path.join(recipesDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const processedContent = await remark()
        .use(html)
        .process(content);
    const contentHtml = processedContent.toString();

    return {
        slug,
        contentHtml,
        ...data,
    };
}

export function getRecentRecipes(count = 6) {
    const allRecipes = getAllRecipes();
    return allRecipes.slice(0, count);
}

export function getRelatedRecipes(currentSlug, mainIngredient, count = 3) {
    const allRecipes = getAllRecipes();
    return allRecipes
        .filter(r => r.slug !== currentSlug)
        .filter(r => r.mainIngredient === mainIngredient || r.season === mainIngredient)
        .slice(0, count);
}
