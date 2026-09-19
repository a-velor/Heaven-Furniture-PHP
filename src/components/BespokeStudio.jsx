import { useState } from "react";
import { Sparkles, Check, ArrowRight, MessageCircle, Ruler, Layers, ShieldCheck, Box, Share2 } from "lucide-react";
import { BESPOKE_STEPS, WOOD_SPECIES } from "../data/furnitureData";
import { SocialShareModal } from "./SocialShareModal";
export const BespokeStudio = ({ onOpenQuote }) => {
  const [selectedRoom, setSelectedRoom] = useState("living");
  const [selectedWood, setSelectedWood] = useState(WOOD_SPECIES[0].id);
  const [selectedFinish, setSelectedFinish] = useState("boucl\xE9");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const roomOptions = [
    {
      id: "living",
      name: "Living Room Suite",
      description: "Custom sectional, coffee tables, fluted media consoles, and accent lounge chairs.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=700&q=75",
      specs: "Tailored L-shape / U-shape seating, custom cushion firmness, concealed wire routing."
    },
    {
      id: "bedroom",
      name: "Master Bedroom Suite",
      description: "Canopy or floating bed frames, acoustic tufted headboards, and walk-in wardrobe cabinetry.",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=700&q=75",
      specs: "Integrated bedside reading luminaires, anti-creak floating slats, custom mattress sizing."
    },
    {
      id: "dining",
      name: "Formal Dining Ensemble",
      description: "Single-slab or bookmatched teak tables for 8\u201314 seats with bespoke upholstered chairs.",
      image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=700&q=75",
      specs: "Heat and spill-resistant organic nano-lacquer, ergonomic lumbar curved chair backs."
    },
    {
      id: "office",
      name: "Executive Workstation & Library",
      description: "Heavy solid hardwood partner desks, credenzas, floor-to-ceiling study bookshelves.",
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=700&q=75",
      specs: "Concealed power bays, leather desk insets, biometric private lock drawers."
    }
  ];
  const finishOptions = [
    { id: "boucl\xE9", name: "Textured Belgian Boucl\xE9", tone: "Warm Oatmeal" },
    { id: "velvet", name: "Italian Cotton Velvet", tone: "Deep Teal / Amber" },
    { id: "leather", name: "Full-Grain Pull-Up Leather", tone: "Cognac Saddle" },
    { id: "satin-wood", name: "Hand-Rubbed Organic Teak Satin", tone: "Natural Honey" }
  ];
  const currentWoodObj = WOOD_SPECIES.find((w) => w.id === selectedWood) || WOOD_SPECIES[0];
  const currentRoomObj = roomOptions.find((r) => r.id === selectedRoom) || roomOptions[0];
  const handleSendToWhatsApp = () => {
    const text = `Hello Heaven Furniture Mart! I would like to inquire about a Bespoke Commission:
- Room Type: ${currentRoomObj.name}
- Preferred Hardwood: ${currentWoodObj.name}
- Finish / Fabric: ${finishOptions.find((f) => f.id === selectedFinish)?.name}
Could we arrange a complimentary consultation or review floor measurements?`;
    window.open(`https://wa.me/8801960481983?text=${encodeURIComponent(text)}`, "_blank");
  };
  return <section id="bespoke" className="py-20 lg:py-28 bg-[#FAF8F5] dark:bg-[#0B1617] text-[#2C221E] dark:text-[#F2EFE9] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {
    /* Section Header */
  }
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8C6239]/10 dark:bg-[#C5A880]/10 border border-[#8C6239]/30 dark:border-[#C5A880]/30 rounded-full text-xs font-semibold uppercase tracking-[0.25em] text-[#8C6239] dark:text-[#D4B78F] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Our #1 Differentiator
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#132629] dark:text-[#FAF8F5] font-normal leading-tight">
            The Bespoke Atelier: <br />
            <span className="italic text-[#8C6239] dark:text-[#C5A880]">Your Space. Your Dimensions. Your Wood.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#2C221E]/75 dark:text-[#FAF8F5]/75 font-light max-w-2xl mx-auto">
            Unlike retail outlets that constrain you to warehouse templates, Heaven Furniture Mart handcrafts 
            everything from scratch to match your home’s architectural blueprint and aesthetic desires.
          </p>
        </div>

        {
    /* Interactive Bespoke Workshop Explorer */
  }
        <div className="bg-white dark:bg-[#122022] border border-[#C5A880]/30 shadow-xl overflow-hidden mb-20 transition-colors">
          
          {
    /* Top Bar / Category Selector */
  }
          <div className="bg-[#132629] dark:bg-[#0E1A1C] p-4 sm:p-6 text-white border-b border-[#C5A880]/30">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C5A880] block">
                  Interactive Commission Planner
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#FAF8F5]">
                  Configure Your Custom Piece
                </h3>
              </div>
              {
    /* Room Buttons */
  }
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {roomOptions.map((room) => <button
    key={room.id}
    onClick={() => setSelectedRoom(room.id)}
    className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all text-center border ${selectedRoom === room.id ? "bg-[#C5A880] text-[#132629] border-[#C5A880]" : "bg-[#1B3236] dark:bg-[#162528] text-[#FAF8F5]/80 border-transparent hover:border-[#C5A880]/40"}`}
  >
                    {room.name.split(" ")[0]} Room
                  </button>)}
              </div>
            </div>
          </div>

          {
    /* Configuration Body */
  }
          <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {
    /* Left: Interactive Controls */
  }
            <div className="lg:col-span-7 space-y-8">
              
              {
    /* Selected Room Overview */
  }
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#8C6239] dark:text-[#D4B78F] mb-1">
                  <Box className="w-3.5 h-3.5" />
                  <span>Selected Commission Category</span>
                </div>
                <h4 className="font-serif text-2xl text-[#132629] dark:text-[#FAF8F5] font-medium">
                  {currentRoomObj.name}
                </h4>
                <p className="text-sm text-[#2C221E]/80 dark:text-[#FAF8F5]/75 mt-1 font-light">
                  {currentRoomObj.description}
                </p>
                <div className="mt-2 text-xs bg-[#FAF8F5] dark:bg-[#182A2D] border border-stone-200 dark:border-stone-700/60 p-3 text-stone-600 dark:text-stone-300 rounded-sm">
                  <strong className="text-[#132629] dark:text-[#FAF8F5]">Bespoke Capabilities:</strong> {currentRoomObj.specs}
                </div>
              </div>

              {
    /* Wood Selection */
  }
              <div>
                <label className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#132629] dark:text-[#FAF8F5] mb-3">
                  <Layers className="w-3.5 h-3.5 text-[#8C6239] dark:text-[#C5A880]" />
                  <span>Step 1: Choose Seasoned Hardwood</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {WOOD_SPECIES.map((wood) => <button
    key={wood.id}
    onClick={() => setSelectedWood(wood.id)}
    className={`p-3.5 text-left border transition-all flex flex-col justify-between ${selectedWood === wood.id ? "border-[#8C6239] dark:border-[#C5A880] bg-[#8C6239]/10 dark:bg-[#C5A880]/10 ring-1 ring-[#8C6239] dark:ring-[#C5A880]" : "border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 bg-white dark:bg-[#162528]"}`}
  >
                      <div className="flex items-start justify-between">
                        <span className="font-serif text-sm font-semibold text-[#132629] dark:text-[#FAF8F5]">
                          {wood.name}
                        </span>
                        {selectedWood === wood.id && <Check className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880]" />}
                      </div>
                      <span className="text-[11px] text-[#8C6239] dark:text-[#D4B78F] font-medium mt-1">
                        {wood.origin}
                      </span>
                    </button>)}
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 italic">
                  * {currentWoodObj.character}
                </p>
              </div>

              {
    /* Finish / Upholstery Selection */
  }
              <div>
                <label className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#132629] dark:text-[#FAF8F5] mb-3">
                  <Ruler className="w-3.5 h-3.5 text-[#8C6239] dark:text-[#C5A880]" />
                  <span>Step 2: Choose Material Finish / Textile</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {finishOptions.map((finish) => <button
    key={finish.id}
    onClick={() => setSelectedFinish(finish.id)}
    className={`p-3 text-left border text-xs transition-all ${selectedFinish === finish.id ? "border-[#132629] dark:border-[#C5A880] bg-[#132629] dark:bg-[#C5A880] text-[#FAF8F5] dark:text-[#132629]" : "border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 bg-[#FAF8F5] dark:bg-[#162528] text-stone-800 dark:text-stone-200"}`}
  >
                      <span className="font-medium block leading-tight">
                        {finish.name}
                      </span>
                      <span className={`text-[10px] block mt-1 ${selectedFinish === finish.id ? "text-[#C5A880] dark:text-[#132629]/90" : "text-stone-500 dark:text-stone-400"}`}>
                        {finish.tone}
                      </span>
                    </button>)}
                </div>
              </div>

              {
    /* Action Buttons */
  }
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
                <button
    id="bespoke-request-quote-btn"
    onClick={() => onOpenQuote(currentRoomObj.name)}
    className="flex-1 py-3.5 px-6 bg-[#132629] dark:bg-[#C5A880] hover:bg-[#1B3236] dark:hover:bg-[#D4B78F] text-[#FAF8F5] dark:text-[#132629] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm btn-luxury"
  >
                  <span>Request Bespoke Quote</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A880] dark:text-[#132629]" />
                </button>

                <button
    id="bespoke-whatsapp-btn"
    onClick={handleSendToWhatsApp}
    className="py-3.5 px-6 bg-[#FAF8F5] dark:bg-[#162528] hover:bg-stone-100 dark:hover:bg-[#1e3336] border border-stone-300 dark:border-stone-700 text-[#132629] dark:text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors btn-luxury"
  >
                  <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Send Spec to WhatsApp</span>
                </button>

                <button
    id="bespoke-share-spec-btn"
    onClick={() => setIsShareOpen(true)}
    className="py-3.5 px-4 bg-stone-100 dark:bg-[#182A2D] hover:bg-stone-200 dark:hover:bg-[#20373b] border border-stone-300 dark:border-stone-700 text-[#132629] dark:text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
    title="Preview & share Open Graph social card"
  >
                  <Share2 className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880]" />
                  <span className="hidden sm:inline">Share Spec</span>
                </button>
              </div>

            </div>

            {
    /* Right: Architectural Visual Preview Card */
  }
            <div className="lg:col-span-5 flex flex-col">
              <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-inner group">
                <img
    src={currentRoomObj.image}
    alt={currentRoomObj.name}
    loading="lazy"
    decoding="async"
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    referrerPolicy="no-referrer"
  />
                <div className="absolute top-3 left-3 bg-[#132629]/90 dark:bg-[#0B1617]/90 backdrop-blur-sm text-[#FAF8F5] px-3 py-1 text-[11px] uppercase tracking-widest font-semibold border border-[#C5A880]/30">
                  Custom Atelier Spec
                </div>
              </div>

              {
    /* Spec Summary Card */
  }
              <div className="mt-4 p-4 bg-[#FAF8F5] dark:bg-[#182A2D] border border-stone-200 dark:border-stone-700 text-xs space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-stone-200 dark:border-stone-700/60">
                  <span className="text-stone-500 dark:text-stone-400">Selected Hardwood:</span>
                  <span className="font-semibold text-[#132629] dark:text-[#FAF8F5]">{currentWoodObj.name}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-stone-200 dark:border-stone-700/60">
                  <span className="text-stone-500 dark:text-stone-400">Textile / Finish:</span>
                  <span className="font-semibold text-[#132629] dark:text-[#FAF8F5]">
                    {finishOptions.find((f) => f.id === selectedFinish)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-stone-200 dark:border-stone-700/60">
                  <span className="text-stone-500 dark:text-stone-400">Production Timeframe:</span>
                  <span className="font-semibold text-[#8C6239] dark:text-[#C5A880]">14 – 21 Days (Master Joinery)</span>
                </div>
                <div className="flex items-center gap-2 pt-1 text-stone-600 dark:text-stone-300 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Lifetime structural warranty against warping and pest degradation.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {
    /* The 4-Step Bespoke Journey */
  }
        <div className="border-t border-[#C5A880]/30 dark:border-stone-800 pt-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8C6239] dark:text-[#D4B78F] block mb-2">
              From Blueprint to Reality
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#132629] dark:text-[#FAF8F5]">
              How Your Commission Is Created
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BESPOKE_STEPS.map((step) => <div
    key={step.step}
    className="bg-white dark:bg-[#122022] p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm relative group hover:border-[#C5A880] dark:hover:border-[#C5A880]/60 transition-colors card-hover"
  >
                <div className="font-serif text-4xl font-bold text-[#8C6239]/25 dark:text-[#C5A880]/30 group-hover:text-[#8C6239] dark:group-hover:text-[#C5A880] transition-colors mb-4">
                  {step.step}
                </div>
                <h4 className="font-serif text-lg font-semibold text-[#132629] dark:text-[#FAF8F5] mb-2">
                  {step.title}
                </h4>
                <p className="text-xs text-[#2C221E]/75 dark:text-[#FAF8F5]/70 leading-relaxed font-light">
                  {step.description}
                </p>
              </div>)}
          </div>
        </div>

      </div>

      {
    /* Dynamic Open Graph & Social Share Preview Modal */
  }
      <SocialShareModal
    isOpen={isShareOpen}
    onClose={() => setIsShareOpen(false)}
    title={`${currentRoomObj.name} (Bespoke Commission)`}
    category="Bespoke Atelier Commission"
    woodType={currentWoodObj.name}
    imageUrl={currentRoomObj.image}
    description={`Custom ${currentRoomObj.name.toLowerCase()} in seasoned ${currentWoodObj.name} with ${finishOptions.find((f) => f.id === selectedFinish)?.name}. Handcrafted at Heaven Furniture Mart, Agrabad, Chattogram.`}
  />
    </section>;
};
