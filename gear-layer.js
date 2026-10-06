'use strict';

/*
 * ENGLISH QUEST v1.6.1 — equipment image layer
 *
 * Existing learning logic in app.js is unchanged.
 * Reads the equipment tier already calculated by app.js and overlays
 * the matching transparent PNG on the fixed hero base.
 *
 * tier 1..7 -> 0, 5, 15, 30, 50, 75, 100 %
 */

(() => {
  const PERCENTS = [0, 5, 15, 30, 50, 75, 100];

  const ASSETS = {
    hero: './assets/hero/hero_base_front.png',
    shoes: {
      nameId: 'gear-shoes-name',
      layerId: 'hero-shoes-layer',
      path: p => `./assets/equipment/shoes/shoes_${p}.png`
    },
    shield: {
      nameId: 'gear-shield-name',
      layerId: 'hero-shield-layer',
      path: p => `./assets/equipment/shields/shield_${p}.png`
    },
    sword: {
      nameId: 'gear-sword-name',
      layerId: 'hero-sword-layer',
      path: p => `./assets/equipment/swords/sword_${p}.png`
    },
    outfit: {
      nameId: 'gear-outfit-name',
      layerId: 'hero-outfit-layer',
      path: p => `./assets/equipment/outfits/outfit_${p}.png`
    }
  };

  function injectStyle() {
    if (document.getElementById('gear-layer-style')) return;

    const style = document.createElement('style');
    style.id = 'gear-layer-style';
    style.textContent = `
      .hero-gear-badges{
        display:none !important;
      }

      .hero-sprite-stack{
        position:relative;
        width:min(100%,220px);
        aspect-ratio:1/1;
        display:block;
        flex:0 0 auto;
      }

      .hero-sprite-stack .hero-sprite{
        position:absolute !important;
        inset:0 !important;
        display:block;
        width:100% !important;
        height:100% !important;
        max-width:none !important;
        object-fit:contain !important;
        image-rendering:pixelated !important;
        pointer-events:none;
      }

      .hero-sprite-stack .hero-base{z-index:1}
      .hero-sprite-stack .hero-outfit-layer{z-index:2}
      .hero-sprite-stack .hero-shoes-layer{z-index:3}
      .hero-sprite-stack .hero-shield-layer{z-index:4}
      .hero-sprite-stack .hero-sword-layer{z-index:5}
      .hero-sprite-stack .hero-sprite[hidden]{display:none !important}

      @media(max-width:680px){
        .hero-sprite-stack{width:min(100%,205px)}
      }
    `;
    document.head.appendChild(style);
  }

  function makeLayer(id, className) {
    const img = document.createElement('img');
    img.id = id;
    img.className = `hero-sprite ${className}`;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.hidden = true;
    img.decoding = 'async';
    return img;
  }

  function prepareStack() {
    const visual = document.querySelector('.hero-visual');
    const base = document.getElementById('hero-key');
    if (!visual || !base) return null;

    let stack = document.getElementById('hero-sprite-stack');
    if (stack) return stack;

    stack = document.createElement('div');
    stack.id = 'hero-sprite-stack';
    stack.className = 'hero-sprite-stack';
    stack.setAttribute('aria-label', base.alt || '街の冒険少年');

    const fallbackBase = base.getAttribute('src') || './hero-key.png';
    base.dataset.fallbackSrc = fallbackBase;
    base.classList.add('hero-sprite', 'hero-base');

    visual.insertBefore(stack, base);
    stack.appendChild(base);

    [
      makeLayer('hero-outfit-layer', 'hero-outfit-layer'),
      makeLayer('hero-shoes-layer', 'hero-shoes-layer'),
      makeLayer('hero-shield-layer', 'hero-shield-layer'),
      makeLayer('hero-sword-layer', 'hero-sword-layer')
    ].forEach(layer => stack.appendChild(layer));

    const fallback = base.dataset.fallbackSrc;
    base.onerror = () => {
      if (base.dataset.usingFallback === '1') return;
      base.dataset.usingFallback = '1';
      base.src = fallback;
    };

    base.src = ASSETS.hero;

    return stack;
  }

  function clampTier(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 1;
    return Math.max(1, Math.min(7, Math.round(n)));
  }

  function currentTier(nameId) {
    const label = document.getElementById(nameId);
    const card = label?.closest('.gear-card');
    return clampTier(card?.dataset.tier || 1);
  }

  function setLayer(img, src) {
    if (!img) return;

    if (img.dataset.assetSrc === src &&
        ['loaded', 'missing', 'loading'].includes(img.dataset.assetState)) {
      return;
    }

    img.dataset.assetSrc = src;
    img.dataset.assetState = 'loading';
    img.hidden = true;

    img.onload = () => {
      if (img.dataset.assetSrc !== src) return;
      img.dataset.assetState = 'loaded';
      img.hidden = false;
    };

    img.onerror = () => {
      if (img.dataset.assetSrc !== src) return;
      img.dataset.assetState = 'missing';
      img.hidden = true;
    };

    img.src = src;
  }

  function renderEquipmentImages() {
    if (!prepareStack()) return;

    for (const kind of ['shoes', 'shield', 'sword', 'outfit']) {
      const cfg = ASSETS[kind];
      const tier = currentTier(cfg.nameId);
      const percent = PERCENTS[tier - 1];
      const img = document.getElementById(cfg.layerId);
      setLayer(img, cfg.path(percent));
    }
  }

  function startObserver() {
    const grid = document.getElementById('gear-grid');
    if (!grid) return;

    const observer = new MutationObserver(() => {
      renderEquipmentImages();
    });

    observer.observe(grid, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-tier'],
      childList: true,
      characterData: true
    });
  }

  function init() {
    if (document.documentElement.dataset.gearLayerReady === '1') return;
    document.documentElement.dataset.gearLayerReady = '1';

    injectStyle();
    prepareStack();
    renderEquipmentImages();
    startObserver();

    requestAnimationFrame(renderEquipmentImages);
    setTimeout(renderEquipmentImages, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
