/* Entry point: owns state, wires events, renders. */
(function (LX) {
  var S = LX.loadState(), ctx = { tab: 'island', flt: 'all', armed: false }, timer;
  var $ = function (s) { return document.querySelector(s); };

  function toast(t) {
    var el = $('#toast'); el.textContent = t; el.style.display = 'block';
    clearTimeout(timer); timer = setTimeout(function () { el.style.display = 'none'; }, 3200);
  }
  function render() { $('#app').innerHTML = LX.ui.screen(S, ctx); }
  function apply(r) {
    if (r.error) return toast(r.error);
    S = r.state;
    if (!LX.saveState(S)) toast('Couldn’t save to this browser');
    if (r.notes.length) toast(r.notes.join(' · '));
    render();
  }

  var actions = {
    tab: function (id) { ctx.tab = id; ctx.armed = false; render(); },
    flt: function (id) { ctx.flt = id; render(); },
    start: function () {
      var n = $('#name').value.trim().slice(0, 24);
      if (!n) return toast('Choose a name first');
      apply(LX.startGame(S, n));
    },
    add: function () {
      var t = $('#mt').value.trim().slice(0, 80);
      if (!t) return toast('Give your mission a title');
      apply(LX.addMission(S, { title: t, category: $('#mc').value, difficulty: $('#md').value }));
    },
    done: function (id) { apply(LX.completeMission(S, id)); },
    arch: function (id) { apply(LX.archiveMission(S, id)); },
    buy: function (id) { apply(LX.buyItem(S, id)); },
    imp: function () {
      var j = LX.parseBackup($('#im').value);
      if (!j) return toast('That isn’t a valid Life.exe backup');
      S = j; LX.saveState(S); toast('Backup restored'); render();
    },
    reset: function () {
      if (!ctx.armed) { ctx.armed = true; return render(); }
      S = LX.createInitialState(); LX.saveState(S); ctx.armed = false; ctx.tab = 'island'; render();
    }
  };

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]');
    if (b && actions[b.dataset.a]) actions[b.dataset.a](b.dataset.id);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    if (e.target.id === 'mt') actions.add();
    if (e.target.id === 'name') actions.start();
  });

  render();
})(window.LX);
