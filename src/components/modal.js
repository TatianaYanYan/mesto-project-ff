/**
 * Открывает указанное модальное окно.
 * @param {Element} popupElement — DOM-элемент модального окна.
 */
export function openPopup(popupElement) {
  // Сбрасываем стили перед началом анимации
  popupElement.style.visibility = 'hidden';
  popupElement.style.opacity = '0';
  popupElement.style.pointerEvents = 'auto';

  //Запускаем анимацию после обновления стилей
  requestAnimationFrame(() => {
    popupElement.style.visibility = 'visible';
    popupElement.style.opacity = '1';
  });

  //Если это попап редактирования профиля — подставляем текущие данные
  if (popupElement.classList.contains('popup_type_edit')) {
    const nameInput = popupElement.querySelector('.popup__input_type_name');
    const jobInput = popupElement.querySelector('.popup__input_type_description');

    const profileTitle = document.querySelector('.profile__title');
    const profileDescription = document.querySelector('.profile__description');

    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
  }
}

/**
 * Закрывает указанное модальное окно.
 * @param {Element} popupElement — DOM-элемент модального окна.
 */
export function closePopup(popupElement) {
  popupElement.style.opacity = '0';

  setTimeout(() => {
    popupElement.style.visibility = 'hidden';
    popupElement.style.pointerEvents = 'none';
  }, 600); // совпадает с длительностью transition в CSS
}

/**
 * Обработчик клика по изображению карточки: открывает попап с изображением.
 * @param {string} link — ссылка на изображение.
 * @param {string} name — название изображения (подпись).
 */
export function handleCardImageClick(link, name) {
  const popupImage = document.querySelector('.popup.popup_type_image');
  const popupImageImg = popupImage.querySelector('.popup__image');
  const popupImageCaption = popupImage.querySelector('.popup__caption');

  popupImageImg.src = link;
  popupImageImg.alt = name;
  popupImageCaption.textContent = name;

  openPopup(popupImage);
}

/**
 * Назначает все необходимые слушатели событий для работы с модальными окнами.
 */
export function setModalListeners() {
  const popupEdit = document.querySelector('.popup.popup_type_edit');
  const editButton = document.querySelector('.profile__edit-button');

  const popupNewCard = document.querySelector('.popup.popup_type_new-card');
  const addButton = document.querySelector('.profile__add-button');

  //Открытие попапов
  editButton.addEventListener('click', () => openPopup(popupEdit));
  addButton.addEventListener('click', () => openPopup(popupNewCard));

  //Закрытие по крестику
  document.querySelectorAll('.popup__close').forEach(button => {
    button.addEventListener('click', (evt) => {
      const popup = evt.target.closest('.popup');
      if (popup) closePopup(popup);
    });
  });

  //Закрытие по Esc
  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      const openedPopup = document.querySelector('.popup_is-animated[style*="visibility: visible"]');
      if (openedPopup) closePopup(openedPopup);
    }
  });

  //Закрытие по оверлею
  document.querySelectorAll('.popup_is-animated').forEach(popup => {
    popup.addEventListener('click', (evt) => {
      if (evt.target === evt.currentTarget) {
        closePopup(evt.currentTarget);
      }
    });
  });
}