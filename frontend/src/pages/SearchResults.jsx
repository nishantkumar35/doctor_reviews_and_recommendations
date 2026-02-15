import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  User,
  Loader2,
  Info,
  AlertTriangle,
  ArrowRight,
  Activity,
  FileText,
} from "lucide-react";
import { aiAPI, doctorAPI } from "../services/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearch, setIsSearch] = useState(false);

  const q = searchParams.get("q");

  useEffect(() => {
    if (q) {
      setIsSearch(true);
      performSearch(q);
    } else {
      setIsSearch(false);
      fetchAllDoctors();
    }
  }, [q]); 

  const fetchAllDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await doctorAPI.getAll();
      setResults({ doctors: data });
    } catch (err) {
      setError("Failed to load doctors.");
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (problem) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await aiAPI.search(problem);
      setResults(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Search failed. Please try again.",
      );
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 min-h-screen">
      <div className="max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Find Your Specialist
        </h1>
        <form
          onSubmit={handleSearch}
          className="glass p-2 rounded-2xl flex gap-3 shadow-2xl"
        >
          <Input
            placeholder="Describe your symptoms for AI analysis..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="!border-none !bg-transparent !ring-0 !h-12 w-full"
            icon={Search}
          />
          <Button
            type="submit"
            disabled={loading}
            className="px-8 whitespace-nowrap"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Loader2 className="text-primary animate-spin mb-4" size={48} />
            <p className="text-slate-400 animate-pulse">
              {isSearch
                ? "AI is analyzing symptoms..."
                : "Fetching our top specialists..."}
            </p>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-3xl text-center max-w-md mx-auto"
          >
            <AlertTriangle className="text-accent mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">
              Error Occurred
            </h3>
            <p className="text-slate-400 mb-6">{error}</p>
            <Button
              variant="outline"
              onClick={() =>
                isSearch ? performSearch(query) : fetchAllDoctors()
              }
            >
              Try Again
            </Button>
          </motion.div>
        ) : results?.doctors ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {isSearch && results.specialization && (
              <div className="glass p-6 rounded-3xl border-l-4 border-primary">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                    <Info size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      AI Prediction: {results.specialization}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Based on your description, we recommend consulting a{" "}
                      <span className="text-primary font-medium">
                        {results.specialization}
                      </span>
                      . Below are specialists matching this profile.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isSearch && (
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <Activity size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  All Health Specialists
                </h2>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.doctors.map((doctor, idx) => (
                <Link key={doctor._id} to={`/doctor/${doctor._id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass group rounded-3xl overflow-hidden hover:border-primary/50 transition-all flex flex-col"
                  >
                    <div className="p-6">
                      <div className="flex gap-4 mb-6">
                        <img
                          src={
                            doctor.userId?.image ||
                            `https://ui-avatars.com/api/?name=${doctor.userId?.name}`
                          }
                          alt={doctor.userId?.name}
                          className="h-16 w-16 rounded-2xl object-cover border border-white/10"
                        />
                        <div>
                          <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                            {doctor.userId?.name}
                          </h4>
                          <p className="text-slate-400 text-sm">
                            {doctor.specialization}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star
                              className="text-yellow-500 fill-yellow-500"
                              size={14}
                            />
                            <span className="text-xs font-medium text-slate-300">
                              {doctor.averageRating || 0} (
                              {doctor.reviewCount || 0} Reviews)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-2 text-sm text-slate-400">
                          <MapPin size={16} className="mt-0.5 shrink-0" />
                          <span className="line-clamp-1">
                            {doctor.clinicAddress}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <FileText size={16} className="shrink-0 " />
                          <span className="line-clamp-2">{doctor.summary}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <User size={16} className="shrink-0" />
                          <span>{doctor.experience} years experience</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto p-4 border-t border-white/10 bg-white/5">
                      <Button
                        variant="ghost"
                        className="w-full justify-between items-center group/btn"
                      >
                        View Profile
                        <ArrowRight
                          size={18}
                          className="translate-x-0 group-hover/btn:translate-x-1 transition-transform"
                        />
                      </Button>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {results.doctors.length === 0 && (
              <div className="py-20 text-center glass rounded-3xl">
                <p className="text-slate-500 italic">
                  No specialists found matching your criteria.
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="py-20 text-center">
            <Loader2
              className="text-primary animate-spin mx-auto mb-4"
              size={32}
            />
            <p className="text-slate-500 italic">Loading specialists...</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchResults;
