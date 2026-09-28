(function(){
  var WA_NUMBER = '51934750374';

  var ADDRESSES = {
    courier: [
      ['Nombres','Tus nombres'],
      ['Apellidos','Tus 2 apellidos'],
      ['Address','8584 NW 56th St'],
      ['Address 2',''],
      ['City','Doral'],
      ['State','Florida'],
      ['Zip Code','33166-3329'],
      ['Phone','+1 (786) 409-7865']
    ],
    viajero: [
      ['Nombres','Tus nombres'],
      ['Apellidos','Tus 2 apellidos'],
      ['Address','8584 NW 56th St'],
      ['Address 2',''],
      ['City','Doral'],
      ['State','Florida'],
      ['Zip Code','33166-3329'],
      ['Phone','+1 (786) 409-7865']
    ],
    iphone18: [
      ['Nombres','WEX'],
      ['Apellidos','Tus nombres y tus 2 apellidos'],
      ['Address','8852 West McNab Rd, Apt 201'],
      ['Address 2',''],
      ['City','Tamarac'],
      ['State','Florida'],
      ['Zip Code','33321'],
      ['Phone','+1 (305) 213-4121']
    ]
  };

  function greeting(){
    var h = new Date().getHours();
    if (h >= 5 && h < 12) return 'Buenos días';
    if (h >= 12 && h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }

  var WA_DOCS_MSG = {
    courier: function(){ return greeting() + ', mi producto ya llegó al almacén. Voy a enviarte el tracking number, la factura comercial y mi documento de identidad para la importación.'; },
    viajero: function(){ return greeting() + ', mi producto ya llegó al almacén. Voy a enviarte el tracking number, la factura comercial y mi documento de identidad para la importación.'; },
    iphone18: function(){ return greeting() + ', mi iPhone 18 ya llegó al almacén. Voy a enviarte el tracking number, la factura comercial y mi documento de identidad para la importación.'; }
  };

  function waLink(text){
    return 'https://wa.me/' + WA_NUMBER + (text ? '?text=' + encodeURIComponent(text) : '');
  }

  function showToast(msg){
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function(){ t.classList.remove('show'); }, 1600);
  }

  function copyText(text){
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch(e){}
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  // tabs
  var tabs = document.querySelectorAll('.tab');
  var panels = document.querySelectorAll('.panel');
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      var target = tab.getAttribute('data-tab');
      tabs.forEach(function(t){
        var active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      panels.forEach(function(p){
        var show = p.getAttribute('data-panel') === target;
        p.hidden = !show;
        if (show) {
          p.classList.remove('enter');
          void p.offsetWidth;
          p.classList.add('enter');
        }
      });
      window.scrollTo({top: 0, behavior:'smooth'});
    });
  });
  var activePanel = document.querySelector('.panel:not([hidden])');
  if (activePanel) activePanel.classList.add('enter');

  function flashCopied(btn, label){
    var original = btn.textContent;
    btn.textContent = label || '✓ Copiado';
    btn.classList.add('copied');
    clearTimeout(btn._t);
    btn._t = setTimeout(function(){
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 1400);
  }

  // per-field copy buttons
  document.querySelectorAll('[data-copy-target]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var row = btn.closest('.row');
      var val = row.querySelector('.v').getAttribute('data-copy');
      copyText(val).then(function(){ flashCopied(btn, '✓'); showToast('Copiado: ' + val); });
    });
  });

  // copy full address
  document.querySelectorAll('[data-copy-all]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var key = btn.getAttribute('data-copy-all');
      var lines = ADDRESSES[key].map(function(f){
        return f[0] + ': ' + (f[1] || '(dejar vacío)');
      });
      copyText(lines.join('\n')).then(function(){ flashCopied(btn, '✓ Dirección copiada'); showToast('Dirección copiada'); });
    });
  });

  // copy provider message
  document.querySelectorAll('[data-copy-msg]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var el = document.getElementById(btn.getAttribute('data-copy-msg'));
      copyText(el.textContent).then(function(){ flashCopied(btn, '✓ Mensaje copiado'); showToast('Mensaje copiado'); });
    });
  });

  document.getElementById('waHeader').href = waLink('Hola, quisiera información sobre el envío con SKAY COURIER.');
  document.getElementById('waFloat').href = waLink('Hola, quisiera información sobre el envío con SKAY COURIER.');

  // whatsapp links for "Enviar documentos" — el saludo se recalcula justo al hacer clic,
  // no al cargar la página, para que siempre coincida con la hora real de envío.
  document.querySelectorAll('[data-wa-docs]').forEach(function(a){
    var panel = a.closest('.panel').getAttribute('data-panel');
    a.addEventListener('click', function(){
      a.href = waLink(WA_DOCS_MSG[panel]());
    });
  });
})();
