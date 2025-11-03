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


    const formData = new FormData(e.target);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");


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

        // Récupération des infos utilisateur
        const { id, email: userEmail, roles } = data.user;
        const user = data.user
        localStorage.setItem("utilisateur", JSON.stringify({ id, email: userEmail, roles }));

        setTimeout(() => navigate('/auth/sign-up/more-info', { state: { user } }), 1000);

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
    <div className="container mx-auto h-screen flex justify-center items-center py-14 px-5">

      <div className=" w-[300px] animate-[text-appear-bottom_0.5s_ease-in] box-content  bg-white p-8 rounded-2xl shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-2">

          <h1 className="montserrat-hero font-bold text-xl text-center">Tapez votre mot de passe</h1>

          {error && <p className='label text-xs text-error'>{error}</p>}
          {success && <p className='label text-xs text-success'>{success}</p>}

          <fieldset className="fieldset my-0 w-full">
            <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]">Mot de passe :</legend>
            <input
              type="password"
              name="password"
              className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300"
              placeholder="Neovate123!"
              required
            />
          </fieldset>
          <fieldset className="fieldset my-0 w-full">
            <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]">Confirmez le mot de passe :</legend>
            <input
              type="password"
              name="confirmPassword"
              className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300"
              placeholder="Neovate123!"
              required
            />
          </fieldset>
          <button
            type="submit"
            disabled={loading}
            className="block w-full mt-2 hover:bg-sky-700 bg-sky-600 text-white h-10 rounded-lg text-sm font-medium shadow-md duration-300 hover:shadow-lg hover:cursor-pointer"
          >
            {loading ? <span className="loading loading-spinner loading-md text-white"></span> : "Valider"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
