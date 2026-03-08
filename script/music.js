// Управление музыкой (кнопка в меню)
import { t, getCurrentLanguage } from './translations.js';

document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('background-music');
  const menuMusicToggle = document.querySelector('.menu-music-toggle');

  if (!audio) {
    return;
  }

  let isPlaying = false;

  // Функция для обновления текста кнопки
  function updateMusicButtonText() {
    if (!menuMusicToggle) return;
    const lang = getCurrentLanguage();
    const text = isPlaying ? t('menu.musicOn', lang) : t('menu.musicOff', lang);
    menuMusicToggle.innerHTML = `<span>&#9654;</span> ${text}`;
  }

  // Проверяем, играет ли музыка (если пользователь выбрал включить атмосферу)
  function checkMusicState() {
    if (audio && !audio.paused && !audio.muted) {
      isPlaying = true;
      updateMusicButtonText();
    } else {
      isPlaying = false;
      updateMusicButtonText();
    }
  }

  // Проверяем состояние сразу и после небольшой задержки (для страниц с прелоадером)
  checkMusicState();
  setTimeout(checkMusicState, 1000);

  // Кнопка управления музыкой в меню
  if (menuMusicToggle) {
    menuMusicToggle.addEventListener('click', () => {
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        updateMusicButtonText();
      } else {
        // Включаем звук если он был выключен
        audio.muted = false;
        audio.play()
          .then(() => {
            isPlaying = true;
            updateMusicButtonText();
          })
          .catch((error) => {
            console.log('Не удалось воспроизвести музыку:', error);
          });
      }
    });
  }

  // Зацикливание
  audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    if (isPlaying) audio.play();
  });

  audio.addEventListener('error', () => {
    console.error('Ошибка загрузки аудио файла');
  });

  // Обновляем текст при смене языка
  if (typeof window !== 'undefined') {
    window.addEventListener('languageChanged', () => {
      updateMusicButtonText();
    });
  }
});
