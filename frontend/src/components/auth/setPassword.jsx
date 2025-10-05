import React, { useState } from "react";
import { useNavigate } from "react-router";

const SetPassword = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const ApiUrl = import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Récupération des données du form
    const formData = new FormData(e.target);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Vérification simple côté client
    if (!password || !confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${ApiUrl}/auth/google/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError(null);
        const id_utilisateur = data.id
        const email = data.email
        localStorage.setItem("utilisateur", JSON.stringify({ id_utilisateur, email}))
        navigate("/")
      } else {
        setError(data.error || "Erreur lors de l'inscription.");
      }
    } catch (err) {
      setError("Erreur réseau. Veuillez réessayer.");
      console.error(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", textAlign: "center" }}>
      <h2>Choisissez votre mot de passe</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Inscription réussie !</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmer le mot de passe"
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          {loading ? "Chargement..." : "Valider"}
        </button>
      </form>
    </div>
  );
};

export default SetPassword;
