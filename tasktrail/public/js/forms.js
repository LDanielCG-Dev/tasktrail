import { getCookie } from "./cookies.js";

async function getLocales(locale) {
	return await fetch(`/i18n/${locale}.json`)
		.then(res => res.json())
		.then(data => {
			return data;
		});
}

const cookieLocale = getCookie("lang") || "es";
const i18n = await getLocales(cookieLocale);

const form = document.querySelector(".form");

const inputPassword = form.querySelectorAll(".input[type='password']") || [];
const navbar = document.querySelector(".navbar");

document.documentElement.style.overflow = "auto";
document.documentElement.classList = "has-navbar-fixed-top";

const eyeIconClasses = ["icon", "is-small", "is-right", "is-clickable"];
const iClasses = ["fas", "fa-solid", "fa-eye-slash", "is-clickable"];
const eye = "fa-eye";
const eyeSlash = "fa-eye-slash";

for (const input of inputPassword) {
	const eyeIcon = document.createElement("span");
	eyeIcon.classList.add(...eyeIconClasses);
	const i = document.createElement("i");
	i.classList.add(...iClasses);
	eyeIcon.appendChild(i);

	input.addEventListener("keyup", self => {
		if (input.value) {
			input.parentNode.append(eyeIcon);
		} else {
			eyeIcon.remove();
		}
	});

	eyeIcon.addEventListener("click", () => {
		const input = eyeIcon.parentNode.querySelector("input");

		input.setAttribute("type", input.getAttribute("type") == "password" ? "text" : "password");

		i.classList.toggle(eyeSlash);
		i.classList.toggle(eye);
	});
}

// https://www.npmjs.com/package/validator?activeTab=readme libreria para validar añadida en cliente mediante url cdn

// comprobaciones
const formInputs = form.querySelectorAll(".input[data-input]");

const errorMsgs = {
	username: i18n.signup.form.error.username,
	email: i18n.signup.form.error.email,
	password: i18n.signup.form.error.password
};

function validarPassword() {
	let passwordsMatch = true;
	let previousValue;

	inputPassword.forEach(input => {
		const currentValue = input.value;

		if (previousValue && currentValue !== previousValue) {
			passwordsMatch = false;
			errorMsg(input, passwordsMatch);
			return;
		}

		previousValue = currentValue;
	});

	return passwordsMatch;
}

function errorMsg(input, success) {
	const control = input.parentNode.parentNode;

	if (!success) {
		input.classList.add("is-danger");

		const help = control.querySelector(".help") || document.createElement("p");
		help.classList = "help is-danger";

		help.textContent = errorMsgs[input.dataset.input];

		control.append(help);
	} else {
		if (control.contains(control.querySelector(".help"))) {
			input.classList.remove("is-danger");
			control.querySelector(".help").remove();
		}
	}
}

function validarForm() {
	let success = false;
	for (const input of formInputs) {
		// segun el tipo de input especificado aplicar un tipo de comprobación
		// es eficiente?? esta en el lado del cliente el campo, es seguro?
		// habra que validar tanto en front como en back
		// console.log(input.dataset.input);
		validator.isEmpty(input.value);

		if (input.dataset.input == "username") {
			const MAX_LENGTH = 24;
			const MIN_LENGTH = 3;
			success = validator.isAlphanumeric(input.value, "es-ES") & validator.isLength(input.value, { min: MIN_LENGTH, max: MAX_LENGTH });
			errorMsg(input, success);
		} else if (input.dataset.input == "email") {
			success = validator.isEmail(input.value);
			errorMsg(input, success);
		} else if ((input.dataset.input = "password")) {
			success = validarPassword();
			// console.log(validator.isStrongPassword(input.value, { returnScore: true }));
		}

		if (!success) {
			return success;
		}
	}

	return success;
}

const register = document.querySelector(".form.register");

if (register) {
	register.addEventListener("submit", async e => {
		let success;
		// comprobar si el formulario tiene el formato correcto
		// si estuviera correcto no hacer nada, si esta mal, prevenir evento por defecto y mostrar en el formulario los errores
		success = validarForm();

		if (!success) {
			// console.log("Formulario invalido");
		} else {
			const data = new FormData(formInputs);

			await fetch("/signup", {
				method: "post",
				body: data
			});
			// console.log("Formulario correcto");
		}
		e.preventDefault();
	});
}

const login = document.querySelector(".form.login");

if (login) {
	login.addEventListener("submit", async e => {
		let success = validarForm();

		if (!success) {
			// console.log("Formulario invalido");
		} else {
			const data = new FormData(formInputs);

			await fetch("/login", {
				method: "post",
				body: data
			});
			// console.log("Formulario correcto");
		}
		e.preventDefault();
	});
}
