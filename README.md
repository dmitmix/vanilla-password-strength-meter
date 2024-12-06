# Password Strength Meter

**Password Strength Meter on pure JavaScript with password confirmation check**

Переписанная и улучшенная версия оригинального проекта [elboletaire/password-strength-meter](https://github.com/elboletaire/password-strength-meter), реализованная без jQuery и с проверкой подтверждения пароля.

## Особенности

- **Оценка сложности пароля:** Скрипт оценивает пароль по длине, типам символов, а также проверяет повторяющиеся последовательности.
- **Настраиваемые сообщения:** Можно определить свои тексты для различных уровней сложности и состояний пароля.
- **Проверка подтверждения пароля:** Скрипт позволяет указать поле для повторного ввода пароля и проверять их совпадение в реальном времени.
- **Анимации и цвета:** При желании можно использовать анимацию появления прогресс-бара, а также кастомизировать цветовую полосу прогресса.
- **Без зависимостей:** Не требует jQuery или других библиотек.

## Установка

Установите пакет через npm или yarn:

```bash
npm install password-strength-meter --save
```

## Использование

HTML-разметка
Подготовьте поля для ввода пароля и его подтверждения (при необходимости):

```html
<div class="form-group">
  <input type="password" id="password" placeholder="Введите пароль" />
</div>
<div class="form-group">
  <input
    type="password"
    id="confirm_password"
    placeholder="Подтвердите пароль"
  />
</div>
```

## Подключение стилей

Подключите CSS-стили (файл style.css доступен в пакете)

## Подключение JS

Импортируйте класс и функцию инициализации:

```js
import {
  PasswordStrengthMeter,
  initPasswordStrengthMeter,
} from "password-strength-meter";
import "password-strength-meter/style.css";

initPasswordStrengthMeter("#password", "#confirm_password", {
  showText: true,
  showPercent: true,
  minimumLength: 6,
  steps: {
    13: "Очень слабый пароль",
    33: "Слабый, попробуйте смешать буквы и цифры",
    67: "Средний, используйте специальные символы",
    94: "Сильный пароль",
  },
  enterPass: "Введите пароль",
  shortPass: "Пароль слишком короткий",
  passwordsMatch: "Пароли совпадают",
  passwordsNotMatch: "Пароли не совпадают",
});
```

## События

При изменении пароля генерируется событие password.score на inputElement, которое можно отловить, например:

```js
document.getElementById("password").addEventListener("password.score", (e) => {
  console.log("Score:", e.detail.score);
  console.log("Passwords match:", e.detail.passwordsMatch);
});
```
