class Token {
	static TOKEN_TYPES = Object.freeze({
		VERIFY: 1,
		RECOVER: 2
	});

	static FILTERS = Object.freeze({
		done: true,
		undone: false,
		all: undefined
	});
}

module.exports = { Token };
