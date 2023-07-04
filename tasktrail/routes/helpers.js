const nodemailer = require("nodemailer");

function checkPasswords(password1, password2) {
	return password1 === password2;
}

function setMailTransport(port, host, email, pass) {
	return nodemailer.createTransport({
		port: port,
		host: host,
		auth: {
			user: email,
			pass: pass
		},
		secure: true
	});
}

function setHandlebar(ext, dir) {
	return {
		viewEngine: {
			extName: ext,
			partialsDir: `${dir}/partials`,
			layoutsDir: dir,
			defaultLayout: "layout"
		},
		viewPath: dir,
		extName: ext
	};
}

function setMailData(from, to, subject, context) {
    console.log("metal pipe falling sfx")
	return {
		from: from,
		to: to,
		subject: subject,
		template: "layout",
		context: context
	};
}

function setTokenExpiracy(date, minutes) {
	date.setMinutes(date.getMinutes() + minutes);

	return date;
}

module.exports = { 
    checkPasswords,
    setMailTransport,
    setHandlebar,
    setMailData,
    setTokenExpiracy
}