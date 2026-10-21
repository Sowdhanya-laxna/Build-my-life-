/* Screens: pure functions that turn state into HTML strings. */
(function (LX) {
  var esc = LX.esc, C = LX.CATS;
  var TABS = [['island', '🏝️ Island'], ['missions', '🎯 Missions'], ['shop', '🛒 Shop'],
              ['badges', '🏆 Badges'], ['chronicle', '📜 Chronicle'], ['settings', '⚙️ Settings']];
  var countDone = function (s) { return s.missions.filter(function (m) { return m.status === 'completed'; }).length; };

  function welcome() {
    return '<div class="card welcome"><h1>Life.exe</h1><p class="mu">Build a life worth logging into.</p>' +
      '<p>Complete real-life missions, earn XP, and watch your island grow.</p>' +
      '<div class="row"><input id="name" maxlength="24" placeholder="Your name" aria-label="Your name"><button data-a="start">Start</button></div></div>';
  }

  function header(S) {
    var p = LX.levelProgress(S.player.totalXP);
    return '<header><b style="color:var(--ac);font-size:18px">Life.exe</b> · ' + esc(S.player.name) + ' · Level ' + p.level +
      '<div class="bar"><i style="width:' + p.percent + '%"></i></div><small>' + p.earned + '/' + p.need + ' XP to level ' + (p.level + 1) +
      ' · ' + S.player.totalXP + ' lifetime XP · 🪙 ' + S.player.coins + ' · 🔥 ' + LX.getStreak(S.dailyActivity) + '-day streak</small></header>';
  }

  function nav(tab) {
    return '<nav>' + TABS.map(function (t) {
      return '<button class="' + (tab === t[0] ? 'on' : '') + '" data-a="tab" data-id="' + t[0] + '">' + t[1] + '</button>';
    }).join('') + '</nav>';
  }

  function missionRow(m) {
    var r = LX.REWARDS[m.difficulty];
    return '<li><span>' + C[m.category] + ' ' + esc(m.title) + '<br><small>' + m.difficulty + ' · +' + r.xp + ' XP · +' + r.coins + ' 🪙</small></span>' +
      '<span><button data-a="done" data-id="' + m.id + '">Complete</button> <button class="g" aria-label="Archive" data-a="arch" data-id="' + m.id + '">🗄️</button></span></li>';
  }

  function island(S) {
    var h = new Date().getHours(), night = h < 6 || h >= 19;
    var objs = LX.BUILDINGS.filter(function (b) { return S.worldObjects.includes(b.id); })
      .concat(LX.SHOP.filter(function (i) { return S.inventory.includes(i.id); }));
    var next = LX.BUILDINGS.find(function (b) { return !S.worldObjects.includes(b.id); });
    var pending = S.missions.filter(function (m) { return m.status === 'pending'; }).slice(0, 4);
    return '<svg class="scene" viewBox="0 0 640 340" role="img" aria-label="Your island">' +
      '<rect width="640" height="340" fill="' + (night ? '#0b1230' : '#7fc8e8') + '"/>' +
      '<circle cx="560" cy="50" r="20" fill="' + (night ? '#f2f3ea' : '#F5C76B') + '"/>' +
      '<ellipse cx="320" cy="255" rx="300" ry="70" fill="' + (night ? '#16324a' : '#3a8fb7') + '"/>' +
      '<ellipse cx="320" cy="220" rx="250" ry="75" fill="#c9b27c"/><ellipse cx="320" cy="208" rx="235" ry="68" fill="#4f9a5a"/>' +
      objs.map(function (o, i) {
        return '<text class="o" x="' + o.p[0] + '" y="' + o.p[1] + '" font-size="36" text-anchor="middle" style="animation-delay:' + (i * 0.4) + 's"><title>' + o.name + '</title>' + o.e + '</text>';
      }).join('') + '</svg>' +
      '<p class="mu">' + (next
        ? 'Next unlock: <b style="color:var(--tx)">' + next.name + '</b> — level ' + next.requiredLevel + ' and ' + next.requiredCategoryXP + ' ' + C[next.category] + ' ' + next.category + ' XP (you have ' + S.categoryXP[next.category] + ')'
        : 'Every district is unlocked. Keep building!') + '</p>' +
      '<div class="card"><h2>Today’s missions</h2>' + (pending.length ? '<ul>' + pending.map(missionRow).join('') + '</ul>'
        : '<p class="mu">Nothing pending. Add a mission on the Missions tab.</p>') + '</div>';
  }

  function missions(S, ctx) {
    var opts = Object.keys(C).map(function (k) { return '<option value="' + k + '">' + C[k] + ' ' + k + '</option>'; }).join('');
    var diffs = Object.keys(LX.REWARDS).map(function (k) { return '<option value="' + k + '"' + (k === 'easy' ? ' selected' : '') + '>' + k + '</option>'; }).join('');
    var list = S.missions.filter(function (m) { return m.status === 'pending' && (ctx.flt === 'all' || m.category === ctx.flt); });
    var recent = S.missions.filter(function (m) { return m.status === 'completed'; }).slice(-5).reverse();
    return '<div class="card"><h2>New mission</h2><div class="row"><input id="mt" maxlength="80" placeholder="e.g. Practice coding for 30 minutes" aria-label="Mission title">' +
      '<select id="mc" aria-label="Category">' + opts + '</select><select id="md" aria-label="Difficulty">' + diffs + '</select><button data-a="add">Add</button></div></div>' +
      '<div class="card"><h2>Mission board</h2><div class="row">' + ['all'].concat(Object.keys(C)).map(function (c) {
        return '<button class="' + (ctx.flt === c ? '' : 'g') + '" data-a="flt" data-id="' + c + '">' + (C[c] || '') + ' ' + c + '</button>';
      }).join('') + '</div>' + (list.length ? '<ul>' + list.map(missionRow).join('') + '</ul>' : '<p class="mu">No pending missions here.</p>') + '</div>' +
      (recent.length ? '<div class="card"><h2>Recently completed</h2><ul>' + recent.map(function (m) {
        return '<li><span>✅ ' + esc(m.title) + '</span><small>' + new Date(m.completedAt).toLocaleDateString() + '</small></li>';
      }).join('') + '</ul></div>' : '');
  }

  function shop(S) {
    return '<div class="card"><h2>Decoration shop</h2><p class="mu">You have 🪙 ' + S.player.coins + '. Missions earn coins.</p><ul>' + LX.SHOP.map(function (i) {
      return '<li><span>' + i.e + ' <b>' + i.name + '</b><br><small>' + i.desc + '</small></span>' +
        (S.inventory.includes(i.id) ? '<small>Owned ✓</small>' : '<button data-a="buy" data-id="' + i.id + '">' + i.price + ' 🪙</button>') + '</li>';
    }).join('') + '</ul></div><div class="card"><h2>Districts</h2><div class="grid">' + LX.BUILDINGS.map(function (b) {
      return '<div class="' + (S.worldObjects.includes(b.id) ? '' : 'lock') + '">' + b.e + ' <b>' + b.name + '</b><br><small>Lv ' + b.requiredLevel + ' · ' + b.requiredCategoryXP + ' ' + b.category + ' XP</small></div>';
    }).join('') + '</div></div>';
  }

  function badges(S) {
    return '<div class="card"><h2>Achievements (' + S.achievements.length + '/' + LX.ACHIEVEMENTS.length + ')</h2><div class="grid">' + LX.ACHIEVEMENTS.map(function (a) {
      return '<div class="' + (S.achievements.includes(a.id) ? '' : 'lock') + '">' + a.e + ' <b>' + a.name + '</b><br><small>' + a.desc + '</small></div>';
    }).join('') + '</div></div>';
  }

  function bars(rows) {
    var max = Math.max.apply(null, [1].concat(rows.map(function (r) { return r[1]; })));
    return rows.map(function (r) {
      return '<div class="bw"><span>' + r[0] + '</span><div class="bar"><i style="width:' + (r[1] / max * 100) + '%"></i></div><small>' + r[1] + '</small></div>';
    }).join('');
  }

  function chronicle(S) {
    var days = [];
    for (var i = 0; i < 7; i++) {
      var d = new Date(); d.setDate(d.getDate() - 6 + i);
      days.push([d.toLocaleDateString(undefined, { weekday: 'short' }), S.dailyActivity[LX.dayKey(d)] || 0]);
    }
    var coins = S.history.reduce(function (a, e) { return a + (e.coinsEarned || 0); }, 0);
    var events = S.history.slice().reverse().slice(0, 40);
    return '<div class="card"><h2>Statistics</h2><p>' + S.player.totalXP + ' XP · ' + countDone(S) + ' missions done · ' + coins + ' coins earned · ' + LX.getStreak(S.dailyActivity) + '-day streak</p>' +
      '<small>Missions completed, last 7 days</small>' + bars(days) +
      '<small>Category balance (XP)</small>' + bars(Object.keys(C).map(function (c) { return [C[c] + ' ' + c, S.categoryXP[c]]; })) + '</div>' +
      '<div class="card"><h2>World Chronicle</h2><ul>' + (events.length ? events.map(function (e) {
        return '<li><span>' + esc(e.label || e.type) + '</span><small>' + new Date(e.timestamp).toLocaleString() + '</small></li>';
      }).join('') : '<li class="mu">Your story starts with your first mission.</li>') + '</ul></div>';
  }

  function settings(S, ctx) {
    return '<div class="card"><h2>Backup</h2><p class="mu">Copy this text somewhere safe to back up your save.</p><textarea readonly aria-label="Export" onclick="this.select()">' + esc(JSON.stringify(S)) + '</textarea></div>' +
      '<div class="card"><h2>Restore</h2><textarea id="im" placeholder="Paste a backup here" aria-label="Import"></textarea><p><button data-a="imp">Import backup</button></p></div>' +
      '<div class="card"><h2>Reset</h2><p class="mu">This erases all progress in this browser.</p><button class="g" data-a="reset">' + (ctx.armed ? 'Tap again to confirm reset' : 'Reset game') + '</button></div>';
  }

  LX.ui = {
    screen: function (S, ctx) {
      if (!S.player.name) return welcome();
      var views = { island: island, missions: missions, shop: shop, badges: badges, chronicle: chronicle, settings: settings };
      return header(S) + nav(ctx.tab) + views[ctx.tab](S, ctx);
    }
  };
})(window.LX);
