import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Star, User, Loader2, Info,
  AlertTriangle, ArrowRight, Activity, FileText,
  Filter, Award, ChevronRight
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
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    clinicAddress: "", specialization: "", minExperience: "", minRating: "",
  });
  const [specializationOptions, setSpecializationOptions] = useState([]);

  const q = searchParams.get("q");

  useEffect(() => {
    if (q) { setIsSearch(true); performSearch(q); }
    else { setIsSearch(false); fetchAllDoctors(); }
  }, [q]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const { data } = await doctorAPI.getFilterOptions();
        setSpecializationOptions(data.specializations || []);
      } catch (err) { console.error("Failed to fetch specializations"); }
    };
    fetchOptions();
  }, []);

  const fetchAllDoctors = async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await doctorAPI.getAll();
      setResults(data);
    } catch (err) { setError("Failed to load doctors."); }
    finally { setLoading(false); }
  };

  const performSearch = async (problem) => {
    setLoading(true); setError(null);
    try {
      const { data } = await aiAPI.search(problem);
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed. Please try again.");
      setResults(null);
    } finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) setSearchParams({ q: query });
    else setSearchParams({});
  };

  const handleFilter = async () => {
    setLoading(true); setError(null); setSearchParams({});
    try {
      const activeFilters = {};
      if (filters.clinicAddress) activeFilters.clinicAddress = filters.clinicAddress;
      if (filters.specialization && filters.specialization !== "All")
        activeFilters.specialization = filters.specialization;
      if (filters.minExperience) activeFilters.minExperience = filters.minExperience;
      if (filters.minRating) activeFilters.minRating = filters.minRating;
      const { data } = await doctorAPI.getFiltered(activeFilters);
      setResults(data); setIsSearch(false);
    } catch (err) {
      setError(err.response?.data?.message || "No doctors found matching filters.");
      setResults(null);
    } finally { setLoading(false); }
  };

  const clearFilters = () => {
    setFilters({ clinicAddress: "", specialization: "", minExperience: "", minRating: "" });
    fetchAllDoctors();
  };

  return (
    <div className="min-h-screen bg-[#f8faff] px-6 py-12">

      {/* Search header */}
      <div className="max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 text-center tracking-tight mb-6">
          Find your specialist
        </h1>

        <form onSubmit={handleSearch} className="flex gap-2 bg-white border border-blue-100 rounded-2xl p-1.5 shadow-[0_2px_12px_rgba(59,130,246,0.08)]">
          <div className="flex-1 flex items-center gap-2.5 px-3">
            <Search size={15} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your symptoms for AI analysis..."
              className="w-full bg-transparent border-none outline-none text-sm text-slate-800 placeholder:text-slate-300 h-11"
            />
          </div>
          <Button type="submit" disabled={loading} className="px-6 shrink-0">
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </form>

        {/* Filter toggle */}
        <div className="flex justify-end mt-3">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Filter size={13} />
            {showFilters ? "Hide filters" : "Show filters"}
          </button>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white border border-blue-100 rounded-2xl p-5 mt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Specialization</label>
                    <select
                      value={filters.specialization}
                      onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                      className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer"
                    >
                      <option value="">All specializations</option>
                      {specializationOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">City / location</label>
                    <Input
                      placeholder="e.g. Lahore"
                      value={filters.clinicAddress}
                      onChange={(e) => setFilters({ ...filters, clinicAddress: e.target.value })}
                      icon={MapPin}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Min experience (yrs)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.minExperience}
                      onChange={(e) => setFilters({ ...filters, minExperience: e.target.value })}
                      icon={Award}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Minimum rating</label>
                    <select
                      value={filters.minRating}
                      onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                      className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer"
                    >
                      <option value="">Any rating</option>
                      {[5, 4, 3, 2, 1].map((num) => (
                        <option key={num} value={num}>{num}+ stars</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                  <Button variant="outline" onClick={clearFilters} type="button">
                    Reset
                  </Button>
                  <Button onClick={handleFilter} type="button">
                    Apply filters
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">

          {/* Loading */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <Loader2 size={36} className="text-blue-500 animate-spin mb-4" />
              <p className="text-sm text-slate-400 animate-pulse">
                {isSearch ? "AI is analysing your symptoms..." : "Fetching our top specialists..."}
              </p>
            </motion.div>
          )}

          {/* Error */}
          {!loading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-red-100 rounded-2xl p-8 text-center max-w-sm mx-auto"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={22} className="text-red-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Something went wrong</h3>
              <p className="text-sm text-slate-500 mb-5">{error}</p>
              <Button variant="outline" onClick={() => isSearch ? performSearch(query) : fetchAllDoctors()}>
                Try again
              </Button>
            </motion.div>
          )}

          {/* Results grid */}
          {!loading && results?.doctors && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* AI banner */}
              {isSearch && results.specialization && (
                <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 border-l-[3px] border-l-blue-500 rounded-2xl px-5 py-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Info size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 mb-0.5">
                      AI prediction: {results.specialization}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Based on your description, we recommend consulting a{" "}
                      <span className="text-blue-600 font-semibold">{results.specialization}</span>.
                      Below are specialists matching this profile.
                    </p>
                  </div>
                </div>
              )}

              {/* Section heading for browse mode */}
              {!isSearch && (
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-blue-500" strokeWidth={2} />
                  <h2 className="text-base font-bold text-slate-900">All health specialists</h2>
                </div>
              )}

              {/* Doctor cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.doctors.map((doctor, idx) => (
                  <Link key={doctor._id} to={`/doctor/${doctor._id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group bg-white border border-blue-100 rounded-2xl overflow-hidden flex flex-col hover:border-blue-300 hover:shadow-[0_4px_16px_rgba(59,130,246,0.1)] transition-all duration-150"
                    >
                      <div className="p-5 flex-1">
                        {/* Doctor header */}
                        <div className="flex gap-3 mb-4">
                          <img
                            src={doctor.userId?.image || `https://ui-avatars.com/api/?name=${doctor.userId?.name}&background=dbeafe&color=1d4ed8&bold=true`}
                            alt={doctor.userId?.name}
                            className="h-14 w-14 rounded-xl object-cover border-2 border-blue-50 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                              {doctor.userId?.name}
                            </h4>
                            <p className="text-xs text-slate-500 truncate">{doctor.specialization}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star size={11} className="text-amber-400 fill-amber-400" />
                              <span className="text-[11px] font-semibold text-slate-400">
                                {doctor.averageRating || 0} ({doctor.reviewCount || 0} reviews)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Doctor meta */}
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-xs text-slate-500">
                            <MapPin size={12} className="mt-0.5 flex-shrink-0 text-slate-400" />
                            <span className="truncate">{doctor.clinicAddress}</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-slate-500">
                            <FileText size={12} className="mt-0.5 flex-shrink-0 text-slate-400" />
                            <span className="line-clamp-2">{doctor.summary}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <User size={12} className="flex-shrink-0 text-slate-400" />
                            <span>{doctor.experience} years experience</span>
                          </div>
                        </div>
                      </div>

                      {/* Card footer */}
                      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                        <span className="text-xs font-semibold text-blue-600">View profile</span>
                        <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* Empty state */}
              {results.doctors.length === 0 && (
                <div className="bg-white border border-slate-100 rounded-2xl py-16 text-center">
                  <p className="text-sm text-slate-400 italic">No specialists found matching your criteria.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Initial loading fallback */}
          {!loading && !error && !results && (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 size={28} className="text-blue-400 animate-spin mb-3" />
              <p className="text-sm text-slate-400 italic">Loading specialists...</p>
            </div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchResults;