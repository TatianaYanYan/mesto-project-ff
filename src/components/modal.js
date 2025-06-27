/**
 * Открываем модальное окно.
 * @param {Element} popupElement — DOM-элемент модального окна.
 */
export function openPopup(popupElement) {
 // Устанавливаем начальные классы для анимации
  popupElement.classList.remove('popup_is-opened');
  void popupElement.offsetWidth; // Принудительное обновление стилей
  popupElement.classList.add('popup_is-opened');
  
  // Добавляем обработчик Escape при открытии попапа
  document.addEventListener('keydown', handleEscClose);

  // Сохраняем ссылку на обработчик для последующего удаления
  popupElement._handleEscClose = handleEscClose;
}

/**
 * Закрываем модальное окно.
 * @param {Element} popupElement — DOM-элемент модального окна.
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

export function addPopupEventListeners(popupEdit, editButton, popupNewCard, addButton) {
  // Открытие попапов
  editButton.addEventListener('click', () => openPopup(popupEdit));
  addButton.addEventListener('click', () => openPopup(popupNewCard));

  // Закрытие по крестику
  document.querySelectorAll('.popup__close').forEach(button => {
    button.addEventListener('click', (evt) => {
      const popup = evt.target.closest('.popup');
      if (popup) closePopup(popup);
    });
  });

  // Закрытие по оверлею
  document.querySelectorAll('.popup_is-animated').forEach(popup => {
    popup.addEventListener('click', (evt) => {
      if (evt.target === evt.currentTarget) {
        closePopup(evt.currentTarget);
      }
    });
  });
}