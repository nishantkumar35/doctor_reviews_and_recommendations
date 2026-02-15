import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, FileText, User, Save, Loader2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ApplyDoctor = () => {
  const [formData, setFormData] = useState({
    specialization: '',
    experience: '',
    clinicAddress: '',
    summary: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { fetchUserProfile } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await userAPI.applyDoctor(formData);
      setSuccess(true);
      await fetchUserProfile();
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass p-12 rounded-3xl text-center max-w-sm">
          <CheckCircle className="text-green-500 mx-auto mb-6" size={64} />
          <h2 className="text-2xl font-bold text-white mb-2">Application Submitted!</h2>
          <p className="text-slate-400">Your doctor profile is now active. Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Apply for Doctor Account</h1>
          <p className="text-slate-400">Complete your professional profile to start interacting with patients.</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass p-8 rounded-[2.5rem] space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Specialization"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              icon={Briefcase}
              placeholder="e.g. Cardiologist"
              required
            />
            <Input 
              label="Years of Experience"
              type="number"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              icon={User}
              placeholder="e.g. 10"
              required
            />
          </div>

          <Input 
            label="Clinic Address"
            value={formData.clinicAddress}
            onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
            icon={MapPin}
            placeholder="123 Health St, Med City"
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <FileText size={16} /> Professional Summary
            </label>
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-slate-50 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none min-h-[150px]"
              placeholder="Briefly describe your medical expertise..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 rounded-2xl"
          >
            {loading ? (
              <><Loader2 className="animate-spin mr-2" size={18} /> Submitting...</>
            ) : (
              <><Save className="mr-2" size={18} /> Complete Professional Profile</>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ApplyDoctor;
