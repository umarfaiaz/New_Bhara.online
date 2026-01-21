
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { Logo } from '../components/Logo';

const Register: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
        if (formData.name && formData.email && formData.password && formData.password === formData.confirm) {
            onLogin();
            navigate('/myspace/overview');
        } else if (formData.password !== formData.confirm) {
            setError('Passwords do not match');
            setIsLoading(false);
        } else {
            setError('Please fill in all required fields');
            setIsLoading(false);
        }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white flex flex-row-reverse">
      {/* RIGHT SIDE - FORM (Reversed logic for visual balance) */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-24 xl:px-32 relative z-10 bg-white">
        
        <button 
            onClick={() => navigate('/')} 
            className="absolute top-8 left-8 p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors lg:hidden"
        >
            <ChevronLeft size={24} />
        </button>

        <div className="w-full max-w-md mx-auto space-y-8 py-10">
            <div className="space-y-2">
                <div className="mb-6"><Logo size="lg"/></div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Create Account</h1>
                <p className="text-gray-500 text-lg">Join the smartest rental community today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wider ml-1">Full Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 font-medium focus:outline-none focus:bg-white focus:border-[#ff4b9a] focus:ring-4 focus:ring-[#ff4b9a]/10 transition-all placeholder:text-gray-400"
                        placeholder="e.g. Salim Uddin"
                    />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wider ml-1">Email Address</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 font-medium focus:outline-none focus:bg-white focus:border-[#ff4b9a] focus:ring-4 focus:ring-[#ff4b9a]/10 transition-all placeholder:text-gray-400"
                        placeholder="hello@example.com"
                    />
                </div>

                {/* Password Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-900 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 font-medium focus:outline-none focus:bg-white focus:border-[#ff4b9a] focus:ring-4 focus:ring-[#ff4b9a]/10 transition-all placeholder:text-gray-400"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-900 uppercase tracking-wider ml-1">Confirm</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.confirm}
                            onChange={(e) => setFormData({...formData, confirm: e.target.value})}
                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 font-medium focus:outline-none focus:bg-white focus:border-[#ff4b9a] focus:ring-4 focus:ring-[#ff4b9a]/10 transition-all placeholder:text-gray-400"
                            placeholder="••••••••"
                        />
                    </div>
                </div>
                
                {/* Show Pass Toggle Text */}
                <div className="flex items-center justify-between ml-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#ff4b9a] focus:ring-[#ff4b9a] cursor-pointer" onChange={() => setShowPassword(!showPassword)} checked={showPassword}/>
                        <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700 select-none">Show Password</span>
                    </label>
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
                    className="w-full py-4 bg-[#ff4b9a] text-white font-bold rounded-2xl shadow-xl shadow-pink-500/20 hover:shadow-2xl hover:bg-pink-600 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>Create Free Account <Sparkles size={18} className="fill-white/20"/></>
                    )}
                </button>
            </form>

            <p className="text-center text-gray-500 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-[#2d1b4e] font-bold hover:underline">Log in</Link>
            </p>
        </div>
      </div>

      {/* LEFT SIDE - VISUAL */}
      <div className="hidden lg:flex flex-1 relative bg-gray-50 overflow-hidden items-center justify-center">
          {/* Background */}
          <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&q=80&w=1920" 
                className="w-full h-full object-cover"
                alt="Car Background"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2d1b4e]/90 to-[#2d1b4e]/70 mix-blend-multiply"></div>
          </div>

          <div className="relative z-10 max-w-lg px-12">
              <div className="mb-10 animate-in slide-in-from-left duration-700">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6">
                      Join 5000+ Landlords
                  </span>
                  <h2 className="text-5xl font-black text-white mb-6 leading-[1.1]">
                      One Platform for <br/> All Your <span className="text-[#ff4b9a]">Rentals.</span>
                  </h2>
                  <p className="text-lg text-gray-200 leading-relaxed">
                      From tracking payments to managing tenants and maintenance requests. Handle your buildings, cars, and gadgets in one place.
                  </p>
              </div>

              <div className="space-y-4 animate-in slide-in-from-left duration-700 delay-200">
                  {[
                      "Automated Rent Collection & SMS",
                      "Expense & Profit Tracking",
                      "Digital Tenant Screening",
                      "Marketplace Listing Integration"
                  ].map((feat, i) => (
                      <div key={i} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50">
                              <Check size={14} className="text-green-400"/>
                          </div>
                          <span className="text-white font-bold text-sm">{feat}</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};

export default Register;
