(function () {
  // Only run if mermaid is available
  function ready(cb) {
    if (document.readyState !== 'loading') cb();
    else document.addEventListener('DOMContentLoaded', cb);
  }

  function renderMermaids() {
    if (typeof mermaid === 'undefined') return;
    // Initialize mermaid once (no autostart)
    try {
      mermaid.initialize({ startOnLoad: false });
    } catch (e) {}

    // Query for Mermaid code blocks and already-marked mermaid divs
    var candidates = document.querySelectorAll('pre[class*="language-mermaid"], code.language-mermaid, div.mermaid');
    candidates.forEach(function (node) {
      // Skip if already rendered (div.mermaid containing svg)
      if (node.classList.contains('mermaid') && node.querySelector('svg')) return;

      var codeText = '';
      if (node.tagName.toLowerCase() === 'pre') {
        var codeEl = node.querySelector('code');
        codeText = (codeEl ? codeEl.textContent : node.textContent).trim();
      } else {
        codeText = node.textContent.trim();
      }
      if (!codeText) return;

      var id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
      try {
        // mermaid v8/v9 compatibility: use mermaidAPI.render or mermaid.render
        if (mermaid.mermaidAPI && typeof mermaid.mermaidAPI.render === 'function') {
          var wrapper = document.createElement('div');
          mermaid.mermaidAPI.render(id, codeText, function (svgCode) {
            wrapper.className = 'mermaid';
            wrapper.innerHTML = svgCode;
            node.parentNode.replaceChild(wrapper, node);
          });
        } else if (typeof mermaid.render === 'function') {
          var svg = mermaid.render(id, codeText);
          var wrapper2 = document.createElement('div');
          wrapper2.className = 'mermaid';
          wrapper2.innerHTML = svg;
          node.parentNode.replaceChild(wrapper2, node);
        } else {
          // Fallback - mark as mermaid to possibly be detected later
          node.classList.add('mermaid');
        }
      } catch (err) {
        console.warn('Mermaid render error:', err);
      }
    });
  }

  ready(function () {
    renderMermaids();

    // Re-render on navigation mutations (mkdocs-material swaps content dynamically)
    var main = document.querySelector('main') || document.querySelector('.md-content');
    if (main) {
      var observer = new MutationObserver(function () {
        renderMermaids();
      });
      observer.observe(main, { childList: true, subtree: true });
    }

    // Also re-render on hashchange (some navigation patterns)
    window.addEventListener('hashchange', function () {
      renderMermaids();
    }, false);
  });
})();
