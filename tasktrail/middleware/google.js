const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_URL,
			passReqToCallback: true
		},
		async function (req, accessToken, refreshToken, profile, done) {
			const googleId = profile.id;
			const username = profile.displayName;
			const email = profile.emails[0].value;
			const photo = profile.photos[0].value;

			if (profile) {
				const user = await prisma.users.upsert({
					where: {
						provider_id: googleId
					},
					create: {
						provider_id: googleId,
						email: email,
						username: username,
						img: photo
					}
				});
			}

			return done(null, profile);
		}
	)
);

passport.serializeUser(async function (user, done) {
	const data = await prisma.users.findUnique({
		where: {
			email: user.emails[0].value
		}
	});

	return done(null, {
		userid: data.id,
		providerId: data.provider_id,
		username: data.username,
		email: data.email,
		provider: user.provider,
		img: user.photos[0].value
	});
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});
