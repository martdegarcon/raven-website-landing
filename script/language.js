import { t, getCurrentLanguage, setLanguage, translations } from "./translations.js";

// Применение переводов к элементам страницы
export function applyTranslations() {
  const lang = getCurrentLanguage();
  
  // Обновляем ссылки на каталог с параметром языка
  updateCatalogLinks(lang);
  
  // Меню
  const menuLinks = document.querySelectorAll('.menu-nav a');
  if (menuLinks.length > 0) {
    const menuKeys = ['menu.home', 'menu.catalog', 'menu.contacts'];
    menuLinks.forEach((link, index) => {
      if (menuKeys[index]) {
        link.textContent = t(menuKeys[index], lang);
      }
    });
  }

  // Меню - социальные сети (порядок как в index.html: Instagram, YouTube, Facebook, VK, Telegram)
  const menuSocialLinks = document.querySelectorAll('.menu-social a');
  const menuSocialKeys = ['menu.instagram', 'menu.youtube', 'menu.facebook', 'menu.vk', 'menu.telegram'];
  menuSocialLinks.forEach((link, index) => {
    if (menuSocialKeys[index]) {
      link.innerHTML = `<span>&#9654;</span> ${t(menuSocialKeys[index], lang)}`;
    }
  });

  // Меню - время на Татуине
  const menuTime = document.querySelector('.menu-time');
  if (menuTime) {
    const timeMatch = menuTime.textContent.match(/(\d{2}:\d{2}:\d{2})/);
    const time = timeMatch ? timeMatch[1] : '23:24:02';
    menuTime.textContent = `${time} ${t('menu.timeOnTatooine', lang)}`;
  }

  // Меню - переключение языка
  const menuLanguageToggle = document.querySelector('.menu-language-toggle');
  if (menuLanguageToggle) {
    menuLanguageToggle.innerHTML = `<span>&#9654;</span> ${t('menu.switchLanguage', lang)}`;
  }

  // Меню - переключение музыки (текст обновляется в music.js)
  const menuMusicToggle = document.querySelector('.menu-music-toggle');
  if (menuMusicToggle) {
    // Текст будет обновлен в music.js в зависимости от состояния
    const isPlaying = !document.getElementById('background-music')?.paused && !document.getElementById('background-music')?.muted;
    menuMusicToggle.innerHTML = `<span>&#9654;</span> ${isPlaying ? t('menu.musicOn', lang) : t('menu.musicOff', lang)}`;
  }

  // Hero секция
  const heroTitle = document.querySelector('.hero-header h1');
  if (heroTitle) {
    heroTitle.textContent = t('hero.title', lang);
  }

  const heroDescription = document.querySelector('.hero-footer-copy p');
  if (heroDescription) {
    heroDescription.innerHTML = t('hero.description', lang);
  }

  const heroTags = document.querySelectorAll('.hero-footer-tags p');
  if (heroTags.length > 0) {
    const timeMatch = heroTags[0].textContent.match(/(\d{2}:\d{2}:\d{2})/);
    const time = timeMatch ? timeMatch[1] : '18:15:16';
    heroTags[0].innerHTML = `<span>&#9654;</span> ${t('hero.timeOnTatooine', lang)} ${time}`;
  }

  // About секция
  const aboutTags = document.querySelectorAll('.home-about-header p.mono, .home-about-header h3');
  if (aboutTags.length >= 2) {
    aboutTags[0].innerHTML = `<span>&#9654;</span> ${t('about.whyChooseUs', lang)}`;
    aboutTags[1].textContent = t('about.ourStrength', lang);
  }

  const aboutCards = document.querySelectorAll('.home-about-card');
  if (aboutCards.length >= 4) {
    const cardData = [
      { key: 'about.soundDesc', title: 'about.sound' },
      { key: 'about.lightDesc', title: 'about.light' },
      { key: 'about.customDesc', title: 'about.custom' },
      { key: 'about.craftDesc', title: 'about.craft' }
    ];
    
    aboutCards.forEach((card, index) => {
      if (cardData[index]) {
        const desc = card.querySelector('p.mono');
        const title = card.querySelector('h4');
        if (desc) desc.innerHTML = t(cardData[index].key, lang);
        if (title) title.textContent = t(cardData[index].title, lang);
      }
    });
  }

  // Services секция
  const servicesHeader = document.querySelector('.home-services-header p');
  if (servicesHeader) {
    servicesHeader.textContent = t('services.ready', lang);
  }

  const servicesTags = document.querySelectorAll('.home-services-bottom-bar p.mono');
  if (servicesTags.length >= 2) {
    servicesTags[0].textContent = t('services.since', lang);
    servicesTags[1].textContent = t('services.moreModels', lang);
  }

  // Spotlight секция
  const spotlightTags = document.querySelectorAll('.home-spotlight-bottom-bar p.mono');
  // Проверяем, что это не contact страница (на главной странице есть секция .contact, но она не является отдельной страницей)
  const isContactPage = window.location.pathname === '/contact' || window.location.pathname.endsWith('/contact.html');
  
  if (!isContactPage && spotlightTags.length >= 1) {
    // На главной странице переводим "[ Наши мечи ]"
    spotlightTags[0].textContent = t('spotlight.ourSabers', lang);
  }

  const spotlightTitle = document.querySelector('.spotlight-intro-header h3');
  if (spotlightTitle) {
    spotlightTitle.textContent = t('spotlight.title', lang);
  }

  const spotlightSubtitle = document.querySelector('.spotlight-mask-header h3');
  if (spotlightSubtitle) {
    spotlightSubtitle.innerHTML = t('spotlight.subtitle', lang);
  }

  // Outro секция (только на главной странице)
  const outroTitle = document.querySelector('.outro h3');
  if (outroTitle) {
    outroTitle.textContent = t('outro.title', lang);
  }

  // Outro strips - переводим все навыки
  const outroStrips = document.querySelectorAll('.outro-strip');
  outroStrips.forEach((strip, stripIndex) => {
    const skills = strip.querySelectorAll('.skill p.mono');
    const stripKey = `outro.skills.strip${stripIndex + 1}`;
    const translations = t(stripKey, lang);
    
    if (Array.isArray(translations)) {
      skills.forEach((skill, skillIndex) => {
        if (translations[skillIndex]) {
          skill.textContent = translations[skillIndex];
        }
      });
    }
  });

  // Секция контактов (есть и на главной, и на странице /contact) — заголовок и email переводим всегда
  const contactEmail = document.querySelector('.contact-callout p.mono');
  if (contactEmail) {
    contactEmail.innerHTML = `<span>&#9654;</span> ${t('contact.email', lang)}`;
  }

  const contactTitle = document.querySelector('.contact-header-title h2');
  if (contactTitle) {
    contactTitle.innerHTML = t('contact.title', lang);
  }

  // Только на странице /contact — доп. блоки с ссылками
  const isContactPageCheck = window.location.pathname === '/contact' || window.location.pathname.endsWith('/contact.html');
  if (isContactPageCheck) {
    const contactLinks = document.querySelectorAll('.home-spotlight-bottom-bar p.mono');
    if (contactLinks.length >= 4) {
      contactLinks[0].innerHTML = `<span>&#9654;</span> ${t('contact.instagram', lang)}`;
      contactLinks[1].innerHTML = `<span>&#9654;</span> ${t('contact.twitter', lang)}`;
      contactLinks[2].innerHTML = `<span>&#9654;</span> ${t('contact.youtube', lang)}`;
      const linkedinLink = contactLinks[3].querySelector('a');
      if (linkedinLink) {
        linkedinLink.innerHTML = `<span>&#9654;</span> ${t('contact.linkedin', lang)}`;
      } else {
        contactLinks[3].innerHTML = `<span>&#9654;</span> ${t('contact.linkedin', lang)}`;
      }
    }
  }

  // Footer
  const footerFirstStep = document.querySelector('.footer-top p.mono');
  if (footerFirstStep) {
    footerFirstStep.innerHTML = `<span>&#9654;</span> ${t('footer.firstStep', lang)}`;
  }

  const footerEmail = document.querySelector('.footer-email-container input');
  if (footerEmail) {
    footerEmail.placeholder = t('footer.emailPlaceholder', lang);
  }

  const footerNav = document.querySelectorAll('.footer-sub-col p.mono');
  if (footerNav.length > 0) {
    footerNav[0].textContent = t('footer.navigation', lang);
    if (footerNav[1]) footerNav[1].textContent = t('footer.social', lang);
  }

  const footerLinks = document.querySelectorAll('.footer-links a');
  if (footerLinks.length > 0) {
    const footerKeys = ['menu.home', 'menu.catalog', 'menu.instagram', 'menu.youtube', 'menu.facebook', 'menu.vk', 'menu.telegram'];
    footerLinks.forEach((link, index) => {
      if (footerKeys[index]) {
        link.textContent = t(footerKeys[index], lang);
      }
    });
  }

  const footerSocial = document.querySelectorAll('.footer-copy p');
  if (footerSocial.length >= 2) {
    footerSocial[0].textContent = t('footer.telegram', lang);
    footerSocial[1].textContent = t('footer.youtube', lang);
  }

  const footerMadeBy = document.querySelectorAll('.footer-copyright .footer-sub-col p.mono');
  if (footerMadeBy.length > 0 && footerMadeBy[footerMadeBy.length - 1]) {
    footerMadeBy[footerMadeBy.length - 1].textContent = t('footer.madeBy', lang);
  }

  // Hero cards
  const heroCards = document.querySelectorAll('.hero-card-inner .card-title p.mono');
  heroCards.forEach(card => {
    if (card.textContent.includes('Название модели') || card.textContent.includes('Model name')) {
      card.textContent = t('common.modelName', lang);
    }
  });

  const heroCardViews = document.querySelectorAll('.hero-card-inner .card-title');
  heroCardViews.forEach((card, index) => {
    if (index % 2 === 1 && card.textContent.includes('Посмотреть')) {
      card.innerHTML = `${t('common.view', lang)}<span>&#9654;</span>`;
    }
  });

  // Service cards (flip cards)
  const card1 = document.getElementById('card-1');
  const card2 = document.getElementById('card-2');
  const card3 = document.getElementById('card-3');

  // Карточка 1
  if (card1) {
    const titles1 = card1.querySelectorAll('.card-title p.mono');
    titles1.forEach(title => {
      if (title.textContent && !title.textContent.match(/^\d+$/)) {
        if (title.textContent.includes('Сущность') || title.textContent.includes('Sword essence')) {
          title.textContent = t('cards.card1.title', lang);
        }
      }
    });

    const cardCopy1 = card1.querySelector('.card-copy');
    if (cardCopy1) {
      const items1 = cardCopy1.querySelectorAll('p');
      const translations1 = translations[lang].cards.card1.items;
      items1.forEach((item, index) => {
        if (translations1[index]) {
          item.textContent = translations1[index];
        }
      });
    }
  }

  // Карточка 2
  if (card2) {
    const titles2 = card2.querySelectorAll('.card-title p.mono');
    titles2.forEach(title => {
      if (title.textContent && !title.textContent.match(/^\d+$/)) {
        if (title.textContent.includes('Звук') || title.textContent.includes('Sound')) {
          title.textContent = t('cards.card2.title', lang);
        }
      }
    });

    const cardCopy2 = card2.querySelector('.card-copy');
    if (cardCopy2) {
      const items2 = cardCopy2.querySelectorAll('p');
      const translations2 = translations[lang].cards.card2.items;
      items2.forEach((item, index) => {
        if (translations2[index]) {
          item.textContent = translations2[index];
        }
      });
    }
  }

  // Карточка 3
  if (card3) {
    const titles3 = card3.querySelectorAll('.card-title p.mono');
    titles3.forEach(title => {
      if (title.textContent && !title.textContent.match(/^\d+$/)) {
        if (title.textContent.includes('Технология') || title.textContent.includes('Technology')) {
          title.textContent = t('cards.card3.title', lang);
        }
      }
    });

    const cardCopy3 = card3.querySelector('.card-copy');
    if (cardCopy3) {
      const items3 = cardCopy3.querySelectorAll('p');
      const translations3 = translations[lang].cards.card3.items;
      items3.forEach((item, index) => {
        if (translations3[index]) {
          item.textContent = translations3[index];
        }
      });
    }
  }
}

