/**
 * Открываем модальное окно.
 */
export function openPopup(popupElement) {
  // Добавляем класс, запускающий анимацию открытия
  popupElement.classList.add('popup_is-opened');

  // Добавляем обработчик клавиши Escape
  document.addEventListener('keydown', handleEscClose);

  // Сохраняем ссылку на обработчик для последующего удаления
  popupElement._handleEscClose = handleEscClose;
}

/**
 * Закрываем модальное окно.
 */
export function closePopup(popupElement) {
  // Убираем класс popup_is-opened, чтобы запустить обратную анимацию
  popupElement.classList.remove('popup_is-opened');

  // Удаляем обработчик Escape при закрытии попапа
  if (popupElement._handleEscClose) {
    document.removeEventListener('keydown', popupElement._handleEscClose);
    delete popupElement._handleEscClose;
  }
}

// Вспомогательная функция для закрытия попапа по клавише Escape
function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup.popup_is-opened');
    if (openedPopup) closePopup(openedPopup);
  }
}

