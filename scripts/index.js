// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;
// @todo: DOM узлы
const placesList = document.querySelector(".places__list");
// @todo: Функция создания карточки
function createCard(cardData, handleDeleteCard) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  deleteButton.addEventListener("click", handleDeleteCard);
  return cardElement;
}
// @todo: Функция удаления карточки
function handleDeleteCard(event) {
  const card = event.target.closest(".card");
  if (card) {
    card.remove();
  }
}
// @todo: Вывести карточки на страницу
initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData, handleDeleteCard);
  placesList.appendChild(cardElement);
});