// Переключение языка
export function switchLanguage(lang) {
  setLanguage(lang);
  applyTranslations();
  
  // Обновляем текст кнопки переключения языка в меню
  const menuLanguageToggle = document.querySelector('.menu-language-toggle');
  if (menuLanguageToggle) {
    menuLanguageToggle.innerHTML = `<span>&#9654;</span> ${t('menu.switchLanguage', lang)}`;
  }

  // Обновляем текст кнопки музыки при смене языка
  const menuMusicToggle = document.querySelector('.menu-music-toggle');
  if (menuMusicToggle) {
    const audio = document.getElementById('background-music');
    const isPlaying = audio && !audio.paused && !audio.muted;
    menuMusicToggle.innerHTML = `<span>&#9654;</span> ${isPlaying ? t('menu.musicOn', lang) : t('menu.musicOff', lang)}`;
  }

  // Обновляем ссылки на каталог с параметром языка
  updateCatalogLinks(lang);

  // Отправляем событие для обновления других элементов
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('languageChanged'));
  }
}

// Функция для обновления ссылок на каталог с параметром языка
function updateCatalogLinks(lang) {
  const catalogLinks = document.querySelectorAll('a[href*="localhost:3000"], a[href*="catalog"]');
  catalogLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes('localhost:3000')) {
      try {
        const url = new URL(href);
        url.searchParams.set('lang', lang);
        link.setAttribute('href', url.toString());
      } catch (e) {
        // Если не удалось распарсить URL, добавляем параметр вручную
        const separator = href.includes('?') ? '&' : '?';
        link.setAttribute('href', `${href}${separator}lang=${lang}`);
      }
    }
  });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  // Экспортируем функцию для использования в прелоадере
  window.applyTranslations = applyTranslations;
  window.switchLanguage = switchLanguage;
  
  // Кнопка переключения языка в меню
  const menuLanguageToggle = document.querySelector('.menu-language-toggle');
  if (menuLanguageToggle) {
    const currentLang = getCurrentLanguage();
    menuLanguageToggle.innerHTML = `<span>&#9654;</span> ${t('menu.switchLanguage', currentLang)}`;
    
    menuLanguageToggle.addEventListener('click', () => {
      const currentLang = getCurrentLanguage();
      const newLang = currentLang === 'ru' ? 'en' : 'ru';
      switchLanguage(newLang);
    });
  }
  
  // Применяем переводы если прелоадер уже скрыт
  const preloader = document.getElementById('preloader');
  if (!preloader || preloader.classList.contains('hidden')) {
    // Показываем кнопку языка если прелоадер скрыт
    if (langToggle) {
      langToggle.style.display = 'flex';
    }
    applyTranslations();
  }
});

