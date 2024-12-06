/**
 * Password Strength Meter on pure JavaScript with password confirmation check
 * 
 * Original author:
 * @author Òscar Casajuana
 * @link https://github.com/elboletaire/password-strength-meter
 * @license GPL-3.0
 * 
 * Rewritten and extended on modern JavaScript without using jQuery:
 * Added password confirmation check.
 * @author Dmitriy Mikholazhin
 * @email me@dmitmix.ru
 * @link 
 * @license GPL-3.0
 */

'use strict';

class PasswordStrengthMeter {
	constructor(inputElement, confirmElement = null, options = {}) {
		const defaults = {
			enterPass: 'Enter password',
			shortPass: 'Password is too short',
			containsField: 'Password contains your username',
			invalidChars: 'Password contains invalid characters',
			passwordsMatch: 'Passwords match',
			passwordsNotMatch: 'Passwords do not match',
			steps: {
				13: 'Very weak password',
				33: 'Weak; try mixing letters and numbers',
				67: 'Medium; try using special characters',
				94: 'Strong password',
			},
			showPercent: false,
			showText: true,
			animate: true,
			animateSpeed: 'fast',
			field: null,
			fieldPartialMatch: true,
			minimumLength: 4,
			closestSelector: 'div',
			useColorBarImage: false,
			customColorBarRGB: {
				red: [0, 240],
				green: [0, 240],
				blue: 10
			},
		};

		this.options = { ...defaults, ...options };
		this.inputElement = inputElement;
		this.confirmElement = confirmElement;
		this.passwordsMatch = null;
		this.init();
	}

	scoreText(score) {
		if (score === -1) return this.options.shortPass;
		if (score === -2) return this.options.containsField;
		if (score === -3) return this.options.invalidChars;

		let text = this.options.shortPass;
		const sortedSteps = Object.keys(this.options.steps)
			.map(Number)
			.sort((a, b) => a - b);
		for (const step of sortedSteps) {
			if (score >= step) {
				text = this.options.steps[step];
			}
		}
		return text;
	}

	calculateScore(password, field) {
		let score = 0;
		if (password.length < this.options.minimumLength) return -1;

		// Проверка на нелатинские символы
		if (/[^A-Za-z0-9!@#$%^&*?_~]/.test(password)) {
			return -3;
		}

		if (this.options.field) {
			if (password.toLowerCase() === field.toLowerCase()) return -2;
			if (this.options.fieldPartialMatch && field.length) {
				const user = new RegExp(field.toLowerCase());
				if (password.toLowerCase().match(user)) return -2;
			}
		}

		// Остальная логика оценки пароля...

		score += password.length * 4;
		score += this.checkRepetition(1, password).length - password.length;
		score += this.checkRepetition(2, password).length - password.length;
		score += this.checkRepetition(3, password).length - password.length;
		score += this.checkRepetition(4, password).length - password.length;

		if (password.match(/(.*[0-9].*[0-9].*[0-9])/)) score += 5;

		const symbols = '.*[!,@,#,$,%,^,&,*,?,_,~]';
		const symbolsRegex = new RegExp('(' + symbols + symbols + ')');
		if (password.match(symbolsRegex)) score += 5;

		if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) score += 10;

		if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) score += 15;

