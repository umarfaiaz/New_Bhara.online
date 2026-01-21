
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Logo } from '../components/Logo';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate network delay for UX
    setTimeout(() => {
        if (email && password) {
            onLogin();
            navigate('/myspace/overview');
        } else {
            setError('Please enter your credentials.');
            setIsLoading(false);
        }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* LEFT SIDE - FORM */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-24 xl:px-32 relative z-10 bg-white">
        
        {/* Mobile Back Button */}
        <button 
            onClick={() => navigate('/')} 
            className="absolute top-8 left-8 p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors lg:hidden"
        >
            <ChevronLeft size={24} />
        </button>

        <div className="w-full max-w-md mx-auto space-y-8">
            <div className="space-y-2">
                <div className="mb-6"><Logo size="lg"/></div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{t('auth_welcome')}</h1>
                <p className="text-gray-500 text-lg">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wider ml-1">{t('auth_email')}</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 font-medium focus:outline-none focus:bg-white focus:border-[#ff4b9a] focus:ring-4 focus:ring-[#ff4b9a]/10 transition-all placeholder:text-gray-400"
                        placeholder="e.g. user@bhara.online"
                    />
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">{t('auth_password')}</label>
                        <a href="#" className="text-xs font-bold text-[#ff4b9a] hover:underline">Forgot?</a>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 font-medium focus:outline-none focus:bg-white focus:border-[#ff4b9a] focus:ring-4 focus:ring-[#ff4b9a]/10 transition-all placeholder:text-gray-400 pr-12"
                            placeholder="••••••••"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-2 animate-in slide-in-from-top-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-[#2d1b4e] text-white font-bold rounded-2xl shadow-xl shadow-indigo-900/20 hover:shadow-2xl hover:bg-[#3a2366] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                            {t('auth_signin')} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                        </>
                    )}
                </button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400 font-medium">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-bold text-gray-700 text-sm">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google"/> Google
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-bold text-gray-700 text-sm">
                    <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook"/> Facebook
                </button>
            </div>

            <p className="text-center text-gray-500 font-medium">
                {t('auth_no_account')}{' '}
                <Link to="/register" className="text-[#ff4b9a] font-bold hover:underline">{t('auth_register_link')}</Link>
            </p>
        </div>
        
        {/* Footer Links */}
        <div className="absolute bottom-6 left-0 right-0 text-center space-x-6 text-xs font-bold text-gray-300 hidden sm:block">
            <a href="#" className="hover:text-gray-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-500 transition-colors">Terms of Service</a>
        </div>
      </div>

      {/* RIGHT SIDE - VISUAL */}
      <div className="hidden lg:flex flex-1 relative bg-[#2d1b4e] overflow-hidden items-center justify-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920" 
                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                alt="Background"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d1b4e] via-[#2d1b4e]/80 to-transparent"></div>
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 max-w-lg px-12">
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl animate-in slide-in-from-bottom-10 duration-1000">
                  <div className="flex gap-1 mb-6">
                      {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-2 bg-[#ff4b9a] rounded-full"></div>)}
                  </div>
                  <h2 className="text-4xl font-black text-white mb-6 leading-tight">
                      "Managing my rentals has never been this <span className="text-[#ff4b9a]">effortless</span>."
                  </h2>
                  <div className="flex items-center gap-4">
                      <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className="w-12 h-12 rounded-full border-2 border-[#ff4b9a]" alt="User"/>
                      <div>
                          <p className="text-white font-bold">Sadia Ahmed</p>
                          <p className="text-white/60 text-xs">Property Owner, Dhaka</p>
                      </div>
                  </div>
              </div>
              
              <div className="mt-12 flex gap-8">
                  <div className="text-white">
                      <p className="text-3xl font-black">15k+</p>
                      <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Active Users</p>
                  </div>
                  <div className="text-white">
                      <p className="text-3xl font-black">৳2M+</p>
                      <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Processed</p>
                  </div>
                  <div className="text-white">
                      <p className="text-3xl font-black">4.9</p>
                      <p className="text-white/60 text-xs font-bold uppercase tracking-wider">App Rating</p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Login;
