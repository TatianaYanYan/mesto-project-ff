import './pages/index.css';
import { initialCards } from './components/cards.js';
import { createCard, handleDeleteCard, handleLikeCard } from './components/card.js';
import { openPopup, closePopup, addPopupEventListeners} from './components/modal.js';

// DOM элементы
const placesList = document.querySelector('.places__list');
const popupEdit = document.querySelector('.popup.popup_type_edit');
const editForm = popupEdit.querySelector('.popup__form[name="edit-profile"]');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const popupNewCard = document.querySelector('.popup.popup_type_new-card');
const newCardForm = popupNewCard.querySelector('.popup__form[name="new-place"]');

//Инициализация обработчиков событий
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

//Инициализация карточек
initialCards.forEach((cardData) => {
  const cardElement = createCard(
    cardData,
    handleDeleteCard,
    handleCardImageClick,
    handleLikeCard
  );
  placesList.appendChild(cardElement);
});

//Инициализация модальных окон
setModalListeners();

//Редактирование профиля
export function handleProfileFormSubmit(profileTitle, profileDescription, popupEdit, closePopup) {
  return function (evt) {
    evt.preventDefault();

    const nameInput = evt.target.querySelector('.popup__input_type_name');
    const jobInput = evt.target.querySelector('.popup__input_type_description');

    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = jobInput.value;

    closePopup(popupEdit);
  };
}
//Добавление новой карточки
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

    const newCardData = {
      name: nameInput.value,
      link: linkInput.value,
    };

    const newCardElement = createCard(
      newCardData,
      handleDeleteCard,
      handleCardImageClick,
      handleLikeCard
    );

    placesList.prepend(newCardElement);

    newCardForm.reset();
    closePopup(popupNewCard);
  };
}

/**
 * Обработчик клика по изображению карточки: открывает попап с изображением.
 * @param {string} link — ссылка на изображение.
 * @param {string} name — название изображения.
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

function fillProfileEditPopup(popupElement) {
  const nameInput = popupElement.querySelector('.popup__input_type_name');
  const jobInput = popupElement.querySelector('.popup__input_type_description');

  const profileTitle = document.querySelector('.profile__title');
  const profileDescription = document.querySelector('.profile__description');

  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
}

export function setModalListeners() {
  const popupEdit = document.querySelector('.popup.popup_type_edit');
  const editButton = document.querySelector('.profile__edit-button');

  const popupNewCard = document.querySelector('.popup.popup_type_new-card');
  const addButton = document.querySelector('.profile__add-button');

  addPopupEventListeners(popupEdit, editButton, popupNewCard, addButton);
}