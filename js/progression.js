/* Level maths, streaks and date helpers. */
(function (LX) {
  LX.getMissionReward = function (d) { return LX.REWARDS[d] || LX.REWARDS.easy; };

  // Cumulative XP to reach level n: 100, 250, 450 ... 2700 (level 10), same curve beyond.
  LX.levelThreshold = function (n) { return 25 * (n - 1) * (n + 2); };

  LX.getLevel = function (xp) {
    var l = 1;
    while (xp >= LX.levelThreshold(l + 1)) l++;
    return l;
  };

  LX.levelProgress = function (xp) {
    var level = LX.getLevel(xp), start = LX.levelThreshold(level);
    var need = LX.levelThreshold(level + 1) - start, earned = xp - start;
    return { level: level, earned: earned, need: need, percent: Math.round(earned / need * 100) };
  };

  LX.dayKey = function (d) {
    d = d || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };

  // Gentle streak: counts back from today, or from yesterday if today is still empty.
  LX.getStreak = function (daily) {
    var n = 0, d = new Date();
    if (!daily[LX.dayKey(d)]) d.setDate(d.getDate() - 1);
    while (daily[LX.dayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  };

  LX.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
})(window.LX);
