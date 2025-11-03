const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const {Utilisateur} = require("../Models")
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Utilisateur.findOne({ where: { email: profile.emails[0].value } });

        if (!user) {
          // nouvel utilisateur
          return done(null, { googleProfile: profile, isNew: true });
        }

        // utilisateur existant
        // ⚠️ inclure googleProfile pour mettre à jour infos
        return done(null, { user, isNew: false, googleProfile: profile });

      } catch (err) {
        return done(err, null);
      }
    }
  )
);



passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
