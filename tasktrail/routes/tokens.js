const express = require("express");
const router = express.Router();
const path = require("path");
const { Token } = require("./enums");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validator = require("validator");
const hbs = require("nodemailer-express-handlebars");

const { SMTP_PORT, MAIL_HOST, MAIL_USER, MAIL_PASSWD, APP_NAME, APP_DOMAIN } = process.env;
const { checkPasswords, setMailTransport, setHandlebar, setMailData, setTokenExpiracy } = require("./helpers");

const transporter = setMailTransport(SMTP_PORT, MAIL_HOST, MAIL_USER, MAIL_PASSWD);
const handlebarOptions = setHandlebar(".handlebars", path.join(__dirname, "../views/email"));

transporter.use("compile", hbs(handlebarOptions));

//#region recover
function recover(req, res, next) {
	res.render("recover", { title: req.__("navigation.recover"), mailSent: true });
}

router.get("/recover", function (req, res, next) {
	const message = req.query.expired;

	res.render("recover", { title: req.__("navigation.recover"), expiredToken: message, lang: req.cookies.lang });
});

router.post(
	"/recover",
	async function (req, res, next) {
		const userEmail = validator.isEmail(req.body.email) ? req.body.email : false;
		const dbUser = await prisma.users.findUnique({ where: { email: userEmail } });

		if (!userEmail || !dbUser) return next();

		const token = crypto.randomBytes(16).toString("hex");

		const emailContext = {
			linkUrl: `${APP_DOMAIN}/recover/${token}`,
			linkText: req.__("email.recover.link"),
			isRecover: true,
			isEnglish: req.getLocale() === "en",
			isSpanish: req.getLocale() === "es"
		};

		const mailData = setMailData(`"${APP_NAME} 📝📌" <${MAIL_USER}>`, userEmail, req.__("email.recover.subject"), emailContext);

		transporter.sendMail(mailData, async (error, info) => {
			if (error) console.error(error);
			else {
				const TOKEN_MINUTES = 5;

				await prisma.tokens.create({
					data: {
						user_id: dbUser.id,
						type_id: Token.TOKEN_TYPES.RECOVER,
						value: token,
						expiracy: setTokenExpiracy(new Date(), TOKEN_MINUTES)
					}
				});
				res.render("recover", { title: req.__("navigation.recover"), mailSent: true, lang: req.cookies.lang });
			}
		});
	},
	recover
);

function recoverToken(req, res, next) {
	const mismatchMessage = req.__("recover.error.mismatch");
	const existingMessage = req.__("recover.error.existingPassword");
	const error = req.body.error === "mismatch" ? mismatchMessage : existingMessage;

	res.render("recover", { title: req.__("navigation.recover"), token: req.params.token, error: error });
}

router.get("/recover/:token", async function (req, res, next) {
	const token = await prisma.tokens.findFirst({
		where: {
			value: req.params.token,
			type_id: Token.TOKEN_TYPES.RECOVER
		}
	});

	if (!token || token.expiracy < new Date()) {
		res.redirect("/recover?expired=true");
		return;
	}

	if (req.params.token) res.render("recover", { title: req.__("navigation.recover"), token: req.params.token, lang: req.cookies.lang });
});

router.post(
	"/recover/:token",
	async function (req, res, next) {
		const password1 = req.body.password;
		const password2 = req.body.password2;

		if (!req.params.token) return next();

		const token = await prisma.tokens.findFirst({
			where: {
				value: req.params.token
			}
		});

		if (!token || token.expiracy < new Date()) res.redirect("/recover?expired=true");

		const user = await prisma.users.findFirst({
			where: {
				id: token.user_id
			}
		});

		if (!checkPasswords(password1, password2)) {
			req.body.error = "mismatch";
			return next();
		} else if (await bcrypt.compare(req.body.password, user.password)) {
			req.body.error = "existing";
			return next();
		}

		await prisma.users.update({
			where: { id: token.user_id },
			data: { password: await bcrypt.hash(password1, 10) }
		});

		res.redirect(`/login?passwordChangedSuccess=true`);
	},
	recoverToken
);
//#endregion

//#region verify
router.get("/verify/:token", async function (req, res, next) {
	const token = await prisma.tokens.findFirst({
		where: {
			value: req.params.token,
			type_id: Token.TOKEN_TYPES.VERIFY
		}
	});

	if (!token || token.expiracy < new Date()) {
		res.render("verify", { title: req.__("verify.title"), lang: req.cookies.lang });
		return;
	}

	await prisma.users.update({
		where: {
			id: token.user_id
		},
		data: {
			verified: true
		}
	});

	req.session.verified = true;

	res.render("verify", { title: req.__("verify.title"), token: req.params.token, lang: req.cookies.lang });
});
//#endregion

module.exports = router;
