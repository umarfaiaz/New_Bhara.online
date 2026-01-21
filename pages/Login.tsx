
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronLeft, ArrowRight } from 'lucide-react';
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
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 xl:px-32 relative z-10 bg-white">
        
        {/* Mobile Back Button */}
        <button 
            onClick={() => navigate('/')} 
            className="absolute top-8 left-8 p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors lg:hidden"
        >
            <ChevronLeft size={24} />
        </button>

        <div className="w-full max-w-md mx-auto space-y-8 animate-in slide-in-from-left-8 duration-700">
            <div className="space-y-2">
                <div className="mb-8"><Logo size="lg"/></div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">{t('auth_welcome')}</h1>
                <p className="text-gray-500 text-lg">Enter your details to access your rental space.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div className="space-y-1.5 group">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 group-focus-within:text-[#ff4b9a] transition-colors">{t('auth_email')}</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 font-bold focus:outline-none focus:bg-white focus:border-[#ff4b9a] focus:ring-4 focus:ring-[#ff4b9a]/10 transition-all placeholder:text-gray-300"
                        placeholder="user@bhara.online"
                    />
                </div>

                {/* Password Input */}
                <div className="space-y-1.5 group">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider group-focus-within:text-[#ff4b9a] transition-colors">{t('auth_password')}</label>
                        <a href="#" className="text-xs font-bold text-[#ff4b9a] hover:underline">Forgot Password?</a>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 font-bold focus:outline-none focus:bg-white focus:border-[#ff4b9a] focus:ring-4 focus:ring-[#ff4b9a]/10 transition-all placeholder:text-gray-300 pr-12"
                            placeholder="••••••••"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-2"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-2 animate-in slide-in-from-top-2 border border-red-100">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-[#2d1b4e] text-white font-bold rounded-2xl shadow-xl shadow-indigo-900/20 hover:shadow-2xl hover:bg-[#3a2366] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group mt-2 text-lg"
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

            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400 font-medium">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-3.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-bold text-gray-700 text-sm hover:border-gray-300">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google"/> Google
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-bold text-gray-700 text-sm hover:border-gray-300">
                    <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook"/> Facebook
                </button>
            </div>

            <p className="text-center text-gray-500 font-medium">
                {t('auth_no_account')}{' '}
                <Link to="/register" className="text-[#ff4b9a] font-bold hover:underline transition-colors">{t('auth_register_link')}</Link>
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
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070" 
                className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                alt="Modern Architecture"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#2d1b4e] via-[#2d1b4e]/90 to-[#ff4b9a]/20"></div>
          </div>

          {/* Floating Blobs */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#ff4b9a]/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-[80px]"></div>

          {/* Content Overlay */}
          <div className="relative z-10 max-w-lg px-12 animate-in slide-in-from-bottom-10 duration-1000">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:bg-white/15 transition-colors">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50"></div>
                  
                  <div className="flex gap-1.5 mb-8">
                      {[1,2,3].map(i => <div key={i} className="w-2.5 h-2.5 bg-[#ff4b9a] rounded-full"></div>)}
                  </div>
                  
                  <h2 className="text-4xl font-black text-white mb-6 leading-tight drop-shadow-sm">
                      "Managing my rentals has never been this <span className="text-[#ff4b9a]">effortless</span>."
                  </h2>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                      <div className="relative">
                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className="w-14 h-14 rounded-full border-2 border-[#ff4b9a]" alt="User"/>
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#2d1b4e]"></div>
                      </div>
                      <div>
                          <p className="text-white font-bold text-lg">Sadia Ahmed</p>
                          <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Property Owner, Dhaka</p>
                      </div>
                  </div>
              </div>
              
              <div className="mt-12 flex gap-12 pl-4">
                  <div className="text-white">
                      <p className="text-4xl font-black tracking-tight">15k+</p>
                      <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-1">Active Landlords</p>
                  </div>
                  <div className="text-white">
                      <p className="text-4xl font-black tracking-tight">৳2M+</p>
                      <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-1">Rent Collected</p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Login;
