/* Game content: categories, rewards, buildings, shop, achievements. */
window.LX = window.LX || {};
(function (LX) {
  LX.CATS = { learning: '📚', fitness: '🏃', creativity: '🎨', career: '💼', mindfulness: '🧘', personal: '🌱' };

  LX.REWARDS = {
    tiny:   { xp: 10, coins: 3 },
    easy:   { xp: 20, coins: 5 },
    medium: { xp: 35, coins: 8 },
    hard:   { xp: 55, coins: 12 },
    epic:   { xp: 80, coins: 18 }
  };

  // p = [x, y] position on the 640x340 island scene
  LX.BUILDINGS = [
    { id: 'home',     name: 'Starter Home',      e: '🏠', category: 'personal',    requiredLevel: 1, requiredCategoryXP: 0,   p: [320, 170] },
    { id: 'library',  name: 'Knowledge Library', e: '🏛️', category: 'learning',    requiredLevel: 3, requiredCategoryXP: 100, p: [200, 150] },
    { id: 'studio',   name: 'Creative Studio',   e: '🎭', category: 'creativity',  requiredLevel: 3, requiredCategoryXP: 100, p: [440, 150] },
    { id: 'trail',    name: 'Forest Trail',      e: '🌲', category: 'fitness',     requiredLevel: 3, requiredCategoryXP: 100, p: [140, 215] },
    { id: 'workshop', name: 'Workshop',          e: '🛠️', category: 'career',      requiredLevel: 3, requiredCategoryXP: 100, p: [500, 215] },
    { id: 'zen',      name: 'Zen Garden',        e: '⛩️', category: 'mindfulness', requiredLevel: 3, requiredCategoryXP: 100, p: [240, 240] },
    { id: 'plaza',    name: 'Gathering Plaza',   e: '⛲', category: 'personal',    requiredLevel: 5, requiredCategoryXP: 150, p: [400, 240] }
  ];

  LX.SHOP = [
    { id: 'bench',   name: 'Garden bench',  e: '🪑', price: 20,  desc: 'A resting spot near the path.', p: [330, 225] },
    { id: 'crystal', name: 'Glow crystal',  e: '💎', price: 50,  desc: 'A glowing landmark.',           p: [320, 115] },
    { id: 'bridge',  name: 'Wooden bridge', e: '🌉', price: 100, desc: 'Crosses the stream.',           p: [560, 270] }
  ];

  var done = function (s) { return s.missions.filter(function (m) { return m.status === 'completed'; }).length; };

  LX.ACHIEVEMENTS = [
    { id: 'first', name: 'First Step',       e: '👣', desc: 'Complete your first mission',  test: function (s) { return done(s) >= 1; } },
    { id: 'seed',  name: 'Seed Planter',     e: '🌰', desc: 'Complete 10 missions',         test: function (s) { return done(s) >= 10; } },
    { id: 'kk',    name: 'Knowledge Keeper', e: '📖', desc: 'Earn 200 learning XP',         test: function (s) { return s.categoryXP.learning >= 200; } },
    { id: 'cs',    name: 'Creative Spark',   e: '✨', desc: 'Earn 200 creativity XP',       test: function (s) { return s.categoryXP.creativity >= 200; } },
    { id: 'week',  name: 'Week of Growth',   e: '🌟', desc: 'Be active on 7 distinct days', test: function (s) { return Object.keys(s.dailyActivity).length >= 7; } },
    { id: 'wb',    name: 'World Builder',    e: '🗺️', desc: 'Unlock 10 world objects',      test: function (s) { return s.worldObjects.length + s.inventory.length >= 10; } }
  ];
})(window.LX);
