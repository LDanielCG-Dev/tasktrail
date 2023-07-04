const express = require("express");
const router = express.Router();

/* GET users listing. */
router.get("/*", function (req, res, next) {
	// console.log(req.session);
	if (JSON.stringify(req.session) !== "{}") {
		const session = {
			username: req.session.username,
			userid: req.session.userid
		};
		return res.render("home", { title: "Home", session: session });
	}

	return res.redirect("/login");
});

module.exports = router;
