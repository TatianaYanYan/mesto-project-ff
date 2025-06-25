// modal.js

// Находим DOM-элементы
const popupEdit = document.querySelector('.popup_type_edit');
const editButton = document.querySelector('.profile__edit-button');
const closeButton = popupEdit.querySelector('.popup__close');

// Функция открытия попапа
function openPopup(popupElement) {
  popupElement.classList.add('popup_is-opened');
}

// Функция закрытия попапа
function closePopup(popupElement) {
  popupElement.classList.remove('popup_is-opened');
}

// Обработчик открытия по клику на кнопку редактирования
editButton.addEventListener('click', () => {
  openPopup(popupEdit);
});

// Обработчик закрытия по клику на крестик
closeButton.addEventListener('click', () => {
  closePopup(popupEdit);
});

// Экспортируем функции, если они понадобятся в других файлах
export { openPopup, closePopup };