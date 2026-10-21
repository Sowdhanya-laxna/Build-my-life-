/* Game rules. Every function takes a state and returns { state, notes, error? } without mutating the input. */
(function (LX) {
  var uid = function () { return Math.random().toString(36).slice(2, 9) + Date.now().toString(36); };
  var log = function (s, type, extra) {
    s.history.push(Object.assign({ id: uid(), type: type, timestamp: new Date().toISOString() }, extra));
  };
  var clone = function (s) { return JSON.parse(JSON.stringify(s)); };

  // Unlock newly eligible buildings and achievements (mutates the cloned state).
  LX.evaluate = function (s, notes) {
    var level = LX.getLevel(s.player.totalXP);
    LX.BUILDINGS.forEach(function (b) {
      if (!s.worldObjects.includes(b.id) && level >= b.requiredLevel && s.categoryXP[b.category] >= b.requiredCategoryXP) {
        s.worldObjects.push(b.id);
        log(s, 'building_unlocked', { label: 'Unlocked ' + b.name });
        notes.push('🏗️ ' + b.name + ' unlocked');
      }
    });
    LX.ACHIEVEMENTS.forEach(function (a) {
      if (!s.achievements.includes(a.id) && a.test(s)) {
        s.achievements.push(a.id);
        log(s, 'achievement_unlocked', { label: 'Earned ' + a.name });
        notes.push(a.e + ' ' + a.name);
      }
    });
  };

  LX.startGame = function (state, name) {
    var s = clone(state), notes = [];
    s.player.name = name;
    log(s, 'journey_started', { label: 'Your journey began' });
    LX.evaluate(s, notes);
    return { state: s, notes: [] };
  };

  LX.addMission = function (state, m) {
    var s = clone(state);
    s.missions.push({ id: uid(), title: m.title, category: m.category, difficulty: m.difficulty,
      status: 'pending', createdAt: new Date().toISOString(), completedAt: null, rewardClaimed: false });
    return { state: s, notes: [] };
  };

  LX.archiveMission = function (state, id) {
    var s = clone(state);
    var m = s.missions.find(function (x) { return x.id === id; });
    if (m && m.status === 'pending') m.status = 'archived';
    return { state: s, notes: [] };
  };

  LX.completeMission = function (state, id) {
    var found = state.missions.find(function (x) { return x.id === id; });
    if (!found || found.status !== 'pending' || found.rewardClaimed) return { state: state, notes: [] };

    var s = clone(state), notes = [];
    var m = s.missions.find(function (x) { return x.id === id; });
    var r = LX.getMissionReward(m.difficulty), oldLevel = LX.getLevel(s.player.totalXP);

    m.status = 'completed'; m.rewardClaimed = true; m.completedAt = new Date().toISOString();
    s.player.totalXP += r.xp; s.player.coins += r.coins; s.categoryXP[m.category] += r.xp;
    var day = LX.dayKey(); s.dailyActivity[day] = (s.dailyActivity[day] || 0) + 1;

    log(s, 'mission_completed', { missionId: id, xpEarned: r.xp, coinsEarned: r.coins, label: 'Completed “' + m.title + '”' });
    notes.push('+' + r.xp + ' XP, +' + r.coins + ' 🪙');

    var newLevel = LX.getLevel(s.player.totalXP);
    for (var l = oldLevel + 1; l <= newLevel; l++) {
      log(s, 'level_up', { label: 'Reached level ' + l });
      notes.push('⬆️ Level ' + l);
    }
    LX.evaluate(s, notes);
    return { state: s, notes: notes };
  };

  LX.buyItem = function (state, id) {
    var item = LX.SHOP.find(function (i) { return i.id === id; });
    if (!item || state.inventory.includes(id)) return { state: state, notes: [] };
    if (state.player.coins < item.price) return { state: state, notes: [], error: 'Not enough coins yet' };
    var s = clone(state), notes = [];
    s.player.coins -= item.price; s.inventory.push(id);
    log(s, 'item_purchased', { label: 'Bought ' + item.name });
    notes.push(item.e + ' ' + item.name + ' added to your island');
    LX.evaluate(s, notes);
    return { state: s, notes: notes };
  };
})(window.LX);
