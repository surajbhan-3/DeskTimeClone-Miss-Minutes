
const passport=require("passport")
const {UserModel}=require("../models/user.model");
require("dotenv").config()
const { v4: uuidv4 } = require("uuid");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
passport.serializeUser((user, done) => {

	done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
	const user = await UserModel.findOne({ email: email });
	done(null, user);
});
passport.use(
	new GoogleStrategy(
		{
            clientID: "684268903079-4n6nnl5360i6v7va7btk5nus59l7r4ui.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:8080/auth/google/callback",
            passReqToCallback: true,
		},
		

		async (request, accessToken, refreshToken, profile, done) => {
			try {
				const cUser = await UserModel.findOne({ email: profile._json.email });
		
				if (!cUser) {
				  const newUser = {
					email: profile._json.email,
					name: profile._json.name,
					password: uuidv4(),
				  };
		
				  const data = await UserModel.create(newUser);
		
		
				  return done(null, newUser);
				} else {
		
				  return done(null, cUser);
				}
			  } catch (err) {
				return done(err);
			  }
		}
	)
);


  module.exports= passport;