import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ROUTES } from "../../routes/paths";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [emailValue, setEmailValue] = useState('');

  const ApiUrl = import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();

  // Si on vient de la page verification avec un email
  useEffect(() => {

    document.title = "S'inscrire"
    if (location.state?.email) {
      setEmailValue(location.state.email);
      // Supprimer le cookie temporaire si on veut recommencer
      document.cookie = 'signup_temp=; Max-Age=0; path=/;'; 
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
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
      const response = await fetch(`${ApiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        navigate(ROUTES.AUTH.SIGN_UP.VERIFICATION, { state: { email } });
      } else {
        setError(data.message || "Erreur lors de l'inscription.");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto h-screen flex justify-center items-center py-14 px-5">
      <div className="flex animate-[text-appear-bottom_0.5s_ease-in] box-content items-center justify-center gap-6 bg-white p-8 rounded-2xl shadow-lg w-[800px]">
        <div className="grow flex flex-col gap-4">
          <div className="flex gap-2 items-center hover:cursor-default rounded-xl hover:-translate-y-1 duration-300 w-fit">
            <img src="/images/logo.png" alt="" className="h-4"/>
            <p className="font-semibold text-xs lg:light">Neovate App</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <h1 className="montserrat-hero font-bold text-2xl">Inscription</h1>
            {error && <p className='label text-xs text-error'>{error}</p>}
            {success && <p className='label text-xs text-success'>{success}</p>}

            <fieldset className="fieldset gap-0 w-full">
              <legend className="fieldset-legend font-medium text-[0.85rem] text-[#4F5D75]">Adresse e-mail :</legend>
              <input
                type="email"
                name="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                className="input min-w-full text-[0.85rem] text-[#4F5D75] border-1 border-gray-200 focus:border-sky-400 focus:border-1 rounded-lg focus:outline-none duration-300"
                placeholder="Neovate@adresse.com"
                required
              />
            </fieldset>

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
              {loading ? <span className="loading loading-spinner loading-md text-white"></span> : "S'inscrire"}
            </button>
          </form>

          <div className="flex flex-col items-start justify-center gap-3">
            <p className="text-[0.75rem] text-neutral-600">
              Vous avez déjà un compte ? <Link to={ROUTES.AUTH.LOGIN} className="text-sky-400 underline">Se connecter</Link>
            </p>
            <a href={ApiUrl + "/auth/google"} className="flex justify-center gap-4 items-center border-1 border-gray-200 h-10 rounded-lg w-full text-sm text-[#4F5D75] font-semibold hover:cursor-pointer">
              <img src="/images/google.png" alt="logo de google" className="h-[16px]"/>
              S'inscrire avec Google
            </a>
          </div>
        </div>
        <img src="/images/welcome.gif" alt="" className="h-[380px] hidden md:block"/>
      </div>
    </div>
  );
}
