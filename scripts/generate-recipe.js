const fs = require('fs');
const path = require('path');

// ============================================================
// Make K-Food — Infinite Recipe Generator
// Combines seasonal ingredients + cooking method templates
// to create unique recipes every day, forever.
// ============================================================

const recipesDir = path.join(__dirname, '..', 'content', 'recipes');
const poolPath = path.join(__dirname, '..', 'data', 'recipe-pool.json');
const ingredientsDbPath = path.join(__dirname, '..', 'data', 'ingredients-db.json');

if (!fs.existsSync(recipesDir)) {
    fs.mkdirSync(recipesDir, { recursive: true });
}

// ============================================================
// 1. Load Seasonal Ingredients Database (월별 제철 식재료 440+)
// ============================================================
const catMap = { v: 'vegetable', s: 'seafood', f: 'fruit', m: 'meat' };
const rawDb = JSON.parse(fs.readFileSync(ingredientsDbPath, 'utf8'));
const SEASONAL_INGREDIENTS = {};
for (const [month, items] of Object.entries(rawDb)) {
    SEASONAL_INGREDIENTS[month] = items.map(i => ({
        ko: i.ko, en: i.en, rom: i.rom, emoji: i.emoji, category: catMap[i.cat] || i.cat,
    }));
}

// ============================================================
// 2. Korean Cooking Method Templates (한식 조리법 템플릿)
//    - Titles are PURE romanized Korean (e.g. Naengi-Doenjangguk)
//    - Recipe steps are English-first, Korean as reference
//    - Ingredients are English-first with Korean in parentheses
// ============================================================
const COOKING_METHODS = [
    // -- 국/찌개/탕 (Soups & Stews) --
    {
        id: 'doenjang-guk',
        koMethod: '된장국', enMethod: 'Doenjangguk', romMethod: 'Doenjangguk',
        koTitle: (ing) => `${ing}된장국`,
        enTitle: (rom) => `${rom}-Doenjangguk`,
        enSubtitle: (en) => `${en} Soybean Paste Soup`,
        koDesc: (ing) => `제철 ${ing}의 향긋함과 구수한 된장이 어우러진 건강한 국`,
        enDesc: (en) => `Healthy Korean soup with seasonal ${en} and rich soybean paste broth`,
        emoji: '🥣', cookTime: '20 min', difficulty: 'Easy', servings: '2 servings',
        tags: (ing) => [ing, '된장국', 'doenjangguk', 'soup', 'healthy'],
        forCategories: ['vegetable'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingEn} (${ingKo})`, amount: '150g' },
            { name: 'Soybean paste (된장)', amount: '2 tbsp' },
            { name: 'Tofu (두부)', amount: '1/2 block' },
            { name: 'Green onion (대파)', amount: '1 stalk' },
            { name: 'Minced garlic (다진마늘)', amount: '1 tsp' },
            { name: 'Anchovy kelp broth (멸치다시마 육수)', amount: '600ml' },
        ],
        steps: (ingKo, ingEn) => [
            `Clean and wash ${ingEn} (${ingKo}) thoroughly and prepare.`,
            `Bring anchovy kelp broth to a boil and dissolve soybean paste.`,
            `Dice tofu and add to soup.`,
            `Add ${ingEn} and minced garlic, boil for 5 more minutes.`,
            `Top with sliced green onion and serve hot.`,
        ],
        nutrition: { calories: '120 kcal', protein: '9g', carbs: '8g', fat: '6g' },
        tip: (ingEn) => `Don't overcook ${ingEn} to preserve the fresh texture.`,
    },
    {
        id: 'jjigae',
        koMethod: '찌개', enMethod: 'Jjigae', romMethod: 'Jjigae',
        koTitle: (ing) => `${ing}찌개`,
        enTitle: (rom) => `${rom}-Jjigae`,
        enSubtitle: (en) => `${en} Korean Stew`,
        koDesc: (ing) => `매콤하고 깊은 맛의 ${ing} 찌개, 밥 한 공기가 뚝딱`,
        enDesc: (en) => `Spicy and savory Korean ${en} stew, perfect with steamed rice`,
        emoji: '🍲', cookTime: '25 min', difficulty: 'Medium', servings: '2 servings',
        tags: (ing) => [ing, '찌개', 'jjigae', 'stew', 'spicy'],
        forCategories: ['vegetable', 'seafood', 'meat'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingEn} (${ingKo})`, amount: '200g' },
            { name: 'Gochujang (고추장)', amount: '1 tbsp' },
            { name: 'Red pepper flakes (고춧가루)', amount: '1 tbsp' },
            { name: 'Tofu (두부)', amount: '1/2 block' },
            { name: 'Green onion (대파)', amount: '1 stalk' },
            { name: 'Minced garlic (다진마늘)', amount: '1 tbsp' },
            { name: 'Water (물)', amount: '500ml' },
            { name: 'Salt (소금)', amount: 'to taste' },
        ],
        steps: (ingKo, ingEn) => [
            `Prepare ${ingEn} (${ingKo}) and cut into bite-sized pieces.`,
            `Add water to a pot and dissolve gochujang and red pepper flakes.`,
            `Add ${ingEn} and bring to a boil over high heat.`,
            `Add tofu and green onion, simmer on medium heat for 10 more minutes.`,
            `Stir in garlic, season with salt, and serve hot with rice.`,
        ],
        nutrition: { calories: '180 kcal', protein: '14g', carbs: '12g', fat: '8g' },
        tip: (ingEn) => `Adding more ${ingEn} makes the broth richer and more flavorful.`,
    },
    // -- 나물 (Namul) --
    {
        id: 'namul',
        koMethod: '나물무침', enMethod: 'Namul', romMethod: 'Namul',
        koTitle: (ing) => `${ing}나물무침`,
        enTitle: (rom) => `${rom}-Namul`,
        enSubtitle: (en) => `Seasoned ${en} Greens`,
        koDesc: (ing) => `고소한 참기름향의 ${ing}나물, 건강한 한식 반찬`,
        enDesc: (en) => `Nutty sesame-flavored ${en} namul, a classic healthy Korean side dish`,
        emoji: '🥬', cookTime: '10 min', difficulty: 'Easy', servings: '2 servings',
        tags: (ing) => [ing, '나물', 'namul', 'side dish', 'healthy'],
        forCategories: ['vegetable'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingEn} (${ingKo})`, amount: '300g' },
            { name: 'Sesame oil (참기름)', amount: '1 tbsp' },
            { name: 'Soup soy sauce (국간장)', amount: '1 tbsp' },
            { name: 'Minced garlic (다진마늘)', amount: '1 tsp' },
            { name: 'Sesame seeds (깨)', amount: '1 tbsp' },
            { name: 'Salt (소금)', amount: 'to taste' },
        ],
        steps: (ingKo, ingEn) => [
            `Wash ${ingEn} (${ingKo}) thoroughly under running water.`,
            `Blanch in salted boiling water for 30 seconds to 1 minute.`,
            `Rinse in cold water and squeeze out excess moisture.`,
            `Season with soy sauce, sesame oil, and garlic. Mix gently by hand.`,
            `Sprinkle with sesame seeds and serve.`,
        ],
        nutrition: { calories: '55 kcal', protein: '4g', carbs: '3g', fat: '3g' },
        tip: (ingEn) => `Squeeze ${ingEn} well after blanching so the seasoning absorbs properly.`,
    },
    // -- 전 (Jeon / Pancake) --
    {
        id: 'jeon',
        koMethod: '전', enMethod: 'Jeon', romMethod: 'Jeon',
        koTitle: (ing) => `${ing}전`,
        enTitle: (rom) => `${rom}-Jeon`,
        enSubtitle: (en) => `${en} Korean Pancake`,
        koDesc: (ing) => `바삭하고 고소한 ${ing}전, 비 오는 날의 최고의 간식`,
        enDesc: (en) => `Crispy and savory ${en} Korean pancake, perfect snack for rainy days`,
        emoji: '🥞', cookTime: '20 min', difficulty: 'Easy', servings: '2 servings',
        tags: (ing) => [ing, '전', 'jeon', 'pancake', 'crispy'],
        forCategories: ['vegetable', 'seafood'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingEn} (${ingKo})`, amount: '200g' },
            { name: 'Pancake flour (부침가루)', amount: '100g' },
            { name: 'Egg (계란)', amount: '1' },
            { name: 'Water (물)', amount: '80ml' },
            { name: 'Salt (소금)', amount: 'to taste' },
            { name: 'Cooking oil (식용유)', amount: 'as needed' },
        ],
        steps: (ingKo, ingEn) => [
            `Wash ${ingEn} (${ingKo}) and slice into proper sizes.`,
            `Mix pancake flour with water, egg, and a pinch of salt to make batter.`,
            `Add ${ingEn} to the batter and mix evenly.`,
            `Heat oil in a pan and fry over medium heat until golden brown.`,
            `Flip and cook both sides until crispy. Serve with soy dipping sauce.`,
        ],
        nutrition: { calories: '220 kcal', protein: '8g', carbs: '28g', fat: '9g' },
        tip: (ingEn) => `Spread the batter thin for extra crispiness.`,
    },
    // -- 볶음 (Stir-fry) --
    {
        id: 'bokkeum',
        koMethod: '볶음', enMethod: 'Bokkeum', romMethod: 'Bokkeum',
        koTitle: (ing) => `${ing}볶음`,
        enTitle: (rom) => `${rom}-Bokkeum`,
        enSubtitle: (en) => `Stir-fried ${en}`,
        koDesc: (ing) => `간장과 참기름으로 볶아낸 고소한 ${ing}볶음 반찬`,
        enDesc: (en) => `Savory stir-fried ${en} with soy sauce and sesame oil`,
        emoji: '🥘', cookTime: '15 min', difficulty: 'Easy', servings: '2 servings',
        tags: (ing) => [ing, '볶음', 'bokkeum', 'stir-fry', 'side dish'],
        forCategories: ['vegetable', 'seafood', 'meat'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingEn} (${ingKo})`, amount: '250g' },
            { name: 'Soy sauce (간장)', amount: '2 tbsp' },
            { name: 'Sugar (설탕)', amount: '1 tbsp' },
            { name: 'Sesame oil (참기름)', amount: '1 tbsp' },
            { name: 'Minced garlic (다진마늘)', amount: '1 tsp' },
            { name: 'Sesame seeds (깨)', amount: '1 tbsp' },
            { name: 'Cooking oil (식용유)', amount: '1 tbsp' },
        ],
        steps: (ingKo, ingEn) => [
            `Wash ${ingEn} (${ingKo}) and cut into bite-sized pieces.`,
            `Heat cooking oil in a pan, add ${ingEn} and stir-fry over medium heat.`,
            `Add soy sauce and sugar, stir-fry until evenly coated.`,
            `Add garlic and stir-fry for 1 more minute.`,
            `Finish with sesame oil and sprinkle sesame seeds. Serve as a side dish.`,
        ],
        nutrition: { calories: '160 kcal', protein: '6g', carbs: '14g', fat: '9g' },
        tip: (ingEn) => `Quick stir-fry over high heat preserves the texture of ${ingEn}.`,
    },
    // -- 조림 (Braised / Jorim) --
    {
        id: 'jorim',
        koMethod: '조림', enMethod: 'Jorim', romMethod: 'Jorim',
        koTitle: (ing) => `${ing}조림`,
        enTitle: (rom) => `${rom}-Jorim`,
        enSubtitle: (en) => `Braised ${en}`,
        koDesc: (ing) => `달콤짭짤하게 조려낸 ${ing}조림, 밥반찬의 정석`,
        enDesc: (en) => `Sweet and savory braised ${en}, a quintessential Korean side dish`,
        emoji: '🍯', cookTime: '30 min', difficulty: 'Medium', servings: '3 servings',
        tags: (ing) => [ing, '조림', 'jorim', 'braised', 'side dish'],
        forCategories: ['vegetable', 'seafood'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingEn} (${ingKo})`, amount: '300g' },
            { name: 'Soy sauce (간장)', amount: '3 tbsp' },
            { name: 'Sugar (설탕)', amount: '1.5 tbsp' },
            { name: 'Corn syrup (물엿)', amount: '1 tbsp' },
            { name: 'Sesame oil (참기름)', amount: '1 tbsp' },
            { name: 'Sesame seeds (깨)', amount: '1 tbsp' },
            { name: 'Water (물)', amount: '200ml' },
        ],
        steps: (ingKo, ingEn) => [
            `Prepare ${ingEn} (${ingKo}) and cut into pieces.`,
            `Combine soy sauce, sugar, and water in a pot and bring to a boil.`,
            `Add ${ingEn} and simmer over medium heat.`,
            `When the liquid reduces by half, add corn syrup and glaze until shiny.`,
            `Finish with sesame oil and sprinkle sesame seeds.`,
        ],
        nutrition: { calories: '130 kcal', protein: '5g', carbs: '18g', fat: '4g' },
        tip: (ingEn) => `Slow simmering on low heat helps the sauce penetrate ${ingEn} deeply.`,
    },
    // -- 김치 (Kimchi) --
    {
        id: 'kimchi',
        koMethod: '김치', enMethod: 'Kimchi', romMethod: 'Kimchi',
        koTitle: (ing) => `${ing}김치`,
        enTitle: (rom) => `${rom}-Kimchi`,
        enSubtitle: (en) => `${en} Kimchi`,
        koDesc: (ing) => `제철 ${ing}로 담근 특별한 김치, 발효의 깊은 맛`,
        enDesc: (en) => `Special kimchi made with seasonal ${en}, deep fermented flavor`,
        emoji: '🥟', cookTime: '30 min', difficulty: 'Medium', servings: '4 servings',
        tags: (ing) => [ing, '김치', 'kimchi', 'fermented', 'traditional'],
        forCategories: ['vegetable'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingEn} (${ingKo})`, amount: '500g' },
            { name: 'Red pepper flakes (고춧가루)', amount: '3 tbsp' },
            { name: 'Anchovy fish sauce (멸치액젓)', amount: '2 tbsp' },
            { name: 'Minced garlic (다진마늘)', amount: '2 tbsp' },
            { name: 'Ginger (생강)', amount: '1 tsp' },
            { name: 'Plum extract (매실액)', amount: '1 tbsp' },
            { name: 'Sesame seeds (깨)', amount: '1 tbsp' },
            { name: 'Salt (소금)', amount: 'as needed' },
        ],
        steps: (ingKo, ingEn) => [
            `Wash ${ingEn} (${ingKo}) and salt for 30 minutes.`,
            `Make seasoning paste: mix red pepper flakes, fish sauce, garlic, ginger, and plum extract.`,
            `Drain the salted ${ingEn} and coat evenly with the seasoning paste.`,
            `Sprinkle sesame seeds and pack tightly into a container.`,
            `Ferment at room temperature for one day, then refrigerate. Best after 1-2 days.`,
        ],
        nutrition: { calories: '35 kcal', protein: '2g', carbs: '5g', fat: '1g' },
        tip: (ingEn) => `Flavor changes with fermentation time — try after 1-2 days for best results.`,
    },
    // -- 비빔밥 (Bibimbap) --
    {
        id: 'bibimbap',
        koMethod: '비빔밥', enMethod: 'Bibimbap', romMethod: 'Bibimbap',
        koTitle: (ing) => `${ing}비빔밥`,
        enTitle: (rom) => `${rom}-Bibimbap`,
        enSubtitle: (en) => `${en} Mixed Rice Bowl`,
        koDesc: (ing) => `향긋한 ${ing}를 듬뿍 올린 영양 만점 비빔밥`,
        enDesc: (en) => `Nutritious bibimbap generously topped with fragrant ${en}`,
        emoji: '🍚', cookTime: '20 min', difficulty: 'Easy', servings: '2 servings',
        tags: (ing) => [ing, '비빔밥', 'bibimbap', 'rice bowl', 'healthy'],
        forCategories: ['vegetable', 'seafood', 'meat'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingEn} (${ingKo})`, amount: '150g' },
            { name: 'Cooked rice (밥)', amount: '2 bowls' },
            { name: 'Gochujang (고추장)', amount: '2 tbsp' },
            { name: 'Sesame oil (참기름)', amount: '1 tbsp' },
            { name: 'Egg (계란)', amount: '2' },
            { name: 'Soy sauce (간장)', amount: '1 tbsp' },
            { name: 'Sesame seeds (깨)', amount: '1 tbsp' },
        ],
        steps: (ingKo, ingEn) => [
            `Prepare ${ingEn} (${ingKo}) and cut into bite-sized pieces.`,
            `Lightly stir-fry or blanch ${ingEn}.`,
            `Fry eggs sunny side up.`,
            `Top a bowl of rice with ${ingEn}, fried egg, and a generous dollop of gochujang.`,
            `Drizzle with sesame oil and sesame seeds. Mix everything together and enjoy!`,
        ],
        nutrition: { calories: '380 kcal', protein: '14g', carbs: '56g', fat: '12g' },
        tip: (ingEn) => `Don't overcook ${ingEn} to preserve the fresh aroma.`,
    },
    // -- 국밥 (Rice Soup) --
    {
        id: 'gukbap',
        koMethod: '국밥', enMethod: 'Gukbap', romMethod: 'Gukbap',
        koTitle: (ing) => `${ing}국밥`,
        enTitle: (rom) => `${rom}-Gukbap`,
        enSubtitle: (en) => `${en} Rice Soup`,
        koDesc: (ing) => `따뜻한 ${ing}국밥 한 그릇으로 속이 든든해지는 보양식`,
        enDesc: (en) => `Hearty ${en} rice soup, a warming and nourishing Korean comfort food`,
        emoji: '🍜', cookTime: '25 min', difficulty: 'Easy', servings: '2 servings',
        tags: (ing) => [ing, '국밥', 'gukbap', 'rice soup', 'comfort food'],
        forCategories: ['vegetable', 'seafood', 'meat'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingEn} (${ingKo})`, amount: '150g' },
            { name: 'Cooked rice (밥)', amount: '2 bowls' },
            { name: 'Soybean paste (된장)', amount: '1.5 tbsp' },
            { name: 'Egg (계란)', amount: '2' },
            { name: 'Green onion (대파)', amount: '1 stalk' },
            { name: 'Minced garlic (다진마늘)', amount: '1 tsp' },
            { name: 'Broth (육수)', amount: '800ml' },
        ],
        steps: (ingKo, ingEn) => [
            `Prepare and clean ${ingEn} (${ingKo}).`,
            `Dissolve soybean paste in broth and bring to a boil.`,
            `Add cooked rice and let it boil.`,
            `Add ${ingEn} and gently drizzle beaten egg into the soup.`,
            `Top with sliced green onion and serve piping hot.`,
        ],
        nutrition: { calories: '350 kcal', protein: '14g', carbs: '52g', fat: '8g' },
        tip: (ingEn) => `Stir gently after adding egg for beautiful egg ribbons in the soup.`,
    },
    // -- 샐러드 (Salad) --
    {
        id: 'salad',
        koMethod: '샐러드', enMethod: 'Saelleodeu', romMethod: 'Saelleodeu',
        koTitle: (ing) => `${ing} 참깨 샐러드`,
        enTitle: (rom) => `${rom}-Chamkkae-Saelleodeu`,
        enSubtitle: (en) => `Korean ${en} Sesame Salad`,
        koDesc: (ing) => `신선한 제철 ${ing}와 고소한 참깨 드레싱의 건강 샐러드`,
        enDesc: (en) => `Fresh seasonal ${en} salad with nutty Korean sesame dressing`,
        emoji: '🥗', cookTime: '10 min', difficulty: 'Easy', servings: '2 servings',
        tags: (ing) => [ing, '샐러드', 'salad', 'healthy', 'fresh'],
        forCategories: ['vegetable', 'fruit'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingEn} (${ingKo})`, amount: '200g' },
            { name: 'Mixed greens (믹스 채소)', amount: '100g' },
            { name: 'Sesame seeds (참깨)', amount: '2 tbsp' },
            { name: 'Soy sauce (간장)', amount: '1 tbsp' },
            { name: 'Sesame oil (참기름)', amount: '1 tbsp' },
            { name: 'Vinegar (식초)', amount: '1 tbsp' },
            { name: 'Honey (꿀)', amount: '1 tbsp' },
        ],
        steps: (ingKo, ingEn) => [
            `Wash ${ingEn} (${ingKo}) and prepare in bite-sized pieces.`,
            `Wash mixed greens and drain well.`,
            `Make dressing: whisk together sesame seeds, soy sauce, sesame oil, vinegar, and honey.`,
            `Arrange greens and ${ingEn} on a plate, drizzle with the sesame dressing.`,
            `Top with extra sesame seeds and serve immediately.`,
        ],
        nutrition: { calories: '140 kcal', protein: '4g', carbs: '14g', fat: '8g' },
        tip: (ingEn) => `Add dressing just before eating to keep the greens fresh and crisp.`,
    },
];

