export const ROUTES = {
  HOME: "/",

  AUTH: {
    ROOT: "/auth",
    LOGIN: "/auth",
    SIGN_UP: {
      ROOT: "/auth/sign-up",
      SET_PASSWORD: "/auth/sign-up/set-password",
      VERIFICATION: "/auth/sign-up/verification",
      MORE_INFO: "/auth/sign-up/more-info",
    },
    SUCCESS: "/auth/login-success",
  },

  USER: {
    ROOT: "/t",
    DASHBOARD: "/t",
    CANDIDATURE: "/t/candidatures",
    OFFRE: "/t/offres",
    PROFIL: "/t/profil",
  },

  ADMIN: {
    ROOT: "/a",
    DASHBOARD: "/a",
    OFFRE: "/a/offres",
    OFFRE_CANDIDATURE: (id) => `/a/offres/${id}`,
    CANDIDATURE: "/a/candidatures",
    CANDIDATURE_ACTION: (id) => `/a/candidatures/${id}`,
    ETUDIANT: "/a/etudiants",
    ETUDIANT_FICHE: (id) => `/a/etudiants/${id}`,
    PROFIL: "/a/profils",
  },
};
