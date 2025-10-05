const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../auth/google");
const Auth = require("../auth/auth")

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/" }), Auth.callback)
router.post("/google/register", Auth.registerGoogle);
router.post("/login", Auth.login)
router.post("/register", Auth.register)





module.exports = {
  prefix: "/auth",
  router
};