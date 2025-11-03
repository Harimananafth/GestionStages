const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Utilisateur } = require("../models");
require("dotenv").config();

const isProd = process.env.NODE_ENV === "production";
const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:5000";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: isProd
        ? `${apiBaseUrl}/api/auth/google/callback` 
        : "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Utilisateur.findOne({
          where: { email: profile.emails[0].value },
        });

        if (!user) {
          // nouvel utilisateur
          return done(null, { googleProfile: profile, isNew: true });
        }

        // utilisateur existant
        // inclure googleProfile pour mettre à jour infos
        return done(null, { user, isNew: false, googleProfile: profile });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
