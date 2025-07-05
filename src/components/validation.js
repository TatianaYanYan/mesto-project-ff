// Функция для проверки регулярного выражения
function isValidPattern(input, pattern, errorMessage) {
  const regex = new RegExp(pattern);
  return regex.test(input.trim()) ? null : errorMessage;
}

// Кастомные сообщения об ошибках
const customErrorMessages = {
  required: "Вы пропустили это поле",
  minLength: (minLength, currentLength) => 
    `Минимальное количество символов ${minLength}. Длина текста сейчас: ${currentLength} символ${currentLength !== 1 ? 'а' : ''}`,
  invalidCharacters: "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы",
  invalidUrl: "Введите адрес сайта"
};

// Функция для получения сообщения об ошибке
function getErrorMessage(inputElement) {
  if (inputElement.validity.valueMissing) {
    return inputElement.dataset.requiredMessage || customErrorMessages.required;
  }

  if (inputElement.validity.tooShort) {
    return customErrorMessages.minLength(inputElement.minLength, inputElement.value.length);
  }

  if (inputElement.type === 'url' && !isValidPattern(inputElement.value, /^https?:\/\/[^\s]+$/i, customErrorMessages.invalidUrl)) {
    return customErrorMessages.invalidUrl;
  }

  if (inputElement.dataset.error) {
    const pattern = inputElement.pattern ? new RegExp(inputElement.pattern) : null;
    if (pattern && !pattern.test(inputElement.value.trim())) {
      return inputElement.dataset.error;
    }
  }

  return "";
}

// Функция для проверки ввода
function checkInputValidity(formElement, inputElement) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  const errorMessage = getErrorMessage(inputElement);

  if (errorMessage) {
    inputElement.classList.add('popup__input_type_error');
    errorElement.textContent = errorMessage;
    errorElement.classList.add('popup__error_visible');
  } else {
    inputElement.classList.remove('popup__input_type_error');
    errorElement.textContent = '';
    errorElement.classList.remove('popup__error_visible');
  }
}

// Функция для переключения состояния кнопки submit
function toggleButtonState(formElement) {
  const isInvalid = Array.from(formElement.querySelectorAll('.popup__input')).some(
    inputElement => !inputElement.checkValidity()
  );

  const submitButton = formElement.querySelector('.popup__button');
  if (isInvalid) {
    submitButton.classList.add('popup__button_disabled');
    submitButton.disabled = true;
  } else {
    submitButton.classList.remove('popup__button_disabled');
    submitButton.disabled = false;
  }
}

// Функция для установки слушателей событий на все формы
function setEventListeners(formElement) {
  const inputList = formElement.querySelectorAll('.popup__input');

  // Устанавливаем паттерны для валидации
  const patterns = {
    'popup__input_type_name': /^[a-zA-Zа-яА-ЯёЁ\- ]+$/,
    'popup__input_type_description': /^[a-zA-Zа-яА-ЯёЁ\- ]+$/,
    'popup__input_type_card-name': /^[a-zA-Zа-яА-ЯёЁ\- ]+$/,
    'popup__input_type_url': /^https?:\/\/[^\s]+$/i,
    'popup__input_type_avatar-url': /^https?:\/\/[^\s]+$/i
  };

  inputList.forEach(inputElement => {
    // Добавляем data-атрибут с сообщением об ошибке для кастомных правил
    const inputClass = [...inputElement.classList].find(cls => cls.startsWith('popup__input_type_'));
    if (patterns[inputClass]) {
      inputElement.pattern = patterns[inputClass].source;
      if (inputClass.includes('name') || inputClass.includes('description')) {
        inputElement.dataset.error = customErrorMessages.invalidCharacters;
        inputElement.setAttribute('minlength', 2);
        inputElement.setAttribute('maxlength', inputClass.includes('name') ? 40 : 200);
      }
      if (inputClass.includes('url') || inputClass.includes('avatar-url')) {
        inputElement.type = 'url';
        inputElement.dataset.requiredMessage = customErrorMessages.invalidUrl;
      }
    }

    inputElement.addEventListener('input', () => {
      // Проверяем дополнительные условия валидации
      const inputClass = [...inputElement.classList].find(cls => cls.startsWith('popup__input_type_'));
      if (patterns[inputClass]) {
        const result = isValidPattern(inputElement.value, patterns[inputClass], inputElement.dataset.error || customErrorMessages.invalidUrl);
        inputElement.setCustomValidity(result || '');
      }

      checkInputValidity(formElement, inputElement);
      toggleButtonState(formElement);
    });
  });

  // Блокируем отправку формы, если есть ошибки
  formElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const firstInvalidInput = [...inputList].find(input => !input.checkValidity());
    if (firstInvalidInput) {
      firstInvalidInput.focus();
    }
  });
}

// Функция для очистки валидации
export function clearValidation(formElement, config) {
  const inputList = formElement.querySelectorAll(config.inputSelector);
  const submitButton = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach(inputElement => {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.remove(config.inputErrorClass);
    errorElement.textContent = "";
    errorElement.classList.remove(config.errorClass);
    inputElement.setCustomValidity('');
  });

  submitButton.classList.add(config.inactiveButtonClass);
  submitButton.disabled = true;
}

// Основная функция включения валидации
export function enableValidation(config) {
  const formList = document.querySelectorAll(config.formSelector);

  formList.forEach(formElement => {
    setEventListeners(formElement);
    toggleButtonState(formElement);
  });
}