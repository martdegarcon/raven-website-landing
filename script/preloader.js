import gsap from "gsap";
import { t, setLanguage, getCurrentLanguage } from "./translations.js";

// Управление прелоадером и музыкой
document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  const enableMusicBtn = document.getElementById('enable-music-btn');
  const skipMusicBtn = document.getElementById('skip-music-btn');
  const audio = document.getElementById('background-music');
  const langRuBtn = document.getElementById('lang-ru-btn');
  const langEnBtn = document.getElementById('lang-en-btn');
  const preloaderTitle = document.getElementById('preloader-welcome');
  const languageLabel = document.getElementById('preloader-language-label');
  const soundLabel = document.getElementById('preloader-sound-label');
  const enableMusicText = document.getElementById('preloader-enable-music-text');
  const skipMusicText = document.getElementById('preloader-skip-music-text');

  if (!preloader || !enableMusicBtn || !skipMusicBtn || !audio) {
    console.error('Элементы прелоадера не найдены');
    return;
  }

  // Определяем язык из браузера или используем сохраненный
  const browserLang = navigator.language || navigator.userLanguage;
  const defaultLang = browserLang.startsWith('en') ? 'en' : 'ru';
  const savedLang = localStorage.getItem('language') || defaultLang;
  setLanguage(savedLang);

  // Обновляем тексты прелоадера
  function updatePreloaderTexts(lang) {
    if (preloaderTitle) preloaderTitle.textContent = t('preloader.welcome', lang);
    if (languageLabel) languageLabel.textContent = t('preloader.language', lang);
    if (soundLabel) soundLabel.textContent = t('preloader.sound', lang);
    if (enableMusicText) enableMusicText.textContent = t('preloader.enableMusic', lang);
    if (skipMusicText) skipMusicText.textContent = t('preloader.skipMusic', lang);

    // Обновляем активную кнопку языка
    if (langRuBtn && langEnBtn) {
      if (lang === 'ru') {
        langRuBtn.classList.add('active');
        langRuBtn.setAttribute('aria-pressed', 'true');
        langEnBtn.classList.remove('active');
        langEnBtn.setAttribute('aria-pressed', 'false');
      } else {
        langEnBtn.classList.add('active');
        langEnBtn.setAttribute('aria-pressed', 'true');
        langRuBtn.classList.remove('active');
        langRuBtn.setAttribute('aria-pressed', 'false');
      }
    }
  }

  // Инициализируем тексты
  updatePreloaderTexts(savedLang);

  // Обработчики выбора языка
  if (langRuBtn) {
    langRuBtn.addEventListener('click', () => {
      setLanguage('ru');
      updatePreloaderTexts('ru');
    });
  }

  if (langEnBtn) {
    langEnBtn.addEventListener('click', () => {
      setLanguage('en');
      updatePreloaderTexts('en');
    });
  }

  // Устанавливаем громкость на 15%
  audio.volume = 0.05;
  audio.muted = true;
  let isPlaying = false;
  let musicEnabled = false;

  // Функция для анимации перехода с прелоадера
  function animatePreloaderTransition() {
    return new Promise((resolve) => {
      // Используем функции из transition.js
      if (typeof window.createMaskOverlay === 'function') {
        window.createMaskOverlay();
      } else {
        // Если функции еще не загружены, создаем маску вручную
        createMaskOverlay();
      }

      const logoMask = document.getElementById("logoMask");
      if (!logoMask) {
        // Если маска не создана, просто скрываем прелоадер
        resolve();
        return;
      }

      const logoData =
        "M800 515.749L501.926 343.832V0H297.482V343.832L0 515.749L101.926 693L399.408 521.084L697.482 693L800 515.749Z";

      logoMask.setAttribute("d", logoData);

      const calculateScale = window.calculateLogoScale || calculateLogoScale;
      const { scale: logoScale, bbox } = calculateScale();
      const pathCenterX = bbox.x + bbox.width / 2;
      const pathCenterY = bbox.y + bbox.height / 2;

      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;

      const initialScale = logoScale;
      const translateX = viewportCenterX - pathCenterX * initialScale;
      const translateY = viewportCenterY - pathCenterY * initialScale;

      logoMask.setAttribute(
        "transform",
        `translate(${translateX}, ${translateY}) scale(${initialScale})`
      );

      // Скрываем прелоадер перед анимацией
      gsap.set(preloader, { opacity: 0 });

      gsap.set(".mask-transition", {
        display: "block",
        zIndex: 100002,
        pointerEvents: "none",
      });

      gsap.set(".mask-bg-overlay", {
        display: "block",
        opacity: 1,
        zIndex: 100001,
        pointerEvents: "none",
      });

      const scaleMultiplier = window.innerWidth < 1000 ? 15 : 40;

      gsap.to(
        {},
        {
          duration: 6,
          delay: 0,
          ease: "power2.inOut",
          onUpdate: function () {
            const progress = this.progress();
            const scale = initialScale + progress * scaleMultiplier;

            const newTranslateX = viewportCenterX - pathCenterX * scale;
            const newTranslateY = viewportCenterY - pathCenterY * scale;

            logoMask.setAttribute(
              "transform",
              `translate(${newTranslateX}, ${newTranslateY}) scale(${scale})`
            );

            const fadeProgress = Math.min(0.3, progress * 2.5);
            gsap.set(".mask-bg-overlay", {
              opacity: 0.3 - fadeProgress,
            });
          },
          onComplete: () => {
            gsap.set(".mask-transition", { display: "none" });
            gsap.set(".mask-bg-overlay", { display: "none" });
            preloader.remove();
            resolve();
          },
        }
      );
    });
  }

  // Вспомогательные функции (если transition.js еще не загружен)
  function calculateLogoScale() {
    const logoSize = 60;
    const logoData =
      "M800 515.749L501.926 343.832V0H297.482V343.832L0 515.749L101.926 693L399.408 521.084L697.482 693L800 515.749Z";

    const tempSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    const tempPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    tempPath.setAttribute("d", logoData);
    tempSvg.appendChild(tempPath);
    document.body.appendChild(tempSvg);

    const bbox = tempPath.getBBox();
    document.body.removeChild(tempSvg);

    const scale = logoSize / Math.max(bbox.width, bbox.height);

    return { scale, bbox };
  }

  function createMaskOverlay() {
    const maskOverlay = document.querySelector(".mask-transition");

    if (!maskOverlay) return;

    maskOverlay.innerHTML = `
      <svg width="100%" height="100%">
        <defs>
          <mask id="logoRevealMask">
            <rect width="100%" height="100%" fill="white" />
            <path id="logoMask" fill="black"></path>
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="var(--base-300)"
          mask="url(#logoRevealMask)"
        />
      </svg>
    `;
  }

  // Функция для скрытия прелоадера с анимацией
  function hidePreloader() {
    // Показываем меню (кнопки музыки и языка теперь в меню)
    const menu = document.querySelector('.menu');
    if (menu) {
      menu.classList.add('visible');
    }

    // На первой загрузке с прелоадером скрываем красный transition-оверлей,
    // чтобы не перекрывал контент (особенно на мобильных)
    const transitionOverlay = document.querySelector('.transition-overlay');
    if (transitionOverlay) {
      try {
        // Если gsap доступен — используем его для совместимости с остальной анимацией
        if (typeof gsap !== 'undefined') {
          gsap.set(transitionOverlay, { scaleY: 0 });
        } else {
          transitionOverlay.style.transformOrigin = 'top';
          transitionOverlay.style.transform = 'scaleY(0)';
        }
      } catch (e) {
        transitionOverlay.style.transformOrigin = 'top';
        transitionOverlay.style.transform = 'scaleY(0)';
      }
    }
    
    // Применяем переводы сразу
    if (typeof window.applyTranslations === 'function') {
      window.applyTranslations();
    }
    
    // Разрешаем скролл сразу
    document.body.style.overflow = '';
    
    // Запускаем анимацию перехода (она будет идти в фоне)
    animatePreloaderTransition().then(() => {
      // Дополнительные действия после анимации (если нужны)
    });
  }

  let isTransitioning = false;

  // Кнопка "Включить атмосферу"
  enableMusicBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;
    
    musicEnabled = true;
    audio.muted = false;
    
    // Блокируем кнопки
    enableMusicBtn.style.pointerEvents = 'none';
    skipMusicBtn.style.pointerEvents = 'none';
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
          hidePreloader();
        })
        .catch((error) => {
          console.log('Не удалось воспроизвести музыку:', error);
          // Все равно скрываем прелоадер даже если воспроизведение не удалось
          hidePreloader();
        });
    } else {
      hidePreloader();
    }
  });

  // Кнопка "Продолжить без звука"
  skipMusicBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;
    
    musicEnabled = false;
    
    // Блокируем кнопки
    enableMusicBtn.style.pointerEvents = 'none';
    skipMusicBtn.style.pointerEvents = 'none';
    
    hidePreloader();
  });

  // Блокируем скролл пока прелоадер виден
  document.body.style.overflow = 'hidden';
});

