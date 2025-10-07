import { useState, useRef, useCallback, useEffect } from 'react';
import { AtSign } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Verification() {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null); // { text: '', type: 'error'|'success'|'info' }

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  useEffect(()=>{
        document.title = "Code de vérification"
    }, [])

  const handleChange = useCallback((e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setMessage(null);
    if (value && index < otp.length - 1) inputRefs.current[index + 1]?.focus();
  }, [otp]);

  const handleKeyDown = useCallback((e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e) => {
    const pasteData = e.clipboardData.getData('text/plain').trim();
    if (pasteData.length === otp.length && /^\d+$/.test(pasteData)) {
      e.preventDefault();
      const newOtp = pasteData.split('').slice(0, otp.length);
      setOtp(newOtp);
      inputRefs.current[otp.length - 1]?.focus();
    }
  }, [otp.length]);

  const isOtpComplete = otp.every((digit) => digit.length === 1);

  const handleVerify = async () => {
    if (!isOtpComplete) {
      setMessage({ text: 'Veuillez entrer les 5 chiffres du code.', type: 'error' });
      return;
    }

    setIsLoading(true);
    const code = otp.join('');

    try {
      const ApiUrl = import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;
      const response = await fetch(`${ApiUrl}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      const user = data.user;

      if (response.ok) {
        setMessage({ text: 'Vérification réussie ! Redirection en cours...', type: 'success' });

        // Récupération des infos utilisateur
        const { id, email: userEmail, roles } = data.user;
        localStorage.setItem("utilisateur", JSON.stringify({ id, email: userEmail, roles }));

        setTimeout(() => navigate('/auth/sign-up/more-info', { state: { user } }), 1000);
      } else {
        setMessage({ text: data.message || 'Code incorrect. Veuillez réessayer.', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Erreur réseau. Veuillez réessayer.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsLoading(true);

    try {
      const ApiUrl = import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_URL;
      const response = await fetch(`${ApiUrl}/auth/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage({ text: data.message || 'Nouveau code envoyé.', type: 'info' });
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Erreur réseau. Veuillez réessayer.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageClass = (type) => {
    switch (type) {
      case 'success': return 'text-success';
      case 'error': return 'text-error';
      case 'info': return 'text-blue-500';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto h-screen flex justify-center items-center py-14 px-5">
      <div className="w-[400px] flex flex-col animate-[text-appear-bottom_0.5s_ease-in] items-center justify-center gap-3 bg-white p-8 rounded-2xl shadow-lg">
        <div className="bg-blue-100 p-4 rounded-full mb-4 shadow-lg">
          <AtSign color="#237baf" strokeWidth={2.25} size={28} />
        </div>

        <div className="flex flex-col items-center">
          <h1 className="montserrat-hero font-bold text-2xl mb-2 text-center">
            Code de vérification
          </h1>
          <p className="text-sm text-gray-500 text-center max-w-xs">
            Nous avons envoyé un code à <b>{email || 'votre e-mail'}</b>. Indiquez-le ci-dessous pour valider votre identité.<br />Ce code expire dans 5 minutes
          </p>
        </div>

        <div className="flex justify-center space-x-3 sm:space-x-4" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              className="otp-input w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-150 outline-none"
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={(e) => e.target.select()}
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={isLoading}
            />
          ))}
        </div>

        {message && (
          <p className={`label text-xs text-center ${getMessageClass(message.type)}`}>
            {message.text}
          </p>
        )}

        <div className="space-y-3 min-w-full px-5">
          <button
            onClick={handleVerify}
            disabled={!isOtpComplete || isLoading}
            className="flex justify-center items-center w-full hover:bg-sky-700 bg-sky-600 text-white h-10 rounded-lg text-sm font-medium shadow-md duration-300 hover:shadow-lg hover:cursor-pointer"
          >
            {isLoading ? <span className="loading loading-spinner loading-md text-white"></span> : 'Vérifier'}
          </button>

          <button
            onClick={handleResend}
            disabled={isLoading || !email}
            className="flex justify-center gap-4 items-center border border-gray-200 h-10 rounded-lg w-full text-sm text-[#4F5D75] font-semibold hover:cursor-pointer"
          >
            Renvoyer le code
          </button>
        </div>

        <p className="text-[0.75rem] text-neutral-600 mt-2 text-center">
          Si vous voulez modifier l'adresse e-mail, <Link to="/auth/sign-up" className="text-sky-400 underline">cliquez ici</Link>.
        </p>
      </div>
    </div>
  );
}
