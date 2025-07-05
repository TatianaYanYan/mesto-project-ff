import './pages/index.css';
import {
  openPopup,
  closePopup
} from './components/modal.js';
import {
  createCard,
  handleDeleteCard,
  handleLikeCard
} from './components/card.js';
import {
  getUserData,
  getInitialCards,
  updateUserInfo,
  addNewCard,
  deleteCard,
  likeCard,
  unlikeCard,
  updateAvatar
} from './components/api.js';
import { enableValidation, clearValidation } from './components/validation.js';

// Конфигурация валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// Включение валидации для всех форм
enableValidation(validationConfig);

// DOM элементы
const placesList = document.querySelector('.places__list');
const popupEdit = document.querySelector('.popup.popup_type_edit');
const editForm = popupEdit.querySelector('.popup__form[name="edit-profile"]');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const avatarElement = document.querySelector('.profile__image');
const popupNewCard = document.querySelector('.popup.popup_type_new-card');
const newCardForm = popupNewCard.querySelector('.popup__form[name="new-place"]');
const popupUpdateAvatar = document.querySelector('.popup.popup_type_update-avatar');
const updateAvatarForm = popupUpdateAvatar.querySelector('.popup__form[name="update-avatar"]');

// Функция "Сохранение"
export function toggleButtonLoading(button, isLoading, loadingText = 'Сохранение...') {
  if (isLoading) {
    button.textContent = loadingText;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.defaultText || 'Сохранить';
    button.disabled = false;
  }
}
// Редактирование профиля

export function handleProfileFormSubmit(profileTitle, profileDescription, popupEdit, closePopup) {
  return function (evt) {
    evt.preventDefault();

    const nameInput = evt.target.querySelector('.popup__input_type_name');
    const jobInput = evt.target.querySelector('.popup__input_type_description');
    const newName = nameInput.value;
    const newAbout = jobInput.value;
    const submitButton = evt.target.querySelector('.popup__button');

    // Сохраняем исходный текст один раз
    if (!submitButton.dataset.defaultText) {
      submitButton.dataset.defaultText = submitButton.textContent;
    }

    toggleButtonLoading(submitButton, true);

    updateUserInfo(newName, newAbout)
      .then(userData => {
        profileTitle.textContent = userData.name;
        profileDescription.textContent = userData.about;
        closePopup(popupEdit);
      })
      .catch(err => console.error('Не удалось сохранить данные:', err))
      .finally(() => {
        toggleButtonLoading(submitButton, false);
      });
  };
}

// Добавление новой карточки
export function handleAddCardFormSubmit(
  placesList,
  newCardForm,
  popupNewCard,
  closePopup,
  createCard,
  handleDeleteCard,
  handleCardImageClick,
  handleLikeCard
) {
  return function (evt) {
    evt.preventDefault();

    const nameInput = newCardForm.querySelector('.popup__input_type_card-name');
    const linkInput = newCardForm.querySelector('.popup__input_type_url');
    const newCardData = { name: nameInput.value, link: linkInput.value };
    const submitButton = evt.target.querySelector('.popup__button');

    if (!submitButton.dataset.defaultText) {
      submitButton.dataset.defaultText = submitButton.textContent;
    }

    toggleButtonLoading(submitButton, true);

    addNewCard(newCardData.name, newCardData.link)
      .then(cardData => {
        const newCardElement = createCard(
          cardData,
          window.userId,
          handleDeleteCard,
          handleCardImageClick,
          handleLikeCard
        );
        placesList.prepend(newCardElement);
        newCardForm.reset();
        closePopup(popupNewCard);
      })
      .catch(err => console.error('Не удалось добавить карточку:', err))
      .finally(() => {
        toggleButtonLoading(submitButton, false);
      });
  };
}

/**
 * Обработчик клика по изображению карточки: открывает попап с изображением.
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

export function setModalListeners() {
  const popupEdit = document.querySelector('.popup.popup_type_edit');
  const editButton = document.querySelector('.profile__edit-button');
  const popupNewCard = document.querySelector('.popup.popup_type_new-card');
  const addButton = document.querySelector('.profile__add-button');
  
  // Открытие попапа редактирования профиля
  editButton.addEventListener('click', () => {
    const nameInput = popupEdit.querySelector('.popup__input_type_name');
    const jobInput = popupEdit.querySelector('.popup__input_type_description');
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
    
    // Очистка ошибок валидации при открытии формы
    clearValidation(editForm, validationConfig);
    
    openPopup(popupEdit);
  });
  
  // Открытие попапа добавления новой карточки
  addButton.addEventListener('click', () => {
    openPopup(popupNewCard);
    
    // Очистка формы при открытии
    newCardForm.reset();
    // Очистка ошибок валидации при открытии формы
    clearValidation(newCardForm, validationConfig);
  });
  
  // Открытие попапа обновления аватара
  avatarElement.addEventListener('click', () => {
    openPopup(popupUpdateAvatar);
  });
  
  // Закрытие по крестику и оверлею
  document.querySelectorAll('.popup__close').forEach(button => {
    button.addEventListener('click', (evt) => {
      const popup = evt.target.closest('.popup');
      if (popup) closePopup(popup);
    });
  });
  document.querySelectorAll('.popup_is-animated').forEach(popup => {
    popup.addEventListener('click', (evt) => {
      if (evt.target === evt.currentTarget) {
        closePopup(evt.currentTarget);
      }
    });
  });
}

// Обработчик формы "Обновить аватар"
export function handleUpdateAvatarSubmit(avatarElement, formElement, popup, closePopup) {
  return function (evt) {
    evt.preventDefault();

    const input = formElement.querySelector('.popup__input_type_avatar-url');
    const newAvatarLink = input.value;
    const submitButton = formElement.querySelector('.popup__button');

    if (!submitButton.dataset.defaultText) {
      submitButton.dataset.defaultText = submitButton.textContent;
    }

    toggleButtonLoading(submitButton, true);

    updateAvatar(newAvatarLink)
      .then(userData => {
        avatarElement.style.backgroundImage = `url(${userData.avatar})`;
        closePopup(popup);
        formElement.reset();
      })
      .catch(err => console.error('Не удалось обновить аватар:', err))
      .finally(() => {
        toggleButtonLoading(submitButton, false);
      });
  };
}

// Назначаем обработчики событий
editForm.addEventListener('submit', handleProfileFormSubmit(
  profileTitle,
  profileDescription,
  popupEdit,
  closePopup
));
newCardForm.addEventListener('submit', handleAddCardFormSubmit(
  placesList,
  newCardForm,
  popupNewCard,
  closePopup,
  createCard,
  handleDeleteCard,
  handleCardImageClick,
  handleLikeCard
));
updateAvatarForm.addEventListener('submit', handleUpdateAvatarSubmit(
  avatarElement,
  updateAvatarForm,
  popupUpdateAvatar,
  closePopup
));

// Инициализация модальных окон
setModalListeners();

// Загрузка данных пользователя и карточек параллельно
Promise.all([getUserData(), getInitialCards()])
  .then(([userData, cardsData]) => {
    window.userId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    avatarElement.style.backgroundImage = `url(${userData.avatar})`;
    cardsData.forEach(cardData => {
      const cardElement = createCard(
        cardData,
        userData._id,
        handleDeleteCard,
        handleCardImageClick,
        handleLikeCard
      );
      placesList.appendChild(cardElement);
    });
  })
  .catch(error => {
    console.error('Произошла ошибка:', error);
  });