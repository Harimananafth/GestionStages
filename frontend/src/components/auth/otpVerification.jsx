import { useState, useRef, useCallback } from 'react';
import { AtSign } from 'lucide-react'
import { Link } from 'react-router-dom'

 export default function Verification(){
  
  const [otp, setOtp] = useState(['', '', '', '']);
  
  const [isLoading, setIsLoading] = useState(false);
  
  const [message, setMessage] = useState('');
  
  const inputRefs = useRef([]);

  
  const handleChange = useCallback((e, index) => {
    const value = e.target.value;

    if (/[^0-9]/.test(value)) return; // N'accepte que les chiffres

    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); 
    setOtp(newOtp);
    setMessage('');

    
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp]);

  
  const handleKeyDown = useCallback((e, index) => {
    
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index - 1] = ''; // Efface le chiffre précédent
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus(); // Déplace le focus au champ précédent
    }
  }, [otp]);

 
  const handlePaste = useCallback((e) => {
    const pasteData = e.clipboardData.getData('text/plain').trim();
    if (pasteData.length === otp.length && /^\d+$/.test(pasteData)) {
      e.preventDefault();
      const newOtp = pasteData.split('').slice(0, otp.length);
      setOtp(newOtp);
      // Déplace le focus à la fin
      inputRefs.current[otp.length - 1]?.focus();
    }
  }, [otp.length]);

  // Vérifie si le code est complet
  const isOtpComplete = otp.every(digit => digit.length === 1);

  // Fonction de simulation de vérification
  const handleVerify = () => {
    if (!isOtpComplete) {
      setMessage('Veuillez entrer les 4 chiffres du code.');
      return;
    }

    setIsLoading(true);
    const code = otp.join('');
    console.log('Code de vérification soumis:', code);

    
    setTimeout(() => {
      setIsLoading(false);
      
      if (code === '1234') {
        setMessage('Vérification réussie! Redirection en cours...');
      } else {
        setMessage('Code incorrect. Veuillez réessayer.');
      }
    }, 2000);
  };


  const RenvoyerUnCodeButton = () => (
    <button
      onClick={() => console.log('Renvoyer le code')}
      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition duration-150 ml-1 focus:outline-none"
      disabled={isLoading}
    >
      Renvoyer un code
    </button>
  );

  return (
    <div className="container mx-auto h-screen flex justify-center items-center py-14 px-5">
      <div className=" w-[400px] flex flex-col animate-[text-appear-bottom_0.5s_ease-in] items-center justify-center gap-3 bg-white p-8 rounded-2xl shadow-lg">
        
          <div className="bg-blue-100 p-4 rounded-full mb-4 shadow-lg">
            <AtSign color="#237baf" strokeWidth={2.25} size={28}/>
          </div>



        <div className="flex flex-col items-center">

          <h1 className="montserrat-hero font-bold text-2xl  mb-2 text-center">
            Code de vérification
          </h1>
          <p className="text-sm text-gray-500 text-center max-w-xs">
            Nous avons envoyé un code à adresse@email.com. Indiquez-le ci-dessous pour valider votre identité.
          </p>
        </div>

        <div className="flex justify-center space-x-3 sm:space-x-4" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              className="otp-input w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-150 outline-none"
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={(e) => e.target.select()} // Sélectionne le contenu en cas de focus
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={isLoading}
            />
          ))}
        </div>

        {/* Gestion d'erreur */}
        {message && (
          <p className= 'label text-xs text-error'>
            {message}
          </p>
        )}

        {/* Boutons d'action */}
        <div className="space-y-3 min-w-full px-5">
          <button
            onClick={handleVerify}
            disabled={!isOtpComplete || isLoading}
            className="flex justify-center items-center w-full hover:bg-sky-700 bg-sky-600 text-white h-10 rounded-lg text-sm font-medium shadow-md  duration-300 hover:shadow-lg hover:cursor-pointer"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-md text-white "></span>
            ) : 'Vérifier'}
          </button>

          <button
            onClick={() => console.log("Modifier l'adresse")}
            disabled={isLoading}
            className="flex justify-center gap-4 items-center border-1 border-gray-200 h-10 rounded-lg w-full text-sm text-[#4F5D75] font-semibold hover:cursor-pointer "
          >
            Modifier l'adresse
          </button>
        </div>

        {/* Lien de renvoi */}
        <p className="text-[0.75rem] text-neutral-600">Aucun code reçu ? <Link to="/auth/sign-up" className="text-sky-400  underline">Renvoyer le code</Link></p>

      </div>
    </div>
  );
};

