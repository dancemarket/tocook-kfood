const fs = require('fs');
const path = require('path');

// ============================================================
// Make K-Food ??Infinite Recipe Generator
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
// 1. Load Seasonal Ingredients Database (?�별 ?�철 ?�재�?440+)
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
// 2. Korean Cooking Method Templates (?�식 조리�??�플�?
// ============================================================
const COOKING_METHODS = [
    // -- �?찌개/??(Soups & Stews) --
    {
        id: 'doenjang-guk',
        koMethod: '?�장�?, enMethod: 'Doenjang-guk',
        koTitle: (ing) => `${ing}?�장�?, enTitle: (ing) => `${ing} Doenjang-guk (Soybean Paste Soup)`,
        koDesc: (ing) => `?�철 ${ing}???�긋?�과 구수???�장???�우?�진 건강??�?,
        enDesc: (ing) => `Healthy Korean soup with seasonal ${ing} and rich soybean paste broth`,
        emoji: '?��', cookTime: '20�?, difficulty: '?��? Easy', servings: '2?�분',
        tags: (ing) => [ing, '?�장�?, '�?��?�리', '건강', '?�식'],
        forCategories: ['vegetable'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingKo} ${ingEn}`, amount: '150g' },
            { name: '?�장 Soybean paste', amount: '2?�술' },
            { name: '?��? Tofu', amount: '1/2�? },
            { name: '?�??Green onion', amount: '1?�' },
            { name: '?�진마늘 Minced garlic', amount: '1?��??? },
            { name: '멸치?�시�??�수 Anchovy kelp broth', amount: '600ml' },
        ],
        steps: (ingKo, ingEn) => [
            `${ingKo}??�? 깨끗???�듬???�어 준비합?�다. Clean and wash ${ingEn} thoroughly.`,
            `멸치?�시�??�수�??�여 ?�장???�?�줍?�다. Bring anchovy kelp broth to boil and dissolve soybean paste.`,
            `?��?�?깍둑 ?�어 ?�습?�다. Dice tofu and add to soup.`,
            `${ingKo}?�(�? ?�진마늘???�고 5�????�입?�다. Add ${ingEn} and garlic, boil 5 more minutes.`,
            `?�?��? ?�송 ?�어 ?�리�??�성?�니?? Top with sliced green onion and serve.`,
        ],
        nutrition: { calories: '120 kcal', protein: '9g', carbs: '8g', fat: '6g' },
        tip: (ingKo) => `${ingKo}?�(?? ?�래 ?�이지 ?�아???�감???�아?�니?? Don't overcook to preserve the texture.`,
    },
    {
        id: 'jjigae',
        koMethod: '찌개', enMethod: 'Jjigae',
        koTitle: (ing) => `${ing}찌개`, enTitle: (ing) => `${ing} Jjigae (Korean Stew)`,
        koDesc: (ing) => `매콤?�고 깊�? 맛의 ${ing} 찌개, �???공기가 ?�딱`,
        enDesc: (ing) => `Spicy and savory Korean ${ing} stew, perfect with steamed rice`,
        emoji: '?��', cookTime: '25 min', difficulty: 'Medium', servings: '2 servings',
        tags: (ing) => [ing, '찌개', '매콤', '밥도??, '?�식'],
        forCategories: ['vegetable', 'seafood', 'meat'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingKo} ${ingEn}`, amount: '200g' },
            { name: '고추??Gochujang', amount: '1?�술' },
            { name: '고춧가�?Red pepper flakes', amount: '1?�술' },
            { name: '?��? Tofu', amount: '1/2�? },
            { name: '?�??Green onion', amount: '1?�' },
            { name: '?�진마늘 Minced garlic', amount: '1?�술' },
            { name: '�?Water', amount: '500ml' },
            { name: '?�금 Salt', amount: '?�간' },
        ],
        steps: (ingKo, ingEn) => [
            `${ingKo}??�? ?�질?�여 먹기 좋�? ?�기�??�릅?�다. Prepare ${ingEn} and cut into bite-sized pieces.`,
            `?�비??물을 붓고 고추?�과 고춧가루�? ?�?�줍?�다. Add water and dissolve gochujang and pepper flakes.`,
            `${ingKo}??�? ?�고 ?�불?�서 ?�입?�다. Add ${ingEn} and bring to a boil.`,
            `?��??� ?�?��? ?�고 중불?�서 10�????�입?�다. Add tofu and green onion, simmer 10 more minutes.`,
            `마늘???�고 ?�금?�로 간을 맞춰 ?�성?�니?? Add garlic, season with salt, and serve.`,
        ],
        nutrition: { calories: '180 kcal', protein: '14g', carbs: '12g', fat: '8g' },
        tip: (ingKo) => `${ingKo}???�을 ?�넉???�으�?�?�� 맛이 ??깊어집니?? Adding more ${ingKo} makes the broth richer.`,
    },
    // -- ?�물 (Namul) --
    {
        id: 'namul',
        koMethod: '?�물무침', enMethod: 'Namul',
        koTitle: (ing) => `${ing}?�물무침`, enTitle: (ing) => `${ing} Namul (Seasoned Greens)`,
        koDesc: (ing) => `고소??참기름향??${ing}?�물, 건강???�식 반찬`,
        enDesc: (ing) => `Nutty sesame-flavored ${ing} namul, a classic healthy Korean side dish`,
        emoji: '??', cookTime: '10 min', difficulty: 'Easy', servings: '2 servings',
        tags: (ing) => [ing, '?�물', '반찬', '건강', '간편'],
        forCategories: ['vegetable'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingKo} ${ingEn}`, amount: '300g' },
            { name: '참기�?Sesame oil', amount: '1?�술' },
            { name: '�?��??Soup soy sauce', amount: '1?�술' },
            { name: '?�진마늘 Minced garlic', amount: '1?��??? },
            { name: '�?Sesame seeds', amount: '1?�술' },
            { name: '?�금 Salt', amount: '?�간' },
        ],
        steps: (ingKo, ingEn) => [
            `${ingKo}??�? 깨끗???�습?�다. Wash ${ingEn} thoroughly.`,
            `?�는 물에 ?�금???�고 30�?1�??�칩?�다. Blanch in salted boiling water for 30 seconds to 1 minute.`,
            `찬물???�구�?물기�?�?�?��?? Rinse in cold water and squeeze dry.`,
            `�?��?? 참기�? 마늘???�고 조물조물 무칩?�다. Season with soy sauce, sesame oil, and garlic.`,
            `깨�? 뿌려 ?�성?�니?? Sprinkle with sesame seeds.`,
        ],
        nutrition: { calories: '55 kcal', protein: '4g', carbs: '3g', fat: '3g' },
        tip: (ingKo) => `?�친 ${ingKo}??물기�?충분??짜야 ?�념????배입?�다. Squeeze well so seasoning absorbs properly.`,
    },
    // -- ??(Jeon / Pancake) --
    {
        id: 'jeon',
        koMethod: '??, enMethod: 'Jeon',
        koTitle: (ing) => `${ing}??, enTitle: (ing) => `${ing} Jeon (Korean Pancake)`,
        koDesc: (ing) => `바삭?�고 고소??${ing}?? �??�는 ?�의 최고??간식`,
        enDesc: (ing) => `Crispy and savory ${ing} Korean pancake, perfect snack for rainy days`,
        emoji: '?��', cookTime: '20 min', difficulty: 'Easy', servings: '2 servings',
        tags: (ing) => [ing, '??, '바삭', '간식', '?�식'],
        forCategories: ['vegetable', 'seafood'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingKo} ${ingEn}`, amount: '200g' },
            { name: '부침�?�?Pancake flour', amount: '100g' },
            { name: '계�? Egg', amount: '1�? },
            { name: '�?Water', amount: '80ml' },
            { name: '?�금 Salt', amount: '?�간' },
            { name: '?�용??Cooking oil', amount: '?�당?? },
        ],
        steps: (ingKo, ingEn) => [
            `${ingKo}??�? 깨끗???�어 먹기 좋게 ?�어줍니?? Wash ${ingEn} and slice into proper sizes.`,
            `부침�?루에 물과 계�?, ?�금???�고 반죽?�니?? Mix pancake flour with water, egg, and salt.`,
            `반죽??${ingKo}??�? ?�고 골고�??�습?�다. Add ${ingEn} to batter and mix evenly.`,
            `?�에 기름???�르�?중불?�서 ?�릇?�게 부칩니?? Pan-fry in oil over medium heat until golden.`,
            `?�집?�서 ?�면??바삭?�게 구워 ?�성?�니?? Flip and cook both sides until crispy.`,
        ],
        nutrition: { calories: '220 kcal', protein: '8g', carbs: '28g', fat: '9g' },
        tip: (ingKo) => `반죽???�게 ?�서 부치면 ??바삭?�니?? Spread the batter thin for extra crispiness.`,
    },
    // -- 볶음 (Stir-fry) --
    {
        id: 'bokkeum',
        koMethod: '볶음', enMethod: 'Bokkeum',
        koTitle: (ing) => `${ing}볶음`, enTitle: (ing) => `${ing} Bokkeum (Stir-fry)`,
        koDesc: (ing) => `간장�?참기름으�?볶아??고소??${ing}볶음 반찬`,
        enDesc: (ing) => `Savory stir-fried ${ing} with soy sauce and sesame oil`,
        emoji: '?��', cookTime: '15 min', difficulty: 'Easy', servings: '2 servings',
        tags: (ing) => [ing, '볶음', '반찬', '간편', '밥도??],
        forCategories: ['vegetable', 'seafood', 'meat'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingKo} ${ingEn}`, amount: '250g' },
            { name: '간장 Soy sauce', amount: '2?�술' },
            { name: '?�탕 Sugar', amount: '1?�술' },
            { name: '참기�?Sesame oil', amount: '1?�술' },
            { name: '?�진마늘 Minced garlic', amount: '1?��??? },
            { name: '�?Sesame seeds', amount: '1?�술' },
            { name: '?�용??Cooking oil', amount: '1?�술' },
        ],
        steps: (ingKo, ingEn) => [
            `${ingKo}??�? 깨끗???�어 먹기 좋게 ?�니?? Wash ${ingEn} and cut into bite-sized pieces.`,
            `?�에 ?�용?��? ?�르�?${ingKo}??�? 중불?�서 볶습?�다. Heat oil and stir-fry ${ingEn} over medium heat.`,
            `간장�??�탕???�고 ?�념??배도�?볶습?�다. Add soy sauce and sugar, stir-fry until coated.`,
            `마늘???�고 1�???볶습?�다. Add garlic and stir-fry 1 more minute.`,
            `참기름과 깨�? 뿌려 ?�성?�니?? Finish with sesame oil and sesame seeds.`,
        ],
        nutrition: { calories: '160 kcal', protein: '6g', carbs: '14g', fat: '9g' },
        tip: (ingKo) => `?�불?�서 빠르�?볶으�?${ingKo}???�감???�아?�니?? Quick stir-fry over high heat preserves texture.`,
    },
    // -- 조림 (Braised / Jorim) --
    {
        id: 'jorim',
        koMethod: '조림', enMethod: 'Jorim',
        koTitle: (ing) => `${ing}조림`, enTitle: (ing) => `${ing} Jorim (Braised)`,
        koDesc: (ing) => `?�콤�?��?�게 조려??${ing}조림, 밥반찬의 ?�석`,
        enDesc: (ing) => `Sweet and savory braised ${ing}, a quintessential Korean side dish`,
        emoji: '?��', cookTime: '30 min', difficulty: 'Medium', servings: '3 servings',
        tags: (ing) => [ing, '조림', '반찬', '밥도??, '?�통'],
        forCategories: ['vegetable', 'seafood'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingKo} ${ingEn}`, amount: '300g' },
            { name: '간장 Soy sauce', amount: '3?�술' },
            { name: '?�탕 Sugar', amount: '1.5?�술' },
            { name: '물엿 Corn syrup', amount: '1?�술' },
            { name: '참기�?Sesame oil', amount: '1?�술' },
            { name: '�?Sesame seeds', amount: '1?�술' },
            { name: '�?Water', amount: '200ml' },
        ],
        steps: (ingKo, ingEn) => [
            `${ingKo}??�? ?�질?�여 먹기 좋게 ?�니?? Prepare ${ingEn} and cut into pieces.`,
            `?�비??간장, ?�탕, 물을 ?�고 ?�입?�다. Bring soy sauce, sugar, and water to a boil.`,
            `${ingKo}??�? ?�고 중불?�서 졸입?�다. Add ${ingEn} and simmer over medium heat.`,
            `�?��??반으�?줄면 물엿???�고 ?�기?�게 조립?�다. When liquid halves, add syrup and glaze.`,
            `참기름과 깨�? 뿌려 ?�성?�니?? Finish with sesame oil and sesame seeds.`,
        ],
        nutrition: { calories: '130 kcal', protein: '5g', carbs: '18g', fat: '4g' },
        tip: (ingKo) => `?�불?�서 천천??졸여??${ingKo}???�념??깊이 배입?�다. Slow simmering helps the sauce penetrate deeply.`,
    },
    // -- 김�?(Kimchi) --
    {
        id: 'kimchi',
        koMethod: '김�?, enMethod: 'Kimchi',
        koTitle: (ing) => `${ing}김�?, enTitle: (ing) => `${ing} Kimchi`,
        koDesc: (ing) => `?�철 ${ing}�??�근 ?�별??김�? 발효??깊�? �?,
        enDesc: (ing) => `Special kimchi made with seasonal ${ing}, deep fermented flavor`,
        emoji: '?��', cookTime: '30 min', difficulty: 'Medium', servings: '4 servings',
        tags: (ing) => [ing, '김�?, '발효?�품', '?�통', '건강'],
        forCategories: ['vegetable'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingKo} ${ingEn}`, amount: '500g' },
            { name: '고춧가�?Red pepper flakes', amount: '3?�술' },
            { name: '멸치?�젓 Anchovy sauce', amount: '2?�술' },
            { name: '?�진마늘 Minced garlic', amount: '2?�술' },
            { name: '?�강 Ginger', amount: '1?��??? },
            { name: '매실�?Plum extract', amount: '1?�술' },
            { name: '�?Sesame seeds', amount: '1?�술' },
            { name: '?�금 Salt', amount: '?�당?? },
        ],
        steps: (ingKo, ingEn) => [
            `${ingKo}??�? 깨끗???�어 ?�금??30분간 ?�입?�다. Wash ${ingEn} and salt for 30 minutes.`,
            `고춧가�? ?�젓, 마늘, ?�강, 매실�?���??�념??만듭?�다. Make seasoning with pepper flakes, fish sauce, garlic, ginger, plum extract.`,
            `?�인 ${ingKo}??물기�?빼고 ?�념??골고�?버무립니?? Drain salted ${ingEn} and coat evenly with seasoning.`,
            `깨�? 뿌려 ?�기???�습?�다. Sprinkle sesame seeds and pack into container.`,
            `?�온?�서 ?�루 ?�성 ???�장보�??�니?? Ferment at room temperature for one day, then refrigerate.`,
        ],
        nutrition: { calories: '35 kcal', protein: '2g', carbs: '5g', fat: '1g' },
        tip: (ingKo) => `?�성 기간???�라 맛이 ?�라집니?? 1-2?????�세?? Flavor changes with fermentation ??try after 1-2 days.`,
    },
    // -- 비빔�?(Bibimbap) --
    {
        id: 'bibimbap',
        koMethod: '비빔�?, enMethod: 'Bibimbap',
        koTitle: (ing) => `${ing}비빔�?, enTitle: (ing) => `${ing} Bibimbap (Mixed Rice Bowl)`,
        koDesc: (ing) => `?�긋??${ing}�??�뿍 ?�린 ?�양 만점 비빔�?,
        enDesc: (ing) => `Nutritious bibimbap generously topped with fragrant ${ing}`,
        emoji: '?��', cookTime: '20�?, difficulty: '?��? Easy', servings: '2?�분',
        tags: (ing) => [ing, '비빔�?, '?�식', '건강', '?�그�?],
        forCategories: ['vegetable', 'seafood', 'meat'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingKo} ${ingEn}`, amount: '150g' },
            { name: '�?Cooked rice', amount: '2공기' },
            { name: '고추??Gochujang', amount: '2?�술' },
            { name: '참기�?Sesame oil', amount: '1?�술' },
            { name: '계�? Egg', amount: '2�? },
            { name: '간장 Soy sauce', amount: '1?�술' },
            { name: '�?Sesame seeds', amount: '1?�술' },
        ],
        steps: (ingKo, ingEn) => [
            `${ingKo}??�? ?�질?�여 먹기 좋게 준비합?�다. Prepare ${ingEn} in bite-sized pieces.`,
            `${ingKo}??�? ?�짝 볶거???�쳐 준비합?�다. Lightly stir-fry or blanch ${ingEn}.`,
            `계�? ?�라?��? 만듭?�다. Fry eggs sunny side up.`,
            `�??�에 ${ingKo}, 계�?, 고추?�을 ?�립?�다. Top rice with ${ingEn}, egg, and gochujang.`,
            `참기름과 깨�? 뿌려 비벼 ?�세?? Drizzle sesame oil and seeds, then mix and enjoy!`,
        ],
        nutrition: { calories: '380 kcal', protein: '14g', carbs: '56g', fat: '12g' },
        tip: (ingKo) => `${ingKo}?�(?? ?�무 ?�히지 ?�아???�이 ?�아?�니?? Don't overcook to preserve the aroma.`,
    },
    // -- �?�� (Rice Soup) --
    {
        id: 'gukbap',
        koMethod: '�?��', enMethod: 'Gukbap',
        koTitle: (ing) => `${ing}�?��`, enTitle: (ing) => `${ing} Gukbap (Rice Soup)`,
        koDesc: (ing) => `?�뜻??${ing}�?�� ??그릇?�로 ?�이 ?�든?��???보양??,
        enDesc: (ing) => `Hearty ${ing} rice soup, a warming and nourishing Korean comfort food`,
        emoji: '?��', cookTime: '25 min', difficulty: 'Easy', servings: '2 servings',
        tags: (ing) => [ing, '�?��', '?�로?�식', '보양', '?�식'],
        forCategories: ['vegetable', 'seafood', 'meat'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingKo} ${ingEn}`, amount: '150g' },
            { name: '�?Cooked rice', amount: '2공기' },
            { name: '?�장 Soybean paste', amount: '1.5?�술' },
            { name: '계�? Egg', amount: '2�? },
            { name: '?�??Green onion', amount: '1?�' },
            { name: '?�진마늘 Minced garlic', amount: '1?��??? },
            { name: '?�수 Broth', amount: '800ml' },
        ],
        steps: (ingKo, ingEn) => [
            `${ingKo}??�? ?�질?�여 준비합?�다. Prepare and clean ${ingEn}.`,
            `?�수???�장???�???�입?�다. Dissolve soybean paste in broth and bring to boil.`,
            `밥을 ?�고 ?�번 ?�입?�다. Add rice and let it boil.`,
            `${ingKo}??�? ?�고 계�????�???�습?�다. Add ${ingEn} and drizzle beaten egg.`,
            `?�?��? ?�어 ?�성?�니?? Top with green onion and serve.`,
        ],
        nutrition: { calories: '350 kcal', protein: '14g', carbs: '52g', fat: '8g' },
        tip: (ingKo) => `계�????�고 ?�서 ?�?�면 ?�쁜 계�? 꽃이 ?�니?? Stir gently after adding egg for beautiful ribbons.`,
    },
    // -- ?�러??(Salad) --
    {
        id: 'salad',
        koMethod: '?�러??, enMethod: 'Salad',
        koTitle: (ing) => `${ing} 참깨 ?�러??, enTitle: (ing) => `Korean ${ing} Sesame Salad`,
        koDesc: (ing) => `?�선???�철 ${ing}?� 고소??참깨 ?�레?�의 건강 ?�러??,
        enDesc: (ing) => `Fresh seasonal ${ing} salad with nutty Korean sesame dressing`,
        emoji: '?��', cookTime: '10 min', difficulty: 'Easy', servings: '2 servings',
        tags: (ing) => [ing, '?�러??, '건강', '간편', '?�이?�트'],
        forCategories: ['vegetable', 'fruit'],
        ingredients: (ingKo, ingEn) => [
            { name: `${ingKo} ${ingEn}`, amount: '200g' },
            { name: '믹스 채소 Mixed greens', amount: '100g' },
            { name: '참깨 Sesame seeds', amount: '2?�술' },
            { name: '간장 Soy sauce', amount: '1?�술' },
            { name: '참기�?Sesame oil', amount: '1?�술' },
            { name: '?�초 Vinegar', amount: '1?�술' },
            { name: '꿀 Honey', amount: '1?�술' },
        ],
        steps: (ingKo, ingEn) => [
            `${ingKo}??�? 깨끗???�어 먹기 좋게 준비합?�다. Wash ${ingEn} and prepare in desired size.`,
            `채소�?깨끗???�어 물기�?뺍니?? Wash greens and drain well.`,
            `참깨, 간장, 참기�? ?�초, 꿀�??�레?�을 만듭?�다. Make dressing with sesame, soy sauce, sesame oil, vinegar, honey.`,
            `채소?� ${ingKo}??�? ?�시???�고 ?�레?�을 뿌립?�다. Arrange greens and ${ingEn}, drizzle dressing.`,
            `깨�? ?�려 ?�성?�니?? Top with extra sesame seeds.`,
        ],
        nutrition: { calories: '140 kcal', protein: '4g', carbs: '14g', fat: '8g' },
        tip: (ingKo) => `?�레?��? 먹기 직전??뿌려??채소가 ?�선?�니?? Add dressing just before eating.`,
    },
];

// ============================================================
// 3. Season Label by Month
// ============================================================
function getSeasonLabel(month) {
    const map = {
        1: '겨울 Winter', 2: '겨울/�?Late Winter', 3: '�?Spring',
        4: '�?Spring', 5: '�??�름 Late Spring', 6: '?�름 Summer',
        7: '?�름 Summer', 8: '?�름/가??Late Summer', 9: '가??Autumn',
        10: '가??Autumn', 11: '가??겨울 Late Autumn', 12: '겨울 Winter',
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

    // If pool exhausted ??auto-generate from templates
    console.log('?�� Recipe pool exhausted. Auto-generating from templates...');

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
        const safeSlug = slug.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9가-??-]/g, '');

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

???�시?�는 ${month}???�철 ?�재료인 **${ingredient.ko}**�?메인?�로 ?�용?�니??
This recipe features **${ingredient.en}**, a seasonal ingredient for ${getSeasonLabel(month)}.
`;

        const filePath = path.join(recipesDir, `${safeSlug}.md`);
        fs.writeFileSync(filePath, markdown, 'utf8');

        console.log(`?�� Auto-generated recipe: ${titleKo} (${title})`);
        console.log(`?�� File: ${filePath}`);
        console.log(`?�� Date: ${dateStr}`);
        console.log(`?�� Ingredient: ${ingredient.ko} (${ingredient.en})`);
        console.log(`?��?��?Method: ${method.koMethod} (${method.enMethod})`);
        return;
    }

    console.log('?�️ Could not generate a unique recipe after 100 attempts.');
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

    console.log(`?�� Published from pool: ${recipe.titleKo} (${recipe.title})`);
    console.log(`?�� File: ${filePath}`);
    console.log(`?�� Date: ${dateStr}`);
}

// Run!
generateRecipe();
