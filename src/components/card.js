import { likeCard, unlikeCard, deleteCard } from './api.js';

const cardTemplate = document.querySelector('#card-template').content;

export function createCard(cardData, userId, handleDelete, handleClickImage, handleLike) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCounter = cardElement.querySelector('.card__like-counter');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCounter.textContent = cardData.likes?.length || 0;

  if (cardData.likes.some(like => like._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  if (cardData.owner._id !== userId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener('click', () => handleDelete(cardData, cardElement));
  }

  cardImage.addEventListener('click', () => handleClickImage(cardData.link, cardData.name));
  likeButton.addEventListener('click', () => handleLike(cardData, userId, likeButton, likeCounter));

  return cardElement;
}

export function handleDeleteCard(cardData, cardElement) {
  deleteCard(cardData._id)
    .then(() => {
      cardElement.remove();
    })
    .catch(err => console.error('Не удалось удалить карточку:', err));
}

export function handleLikeCard(cardData, userId, likeButton, likeCounter) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  const apiCall = isLiked ? unlikeCard(cardData._id) : likeCard(cardData._id);

  apiCall
    .then(updatedCardData => {
      likeButton.classList.toggle('card__like-button_is-active', !isLiked);
      likeCounter.textContent = updatedCardData.likes.length;
    })
    .catch(err => console.error('Не удалось обновить лайк:', err));
}