/* RBS Soluções Elétricas
   Movimento leve e motivado: header que ganha corpo ao rolar, revelação
   das seções, divisória de pulso que se desenha, comparador antes e depois
   e carrossel de avaliações. Tudo desliga sob prefers-reduced-motion. */

(function () {
  'use strict';

  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------- divisória de pulso */
  var PULSO =
    '<span></span>' +
    '<svg viewBox="0 0 132 38" role="presentation" focusable="false">' +
    '<polyline points="0,19 40,19 50,5 60,33 70,12 78,19 132,19"/>' +
    '</svg>' +
    '<span></span>';

  document.querySelectorAll('[data-pulso]').forEach(function (el) {
    el.innerHTML = PULSO;
    el.setAttribute('aria-hidden', 'true');
  });

  /* ------------------------------------------------- header ao rolar */
  var topo = document.getElementById('topo');

  function marcarRolagem() {
    topo.classList.toggle('rolado', window.scrollY > 24);
  }
  marcarRolagem();
  window.addEventListener('scroll', marcarRolagem, { passive: true });

  /* ------------------------------------------------------ menu mobile */
  var gaveta = document.getElementById('gaveta');
  var abrir = document.getElementById('abrir-menu');
  var fechar = document.getElementById('fechar-menu');

  function abrirMenu() {
    gaveta.hidden = false;
    requestAnimationFrame(function () { gaveta.classList.add('aberta'); });
    abrir.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    fechar.focus();
  }

  function fecharMenu() {
    gaveta.classList.remove('aberta');
    abrir.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    window.setTimeout(function () { gaveta.hidden = true; }, semMovimento ? 0 : 320);
  }

  abrir.addEventListener('click', abrirMenu);
  fechar.addEventListener('click', fecharMenu);
  gaveta.addEventListener('click', function (e) {
    if (e.target === gaveta || e.target.closest('a')) fecharMenu();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && gaveta.classList.contains('aberta')) {
      fecharMenu();
      abrir.focus();
    }
  });

  /* -------------------------------------------- revelação no scroll */
  var alvos = document.querySelectorAll('.revelar, .pulso');

  if (semMovimento || !('IntersectionObserver' in window)) {
    alvos.forEach(function (el) { el.classList.add('visivel'); });
  } else {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        var el = entrada.target;
        var irmaos = el.parentElement ? el.parentElement.children : [];
        var indice = Array.prototype.indexOf.call(irmaos, el);
        el.style.setProperty('--atraso', Math.min(indice, 5) * 70 + 'ms');
        el.classList.add('visivel');
        observador.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    alvos.forEach(function (el) { observador.observe(el); });
  }

  /* -------------------------------------- comparador antes e depois */
  var comparador = document.getElementById('comparador');
  var corte = document.getElementById('corte');

  if (comparador && corte) {
    var aplicar = function () {
      comparador.style.setProperty('--corte', corte.value + '%');
    };
    corte.addEventListener('input', aplicar);
    aplicar();
  }

  /* ------------------------------------------ carrossel de avaliações */
  var trilho = document.getElementById('trilho');
  var ant = document.getElementById('ant');
  var prox = document.getElementById('prox');

  if (trilho && ant && prox) {
    var passo = function () {
      var card = trilho.firstElementChild;
      if (!card) return trilho.clientWidth;
      var estilo = window.getComputedStyle(trilho);
      return card.getBoundingClientRect().width + parseFloat(estilo.columnGap || 0);
    };
    var deslizar = function (direcao) {
      trilho.scrollBy({
        left: direcao * passo(),
        behavior: semMovimento ? 'auto' : 'smooth'
      });
    };
    ant.addEventListener('click', function () { deslizar(-1); });
    prox.addEventListener('click', function () { deslizar(1); });
  }
})();
