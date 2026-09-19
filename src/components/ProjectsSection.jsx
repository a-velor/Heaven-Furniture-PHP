import { useState } from "react";
import { Sparkles, MapPin, ArrowRight, Eye } from "lucide-react";
import { COMPLETED_PROJECTS } from "../data/projectsData";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { ProjectDetailModal } from "./ProjectDetailModal";
export const ProjectsSection = ({ onOpenQuote }) => {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [modalProject, setModalProject] = useState(null);
  const activeProject = COMPLETED_PROJECTS[activeProjectIndex];
  return <section
    id="projects"
    className="py-20 sm:py-28 bg-[#FAF8F5] dark:bg-[#0B1617] border-t border-stone-200/80 dark:border-stone-800/80 relative transition-colors duration-300"
  >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {
    /* Section Header */
  }
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A880]/15 dark:bg-[#C5A880]/20 text-[#8C6239] dark:text-[#D4B78F] text-xs uppercase tracking-[0.25em] font-semibold mb-4 rounded-sm border border-[#C5A880]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Completed Commissions & Transformations</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#132629] dark:text-[#FAF8F5] leading-tight">
            Before & After: Real Spaces Crafted in Chattogram
          </h2>

          <p className="mt-4 text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
            Witness how raw architectural frameworks and aged timber logs are sculpted into heirloom suites.
            Interact with the slider below to reveal the artisan transformation from rough framing to finished bespoke elegance.
          </p>
        </div>

        {
    /* Project Selector Tabs */
  }
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-stone-200 dark:border-stone-800">
          {COMPLETED_PROJECTS.map((project, idx) => <button
    key={project.id}
    onClick={() => setActiveProjectIndex(idx)}
    className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all rounded-sm flex items-center gap-2 ${activeProjectIndex === idx ? "bg-[#132629] dark:bg-[#C5A880] text-[#FAF8F5] dark:text-[#132629] shadow-md" : "bg-white dark:bg-[#122224] text-stone-600 dark:text-stone-400 hover:text-[#132629] dark:hover:text-[#FAF8F5] border border-stone-200 dark:border-stone-800"}`}
  >
              <span>{project.category}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeProjectIndex === idx ? "bg-[#C5A880]/30 dark:bg-[#132629]/20 text-[#FAF8F5] dark:text-[#132629]" : "bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400"}`}>
                {project.location.split(",")[0]}
              </span>
            </button>)}
        </div>

        {
    /* Main Showcase: Split Interactive Slider & Detailed Commission Dossier */
  }
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {
    /* Left / Top: Interactive Before-and-After Slider (7 Cols) */
  }
          <div className="lg:col-span-7 space-y-3">
            <BeforeAfterSlider
    beforeImage={activeProject.beforeImage}
    beforeLabel={activeProject.beforeLabel}
    afterImage={activeProject.afterImage}
    afterLabel={activeProject.afterLabel}
    altText={activeProject.title}
    aspectRatio="aspect-[16/11]"
  />

            <div className="flex items-center justify-between px-1 text-[11px] text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                {activeProject.location}
              </span>
              <span>
                Lead Time: <strong className="text-stone-700 dark:text-stone-200">{activeProject.leadTime}</strong>
              </span>
            </div>
          </div>

          {
    /* Right: Commission Dossier & Quick Actions (5 Cols) */
  }
          <div className="lg:col-span-5 bg-white dark:bg-[#112022] p-6 sm:p-7 border border-stone-200/80 dark:border-stone-800/80 rounded-sm shadow-sm flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8C6239] dark:text-[#D4B78F] block mb-1">
                  Commission Case Study
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#132629] dark:text-[#FAF8F5]">
                  {activeProject.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {activeProject.summary}
              </p>

              {
    /* Spec Pills */
  }
              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2 text-xs">
                  <span className="w-24 text-stone-400 dark:text-stone-500 shrink-0 font-medium">Timber:</span>
                  <span className="font-medium text-[#132629] dark:text-[#FAF8F5]">{activeProject.woodType}</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <span className="w-24 text-stone-400 dark:text-stone-500 shrink-0 font-medium">Dimensions:</span>
                  <span className="font-medium text-[#132629] dark:text-[#FAF8F5]">{activeProject.dimensions}</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <span className="w-24 text-stone-400 dark:text-stone-500 shrink-0 font-medium">Completed:</span>
                  <span className="font-medium text-[#132629] dark:text-[#FAF8F5]">{activeProject.completionYear} for {activeProject.clientName}</span>
                </div>
              </div>

              {
    /* Key Challenge Snippet */
  }
              <div className="p-3 bg-stone-50 dark:bg-[#15272a] border-l-2 border-[#C5A880] text-xs text-stone-600 dark:text-stone-300">
                <strong className="block text-[#132629] dark:text-[#FAF8F5] font-semibold mb-0.5">The Spatial Challenge:</strong>
                <p className="line-clamp-2">{activeProject.challenge}</p>
              </div>
            </div>

            {
    /* CTAs */
  }
            <div className="space-y-2.5 pt-4 border-t border-stone-200 dark:border-stone-800">
              <button
    id="view-project-details-btn"
    onClick={() => setModalProject(activeProject)}
    className="w-full py-3 px-4 bg-[#132629] dark:bg-[#C5A880] hover:bg-[#1D363A] dark:hover:bg-[#D4B78F] text-[#FAF8F5] dark:text-[#132629] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm transition-colors btn-luxury"
  >
                <Eye className="w-4 h-4" />
                <span>Reveal Full Case Details & Modal</span>
              </button>

              <button
    onClick={() => onOpenQuote(activeProject.title)}
    className="w-full py-2.5 px-4 bg-transparent hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700 text-[#132629] dark:text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm transition-colors"
  >
                <span>Request Quote for This Design</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

        {
    /* Gallery Grid of Other Completed Projects for Fast Exploration */
  }
        <div className="mt-14 pt-10 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#132629] dark:text-[#FAF8F5]">
              Explore More Atelier Transformations
            </h3>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Select any card to view slider
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMPLETED_PROJECTS.map((project, idx) => <div
    key={project.id}
    onClick={() => {
      setActiveProjectIndex(idx);
      window.scrollTo({
        top: document.getElementById("projects")?.offsetTop || 0,
        behavior: "smooth"
      });
    }}
    className={`group cursor-pointer p-3 bg-white dark:bg-[#122224] border rounded-sm transition-all hover:shadow-md ${activeProjectIndex === idx ? "border-[#C5A880] ring-1 ring-[#C5A880]/40" : "border-stone-200 dark:border-stone-800 hover:border-stone-400"}`}
  >
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm mb-3 bg-stone-900">
                  <img
    src={project.afterImage}
    alt={project.title}
    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    loading="lazy"
  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-[10px] text-stone-200 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                    {project.category}
                  </div>
                  <button
    onClick={(e) => {
      e.stopPropagation();
      setModalProject(project);
    }}
    className="absolute bottom-2 right-2 p-1.5 bg-[#132629]/90 hover:bg-[#C5A880] text-[#FAF8F5] hover:text-[#132629] rounded-sm transition-colors shadow"
    title="Open details modal"
  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="font-serif text-sm font-medium text-[#132629] dark:text-[#FAF8F5] line-clamp-1 group-hover:text-[#8C6239] dark:group-hover:text-[#C5A880] transition-colors">
                  {project.title}
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {project.location} · {project.woodType.split("&")[0]}
                </p>
              </div>)}
          </div>
        </div>

      </div>

      {
    /* Full Screen / Detailed Project Modal Overlay */
  }
      <ProjectDetailModal
    project={modalProject}
    isOpen={Boolean(modalProject)}
    onClose={() => setModalProject(null)}
    onOpenQuote={onOpenQuote}
  />
    </section>;
};
