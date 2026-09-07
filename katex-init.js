(() => {
  const options = {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false }
    ],
    ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'annotation', 'annotation-xml', 'svg'],
    throwOnError: false
  };

  function renderMath(root = document.body) {
    if (!root || typeof window.renderMathInElement !== 'function') return;
    window.renderMathInElement(root, options);
  }

  window.renderSphereMath = renderMath;

  document.addEventListener('DOMContentLoaded', () => {
    renderMath();

    // Render formulas added later by quiz feedback and calculation tools.
    let queued = false;
    const observer = new MutationObserver((mutations) => {
      if (queued || !mutations.some(({ addedNodes }) => addedNodes.length)) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        mutations.forEach(({ addedNodes }) => addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && !node.closest?.('.katex')) renderMath(node);
        }));
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
