"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const passwordHash = await bcrypt.hash("123456", 10);

    const utilisateurs = [
      // --- ADMIN ---
      {
        googleId: null,
        email: "test251025@outlook.com",
        name: "RABE Harivelo Andry",
        password: passwordHash,
        photo: "/images/default-img-profil.png",
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      },

      // --- ÉTUDIANTS ---
      {
        googleId: null,
        email: "fitahiana.rabeh@eni.mg",
        name: "RABEHARISON Fitahiana",
        password: passwordHash,
        photo:
          "https://ui-avatars.com/api/?name=RABEHARISON+Fitahiana&background=0D8ABC&color=fff&size=128",
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        googleId: null,
        email: "tahina.randria@eni.mg",
        name: "RANDRIANASOLO Tahina",
        password: passwordHash,
        photo: "https://randomuser.me/api/portraits/men/12.jpg",
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        googleId: null,
        email: "miora.ranaivo@esi.mg",
        name: "RANAIVO Miora",
        password: passwordHash,
        photo: "https://api.dicebear.com/9.x/adventurer/svg?seed=Aidan",
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        googleId: null,
        email: "anto.herizo@suptech.mg",
        name: "RAKOTOMALALA Herizo",
        password: passwordHash,
        photo:
          "https://ui-avatars.com/api/?name=RAKOTOMALALA+Herizo&background=FF5733&color=fff&size=128",
        isVerified: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        googleId: null,
        email: "tiana.fetra@istech.mg",
        name: "RATSIMBA Tiana Fetra",
        password: passwordHash,
        photo: "https://randomuser.me/api/portraits/women/21.jpg",
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        googleId: null,
        email: "sanda.rivo@eni.mg",
        name: "RABENJAMINA Sanda Rivo",
        password: passwordHash,
        photo: "https://api.dicebear.com/9.x/adventurer/svg?seed=Leo",
        isVerified: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        googleId: null,
        email: "fanja.andri@polytech.mg",
        name: "ANDRIAMAHENINA Fanja",
        password: passwordHash,
        photo:
          "https://ui-avatars.com/api/?name=ANDRIAMAHENINA+Fanja&background=1ABC9C&color=fff&size=128",
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        googleId: null,
        email: "soanja.rahel@supinfo.mg",
        name: "RAHELOSON Soanja",
        password: passwordHash,
        photo: "https://randomuser.me/api/portraits/women/33.jpg",
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        googleId: null,
        email: "toky.ranaiv@univ.mg",
        name: "RANAIVOMANANA Toky",
        password: passwordHash,
        photo: "https://api.dicebear.com/9.x/adventurer/svg?seed=Brian",
        isVerified: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        googleId: null,
        email: "abcdefgf@gmail.com",
        name: "Dernier etudiant",
        password: passwordHash,
        photo:
          "https://ui-avatars.com/api/?name=Dernier+Etudiant&background=FF33A8&color=fff&size=128",
        isVerified: false,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("utilisateurs", utilisateurs, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("utilisateurs", null, {});
  },
};
