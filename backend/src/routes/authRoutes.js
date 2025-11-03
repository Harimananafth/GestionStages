const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../auth/google");
const Auth = require("../auth/auth")
const authMiddleware = require("../middlewares/authMiddleware");


router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/" }), Auth.callback)
router.post("/google/register", Auth.registerGoogle);
router.post("/login", Auth.login)
router.post("/register", Auth.register)
router.post("/verify-code", Auth.verifyCode)
router.post("/resend-code", Auth.resendCode)
router.get("/check", Auth.check);
router.get("/logout",authMiddleware, Auth.logout);








module.exports = {
  prefix: "/auth",
  router
};