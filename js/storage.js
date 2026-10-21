/* Versioned localStorage persistence, validation and backup parsing. */
(function (LX) {
  LX.SAVE_KEY = 'life-exe:save:v1';

  LX.createInitialState = function () {
    var cx = {};
    Object.keys(LX.CATS).forEach(function (c) { cx[c] = 0; });
    return {
      version: 1,
      player: { name: '', totalXP: 0, coins: 0, createdAt: new Date().toISOString() },
      settings: { reducedMotion: false },
      missions: [], achievements: [], inventory: [], worldObjects: [],
      categoryXP: cx, history: [], dailyActivity: {}
    };
  };

  LX.isValidSave = function (s) {
    return !!s && s.version === 1 && !!s.player && typeof s.player.totalXP === 'number' &&
      typeof s.player.coins === 'number' && Array.isArray(s.missions) && Array.isArray(s.history) &&
      Array.isArray(s.achievements) && Array.isArray(s.inventory) && Array.isArray(s.worldObjects) &&
      !!s.categoryXP && !!s.dailyActivity;
  };

  LX.loadState = function () {
    try {
      var j = JSON.parse(localStorage.getItem(LX.SAVE_KEY));
      if (LX.isValidSave(j)) return j;
    } catch (e) { /* corrupted or unavailable: start clean */ }
    return LX.createInitialState();
  };

  LX.saveState = function (s) {
    try { localStorage.setItem(LX.SAVE_KEY, JSON.stringify(s)); return true; }
    catch (e) { return false; }
  };

  LX.parseBackup = function (text) {
    try { var j = JSON.parse(text); return LX.isValidSave(j) ? j : null; }
    catch (e) { return null; }
  };
})(window.LX);
