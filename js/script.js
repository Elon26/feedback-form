"use strict"

const openPopupButton = document.querySelector(".openPopupButton");
const popup = document.querySelector(".popup");
const form = document.querySelector(".popup__form");
const nameInput = form.name;
const phoneInput = form.phone;
const messageInput = form.message;

/** Функция открывает всплывающее окно формы обратной связи. */
function openPopup() {
    popup.classList.add("open");
}

/** Функция закрывает всплывающее окно формы обратной связи. */
function closePopup() {
    popup.classList.remove("open");
}

/** Функция производит валидацию введённых пользователем значений. */
function validate(nameValue, phoneValue, messageValue) {
    let isValid = true;
    const reg = /[\`\"\'\!\@\#\$\%\&\(\)\+\=\-\_\[\]\{\}\\\/\|]/g;

    if (nameValue.trim() === "") {
        handleError("name", "Имя не должно быть пустым");
        isValid = false;
    }
    if (reg.test(nameValue)) {
        handleError("name", "Имя не должно содержать спецсимволы");
        isValid = false;
    }

    if (phoneValue.length !== 18) {
        handleError("phone", "Номер телефона введён не полностью");
        isValid = false;
    }

    if (messageValue.trim() === "") {
        handleError("message", "Сообщение не должно быть пустым");
        isValid = false;
    }
    if (reg.test(messageValue)) {
        handleError("message", "Сообщение не должно содержать спецсимволы");
        isValid = false;
    }

    return isValid;
}

/** Функция создаёт сообщение об ошибке, а также меняет цвет границы поля ввода. */
function handleError(inputName, errorMessage) {
    const inputItem = form[inputName];
    inputItem.classList.add("error");

    const errorItem = document.createElement("div");
    errorItem.className = `popup__error popup__error_${inputName}`;
    errorItem.textContent = errorMessage;
    inputItem.after(errorItem);
}

/** Функция создаёт пользовательское сообщение. */
function createUserMessage(status, userMessage) {
    removeUserMessage();

    const userMessageItem = document.createElement("div");
    document.body.prepend(userMessageItem);
    userMessageItem.className = `userMessage userMessage_${status}`;
    userMessageItem.textContent = userMessage;

    setTimeout(() => {
        userMessageItem.classList.add("visible")
    }, 0);
    setTimeout(() => {
        userMessageItem.classList.remove("visible")
    }, 3000);
    setTimeout(() => {
        userMessageItem.remove();
    }, 4000);
}

/** Функция форсирует удаление пользовательского сообщения. */
function removeUserMessage() {
    const userMessage = document.querySelector(".userMessage");
    if (userMessage) userMessage.remove();
}

/** Функция удаляет все сообщения об ошибках. */
function removeAllErrors() {
    const errors = document.querySelectorAll(".popup__error");
    errors.forEach(error => error.remove());
}

/** Функция очищает форму от введённых значений. */
function clearForm() {
    nameInput.value = "";
    phoneInput.value = "";
    messageInput.value = "";
}

/** Функция преобразует введённый пользователем номер телефона в формат, пригодный для хранения в базе данных. */
function handlePhoneValue(phoneValue) {
    let result = "+7";

    for (let i = 0; i < phoneValue.length; i++) {
        if (i > 3 && i < 7) {
            result += phoneValue[i];
        }
        if (i > 8 && i < 12) {
            result += phoneValue[i];
        }
        if (i > 12 && i < 15) {
            result += phoneValue[i];
        }
        if (i > 15 && i < 18) {
            result += phoneValue[i];
        }
    };

    return result;
}

/** Данная настройка вызывает открытие всплывающего окна при клике на соответствующую кнопку. */
openPopupButton.addEventListener("click", () => {
    openPopup();
});

/** Данная настройка закрытие всплывающего окна при клике на соответствующую кнопку или на пустое пространство. */
popup.addEventListener("click", (e) => {
    if (!e.target.closest(".popup__inner") || e.target.closest(".popup__closeIcon")) {
        closePopup();
    }
});

/** Данная настройка вводит базовое значение маски ввода при установке фокуса на поле ввода номера телефона. */
phoneInput.addEventListener("focus", () => {
    if (phoneInput.value === "") {
        phoneInput.value = "+7 ("
    }
});

/** Данная настройка убирает базовое значение маски с поля ввода номера телефона при снятии фокуса, если пользователем не было введено значений, отличных от установленных по умолчанию. */
phoneInput.addEventListener("blur", () => {
    if (phoneInput.value.length <= 4) {
        phoneInput.value = ""
    }
});

/** Данная настройка регулирует корректность ввода телефона и добавляет соответствующие спецсимволы маски ввода. */
phoneInput.addEventListener("input", (e) => {
    const reg = /[A-Za-zА-Яа-яЁё`"'!@#$%^&*=_]/g;
    e.target.value = e.target.value.replace(reg, "")
    if (e.target.value.length === 7) {
        e.target.value += ") "
    }
    if (e.target.value.length === 12 || e.target.value.length === 15) {
        e.target.value += "-"
    }
    if (e.target.value.length > 18) {
        e.target.value = e.target.value.slice(0, 18)
    }
});

/** Данная настройка вызывает обработку формы после нажатия кнопки "Отправить". */
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameValue = e.target.name.value;
    const phoneValue = e.target.phone.value;
    const messageValue = e.target.message.value;

    removeAllErrors();
    const isValid = validate(nameValue, phoneValue, messageValue);

    if (isValid) {
        const clearedPhoneValue = handlePhoneValue(phoneValue);
        const objectForSend = {
            name: nameValue,
            phone: clearedPhoneValue,
            message: messageValue
        }
        const JSONForSend = JSON.stringify(objectForSend);

        createUserMessage("success", `Форма отправлена, данные переданы в следующем виде: ${JSONForSend}`);
        clearForm();
        closePopup();
    } else {
        createUserMessage("error", "Форма не отправлена, пожалуйста, введите корректные данные.");
    }
});

/** Данная удаляет сообщение об ошибке при изменении поля ввода имени. */
nameInput.addEventListener("input", (e) => {
    const errorMessage = document.querySelector(".popup__error_name");
    if (errorMessage) {
        errorMessage.remove();
        e.target.classList.remove("error");
    }
});

/** Данная удаляет сообщение об ошибке при изменении поля ввода номера телефона. */
phoneInput.addEventListener("input", (e) => {
    const errorMessage = document.querySelector(".popup__error_phone");
    if (errorMessage) {
        errorMessage.remove();
        e.target.classList.remove("error");
    }
});

/** Данная удаляет сообщение об ошибке при изменении поля ввода сообщения. */
messageInput.addEventListener("input", (e) => {
    const errorMessage = document.querySelector(".popup__error_message");
    if (errorMessage) {
        errorMessage.remove();
        e.target.classList.remove("error");
    }
});
