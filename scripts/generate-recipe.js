const fs = require('fs');
const path = require('path');

// Paths
const poolPath = path.join(__dirname, '..', 'data', 'recipe-pool.json');
const recipesDir = path.join(__dirname, '..', 'content', 'recipes');

// Ensure recipes directory exists
if (!fs.existsSync(recipesDir)) {
    fs.mkdirSync(recipesDir, { recursive: true });
}

// Read recipe pool
const pool = JSON.parse(fs.readFileSync(poolPath, 'utf8'));

// Find the first unpublished recipe
const unpublished = pool.find(recipe => !recipe.published);

if (!unpublished) {
    console.log('✅ No unpublished recipes remaining in the pool.');
    process.exit(0);
}

// Set today's date
const today = new Date();
const dateStr = today.toISOString().split('T')[0]; // e.g., 2026-02-13
const slug = `${dateStr}-${unpublished.slug}`;

// Build the markdown frontmatter
const ingredients = unpublished.ingredients.map(i =>
    `  - name: "${i.name}"\n    amount: "${i.amount}"`
).join('\n');

const steps = unpublished.steps.map(s =>
    `  - "${s.step}"`
).join('\n');

const tags = JSON.stringify(unpublished.tags);

const markdown = `---
title: "${unpublished.title}"
titleKo: "${unpublished.titleKo}"
date: "${dateStr}"
emoji: "${unpublished.emoji}"
description: "${unpublished.description}"
descriptionKo: "${unpublished.descriptionKo}"
mainIngredient: "${unpublished.mainIngredient}"
season: "${unpublished.season}"
cookTime: "${unpublished.cookTime}"
difficulty: "${unpublished.difficulty}"
servings: "${unpublished.servings}"
tags: ${tags}
ingredients:
${ingredients}
steps:
${steps}
nutrition:
  calories: "${unpublished.nutrition.calories}"
  protein: "${unpublished.nutrition.protein}"
  carbs: "${unpublished.nutrition.carbs}"
  fat: "${unpublished.nutrition.fat}"
tip: "${unpublished.tip}"
---

## ${unpublished.titleKo} | ${unpublished.title}

${unpublished.descriptionKo}

${unpublished.description}
`;

// Write the markdown file
const filePath = path.join(recipesDir, `${slug}.md`);
fs.writeFileSync(filePath, markdown, 'utf8');

// Mark as published in the pool
unpublished.published = true;
unpublished.publishDate = dateStr;
unpublished.slug = slug;
fs.writeFileSync(poolPath, JSON.stringify(pool, null, 2), 'utf8');

console.log(`🎉 Published new recipe: ${unpublished.titleKo} (${unpublished.title})`);
console.log(`📄 File: ${filePath}`);
console.log(`📅 Date: ${dateStr}`);
