"use client";
import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import api from "@/lib/api";
import {
  ArrowUpRight,
  Search,
  Filter,
  X,
  MapPin,
  Layers,
  Ruler,
  Building,
  Sparkles,
  Info,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";



export default function ProjectsPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [floorsFilter, setFloorsFilter] = useState("All");
  const [dimensionsFilter, setDimensionsFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    api
      .get("/cms/showcase-projects")
      .then(({ data }) => {
        setItems(data || []);
      })
      .catch(() => setItems([]));
  }, []);

  // Filter options derived from current data items
  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category || "Residential Villa")))], [items]);
  const locations = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.location || "Indore")))], [items]);
  const floorsList = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.floors || "G+1")))], [items]);
  const dimensionsList = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.dimensions || "30×40 ft")))], [items]);

  // Filtered dataset
  const filteredProjects = useMemo(() => {
    return items.filter((p) => {
      const matchSearch =
        !search.trim() ||
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.location?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());

      const matchCategory = categoryFilter === "All" || (p.category || "Residential Villa") === categoryFilter;
      const matchLocation = locationFilter === "All" || p.location === locationFilter;
      const matchFloors = floorsFilter === "All" || p.floors === floorsFilter;
      const matchDimensions = dimensionsFilter === "All" || p.dimensions === dimensionsFilter;

      return matchSearch && matchCategory && matchLocation && matchFloors && matchDimensions;
    });
  }, [items, search, categoryFilter, locationFilter, floorsFilter, dimensionsFilter]);

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setLocationFilter("All");
    setFloorsFilter("All");
    setDimensionsFilter("All");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    categoryFilter !== "All" ||
    locationFilter !== "All" ||
    floorsFilter !== "All" ||
    dimensionsFilter !== "All";

  return (
    <div className="bg-[#F4F3EF] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header Hero Section */}
        <section className="marketing-container pt-16 pb-12">
          <div className="flex items-center gap-2 label-caps mb-4">
            <Sparkles size={14} className="text-terracotta" /> Portfolio & Showcase
          </div>
          <h1 className="font-heading text-5xl md:text-7xl tracking-tighter leading-[0.95] max-w-4xl text-charcoal">
            Signature <span className="italic font-normal">masterworks.</span>
          </h1>
          <p className="mt-4 text-neutral-600 max-w-2xl text-base md:text-lg">
            A curated archive of residential villas, commercial hubs, and architectural marvels engineered by our master professionals.
          </p>

          {/* Interactive Filters Bar */}
          <div className="mt-10 bg-white border border-stone-alt p-5 rounded-sm shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-alt pb-3">
              <div className="flex items-center gap-2 font-heading text-lg font-semibold text-charcoal">
                <Filter size={18} className="text-terracotta" /> Filter Projects
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
                >
                  <X size={14} /> Clear All Filters
                </button>
              )}
            </div>

            {/* Filter Dropdowns & Search */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Live Search */}
              <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search project or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-alt rounded-sm focus:outline-none focus:border-terracotta bg-white"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 mb-1 block">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full py-2 px-3 text-xs border border-stone-alt rounded-sm focus:outline-none focus:border-terracotta bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "All" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 mb-1 block">
                  Location
                </label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full py-2 px-3 text-xs border border-stone-alt rounded-sm focus:outline-none focus:border-terracotta bg-white"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc === "All" ? "All Locations" : loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Floors Filter */}
              <div>
                <label className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 mb-1 block">
                  Floors
                </label>
                <select
                  value={floorsFilter}
                  onChange={(e) => setFloorsFilter(e.target.value)}
                  className="w-full py-2 px-3 text-xs border border-stone-alt rounded-sm focus:outline-none focus:border-terracotta bg-white"
                >
                  {floorsList.map((f) => (
                    <option key={f} value={f}>
                      {f === "All" ? "All Floors" : f}
                    </option>
                  ))}
                </select>
              </div>

              {/* Plot Dimensions Filter */}
              <div>
                <label className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 mb-1 block">
                  Plot Dimensions
                </label>
                <select
                  value={dimensionsFilter}
                  onChange={(e) => setDimensionsFilter(e.target.value)}
                  className="w-full py-2 px-3 text-xs border border-stone-alt rounded-sm focus:outline-none focus:border-terracotta bg-white"
                >
                  {dimensionsList.map((dim) => (
                    <option key={dim} value={dim}>
                      {dim === "All" ? "All Dimensions" : dim}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Summary Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-neutral-500">
                Showing {filteredProjects.length} of {items.length} Projects
              </span>
              {categoryFilter !== "All" && (
                <span className="bg-stone-100 border border-stone-alt text-charcoal px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1">
                  Cat: {categoryFilter}
                  <X size={12} className="cursor-pointer hover:text-red-600" onClick={() => setCategoryFilter("All")} />
                </span>
              )}
              {locationFilter !== "All" && (
                <span className="bg-stone-100 border border-stone-alt text-charcoal px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1">
                  Loc: {locationFilter}
                  <X size={12} className="cursor-pointer hover:text-red-600" onClick={() => setLocationFilter("All")} />
                </span>
              )}
              {floorsFilter !== "All" && (
                <span className="bg-stone-100 border border-stone-alt text-charcoal px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1">
                  Floors: {floorsFilter}
                  <X size={12} className="cursor-pointer hover:text-red-600" onClick={() => setFloorsFilter("All")} />
                </span>
              )}
              {dimensionsFilter !== "All" && (
                <span className="bg-stone-100 border border-stone-alt text-charcoal px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1">
                  Dimensions: {dimensionsFilter}
                  <X size={12} className="cursor-pointer hover:text-red-600" onClick={() => setDimensionsFilter("All")} />
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Projects Cards Grid */}
        <section className="marketing-container pb-24">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className="group border border-stone-alt bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container with Category Badge */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                      <img
                        src={p.image_url}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-charcoal/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs backdrop-blur-xs">
                        {p.category || "Residential Villa"}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-terracotta font-medium">
                        <MapPin size={14} /> {p.location}
                      </div>

                      <h3 className="font-heading text-2xl tracking-tight text-charcoal group-hover:text-terracotta transition-colors">
                        {p.title}
                      </h3>

                      <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                        {p.description || p.overview}
                      </p>

                      {/* Specs Row */}
                      <div className="pt-2 border-t border-stone-alt flex items-center justify-between text-xs text-neutral-500 marker-num">
                        <div className="flex items-center gap-1">
                          <Layers size={13} className="text-neutral-400" /> {p.floors}
                        </div>
                        <div className="flex items-center gap-1">
                          <Ruler size={13} className="text-neutral-400" /> {p.dimensions}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="px-5 py-3.5 bg-[#F9F8F6] border-t border-stone-alt flex items-center justify-between text-xs font-semibold text-charcoal group-hover:bg-stone-100 transition-colors">
                    <span>View Project Brief</span>
                    <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-stone-alt p-12 text-center rounded-sm space-y-3">
              <Building size={32} className="mx-auto text-neutral-400" />
              <div className="font-heading text-xl font-semibold text-charcoal">No Projects Match Your Filters</div>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Try resetting your category, location, floors, or plot dimension filters to explore more of our signature works.
              </p>
              <button onClick={clearFilters} className="btn-terra mt-3">
                Reset All Filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Interactive Project Brief Modal */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-2xl bg-white border border-stone-alt shadow-2xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
          {selectedProject && (
            <>
              {/* Header Image with Close Overlay */}
              <div className="relative h-64 sm:h-72 w-full bg-stone-100 shrink-0">
                <img
                  src={selectedProject.image_url}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <span className="bg-terracotta text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-xs inline-block mb-2">
                    {selectedProject.category || "Signature Project"}
                  </span>
                  <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight">
                    {selectedProject.title}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-300 mt-1">
                    <MapPin size={14} /> {selectedProject.location}
                  </div>
                </div>
              </div>

              {/* Scrollable Content Details */}
              <div className="p-6 space-y-6 overflow-y-auto">
                {/* Specifications Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F9F8F6] border border-stone-alt p-4 rounded-sm">
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-neutral-400">Floors</div>
                    <div className="font-heading text-base font-semibold text-charcoal marker-num mt-0.5">
                      {selectedProject.floors}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-neutral-400">Plot Dimensions</div>
                    <div className="font-heading text-base font-semibold text-charcoal marker-num mt-0.5">
                      {selectedProject.dimensions}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-neutral-400">Location</div>
                    <div className="font-heading text-xs font-semibold text-charcoal mt-1 truncate">
                      {selectedProject.location}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-neutral-400">Category</div>
                    <div className="font-heading text-xs font-semibold text-charcoal mt-1 truncate">
                      {selectedProject.category || "Villa"}
                    </div>
                  </div>
                </div>

                {/* Project Brief Description */}
                <div className="space-y-2">
                  <div className="font-heading text-lg font-semibold text-charcoal flex items-center gap-2">
                    <Info size={16} className="text-terracotta" /> Project Brief & Architecture
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    {selectedProject.overview || selectedProject.description}
                  </p>
                </div>

                {/* Key Features List */}
                {selectedProject.features && selectedProject.features.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-heading text-base font-semibold text-charcoal">Structural & Design Highlights</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProject.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700 bg-stone-50 border border-stone-alt p-2 rounded-xs">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inquire Footer */}
                <div className="pt-4 border-t border-stone-alt flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-neutral-500">
                    Interested in building a project with similar specifications?
                  </div>
                  <a
                    href="/contact"
                    className="btn-terra text-xs py-2.5 px-4 justify-center"
                  >
                    Inquire About This Design <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
