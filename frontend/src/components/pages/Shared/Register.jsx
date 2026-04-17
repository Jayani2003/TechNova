import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';
import authBg from '../../../assets/auth-bg.png';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // In a real app, handle registration logic here
    console.log("Registration attempted with:", formData);
    navigate('/user/dashboard');
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-[#1a1a1a]">
      {/* Left side - Image */}
      <div className="hidden lg:flex w-1/2 relative bg-black">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <img
          src={authBg}
          alt="Luxury travel"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute bottom-12 left-12 z-20 text-white">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Join the Adventure</h1>
            <p className="text-lg text-slate-300 max-w-md">Create an account to unlock exclusive tours and premium vehicle rentals.</p>
          </motion.div>
        </div>
        <div className="absolute top-8 left-12 z-20">
          <Link to="/" className="text-3xl font-bold text-white tracking-tighter flex items-center">
            <span className="text-[#00b0a5]">Ceylone </span> Best Tours.
          </Link>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <motion.div
          className="w-full max-w-md my-auto pt-8 pb-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10 text-center flex justify-center">
            <Link to="/" className="text-3xl font-bold text-slate-900 dark:text-white tracking-tighter">
              <span className="text-[#00b0a5]">Ceylone</span> Best Tours.
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h2>
            <p className="text-slate-500 dark:text-slate-400">Sign up to get started with Ceylone Best Tours.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full pl-10 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#242424] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00b0a5] focus:border-transparent transition-all outline-none placeholder:text-slate-400"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#242424] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00b0a5] focus:border-transparent transition-all outline-none placeholder:text-slate-400"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#242424] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00b0a5] focus:border-transparent transition-all outline-none placeholder:text-slate-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#242424] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00b0a5] focus:border-transparent transition-all outline-none placeholder:text-slate-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center pt-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-[#00b0a5] focus:ring-[#00b0a5] border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-[#242424] cursor-pointer"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                I agree to the <a href="#" className="text-[#00b0a5] hover:underline">Terms of Service</a> and <a href="#" className="text-[#00b0a5] hover:underline">Privacy Policy</a>
              </label>
              {/*----------add terms when get the call--------------------*/}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-slate-900 dark:bg-[#00b0a5] hover:bg-slate-800 dark:hover:bg-[#008f86] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b0a5] transition-all cursor-pointer mt-4"
            >
              Sign Up
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#00b0a5] hover:text-[#008f86] transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
