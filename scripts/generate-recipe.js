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
        ko: i.ko, en: i.en, emoji: i.emoji, category: catMap[i.cat] || i.cat,
    }));
}

// ============================================================
// 2. Korean Cooking Method Templates (한식 조리법 템플릿)
// ============================================================
const COOKING_METHODS = [
    // -- 국/찌개/탕 (Soups & Stews) --
    {
        id: 'doenjang-guk',
        koMethod: '된장국', enMethod: 'Doenjang-guk',
        koTitle: (ing) => `${ing}된장국`, enTitle: (ing) => `${ing} Doenjang-guk (Soybean Paste Soup)`,
        koDesc: (ing) => `제철 ${ing}의 향긋함과 구수한 된장이 어우러진 건강한 국`,
        enDesc: (ing) => `Healthy Korean soup with seasonal ${ing} and rich soybean paste broth`,
        emoji: '🥣', cookTime: '20 min', difficulty: 'Easy', servings: '2 servings',
        tags: (ing) => [ing, '된장국', '국물요리', '건강', '한식'],
        forCategories: ['vegetable'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingKo} ${ingEn}`, amount: '150g' },
            { name: '된장 Soybean paste', amount: '2큰술' },
            { name: '두부 Tofu', amount: '1/2모' },
            { name: '대파 Green onion', amount: '1대' },
            { name: '다진마늘 Minced garlic', amount: '1작은술' },
            { name: '멸치다시마 육수 Anchovy kelp broth', amount: '600ml' },
        ],
        steps: (ingKo, ingEn) => [
            `${ingKo}을(를) 깨끗이 다듬어 씻어 준비합니다. Clean and wash ${ingEn} thoroughly.`,
            `멸치다시마 육수를 끓여 된장을 풀어줍니다. Bring anchovy kelp broth to boil and dissolve soybean paste.`,
            `두부를 깍둑 썰어 넣습니다. Dice tofu and add to soup.`,
            `${ingKo}와(과) 다진마늘을 넣고 5분 더 끓입니다. Add ${ingEn} and garlic, boil 5 more minutes.`,
            `대파를 송송 썰어 올리고 완성합니다. Top with sliced green onion and serve.`,
        ],
        nutrition: { calories: '120 kcal', protein: '9g', carbs: '8g', fat: '6g' },
        tip: (ingKo) => `${ingKo}은(는) 오래 끓이지 않아야 식감이 살아납니다. Don't overcook to preserve the texture.`,
    },
    {
        id: 'jjigae',
        koMethod: '찌개', enMethod: 'Jjigae',
        koTitle: (ing) => `${ing}찌개`, enTitle: (ing) => `${ing} Jjigae (Korean Stew)`,
        koDesc: (ing) => `매콤하고 깊은 맛의 ${ing} 찌개, 밥 한 공기가 뚝딱`,
        enDesc: (ing) => `Spicy and savory Korean ${ing} stew, perfect with steamed rice`,
        emoji: '🍲', cookTime: '25 min', difficulty: 'Medium', servings: '2 servings',
        tags: (ing) => [ing, '찌개', '매콤', '밥도둑', '한식'],
        forCategories: ['vegetable', 'seafood', 'meat'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingKo} ${ingEn}`, amount: '200g' },
            { name: '고추장 Gochujang', amount: '1큰술' },
            { name: '고춧가루 Red pepper flakes', amount: '1큰술' },
            { name: '두부 Tofu', amount: '1/2모' },
            { name: '대파 Green onion', amount: '1대' },
            { name: '다진마늘 Minced garlic', amount: '1큰술' },
            { name: '물 Water', amount: '500ml' },
            { name: '소금 Salt', amount: '약간' },
        ],
        steps: (ingKo, ingEn) => [
            `${ingKo}을(를) 손질하여 먹기 좋은 크기로 자릅니다. Prepare ${ingEn} and cut into bite-sized pieces.`,
            `냄비에 물을 붓고 고추장과 고춧가루를 풀어줍니다. Add water and dissolve gochujang and pepper flakes.`,
            `${ingKo}을(를) 넣고 센불에서 끓입니다. Add ${ingEn} and bring to a boil.`,
            `두부와 대파를 넣고 중불에서 10분 더 끓입니다. Add tofu and green onion, simmer 10 more minutes.`,
            `마늘을 넣고 소금으로 간을 맞춰 완성합니다. Add garlic, season with salt, and serve.`,
        ],
        nutrition: { calories: '180 kcal', protein: '14g', carbs: '12g', fat: '8g' },
        tip: (ingKo) => `${ingKo}의 양을 넉넉히 넣으면 국물 맛이 더 깊어집니다. Adding more ${ingKo} makes the broth richer.`,
    },
    // -- 나물 (Namul) --
    {
        id: 'namul',
        koMethod: '나물무침', enMethod: 'Namul',
        koTitle: (ing) => `${ing}나물무침`, enTitle: (ing) => `${ing} Namul (Seasoned Greens)`,
        koDesc: (ing) => `고소한 참기름향의 ${ing}나물, 건강한 한식 반찬`,
        enDesc: (ing) => `Nutty sesame-flavored ${ing} namul, a classic healthy Korean side dish`,
        emoji: '🥬', cookTime: '10 min', difficulty: 'Easy', servings: '2 servings',
        tags: (ing) => [ing, '나물', '반찬', '건강', '간편'],
        forCategories: ['vegetable'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingKo} ${ingEn}`, amount: '300g' },
            { name: '참기름 Sesame oil', amount: '1큰술' },
            { name: '국간장 Soup soy sauce', amount: '1큰술' },
            { name: '다진마늘 Minced garlic', amount: '1작은술' },
            { name: '깨 Sesame seeds', amount: '1큰술' },
            { name: '소금 Salt', amount: '약간' },
        ],
        steps: (ingKo, ingEn) => [
            `${ingKo}을(를) 깨끗이 씻습니다. Wash ${ingEn} thoroughly.`,
            `끓는 물에 소금을 넣고 30초~1분 데칩니다. Blanch in salted boiling water for 30 seconds to 1 minute.`,
            `찬물에 헹구고 물기를 꽉 짭니다. Rinse in cold water and squeeze dry.`,
            `국간장, 참기름, 마늘을 넣고 조물조물 무칩니다. Season with soy sauce, sesame oil, and garlic.`,
            `깨를 뿌려 완성합니다. Sprinkle with sesame seeds.`,
        ],
        nutrition: { calories: '55 kcal', protein: '4g', carbs: '3g', fat: '3g' },
        tip: (ingKo) => `데친 ${ingKo}의 물기를 충분히 짜야 양념이 잘 배입니다. Squeeze well so seasoning absorbs properly.`,
    },
    // -- 전 (Jeon / Pancake) --
    {
        id: 'jeon',
        koMethod: '전', enMethod: 'Jeon',
        koTitle: (ing) => `${ing}전`, enTitle: (ing) => `${ing} Jeon (Korean Pancake)`,
        koDesc: (ing) => `바삭하고 고소한 ${ing}전, 비 오는 날의 최고의 간식`,
        enDesc: (ing) => `Crispy and savory ${ing} Korean pancake, perfect snack for rainy days`,
        emoji: '🥞', cookTime: '20 min', difficulty: 'Easy', servings: '2 servings',
        tags: (ing) => [ing, '전', '바삭', '간식', '한식'],
        forCategories: ['vegetable', 'seafood'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingKo} ${ingEn}`, amount: '200g' },
            { name: '부침가루 Pancake flour', amount: '100g' },
            { name: '계란 Egg', amount: '1개' },
            { name: '물 Water', amount: '80ml' },
            { name: '소금 Salt', amount: '약간' },
            { name: '식용유 Cooking oil', amount: '적당량' },
        ],
        steps: (ingKo, ingEn) => [
            `${ingKo}을(를) 깨끗이 씻어 먹기 좋게 썰어줍니다. Wash ${ingEn} and slice into proper sizes.`,
            `부침가루에 물과 계란, 소금을 넣고 반죽합니다. Mix pancake flour with water, egg, and salt.`,
            `반죽에 ${ingKo}을(를) 넣고 골고루 섞습니다. Add ${ingEn} to batter and mix evenly.`,
            `팬에 기름을 두르고 중불에서 노릇하게 부칩니다. Pan-fry in oil over medium heat until golden.`,
            `뒤집어서 양면이 바삭하게 구워 완성합니다. Flip and cook both sides until crispy.`,
        ],
        nutrition: { calories: '220 kcal', protein: '8g', carbs: '28g', fat: '9g' },
        tip: (ingKo) => `반죽을 얇게 펴서 부치면 더 바삭합니다. Spread the batter thin for extra crispiness.`,
    },
    // -- 볶음 (Stir-fry) --
    {
        id: 'bokkeum',
        koMethod: '볶음', enMethod: 'Bokkeum',
        koTitle: (ing) => `${ing}볶음`, enTitle: (ing) => `${ing} Bokkeum (Stir-fry)`,
        koDesc: (ing) => `간장과 참기름으로 볶아낸 고소한 ${ing}볶음 반찬`,
        enDesc: (ing) => `Savory stir-fried ${ing} with soy sauce and sesame oil`,
        emoji: '🥘', cookTime: '15 min', difficulty: 'Easy', servings: '2 servings',
        tags: (ing) => [ing, '볶음', '반찬', '간편', '밥도둑'],
        forCategories: ['vegetable', 'seafood', 'meat'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingKo} ${ingEn}`, amount: '250g' },
            { name: '간장 Soy sauce', amount: '2큰술' },
            { name: '설탕 Sugar', amount: '1큰술' },
            { name: '참기름 Sesame oil', amount: '1큰술' },
            { name: '다진마늘 Minced garlic', amount: '1작은술' },
            { name: '깨 Sesame seeds', amount: '1큰술' },
            { name: '식용유 Cooking oil', amount: '1큰술' },
        ],
        steps: (ingKo, ingEn) => [
            `${ingKo}을(를) 깨끗이 씻어 먹기 좋게 썹니다. Wash ${ingEn} and cut into bite-sized pieces.`,
            `팬에 식용유를 두르고 ${ingKo}을(를) 중불에서 볶습니다. Heat oil and stir-fry ${ingEn} over medium heat.`,
            `간장과 설탕을 넣고 양념이 배도록 볶습니다. Add soy sauce and sugar, stir-fry until coated.`,
            `마늘을 넣고 1분 더 볶습니다. Add garlic and stir-fry 1 more minute.`,
            `참기름과 깨를 뿌려 완성합니다. Finish with sesame oil and sesame seeds.`,
        ],
        nutrition: { calories: '160 kcal', protein: '6g', carbs: '14g', fat: '9g' },
        tip: (ingKo) => `센불에서 빠르게 볶으면 ${ingKo}의 식감이 살아납니다. Quick stir-fry over high heat preserves texture.`,
    },
    // -- 조림 (Braised / Jorim) --
    {
        id: 'jorim',
        koMethod: '조림', enMethod: 'Jorim',
        koTitle: (ing) => `${ing}조림`, enTitle: (ing) => `${ing} Jorim (Braised)`,
        koDesc: (ing) => `달콤짭짤하게 조려낸 ${ing}조림, 밥반찬의 정석`,
        enDesc: (ing) => `Sweet and savory braised ${ing}, a quintessential Korean side dish`,
        emoji: '🍯', cookTime: '30 min', difficulty: 'Medium', servings: '3 servings',
        tags: (ing) => [ing, '조림', '반찬', '밥도둑', '전통'],
        forCategories: ['vegetable', 'seafood'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingKo} ${ingEn}`, amount: '300g' },
            { name: '간장 Soy sauce', amount: '3큰술' },
            { name: '설탕 Sugar', amount: '1.5큰술' },
            { name: '물엿 Corn syrup', amount: '1큰술' },
            { name: '참기름 Sesame oil', amount: '1큰술' },
            { name: '깨 Sesame seeds', amount: '1큰술' },
            { name: '물 Water', amount: '200ml' },
        ],
        steps: (ingKo, ingEn) => [
            `${ingKo}을(를) 손질하여 먹기 좋게 썹니다. Prepare ${ingEn} and cut into pieces.`,
            `냄비에 간장, 설탕, 물을 넣고 끓입니다. Bring soy sauce, sugar, and water to a boil.`,
            `${ingKo}을(를) 넣고 중불에서 졸입니다. Add ${ingEn} and simmer over medium heat.`,
            `국물이 반으로 줄면 물엿을 넣고 윤기나게 조립니다. When liquid halves, add syrup and glaze.`,
            `참기름과 깨를 뿌려 완성합니다. Finish with sesame oil and sesame seeds.`,
        ],
        nutrition: { calories: '130 kcal', protein: '5g', carbs: '18g', fat: '4g' },
        tip: (ingKo) => `약불에서 천천히 졸여야 ${ingKo}에 양념이 깊이 배입니다. Slow simmering helps the sauce penetrate deeply.`,
    },
    // -- 김치 (Kimchi) --
    {
        id: 'kimchi',
        koMethod: '김치', enMethod: 'Kimchi',
        koTitle: (ing) => `${ing}김치`, enTitle: (ing) => `${ing} Kimchi`,
        koDesc: (ing) => `제철 ${ing}로 담근 특별한 김치, 발효의 깊은 맛`,
        enDesc: (ing) => `Special kimchi made with seasonal ${ing}, deep fermented flavor`,
        emoji: '🥟', cookTime: '30 min', difficulty: 'Medium', servings: '4 servings',
        tags: (ing) => [ing, '김치', '발효식품', '전통', '건강'],
        forCategories: ['vegetable'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingKo} ${ingEn}`, amount: '500g' },
            { name: '고춧가루 Red pepper flakes', amount: '3큰술' },
            { name: '멸치액젓 Anchovy sauce', amount: '2큰술' },
            { name: '다진마늘 Minced garlic', amount: '2큰술' },
            { name: '생강 Ginger', amount: '1작은술' },
            { name: '매실액 Plum extract', amount: '1큰술' },
            { name: '깨 Sesame seeds', amount: '1큰술' },
            { name: '소금 Salt', amount: '적당량' },
        ],
        steps: (ingKo, ingEn) => [
            `${ingKo}을(를) 깨끗이 씻어 소금에 30분간 절입니다. Wash ${ingEn} and salt for 30 minutes.`,
            `고춧가루, 액젓, 마늘, 생강, 매실액으로 양념을 만듭니다. Make seasoning with pepper flakes, fish sauce, garlic, ginger, plum extract.`,
            `절인 ${ingKo}의 물기를 빼고 양념을 골고루 버무립니다. Drain salted ${ingEn} and coat evenly with seasoning.`,
            `깨를 뿌려 용기에 담습니다. Sprinkle sesame seeds and pack into container.`,
            `상온에서 하루 숙성 후 냉장보관합니다. Ferment at room temperature for one day, then refrigerate.`,
        ],
        nutrition: { calories: '35 kcal', protein: '2g', carbs: '5g', fat: '1g' },
        tip: (ingKo) => `숙성 기간에 따라 맛이 달라집니다. 1-2일 후 드세요. Flavor changes with fermentation — try after 1-2 days.`,
    },
    // -- 비빔밥 (Bibimbap) --
    {
        id: 'bibimbap',
        koMethod: '비빔밥', enMethod: 'Bibimbap',
        koTitle: (ing) => `${ing}비빔밥`, enTitle: (ing) => `${ing} Bibimbap (Mixed Rice Bowl)`,
        koDesc: (ing) => `향긋한 ${ing}를 듬뿍 올린 영양 만점 비빔밥`,
        enDesc: (ing) => `Nutritious bibimbap generously topped with fragrant ${ing}`,
        emoji: '🍚', cookTime: '20 min', difficulty: 'Easy', servings: '2 servings',
        tags: (ing) => [ing, '비빔밥', '한식', '건강', '한그릇'],
        forCategories: ['vegetable', 'seafood', 'meat'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingKo} ${ingEn}`, amount: '150g' },
            { name: '밥 Cooked rice', amount: '2공기' },
            { name: '고추장 Gochujang', amount: '2큰술' },
            { name: '참기름 Sesame oil', amount: '1큰술' },
            { name: '계란 Egg', amount: '2개' },
            { name: '간장 Soy sauce', amount: '1큰술' },
            { name: '깨 Sesame seeds', amount: '1큰술' },
        ],
        steps: (ingKo, ingEn) => [
            `${ingKo}을(를) 손질하여 먹기 좋게 준비합니다. Prepare ${ingEn} in bite-sized pieces.`,
            `${ingKo}을(를) 살짝 볶거나 데쳐 준비합니다. Lightly stir-fry or blanch ${ingEn}.`,
            `계란 프라이를 만듭니다. Fry eggs sunny side up.`,
            `밥 위에 ${ingKo}, 계란, 고추장을 올립니다. Top rice with ${ingEn}, egg, and gochujang.`,
            `참기름과 깨를 뿌려 비벼 드세요! Drizzle sesame oil and seeds, then mix and enjoy!`,
        ],
        nutrition: { calories: '380 kcal', protein: '14g', carbs: '56g', fat: '12g' },
        tip: (ingKo) => `${ingKo}은(를) 너무 익히지 않아야 향이 살아납니다. Don't overcook to preserve the aroma.`,
    },
    // -- 국밥 (Rice Soup) --
    {
        id: 'gukbap',
        koMethod: '국밥', enMethod: 'Gukbap',
        koTitle: (ing) => `${ing}국밥`, enTitle: (ing) => `${ing} Gukbap (Rice Soup)`,
        koDesc: (ing) => `따뜻한 ${ing}국밥 한 그릇으로 속이 든든해지는 보양식`,
        enDesc: (ing) => `Hearty ${ing} rice soup, a warming and nourishing Korean comfort food`,
        emoji: '🍜', cookTime: '25 min', difficulty: 'Easy', servings: '2 servings',
        tags: (ing) => [ing, '국밥', '위로음식', '보양', '한식'],
        forCategories: ['vegetable', 'seafood', 'meat'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingKo} ${ingEn}`, amount: '150g' },
            { name: '밥 Cooked rice', amount: '2공기' },
            { name: '된장 Soybean paste', amount: '1.5큰술' },
            { name: '계란 Egg', amount: '2개' },
            { name: '대파 Green onion', amount: '1대' },
            { name: '다진마늘 Minced garlic', amount: '1작은술' },
            { name: '육수 Broth', amount: '800ml' },
        ],
        steps: (ingKo, ingEn) => [
            `${ingKo}을(를) 손질하여 준비합니다. Prepare and clean ${ingEn}.`,
            `육수에 된장을 풀어 끓입니다. Dissolve soybean paste in broth and bring to boil.`,
            `밥을 넣고 한번 끓입니다. Add rice and let it boil.`,
            `${ingKo}을(를) 넣고 계란을 풀어 넣습니다. Add ${ingEn} and drizzle beaten egg.`,
            `대파를 썰어 완성합니다. Top with green onion and serve.`,
        ],
        nutrition: { calories: '350 kcal', protein: '14g', carbs: '52g', fat: '8g' },
        tip: (ingKo) => `계란을 넣고 살살 저으면 예쁜 계란 꽃이 됩니다. Stir gently after adding egg for beautiful ribbons.`,
    },
    // -- 샐러드 (Salad) --
    {
        id: 'salad',
        koMethod: '샐러드', enMethod: 'Salad',
        koTitle: (ing) => `${ing} 참깨 샐러드`, enTitle: (ing) => `Korean ${ing} Sesame Salad`,
        koDesc: (ing) => `신선한 제철 ${ing}와 고소한 참깨 드레싱의 건강 샐러드`,
        enDesc: (ing) => `Fresh seasonal ${ing} salad with nutty Korean sesame dressing`,
        emoji: '🥗', cookTime: '10 min', difficulty: 'Easy', servings: '2 servings',
        tags: (ing) => [ing, '샐러드', '건강', '간편', '다이어트'],
        forCategories: ['vegetable', 'fruit'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingKo} ${ingEn}`, amount: '200g' },
            { name: '믹스 채소 Mixed greens', amount: '100g' },
            { name: '참깨 Sesame seeds', amount: '2큰술' },
            { name: '간장 Soy sauce', amount: '1큰술' },
            { name: '참기름 Sesame oil', amount: '1큰술' },
            { name: '식초 Vinegar', amount: '1큰술' },
            { name: '꿀 Honey', amount: '1큰술' },
        ],
        steps: (ingKo, ingEn) => [
            `${ingKo}을(를) 깨끗이 씻어 먹기 좋게 준비합니다. Wash ${ingEn} and prepare in desired size.`,
            `채소를 깨끗이 씻어 물기를 뺍니다. Wash greens and drain well.`,
            `참깨, 간장, 참기름, 식초, 꿀로 드레싱을 만듭니다. Make dressing with sesame, soy sauce, sesame oil, vinegar, honey.`,
            `채소와 ${ingKo}을(를) 접시에 담고 드레싱을 뿌립니다. Arrange greens and ${ingEn}, drizzle dressing.`,
            `깨를 올려 완성합니다. Top with extra sesame seeds.`,
        ],
        nutrition: { calories: '140 kcal', protein: '4g', carbs: '14g', fat: '8g' },
        tip: (ingKo) => `드레싱은 먹기 직전에 뿌려야 채소가 신선합니다. Add dressing just before eating.`,
    },
];

