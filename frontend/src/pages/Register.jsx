import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, AlertCircle, Camera, CheckCircle2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    image: null,
    twoFactorEnabled: true
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('role', formData.role);
    data.append('twoFactorEnabled', formData.twoFactorEnabled);
    if (formData.image) data.append('image', formData.image);

    try {
      await authAPI.register(data);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const { data } = await authAPI.googleLogin(credentialResponse.credential);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError('Google Login failed.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass p-12 rounded-3xl text-center max-w-sm">
          <CheckCircle2 className="text-green-500 mx-auto mb-6" size={64} />
          <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
          <p className="text-slate-400">Redirecting to login page...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-lg p-8 rounded-3xl"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
            <UserPlus size={24} />
          </div>
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-slate-400 mt-2">Join DoctorReview to find the best care</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="text-slate-500" size={32} />
                )}
              </div>
              <input 
                type="file" 
                id="image-upload" 
                className="hidden" 
                onChange={handleImageChange}
                accept="image/*"
              />
              <label 
                htmlFor="image-upload"
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-primary-hover shadow-lg"
              >
                <UserPlus size={16} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Full Name"
              placeholder="John Doe"
              icon={User}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input 
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <Input 
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Register as:</label>
              <div className="grid grid-cols-2 gap-4">
                {['user', 'doctor'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className={`py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 capitalize ${
                      formData.role === role 
                        ? 'bg-primary/10 border-primary text-white' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.role === role ? 'border-primary' : 'border-slate-500'}`}>
                      {formData.role === role && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </div>
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Security:</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, twoFactorEnabled: !formData.twoFactorEnabled })}
                className={`w-full py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                  formData.twoFactorEnabled 
                    ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                {formData.twoFactorEnabled ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                2-Step OTP {formData.twoFactorEnabled ? 'On' : 'Off'}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12" 
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0f172a] px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Login failed')}
              theme="filled_black"
              shape="pill"
            />
          </div>

          <p className="text-center text-slate-400 text-sm mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-medium hover:text-primary transition-colors">
              Sign in instead
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
