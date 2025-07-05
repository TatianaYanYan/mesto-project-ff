/**
 * Открываем модальное окно.
 */
export function openPopup(popupElement) {
  // Добавляем класс, запускающий анимацию открытия
  popupElement.classList.add('popup_is-opened');

  // Если это первый открытый попап — добавляем обработчик Escape
  if (!document._escapeHandler) {
    document._escapeHandler = handleEscClose;
    document.addEventListener('keydown', document._escapeHandler);
  }
}

/**
 * Закрываем модальное окно.
 */
export function closePopup(popupElement) {
  // Убираем класс popup_is-opened, чтобы запустить обратную анимацию
  popupElement.classList.remove('popup_is-opened');

  // Удаляем обработчик Escape, если это последний закрытый попап
  if (document._escapeHandler && !getOpenedPopups().length) {
    document.removeEventListener('keydown', document._escapeHandler);
    delete document._escapeHandler;
  }
}

// Вспомогательная функция для получения всех открытых попапов
function getOpenedPopups() {
  return document.querySelectorAll('.popup.popup_is-opened');
}

// Вспомогательная функция для закрытия попапа по клавише Escape
function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup.popup_is-opened');
    if (openedPopup) closePopup(openedPopup);
  }
}