// ============================================================
// 3. Season Label by Month
// ============================================================
function getSeasonLabel(month) {
    const map = {
        1: 'Winter', 2: 'Late Winter', 3: 'Spring',
        4: 'Spring', 5: 'Late Spring', 6: 'Summer',
        7: 'Summer', 8: 'Late Summer', 9: 'Autumn',
        10: 'Autumn', 11: 'Late Autumn', 12: 'Winter',
    };
    return map[month];
}

function getSeasonLabelKo(month) {
    const map = {
        1: '겨울', 2: '겨울/봄', 3: '봄',
        4: '봄', 5: '봄/여름', 6: '여름',
        7: '여름', 8: '여름/가을', 9: '가을',
        10: '가을', 11: '가을/겨울', 12: '겨울',
    };
    return map[month];
}

// ============================================================
// 4. Hash-based deterministic pseudo-random (no duplicates)
// ============================================================
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

function getExistingRecipeSlugs() {
    if (!fs.existsSync(recipesDir)) return new Set();
    return new Set(
        fs.readdirSync(recipesDir)
            .filter(f => f.endsWith('.md'))
            .map(f => f.replace(/\.md$/, ''))
    );
}

// ============================================================
// 5. Main: Generate Today's Recipe
// ============================================================
function generateRecipe() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const month = today.getMonth() + 1;

    // First, try from the pool if any unpublished recipes exist
    if (fs.existsSync(poolPath)) {
        const pool = JSON.parse(fs.readFileSync(poolPath, 'utf8'));
        const unpublished = pool.find(recipe => !recipe.published);

        if (unpublished) {
            const slug = `${dateStr}-${unpublished.slug}`;
            const existing = getExistingRecipeSlugs();
            if (!existing.has(slug)) {
                publishFromPool(unpublished, pool, dateStr, slug);
                return;
            }
        }
    }

    // If pool exhausted — auto-generate from templates
    console.log('🔄 Recipe pool exhausted. Auto-generating from templates...');

    const ingredients = SEASONAL_INGREDIENTS[month];
    const existing = getExistingRecipeSlugs();

    for (let attempt = 0; attempt < 100; attempt++) {
        const seed = simpleHash(`${dateStr}-${attempt}`);
        const ingIdx = seed % ingredients.length;
        const ingredient = ingredients[ingIdx];

        const compatibleMethods = COOKING_METHODS.filter(m =>
            m.forCategories.includes(ingredient.category)
        );
        const methodIdx = (seed >> 4) % compatibleMethods.length;
        const method = compatibleMethods[methodIdx];

        const slug = `${dateStr}-${ingredient.ko}-${method.id}`;
        const safeSlug = slug.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎ-]/g, '');

        if (existing.has(safeSlug)) continue;

        // Generate the recipe!
        const titleKo = method.koTitle(ingredient.ko);
        const title = method.enTitle(ingredient.rom);       // Pure romanized: Naengi-Doenjangguk
        const subtitle = method.enSubtitle(ingredient.en);   // English explanation: Shepherd's Purse Soybean Paste Soup
        const recipeIngredients = method.ingredients(ingredient.ko, ingredient.en);
        const steps = method.steps(ingredient.ko, ingredient.en);
        const tags = method.tags(ingredient.ko);

        const ingredientsMd = recipeIngredients.map(i =>
            `  - name: "${i.name}"\n    amount: "${i.amount}"`
        ).join('\n');

        const stepsMd = steps.map(s => `  - "${s}"`).join('\n');

        const seasonEn = getSeasonLabel(month);
        const seasonKo = getSeasonLabelKo(month);

        const markdown = `---
title: "${title}"
subtitle: "${subtitle}"
titleKo: "${titleKo}"
date: "${dateStr}"
emoji: "${ingredient.emoji}"
description: "${method.enDesc(ingredient.en)}"
descriptionKo: "${method.koDesc(ingredient.ko)}"
mainIngredient: "${ingredient.rom} (${ingredient.en})"
mainIngredientKo: "${ingredient.ko}"
season: "${seasonEn}"
seasonKo: "${seasonKo}"
cookTime: "${method.cookTime}"
difficulty: "${method.difficulty}"
servings: "${method.servings}"
tags: ${JSON.stringify(tags)}
ingredients:
${ingredientsMd}
steps:
${stepsMd}
nutrition:
  calories: "${method.nutrition.calories}"
  protein: "${method.nutrition.protein}"
  carbs: "${method.nutrition.carbs}"
  fat: "${method.nutrition.fat}"
tip: "${method.tip(ingredient.en)}"
---

## ${title}
### ${subtitle} · ${titleKo}

${method.enDesc(ingredient.en)}

### ${ingredient.emoji} ${ingredient.rom} (${ingredient.en} · ${ingredient.ko})

This recipe features **${ingredient.rom}** (${ingredient.en}), a seasonal ingredient for **${seasonEn}** in Korea.
`;

        const filePath = path.join(recipesDir, `${safeSlug}.md`);
        fs.writeFileSync(filePath, markdown, 'utf8');

        console.log(`✅ Auto-generated recipe: ${title} (${titleKo})`);
        console.log(`📁 File: ${filePath}`);
        console.log(`📅 Date: ${dateStr}`);
        console.log(`🥬 Ingredient: ${ingredient.rom} (${ingredient.en} · ${ingredient.ko})`);
        console.log(`🍳 Method: ${method.romMethod} (${method.koMethod})`);
        return;
    }

    console.log('⚠️ Could not generate a unique recipe after 100 attempts.');
}

