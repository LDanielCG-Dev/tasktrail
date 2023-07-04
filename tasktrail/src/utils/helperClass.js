export class Helper {
	constructor() {}

	//#region api cosnt
	static FETCH_OPTIONS = (method, contentType, body = null) => {
		return {
			method: method,
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {
				"Content-Type": contentType
			},
			body: body
		};
	};

	static FETCH_METHODS = Object.freeze({
		GET: "GET",
		POST: "POST",
		PUT: "PUT",
		DELETE: "DELETE"
	});

	static CONTENT_TYPES = Object.freeze({
		JSON: "application/json",
		XML: "text/xml"
	});
	//#endregion

	static alertifysettings = {
		// dialogs defaults
		autoReset: true,
		basic: false,
		closable: true,
		closableByDimmer: true,
		invokeOnCloseOff: false,
		frameless: false,
		defaultFocusOff: false,
		maintainFocus: true, // <== global default not per instance, applies to all dialogs
		maximizable: true,
		modal: true,
		movable: false,
		moveBounded: false,
		overflow: true,
		padding: true,
		pinnable: true,
		pinned: true,
		preventBodyShift: false, // <== global default not per instance, applies to all dialogs
		resizable: true,
		startMaximized: false,
		transition: "fade",
		transitionOff: false,
		tabbable:
			'button:not(:disabled):not(.ajs-reset),[href]:not(:disabled):not(.ajs-reset),input:not(:disabled):not(.ajs-reset),select:not(:disabled):not(.ajs-reset),textarea:not(:disabled):not(.ajs-reset),[tabindex]:not([tabindex^="-"]):not(:disabled):not(.ajs-reset)', // <== global default not per instance, applies to all dialogs

		// notifier defaults
		notifier: {
			// auto-dismiss wait time (in seconds)
			delay: 5,
			// default position
			position: "bottom-right",
			// adds a close button to notifier messages
			closeButton: false,
			// provides the ability to rename notifier classes
			classes: {
				base: "alertify-notifier",
				// prefix: "ajs-",
				message: "ajs-message",
				top: "ajs-top",
				right: "ajs-right",
				bottom: "ajs-bottom",
				left: "ajs-left",
				center: "ajs-center",
				visible: "ajs-visible",
				hidden: "ajs-hidden",
				close: "ajs-close"
			}
		},

		// language resources
		glossary: {
			// dialogs default title
			title: "AlertifyJS",
			// ok button text
			ok: "Confirmar",
			// cancel button text
			cancel: "Cancelar"
		},

		// theme settings
		theme: {
			// class name attached to prompt dialog input textbox.
			input: "button",
			// class name attached to ok button
			ok: "button is-primary",
			// class name attached to cancel button
			cancel: "button is-danger"
		},
		// global hooks
		hooks: {
			// invoked before initializing any dialog
			preinit: function (instance) {},
			// invoked after initializing any dialog
			postinit: function (instance) {}
		}
	};

	//#region drag and drop
	static applyTaskDrag(items, dropResult) {
		const { removedIndex, addedIndex, payload } = dropResult;
		if (removedIndex === null && addedIndex === null) return items;

		const result = [...items];
		let itemToAdd = payload;

		if (removedIndex !== null) {
			itemToAdd = result.splice(removedIndex, 1)[0];
		}

		if (addedIndex !== null) {
			result.splice(addedIndex, 0, itemToAdd);
		}

		return result;
	}
	//#endregion

	static applyKanbanDrag(columns, columnIndex, dropResult) {
		const { removedIndex, addedIndex, payload } = dropResult;
		if (removedIndex === null && addedIndex === null) return columns;

		let itemToAdd = payload;

		if (removedIndex !== null) {
			itemToAdd = columns[columnIndex].tasks.splice(removedIndex, 1)[0];
		}

		if (addedIndex !== null) {
			columns[columnIndex].tasks.splice(addedIndex, 0, itemToAdd);
		}

		return columns;
	}

	//#region
	static disableScroll() {
		// console.log("scroll");
		const container = document.querySelector(".content");

		container.style.overflowY = "hidden";
	}

	static enableScroll() {
		// console.log("scroll");
		const container = document.querySelector(".content");

		container.style.overflowY = "auto";
	}

	static toggleScroll(active) {
		// console.log("scroll");

		const container = document.querySelector(".content");

		container.style.overflowY = active ? "hidden" : "auto";
	}
	//#endregion

	//#region api
	static async addTask(name, date) {
		try {
			await fetch(
				"/api/insert/task",
				FETCH_OPTIONS(
					FETCH_METHODS.POST,
					CONTENT_TYPES.JSON,
					JSON.stringify({
						task: JSON.stringify({
							order: 0,
							name: name,
							done: false,
							edit: false,
							date: date
						})
					})
				)
			);
		} catch (e) {
			//
		}
	}

	static async deleteTask(task) {
		try {
			await fetch("/api/delete/task", FETCH_OPTIONS(FETCH_METHODS.POST, CONTENT_TYPES.JSON, JSON.stringify({ task: JSON.stringify(task) })));
		} catch (e) {
			//
		}
	}

	static async getTasks(number = "") {
		const tasks = await fetch(`/api/get/tasks/${number}`, FETCH_OPTIONS(FETCH_METHODS.GET, CONTENT_TYPES.JSON)).then(res => res.json());

		return tasks;
	}

	static async getPaginatedTasks(skip, take) {
		const tasks = await fetch(`/api/get/tasks/${skip}/${take}`, FETCH_OPTIONS(FETCH_METHODS.GET, CONTENT_TYPES.JSON)).then(res => res.json());

		return tasks;
	}

	static async saveTasks(tasks) {
		// console.log("helper");

		await fetch("/api/upsert/tasks", FETCH_OPTIONS(FETCH_METHODS.POST, CONTENT_TYPES.JSON, JSON.stringify({ tasks: JSON.stringify(tasks) })));
	}

	static async logout() {
		// console.log("helper");

		await fetch("/logout", FETCH_OPTIONS(FETCH_METHODS.GET, CONTENT_TYPES.JSON)).then(() => (window.location.href = "/"));
	}
	//#endregion

	//#region applyTheme
	static applyTheme(theme = null) {
		const defaultTheme = { styleName: "" };
		const localStorageTheme = localStorage.getItem("theme");

		if (theme != null) {
			theme = theme;
		} else if (localStorageTheme) {
			theme = JSON.parse(localStorageTheme)[0];
		} else {
			theme = defaultTheme;
		}

		const htmlElement = document.documentElement;
		const bodyElement = document.body;

		if (theme.hasOwnProperty("0")) {
			htmlElement.classList.forEach(className => {
				if (className !== theme[0].styleName) {
					htmlElement.classList.remove(className);
				}
			});
			bodyElement.classList.forEach(className => {
				if (className !== theme[0].styleName) {
					bodyElement.classList.remove(className);
				}
			});

			htmlElement.classList.add(theme[0].styleName);
			bodyElement.classList.add(theme[0].styleName);
		} else {
			htmlElement.classList.forEach(className => {
				if (className !== theme.styleName) {
					htmlElement.classList.remove(className);
				}
			});
			bodyElement.classList.forEach(className => {
				if (className !== theme.styleName) {
					bodyElement.classList.remove(className);
				}
			});

			if (theme.styleName != "") {
				htmlElement.classList.add(theme.styleName);
				bodyElement.classList.add(theme.styleName);
			}
		}
	}
	//#endregion
}
