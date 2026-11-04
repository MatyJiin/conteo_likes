(function() {
  var previousLikesMap = {};
  var countdown = 15;
  var countdownTimer = null;

  // Datos base garantizados oficiales desde Meta API
  var fallbackData = [
    { "url": "https://www.instagram.com/p/DfTQQT-OWM0/", "shortcode": "DfTQQT-OWM0", "name": "RENATA ARRIAGADA", "likes": 550, "comments": 18, "localImage": "fotos/DfTQQT-OWM0.jpg" },
    { "url": "https://www.instagram.com/p/DfTRB7DOhP5/", "shortcode": "DfTRB7DOhP5", "name": "MAITTE OPAZO", "likes": 392, "comments": 30, "localImage": "fotos/DfTRB7DOhP5.jpg" },
    { "url": "https://www.instagram.com/p/DfTQwh-u8jD/", "shortcode": "DfTQwh-u8jD", "name": "EMILIA FRITSCH", "likes": 210, "comments": 8, "localImage": "fotos/DfTQwh-u8jD.jpg" },
    { "url": "https://www.instagram.com/p/DfTQZ4BuX8u/", "shortcode": "DfTQZ4BuX8u", "name": "ROSA HARO", "likes": 190, "comments": 14, "localImage": "fotos/DfTQZ4BuX8u.jpg" },
    { "url": "https://www.instagram.com/p/DfTQzO9O8bc/", "shortcode": "DfTQzO9O8bc", "name": "ISIADORA LEIVA", "likes": 152, "comments": 13, "localImage": "fotos/DfTQzO9O8bc.jpg" },
    { "url": "https://www.instagram.com/p/DfTQ173OYef/", "shortcode": "DfTQ173OYef", "name": "LEONOR GONZALEZ", "likes": 146, "comments": 0, "localImage": "fotos/DfTQ173OYef.jpg" },
    { "url": "https://www.instagram.com/p/DfTQqfYOlUD/", "shortcode": "DfTQqfYOlUD", "name": "ESTEFANI CARCAMO", "likes": 125, "comments": 0, "localImage": "fotos/DfTQqfYOlUD.jpg" },
    { "url": "https://www.instagram.com/p/DfTQT1eOlfE/", "shortcode": "DfTQT1eOlfE", "name": "FERNANDA GALLARDO", "likes": 120, "comments": 2, "localImage": "fotos/DfTQT1eOlfE.jpg" },
    { "url": "https://www.instagram.com/p/DfTQtpwumd2/", "shortcode": "DfTQtpwumd2", "name": "EMILIA BORQUEZ", "likes": 108, "comments": 2, "localImage": "fotos/DfTQtpwumd2.jpg" },
    { "url": "https://www.instagram.com/p/DfTQ4VWOgnQ/", "shortcode": "DfTQ4VWOgnQ", "name": "LUCIA SOTO", "likes": 85, "comments": 3, "localImage": "fotos/DfTQ4VWOgnQ.jpg" },
    { "url": "https://www.instagram.com/p/DfTQ_Yku8UC/", "shortcode": "DfTQ_Yku8UC", "name": "PALOMA ALVARADO", "likes": 58, "comments": 0, "localImage": "fotos/DfTQ_Yku8UC.jpg" },
    { "url": "https://www.instagram.com/p/DfTQlOMuffA/", "shortcode": "DfTQlOMuffA", "name": "JAVIERA ACUÑA Y DAYHARY PEREZ", "likes": 56, "comments": 1, "localImage": "fotos/DfTQlOMuffA.jpg" },
    { "url": "https://www.instagram.com/p/DfTQ7cLOoRa/", "shortcode": "DfTQ7cLOoRa", "name": "ISADORA MARTINEZ", "likes": 40, "comments": 2, "localImage": "fotos/DfTQ7cLOoRa.jpg" },
    { "url": "https://www.instagram.com/p/DfTQnVYuKlp/", "shortcode": "DfTQnVYuKlp", "name": "VICTOR VEGA", "likes": 31, "comments": 1, "localImage": "fotos/DfTQnVYuKlp.jpg" },
    { "url": "https://www.instagram.com/p/DfTQe-NOAZX/", "shortcode": "DfTQe-NOAZX", "name": "GIANELLA MONSALVE", "likes": 21, "comments": 0, "localImage": "fotos/DfTQe-NOAZX.jpg" },
    { "url": "https://www.instagram.com/p/DfTQcjBu1HN/", "shortcode": "DfTQcjBu1HN", "name": "KEVIN DOMKE Y MATILDA ESPINOZA", "likes": 10, "comments": 5, "localImage": "fotos/DfTQcjBu1HN.jpg" },
    { "url": "https://www.instagram.com/p/DfTQie5Onwa/", "shortcode": "DfTQie5Onwa", "name": "DAMARYS ALVAREZ", "likes": 7, "comments": 2, "localImage": "fotos/DfTQie5Onwa.jpg" }
  ];

  function formatNumber(n) {
    return (n || 0).toLocaleString("es-CL");
  }

  function render(items) {
    if (!Array.isArray(items) || items.length === 0) return;

    items.sort(function(a, b) { return b.likes - a.likes; });

    var maxLikes = items[0].likes || 1;
    var totalLikes = 0;
    items.forEach(function(x) { totalLikes += (x.likes || 0); });

    var totalLikesEl = document.getElementById("statTotalLikes");
    if (totalLikesEl) totalLikesEl.textContent = formatNumber(totalLikes);

    // 1. Render Podio (Top 3)
    var pod = document.getElementById("podium");
    if (pod) {
      pod.innerHTML = "";
      var podiumConfig = [
        { idx: 1, class: "second", label: "🥈 2° Lugar" },
        { idx: 0, class: "first", label: "🥇 1° Lugar" },
        { idx: 2, class: "third", label: "🥉 3° Lugar" }
      ];

      podiumConfig.forEach(function(cfg) {
        var item = items[cfg.idx];
        if (!item) return;

        var card = document.createElement("div");
        card.className = "podium-card " + cfg.class;

        var imgSrc = item.localImage || ("fotos/" + item.shortcode + ".jpg") || item.image;
        var name = item.name || "PARTICIPANTE";

        card.innerHTML = 
          '<div class="podium-badge">' + cfg.label + '</div>' +
          '<div class="podium-img-wrapper">' +
            '<img class="podium-img" src="' + imgSrc + '" alt="' + name + '">' +
          '</div>' +
          '<div class="podium-name">' + name + '</div>' +
          '<div class="podium-likes">' + formatNumber(item.likes) + '</div>' +
          '<div class="podium-comments">' + item.comments + ' comentarios</div>' +
          '<a class="btn-ig" href="' + item.url + '" target="_blank">Ver publicación ↗</a>';

        pod.appendChild(card);
      });
    }

    // 2. Render Lista completa del 1 al 17
    var grid = document.getElementById("contestantsGrid");
    if (grid) {
      grid.innerHTML = "";

      items.forEach(function(item, index) {
        var rank = index + 1;
        var row = document.createElement("div");
        var rankClass = rank === 1 ? "top-1" : (rank === 2 ? "top-2" : (rank === 3 ? "top-3" : ""));
        row.className = "contestant-row " + rankClass;

        var prev = previousLikesMap[item.shortcode];
        if (prev !== undefined && item.likes > prev) {
          row.classList.add("bump");
        }
        previousLikesMap[item.shortcode] = item.likes;

        var imgSrc = item.localImage || ("fotos/" + item.shortcode + ".jpg") || item.image;
        var pct = Math.round((item.likes / maxLikes) * 100);
        var name = item.name || "PARTICIPANTE";

        row.innerHTML = 
          '<div class="rank-badge">#' + rank + '</div>' +
          '<img class="contestant-img" src="' + imgSrc + '" alt="' + name + '">' +
          '<div class="contestant-info">' +
            '<div class="contestant-title">' +
              name +
              '<span class="post-code">' + item.shortcode + '</span>' +
            '</div>' +
            '<div class="bar-container"><div class="bar-fill" style="width: ' + pct + '%"></div></div>' +
          '</div>' +
          '<div class="contestant-metrics">' +
            '<div class="contestant-likes">' + formatNumber(item.likes) + ' <span>likes</span></div>' +
            '<div class="contestant-comments">' + item.comments + ' comentarios</div>' +
          '</div>' +
          '<a class="link-arrow" href="' + item.url + '" target="_blank" title="Abrir en Instagram">↗</a>';

        grid.appendChild(row);
      });
    }
  }

  function fetchLiveData() {
    fetch("/api/data?t=" + Date.now())
      .then(function(r) { return r.json(); })
      .then(function(res) {
        var list = res.data || res;
        if (Array.isArray(list)) {
          render(list);
          if (res.lastUpdate) {
            var timeEl = document.getElementById("statTime");
            if (timeEl) timeEl.textContent = new Date(res.lastUpdate).toLocaleTimeString("es-CL");
          }
        }
      })
      .catch(function() {
        // Fallback para Vercel o archivo estático
        fetch("conteo_resultados.json?t=" + Date.now())
          .then(function(r) { return r.json(); })
          .then(function(items) { render(items); })
          .catch(function() {
            render(fallbackData);
          });
      });
  }

  function startCountdown() {
    clearInterval(countdownTimer);
    countdown = 15;
    countdownTimer = setInterval(function() {
      countdown--;
      if (countdown <= 0) {
        countdown = 15;
        fetchLiveData();
      }
      var countEl = document.getElementById("statCountdown");
      if (countEl) countEl.textContent = "Próxima en " + countdown + "s";
    }, 1000);
  }

  var btnRefresh = document.getElementById("btnRefresh");
  if (btnRefresh) {
    btnRefresh.addEventListener("click", function() {
      btnRefresh.classList.add("loading");
      var icon = document.getElementById("refreshIcon");
      var text = document.getElementById("refreshText");
      if (icon) icon.textContent = "⏳";
      if (text) text.textContent = "Actualizando...";

      fetch("/api/refresh")
        .catch(function() {})
        .then(function() {
          setTimeout(function() {
            fetchLiveData();
            btnRefresh.classList.remove("loading");
            if (icon) icon.textContent = "🔄";
            if (text) text.textContent = "Actualizar";
            startCountdown();
          }, 500);
        });
    });
  }

  // Render inicial
  render(fallbackData);
  fetchLiveData();
  startCountdown();
  // Sondeo de datos en vivo cada 6 segundos
  setInterval(fetchLiveData, 6000);
})();