function publishFromPool(recipe, pool, dateStr, slug) {
    const ingredients = recipe.ingredients.map(i =>
        `  - name: "${i.name}"\n    amount: "${i.amount}"`
    ).join('\n');

    const steps = recipe.steps.map(s => `  - "${s.step}"`).join('\n');
    const tags = JSON.stringify(recipe.tags);

    const markdown = `---
title: "${recipe.title}"
titleKo: "${recipe.titleKo}"
date: "${dateStr}"
emoji: "${recipe.emoji}"
description: "${recipe.description}"
descriptionKo: "${recipe.descriptionKo}"
mainIngredient: "${recipe.mainIngredient}"
season: "${recipe.season}"
cookTime: "${recipe.cookTime}"
difficulty: "${recipe.difficulty}"
servings: "${recipe.servings}"
tags: ${tags}
ingredients:
${ingredients}
steps:
${steps}
nutrition:
  calories: "${recipe.nutrition.calories}"
  protein: "${recipe.nutrition.protein}"
  carbs: "${recipe.nutrition.carbs}"
  fat: "${recipe.nutrition.fat}"
tip: "${recipe.tip}"
---

## ${recipe.titleKo} | ${recipe.title}

${recipe.descriptionKo}

${recipe.description}
`;

    const filePath = path.join(recipesDir, `${slug}.md`);
    fs.writeFileSync(filePath, markdown, 'utf8');

    recipe.published = true;
    recipe.publishDate = dateStr;
    recipe.slug = slug;
    fs.writeFileSync(poolPath, JSON.stringify(pool, null, 2), 'utf8');

    console.log(`✅ Published from pool: ${recipe.titleKo} (${recipe.title})`);
    console.log(`📁 File: ${filePath}`);
    console.log(`📅 Date: ${dateStr}`);
}

// Run!
generateRecipe();
