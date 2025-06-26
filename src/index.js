import './pages/index.css';
import { initialCards } from './components/cards.js';
import { createCard, handleDeleteCard, handleLikeCard, handleProfileFormSubmit, handleAddCardFormSubmit } from './components/card.js';
import { openPopup, closePopup, setModalListeners } from './components/modal.js';
import { handleCardImageClick } from './components/modal.js';

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