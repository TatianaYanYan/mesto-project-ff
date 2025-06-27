const cardTemplate = document.querySelector('#card-template').content;

export function createCard(cardData, handleDelete, handleClickImage, handleLike) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  //Заполнение карточки данными
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  //Назначение обработчика событий
  deleteButton.addEventListener('click', () => handleDelete(cardElement));
  cardImage.addEventListener('click', () => handleClickImage(cardData.link, cardData.name));
  likeButton.addEventListener('click', () => handleLikeCard(likeButton));

  return cardElement;
}

export function handleDeleteCard(cardElement) {
  cardElement.remove();
}
//Лайк карточки
export function handleLikeCard(button) {
  button.classList.toggle('card__like-button_is-active');
}