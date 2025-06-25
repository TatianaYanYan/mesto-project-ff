
import './pages/index.css';
import { initialCards } from './components/cards.js';
import { createCard, handleDeleteCard, placesList } from './components/card.js';
import { openPopup, closePopup } from './components/modal.js'; // Импортируем функции из modal.js

// @todo: Вывести карточки на страницу
initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData, handleDeleteCard);
  placesList.appendChild(cardElement);
}); 