// ============================================================
// 3. Season Label by Month
// ============================================================
function getSeasonLabel(month) {
    const map = {
        1: '겨울 Winter', 2: '겨울/봄 Late Winter', 3: '봄 Spring',
        4: '봄 Spring', 5: '봄/여름 Late Spring', 6: '여름 Summer',
        7: '여름 Summer', 8: '여름/가을 Late Summer', 9: '가을 Autumn',
        10: '가을 Autumn', 11: '가을/겨울 Late Autumn', 12: '겨울 Winter',
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
        hash = hash & hash; // Convert to 32bit integer
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
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);

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

    // Try combinations until finding one that doesn't exist yet
    for (let attempt = 0; attempt < 100; attempt++) {
        const seed = simpleHash(`${dateStr}-${attempt}`);
        const ingIdx = seed % ingredients.length;
        const ingredient = ingredients[ingIdx];

        // Filter compatible methods for this ingredient category
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
        const title = method.enTitle(ingredient.en);
        const recipeIngredients = method.ingredients(ingredient.ko, ingredient.en);
        const steps = method.steps(ingredient.ko, ingredient.en);
        const tags = method.tags(ingredient.ko);

        const ingredientsMd = recipeIngredients.map(i =>
            `  - name: "${i.name}"\n    amount: "${i.amount}"`
        ).join('\n');

        const stepsMd = steps.map(s => `  - "${s}"`).join('\n');

        const markdown = `---
title: "${title}"
titleKo: "${titleKo}"
date: "${dateStr}"
emoji: "${ingredient.emoji}"
image: "/images/categories/${method.id}.jpg"
description: "${method.enDesc(ingredient.en)}"
descriptionKo: "${method.koDesc(ingredient.ko)}"
mainIngredient: "${ingredient.ko} ${ingredient.en}"
season: "${getSeasonLabel(month)}"
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
tip: "${method.tip(ingredient.ko)}"
---

## ${titleKo} | ${title}

${method.koDesc(ingredient.ko)}

${method.enDesc(ingredient.en)}

### ${ingredient.emoji} ${ingredient.ko} (${ingredient.en})

이 레시피는 ${month}월 제철 식재료인 **${ingredient.ko}**를 메인으로 사용합니다.
This recipe features **${ingredient.en}**, a seasonal ingredient for ${getSeasonLabel(month)}.
`;

        const filePath = path.join(recipesDir, `${safeSlug}.md`);
        fs.writeFileSync(filePath, markdown, 'utf8');

        console.log(`✅ Auto-generated recipe: ${titleKo} (${title})`);
        console.log(`📁 File: ${filePath}`);
        console.log(`📅 Date: ${dateStr}`);
        console.log(`🥬 Ingredient: ${ingredient.ko} (${ingredient.en})`);
        console.log(`🍳 Method: ${method.koMethod} (${method.enMethod})`);
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