		if (password.match(/([!@#$%^&*?_~])/) && password.match(/([0-9])/)) score += 15;

		if (password.match(/([!@#$%^&*?_~])/) && password.match(/([a-zA-Z])/)) score += 15;

		if (password.match(/^\w+$/) || password.match(/^\d+$/)) score -= 10;

		if (score > 100) score = 100;
		if (score < 0) score = 0;

		return score;
	}

	checkRepetition(length, str) {
		let res = "", repeated;
		for (let i = 0; i < str.length; i++) {
			repeated = true;
			let j = 0;
			for (; j < length && (j + i + length) < str.length; j++) {
				repeated = repeated && (str.charAt(j + i) === str.charAt(j + i + length));
			}
			if (j < length) repeated = false;
			if (repeated) {
				i += length - 1;
				repeated = false;
			} else {
				res += str.charAt(i);
			}
		}
		return res;
	}


	calculateColorFromPercentage(perc) {
		let { red: [minRed, maxRed], green: [minGreen, maxGreen], blue } = this.options.customColorBarRGB;

		const green = (perc * maxGreen) / 50;
		const red = (2 * maxRed) - (perc * maxRed / 50);

		return {
			red: Math.min(Math.max(red, minRed), maxRed),
			green: Math.min(Math.max(green, minGreen), maxGreen),
			blue
		};
	}

	addColorBarStyle(colorbar, perc) {
		if (this.options.useColorBarImage) {
			colorbar.style.backgroundPosition = `0px -${perc}px`;
			colorbar.style.width = `${perc}%`;
		} else {
			const colors = this.calculateColorFromPercentage(perc);
			colorbar.style.backgroundImage = 'none';
			colorbar.style.backgroundColor = `rgb(${colors.red}, ${colors.green}, ${colors.blue})`;
			colorbar.style.width = `${perc}%`;
		}
	}

	init() {
		let shown = true;
		const { showText, showPercent, animate, animateSpeed, closestSelector } = this.options;
		this.confirmTextElement = null;
		// Создание элементов для основного пароля
		const graybar = document.createElement('div');
		graybar.classList.add('pass-graybar');

		const colorbar = document.createElement('div');
		colorbar.classList.add('pass-colorbar');
		graybar.appendChild(colorbar);

		const wrapper = document.createElement('div');
		wrapper.classList.add('pass-wrapper');
		wrapper.appendChild(graybar);

		let percentageElement;
		if (showPercent) {
			percentageElement = document.createElement('span');
			percentageElement.classList.add('pass-percent');
			percentageElement.textContent = '0%';
			wrapper.appendChild(percentageElement);
		}

		let textElement;
		if (showText) {
			textElement = document.createElement('span');
			textElement.classList.add('pass-text');
			textElement.innerHTML = this.options.enterPass;
			wrapper.appendChild(textElement);
		}

		const closestElement = this.inputElement.closest(closestSelector);
		if (closestElement) {
			closestElement.classList.add('pass-strength-visible');
			closestElement.appendChild(wrapper);

			if (animate) {
				wrapper.style.display = 'none';
				shown = false;
				closestElement.classList.remove('pass-strength-visible');
			}
		}

		// Обработчики событий для основного пароля
		this.inputElement.addEventListener('keyup', () => {
			this.updateStrength(colorbar, percentageElement, textElement);
			this.checkPasswordMatch(this.confirmTextElement);
		});

		if (animate) {
			this.inputElement.addEventListener('focus', () => {
				if (!shown && wrapper.style.display === 'none') {
					wrapper.style.display = '';
					shown = true;
					closestElement.classList.add('pass-strength-visible');
				}
			});

			this.inputElement.addEventListener('blur', () => {
				if (!this.inputElement.value.length && shown) {
					wrapper.style.display = 'none';
					shown = false;
					closestElement.classList.remove('pass-strength-visible');
				}
			});
		}

		// Если задан элемент подтверждения пароля
		if (this.confirmElement) {
			let confirmShown = true;

			const confirmWrapper = document.createElement('div');
			confirmWrapper.classList.add('pass-confirm-wrapper');

			this.confirmTextElement = document.createElement('span');
			this.confirmTextElement.classList.add('pass-confirm-text');
			this.confirmTextElement.innerHTML = ''; // Изначально пусто
			confirmWrapper.appendChild(this.confirmTextElement);

			const confirmClosestElement = this.confirmElement.closest(closestSelector);
			if (confirmClosestElement) {
				confirmClosestElement.classList.add('pass-confirm-visible');
				confirmClosestElement.appendChild(confirmWrapper);

				if (animate) {
					confirmWrapper.style.display = 'none';
					confirmShown = false;
					confirmClosestElement.classList.remove('pass-confirm-visible');
				}
			}

			// Обработчики событий для подтверждения пароля
			if (this.confirmElement) {
				const updateConfirmation = () => {
					this.updateStrength(colorbar, percentageElement, textElement);
				};

				this.inputElement.addEventListener('keyup', updateConfirmation);
				this.confirmElement.addEventListener('keyup', updateConfirmation);
			}

			if (animate) {
				this.confirmElement.addEventListener('focus', () => {
					if (!confirmShown && confirmWrapper.style.display === 'none') {
						confirmWrapper.style.display = '';
						confirmShown = true;
						confirmClosestElement.classList.add('pass-confirm-visible');
					}
				});

				this.confirmElement.addEventListener('blur', () => {
					if (!this.confirmElement.value.length && confirmShown) {
						confirmWrapper.style.display = 'none';
						confirmShown = false;
						confirmClosestElement.classList.remove('pass-confirm-visible');
					}
				});
			}
		}
	}

	updateStrength(colorbar, percentageElement, textElement) {
		let fieldValue = '';
		if (this.options.field) {
			const fieldElement = document.querySelector(this.options.field);
			if (fieldElement) fieldValue = fieldElement.value;
		}

		const score = this.calculateScore(this.inputElement.value, fieldValue);
		const perc = score < 0 ? 0 : score;

		this.addColorBarStyle(colorbar, perc);

		if (this.options.showPercent && percentageElement) {
			percentageElement.textContent = `${perc}%`;
		}

		if (this.options.showText && textElement) {
			let text = this.scoreText(score);
			if (!this.inputElement.value.length && score <= 0) {
				text = this.options.enterPass;
			}
			if (textElement.innerHTML !== text) {
				textElement.innerHTML = text;
			}
		}
		// Обновляем статус совпадения паролей перед отправкой события
		if (this.confirmElement) {
			this.checkPasswordMatch(this.confirmTextElement);
		}

		const scoreEvent = new CustomEvent('password.score', {
			detail: {
				score: score,
				percentage: perc,
				passwordsMatch: this.passwordsMatch
			}
		});
		this.inputElement.dispatchEvent(scoreEvent);
	}

	checkPasswordMatch(confirmTextElement = null) {
		if (!this.confirmElement) return;

		const password = this.inputElement.value;
		const confirmPassword = this.confirmElement.value;

		let message = '';
		if (confirmPassword.length > 0) {
			if (password === confirmPassword) {
				message = this.options.passwordsMatch;
				this.passwordsMatch = true;
				if (confirmTextElement) {
					confirmTextElement.classList.remove('pass-not-match');
					confirmTextElement.classList.add('pass-match');
				}
			} else {
				message = this.options.passwordsNotMatch;
				this.passwordsMatch = false;
				if (confirmTextElement) {
					confirmTextElement.classList.remove('pass-match');
					confirmTextElement.classList.add('pass-not-match');
				}
			}
		} else {
			message = '';
			this.passwordsMatch = null;
			if (confirmTextElement) {
				confirmTextElement.classList.remove('pass-match', 'pass-not-match');
			}
		}

		if (confirmTextElement) {
			confirmTextElement.textContent = message;
		}
	}

}

// Инициализация на элементах
function initPasswordStrengthMeter(selector, confirmSelector = null, options) {
	const elements = document.querySelectorAll(selector);
	const confirmElements = confirmSelector ? document.querySelectorAll(confirmSelector) : null;

	elements.forEach((element, index) => {
		const confirmElement = confirmElements ? confirmElements[index] : null;
		new PasswordStrengthMeter(element, confirmElement, options);
	});
}

export { PasswordStrengthMeter, initPasswordStrengthMeter };

