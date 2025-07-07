// Функция проверки регулярного выражения
function isValidPattern(inputElement) {
  const pattern = inputElement.getAttribute("pattern");
  if (pattern) {
    const regex = new RegExp(pattern);
    const value = inputElement.value.trim();
    if (!regex.test(value)) {
      inputElement.setCustomValidity(inputElement.dataset.error || "Некорректный формат");
    } else {
      inputElement.setCustomValidity("");
    }
  }
}

// Получаем кастомное или стандартное сообщение об ошибке
function getErrorMessage(inputElement) {
  // Сброс стандартной ошибки, если была
  inputElement.setCustomValidity("");

  if (inputElement.validity.patternMismatch && inputElement.dataset.error) {
    return inputElement.dataset.error;
  }

  return inputElement.validationMessage;
}

// Показываем ошибку
function showInputError(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  const errorMessage = getErrorMessage(inputElement);

  if (errorMessage) {
    inputElement.classList.add(config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
  }
}

// Скрываем ошибку
function hideInputError(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(config.errorClass);
}

// Переключаем состояние кнопки "Сохранить"
function toggleButtonState(formElement, config) {
  const inputList = formElement.querySelectorAll(config.inputSelector);
  const submitButton = formElement.querySelector(config.submitButtonSelector);
  const hasInvalidInput = Array.from(inputList).some((input) => !input.checkValidity());

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
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      isValidPattern(inputElement);
      if (!inputElement.validity.valid) {
        showInputError(formElement, inputElement, config);
      } else {
        hideInputError(formElement, inputElement, config);
      }
      toggleButtonState(formElement, config);
    });
  });
}

// Очищает все ошибки и блокирует кнопку
export function clearValidation(formElement, config) {
  const inputList = formElement.querySelectorAll(config.inputSelector);
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, config);
    inputElement.setCustomValidity("");
  });
  toggleButtonState(formElement, config);
}

// Включает валидацию для всех форм
export function enableValidation(config) {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formElement) => {
    setEventListeners(formElement, config);
    toggleButtonState(formElement, config);
  });
}