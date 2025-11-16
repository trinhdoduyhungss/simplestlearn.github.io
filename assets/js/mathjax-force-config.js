window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true,
    processEnvironments: true
  },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
  }
};

document.addEventListener('DOMContentLoaded', (event) => {
    // Delay to ensure all content is loaded
    setTimeout(() => {
        if (window.MathJax && window.MathJax.typeset) {
            console.log('Forcing MathJax to re-render...');
            window.MathJax.typeset();
        }
    }, 500); // 500ms delay as a safeguard
});