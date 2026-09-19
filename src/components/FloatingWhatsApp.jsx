import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Clock, ZapOff } from "lucide-react";
const checkIsBusinessHours = () => {
  try {
    const now = /* @__PURE__ */ new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Dhaka",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    const weekday = parts.find((p) => p.type === "weekday")?.value;
    const hour = parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10);
    const minute = parseInt(parts.find((p) => p.type === "minute")?.value || "0", 10);
    const currentMins = hour * 60 + minute;
    if (weekday === "Fri") {
      return currentMins >= 15 * 60 && currentMins < 21 * 60;
    }
    return currentMins >= 10 * 60 && currentMins < 21 * 60;
  } catch {
    const now = /* @__PURE__ */ new Date();
    const day = now.getDay();
    const hour = now.getHours();
    if (day === 5) return hour >= 15 && hour < 21;
    return hour >= 10 && hour < 21;
  }
};
const getAgrabadCurrentTime = () => {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Dhaka",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).format(/* @__PURE__ */ new Date());
  } catch {
    const now = /* @__PURE__ */ new Date();
    return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  }
};
export const FloatingWhatsApp = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoShown, setIsAutoShown] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isBelow480, setIsBelow480] = useState(false);
  const [isAvailable, setIsAvailable] = useState(checkIsBusinessHours);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [isPreconnected, setIsPreconnected] = useState(false);
  const [agrabadTime, setAgrabadTime] = useState(getAgrabadCurrentTime);
  const [isTyping, setIsTyping] = useState(false);
  const hasPingedRef = useRef(false);
  const hasWarmedUpRef = useRef(false);
  const hasInteractedRef = useRef(false);
  const hoverTimeoutRef = useRef(null);
  const autoShowTimerRef = useRef(null);
  const autoHideTimerRef = useRef(null);
  const warmupWhatsAppConnection = useCallback(() => {
    if (hasWarmedUpRef.current || typeof document === "undefined") return;
    hasWarmedUpRef.current = true;
    setIsPreconnected(true);
    const targetOrigins = [
      "https://wa.me",
      "https://api.whatsapp.com",
      "https://web.whatsapp.com"
    ];
    targetOrigins.forEach((origin) => {
      if (!document.querySelector(`link[rel="dns-prefetch"][href="${origin}"]`)) {
        const dnsLink = document.createElement("link");
        dnsLink.rel = "dns-prefetch";
        dnsLink.href = origin;
        document.head.appendChild(dnsLink);
      }
      if (!document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
        const preconnectLink = document.createElement("link");
        preconnectLink.rel = "preconnect";
        preconnectLink.href = origin;
        preconnectLink.crossOrigin = "anonymous";
        document.head.appendChild(preconnectLink);
      }
    });
    const waChatUrl = "https://wa.me/8801960481983?text=Hello%20Heaven%20Furniture%20Mart!%20I%20would%20like%20to%20inquire%20about%20a%20bespoke%20piece.";
    if (!document.querySelector(`link[rel="prefetch"][href="${waChatUrl}"]`)) {
      const prefetchLink = document.createElement("link");
      prefetchLink.rel = "prefetch";
      prefetchLink.href = waChatUrl;
      prefetchLink.as = "document";
      document.head.appendChild(prefetchLink);
    }
    try {
      if ("HTMLScriptElement" in window && HTMLScriptElement.supports?.("speculationrules") && !document.querySelector("script#whatsapp-speculation-rules")) {
        const specScript = document.createElement("script");
        specScript.id = "whatsapp-speculation-rules";
        specScript.type = "speculationrules";
        specScript.textContent = JSON.stringify({
          prefetch: [
            {
              source: "list",
              urls: [waChatUrl]
            }
          ]
        });
        document.head.appendChild(specScript);
      }
    } catch {
    }
  }, []);
  useEffect(() => {
    try {
      if (sessionStorage.getItem("hfm_wa_ping_played") === "true") {
        hasPingedRef.current = true;
      }
    } catch {
    }
    const checkViewportWidth = () => {
      setIsBelow480(typeof window !== "undefined" && window.innerWidth < 480);
    };
    checkViewportWidth();
    window.addEventListener("resize", checkViewportWidth, { passive: true });
    const updateAvailability = () => {
      setIsAvailable(checkIsBusinessHours());
    };
    updateAvailability();
    const timer = setInterval(updateAvailability, 6e4);
    return () => {
      window.removeEventListener("resize", checkViewportWidth);
      clearInterval(timer);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);
  useEffect(() => {
    let isMounted = true;
    let batteryObj = null;
    const checkPowerState = (bat) => {
      if (!isMounted) return;
      const nav2 = navigator;
      const conn2 = nav2.connection || nav2.mozConnection || nav2.webkitConnection;
      const isDataSaver = Boolean(conn2?.saveData);
      let isBatteryLow = false;
      const currentBat = bat !== void 0 ? bat : batteryObj;
      if (currentBat) {
        if (!currentBat.charging && currentBat.level <= 0.2) {
          isBatteryLow = true;
        }
      }
      setIsLowPowerMode(isDataSaver || isBatteryLow);
    };
    const nav = navigator;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    const handleConnChange = () => checkPowerState();
    if (conn?.addEventListener) {
      conn.addEventListener("change", handleConnChange);
    }
    if (typeof nav.getBattery === "function") {
      nav.getBattery().then((bat) => {
        if (!isMounted) return;
        batteryObj = bat;
        checkPowerState(bat);
        const onBatUpdate = () => checkPowerState(bat);
        bat.addEventListener("chargingchange", onBatUpdate);
        bat.addEventListener("levelchange", onBatUpdate);
      }).catch(() => {
        checkPowerState();
      });
    } else {
      checkPowerState();
    }
    return () => {
      isMounted = false;
      if (conn?.removeEventListener) {
        conn.removeEventListener("change", handleConnChange);
      }
    };
  }, []);
  useEffect(() => {
    if (isHovered && !isAvailable) {
      setAgrabadTime(getAgrabadCurrentTime());
      const clockInterval = setInterval(() => {
        setAgrabadTime(getAgrabadCurrentTime());
      }, 1e3);
      return () => clearInterval(clockInterval);
    }
  }, [isHovered, isAvailable]);
  const playLuxuryPing = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {
        });
      }
      const now = ctx.currentTime;
      const fundamental = ctx.createOscillator();
      const fundamentalGain = ctx.createGain();
      const harmonic = ctx.createOscillator();
      const harmonicGain = ctx.createGain();
      fundamental.type = "sine";
      fundamental.frequency.setValueAtTime(880, now);
      fundamental.frequency.exponentialRampToValueAtTime(865, now + 0.38);
      harmonic.type = "sine";
      harmonic.frequency.setValueAtTime(1760, now);
      harmonic.frequency.exponentialRampToValueAtTime(1730, now + 0.28);
      fundamentalGain.gain.setValueAtTime(1e-4, now);
      fundamentalGain.gain.linearRampToValueAtTime(0.055, now + 0.02);
      fundamentalGain.gain.exponentialRampToValueAtTime(1e-4, now + 0.42);
      harmonicGain.gain.setValueAtTime(1e-4, now);
      harmonicGain.gain.linearRampToValueAtTime(0.016, now + 0.015);
      harmonicGain.gain.exponentialRampToValueAtTime(1e-4, now + 0.24);
      fundamental.connect(fundamentalGain);
      fundamentalGain.connect(ctx.destination);
      harmonic.connect(harmonicGain);
      harmonicGain.connect(ctx.destination);
      fundamental.start(now);
      harmonic.start(now);
      fundamental.stop(now + 0.45);
      harmonic.stop(now + 0.45);
      setTimeout(() => {
        try {
          ctx.close();
        } catch {
        }
      }, 600);
    } catch {
    }
  }, []);
  const recordUserInteraction = useCallback(() => {
    if (autoShowTimerRef.current) {
      clearTimeout(autoShowTimerRef.current);
      autoShowTimerRef.current = null;
    }
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
    hasInteractedRef.current = true;
    setHasInteracted(true);
    setIsAutoShown(false);
    try {
      sessionStorage.setItem("hfm_wa_interacted", "true");
    } catch {
    }
  }, []);
  useEffect(() => {
    try {
      if (sessionStorage.getItem("hfm_wa_interacted") === "true") {
        hasInteractedRef.current = true;
        setHasInteracted(true);
        return;
      }
    } catch {
    }
    autoShowTimerRef.current = setTimeout(() => {
      if (!hasInteractedRef.current && !isDismissed) {
        setIsAutoShown(true);
        setAgrabadTime(getAgrabadCurrentTime());
        warmupWhatsAppConnection();
        if (!hasPingedRef.current && !isLowPowerMode) {
          try {
            sessionStorage.setItem("hfm_wa_ping_played", "true");
          } catch {
          }
          hasPingedRef.current = true;
          playLuxuryPing();
        }
        autoHideTimerRef.current = setTimeout(() => {
          setIsAutoShown(false);
        }, 8e3);
      }
    }, 5e3);
    return () => {
      if (autoShowTimerRef.current) clearTimeout(autoShowTimerRef.current);
      if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    };
  }, [isDismissed, isLowPowerMode, playLuxuryPing, warmupWhatsAppConnection]);
  const handleButtonMouseOver = () => {
    recordUserInteraction();
    warmupWhatsAppConnection();
  };
  const handleButtonMouseEnter = () => {
    recordUserInteraction();
    handleButtonMouseOver();
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(true);
    setAgrabadTime(getAgrabadCurrentTime());
    if (!hasPingedRef.current && !isLowPowerMode) {
      try {
        if (sessionStorage.getItem("hfm_wa_ping_played") === "true") {
          hasPingedRef.current = true;
          return;
        }
        sessionStorage.setItem("hfm_wa_ping_played", "true");
      } catch {
      }
      hasPingedRef.current = true;
      playLuxuryPing();
    }
  };
  const handleButtonMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };
  const handleButtonFocus = () => {
    recordUserInteraction();
    handleButtonMouseEnter();
  };
  const handleButtonTouchStart = () => {
    recordUserInteraction();
    handleButtonMouseOver();
  };
  const handleButtonClick = () => {
    recordUserInteraction();
  };
  const handleTooltipMouseEnter = () => {
    recordUserInteraction();
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(true);
    setAgrabadTime(getAgrabadCurrentTime());
  };
  const handleTooltipMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };
  const handleDismissTooltip = (e) => {
    e.stopPropagation();
    recordUserInteraction();
    setIsDismissed(true);
    setIsHovered(false);
    setIsAutoShown(false);
  };
  const isTooltipVisible = !isDismissed && (isHovered || isAutoShown);
  useEffect(() => {
    let timer = null;
    if (isTooltipVisible) {
      if (isLowPowerMode) {
        setIsTyping(false);
      } else {
        setIsTyping(true);
        timer = setTimeout(() => {
          setIsTyping(false);
        }, 1100);
      }
    } else {
      setIsTyping(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isTooltipVisible, isLowPowerMode]);
  return <div
    id="floating-whatsapp-container"
    data-whatsapp-container
    className={`fixed z-40 flex items-end gap-3 pointer-events-none transition-all duration-300 ${isBelow480 ? "bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] left-4 right-auto flex-row-reverse" : "bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] md:bottom-6 right-6 left-auto"} max-[480px]:bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] max-[480px]:left-[max(1rem,env(safe-area-inset-left))] max-[480px]:right-auto max-[480px]:flex-row-reverse`}
  >
      
      {
    /* Floating Info Tooltip with Spring Entrance Transition */
  }
      {!isDismissed && <div
    id="whatsapp-tooltip"
    role="tooltip"
    onMouseEnter={handleTooltipMouseEnter}
    onMouseLeave={handleTooltipMouseLeave}
    data-auto-shown={isAutoShown ? "true" : "false"}
    data-visible={isTooltipVisible ? "true" : "false"}
    data-interacted={hasInteracted ? "true" : "false"}
    className={`bg-[#132629]/90 dark:bg-[#122022]/90 backdrop-blur-md supports-[backdrop-filter]:bg-[#132629]/85 dark:supports-[backdrop-filter]:bg-[#122022]/85 text-[#FAF8F5] p-3.5 max-[480px]:p-2.5 max-[480px]:px-3 max-[480px]:py-2.5 max-[480px]:text-center shadow-2xl border border-[#C5A880]/40 rounded-[1.5rem] max-w-[240px] max-[480px]:max-w-[210px] relative block transform transition-all ${isBelow480 ? "origin-bottom-left text-center" : "origin-bottom-right text-left"} ${isTooltipVisible ? "opacity-100 translate-y-0 scale-100 hover:scale-[1.02] pointer-events-auto" : "opacity-0 translate-y-2.5 scale-95 pointer-events-none"}`}
  >
          <button
    onClick={handleDismissTooltip}
    className="absolute -top-2 -right-2 w-5 h-5 bg-stone-700 hover:bg-stone-900 text-white rounded-full flex items-center justify-center text-[10px] transition-colors shadow cursor-pointer"
    aria-label="Dismiss message"
  >
            <X className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider mb-0.5 max-[480px]:justify-center max-[480px]:text-center">
            <span
    className={`w-1.5 h-1.5 rounded-full ${isAvailable ? `bg-emerald-400 ${isLowPowerMode ? "" : "animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]"}` : "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]"}`}
  />
            <span className={isAvailable ? "text-emerald-400" : "text-amber-400"}>
              {isAvailable ? "Studio Online (Available)" : "After Hours (Auto-Responder)"}
            </span>
            {isLowPowerMode && <span
    className="ml-auto max-[480px]:ml-0 inline-flex items-center gap-0.5 text-[9px] text-amber-300/80 uppercase font-mono"
    title="Low Power Mode active (animations & audio minimized)"
  >
                <ZapOff className="w-2.5 h-2.5" />
                Eco
              </span>}
          </div>
          {isTyping ? <div
    id="whatsapp-tooltip-typing"
    className="py-2.5 px-0.5 flex items-center gap-2 text-[#FAF8F5] transition-opacity duration-300 max-[480px]:justify-center"
    aria-label="Artisan consultant is typing"
  >
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-900/60 border border-[#C5A880]/30 shadow-inner">
                <span className="whatsapp-typing-dot" />
                <span className="whatsapp-typing-dot" />
                <span className="whatsapp-typing-dot" />
              </div>
              <span className="text-[11px] text-[#C5A880] font-serif italic tracking-wide">
                Consultant is typing...
              </span>
            </div> : <div className="transition-opacity duration-300">
              <p className="text-xs text-stone-300 dark:text-stone-300 leading-snug font-light max-[480px]:text-center">
                {isAvailable ? <>
                    Need <span className="whatsapp-tooltip-highlight">custom advice</span> or price estimates? Chat live with our Agrabad <span className="whatsapp-tooltip-highlight">master artisans</span>.
                  </> : <>
                    Studio is closed for the evening. Leave your <span className="whatsapp-tooltip-highlight">room dimensions</span> or inquiry — our auto-responder logs your request for <span className="whatsapp-tooltip-highlight">prompt morning follow-up</span>.
                  </>}
              </p>

              {
    /* Business Hours: Response time indicator */
  }
              {isAvailable && <div className="mt-2.5 pt-2 border-t border-[#C5A880]/30 flex items-center justify-between max-[480px]:justify-center max-[480px]:gap-2 max-[480px]:text-center text-[11px] text-stone-300">
                  <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#C5A880] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                    Response time:
                  </span>
                  <span
    id="whatsapp-response-time-badge"
    className="font-mono text-[11px] font-semibold text-emerald-200 dark:text-emerald-200 bg-[#0e2c29] dark:bg-[#164039] border border-emerald-500/40 dark:border-emerald-400/50 px-2 py-0.5 rounded shadow-sm tracking-tight"
  >
                    &lt; 1 hour
                  </span>
                </div>}

              {
    /* Dynamic Agrabad Local Time Display After Business Hours */
  }
              {!isAvailable && <div className="mt-2.5 pt-2 border-t border-[#C5A880]/30 flex items-center justify-between max-[480px]:justify-center max-[480px]:gap-2 max-[480px]:text-center text-[11px] text-stone-300">
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#C5A880] font-medium">
                    <Clock className="w-3 h-3 text-[#C5A880]" />
                    Agrabad Local Time:
                  </span>
                  <span className="font-mono text-xs font-semibold text-white bg-stone-800/90 px-1.5 py-0.5 rounded border border-stone-700 shadow-inner">
                    {agrabadTime}
                  </span>
                </div>}
            </div>}
        </div>}

      {
    /* WhatsApp Button with Dynamic Time-of-Day Border Color & Low Power Mode Adaptivity */
  }
      <a
    id="floating-whatsapp-btn"
    href="https://wa.me/8801960481983?text=Hello%20Heaven%20Furniture%20Mart!%20I%20would%20like%20to%20inquire%20about%20a%20bespoke%20piece."
    target="_blank"
    rel="noopener noreferrer"
    onClick={handleButtonClick}
    onMouseOver={handleButtonMouseOver}
    onMouseEnter={handleButtonMouseEnter}
    onMouseLeave={handleButtonMouseLeave}
    onFocus={handleButtonFocus}
    onBlur={handleButtonMouseLeave}
    onTouchStart={handleButtonTouchStart}
    aria-describedby="whatsapp-tooltip"
    data-status={isAvailable ? "available" : "after-hours"}
    data-prefetched={isPreconnected ? "true" : "false"}
    data-connection-warm={isPreconnected ? "true" : "false"}
    data-low-power-mode={isLowPowerMode ? "true" : "false"}
    data-interacted={hasInteracted ? "true" : "false"}
    data-auto-shown={isAutoShown ? "true" : "false"}
    className={`pointer-events-auto relative w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none ${isAvailable ? `border-2 border-emerald-400 dark:border-emerald-400 ${isLowPowerMode ? "shadow-md" : "whatsapp-border-pulse shadow-[0_0_16px_rgba(52,211,153,0.55)]"}` : `border-2 border-amber-400 dark:border-amber-300/90 ${isLowPowerMode ? "shadow-md" : "shadow-[0_0_16px_rgba(251,191,36,0.45)]"}`}`}
    aria-label={`Chat with Heaven Furniture Mart on WhatsApp (${isAvailable ? "Artisans Available" : "After Hours Auto-Responder Mode"})`}
    title={isAvailable ? `Heaven Furniture Mart: Master Artisans Online (Available)${isLowPowerMode ? " [Low Power Mode]" : ""}` : `Heaven Furniture Mart: After Hours (Auto-Responder Active)${isLowPowerMode ? " [Low Power Mode]" : ""}`}
  >
        <MessageCircle className="w-7 h-7" />

        {
    /* Dynamic Status Indicator Badge */
  }
        <span
    className={`absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#132629] transition-colors duration-300 ${isAvailable ? `bg-emerald-400 ${isLowPowerMode ? "" : "shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse"}` : `bg-amber-400 ${isLowPowerMode ? "" : "shadow-[0_0_8px_rgba(251,191,36,0.9)]"}`}`}
    aria-hidden="true"
  />
      </a>
    </div>;
};
