// validation.js

// Функция проверки регулярного выражения
function isValidPattern(inputElement, pattern, errorMessage) {
  const regex = new RegExp(pattern);
  const value = inputElement.value.trim();

  if (!regex.test(value)) {
    inputElement.setCustomValidity(errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }
}

// Получаем кастомное или стандартное сообщение об ошибке
function getErrorMessage(inputElement, config) {
  // Сброс стандартной ошибки, если была
  inputElement.setCustomValidity('');

  if (inputElement.validity.valueMissing) {
    return 'Вы пропустили это поле';
  }

  if (inputElement.validity.tooShort) {
    return `Минимальное количество символов ${inputElement.minLength}. Длина текста сейчас: ${inputElement.value.length} символ${inputElement.value.length !== 1 ? 'а' : ''}`;
  }

  if (inputElement.validity.typeMismatch && inputElement.type === 'url') {
    return 'Введите адрес сайта';
  }

  // Кастомная ошибка из data-error (проверка через pattern)
  if (inputElement.dataset.error && !inputElement.checkValidity()) {
    return inputElement.dataset.error;
  }

  return '';
}

// Показываем ошибку
function showInputError(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  const errorMessage = getErrorMessage(inputElement, config);

  if (errorMessage) {
    inputElement.classList.add(config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
  } else {
    hideInputError(formElement, inputElement, config);
  }
}

// Скрываем ошибку
function hideInputError(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);

  inputElement.classList.remove(config.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(config.errorClass);
}

// Переключаем состояние кнопки "Сохранить"
function toggleButtonState(formElement, config) {
  const inputList = formElement.querySelectorAll(config.inputSelector);
  const submitButton = formElement.querySelector(config.submitButtonSelector);

  const hasInvalidInput = Array.from(inputList).some(input => !input.checkValidity());

  if (hasInvalidInput) {
    submitButton.classList.add(config.inactiveButtonClass);
    submitButton.disabled = true;
  } else {
    submitButton.classList.remove(config.inactiveButtonClass);
    submitButton.disabled = false;
  }
}

// Устанавливаем слушатели событий на каждую форму
function setEventListeners(formElement, config) {
  const inputList = formElement.querySelectorAll(config.inputSelector);
  const submitButton = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach(inputElement => {
    inputElement.addEventListener('input', () => {
      // Если у элемента есть pattern, запускаем кастомную валидацию
      if (inputElement.hasAttribute('pattern')) {
        const pattern = new RegExp(inputElement.getAttribute('pattern'));
        const errorMessage = inputElement.dataset.error || 'Недопустимые символы';
        isValidPattern(inputElement, pattern, errorMessage);
      }

      showInputError(formElement, inputElement, config);
      toggleButtonState(formElement, config);
    });
  });
}

// Очищает все ошибки и блокирует кнопку
export function clearValidation(formElement, config) {
  const inputList = formElement.querySelectorAll(config.inputSelector);

  inputList.forEach(inputElement => {
    hideInputError(formElement, inputElement, config);
    inputElement.setCustomValidity('');
  });

  toggleButtonState(formElement, config);
}

// Включает валидацию для всех форм
export function enableValidation(config) {
  const formList = document.querySelectorAll(config.formSelector);

  formList.forEach(formElement => {
    setEventListeners(formElement, config);
    toggleButtonState(formElement, config);
  });
}