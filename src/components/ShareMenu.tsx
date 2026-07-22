"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Share2, Check, Link as LinkIcon } from "lucide-react";

/* Iconos de marcas (lucide ya no los incluye) */
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}
function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2a10 10 0 0 0-8.5 15.32L2 22l4.82-1.45A10 10 0 1 0 12 2Zm0 18.18c-1.5 0-2.97-.4-4.25-1.16l-.3-.18-2.86.86.86-2.79-.2-.32A8.18 8.18 0 1 1 12 20.18Zm4.47-5.8c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.73-.65-1.22-1.45-1.36-1.69-.14-.24-.02-.38.1-.5.11-.11.25-.28.37-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.3-.22.24-.85.83-.85 2.04 0 1.2.87 2.37 1 2.53.12.16 1.72 2.63 4.17 3.69.58.25 1.04.4 1.39.51.59.19 1.12.16 1.54.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.23l-4.88-6.38L6.5 22H3.35l7.24-8.28L1.5 2h6.39l4.41 5.83L18.9 2Zm-1.1 18.13h1.72L6.98 3.77H5.13L17.8 20.13Z" />
    </svg>
  );
}

/**
 * Botón de compartir. En móvil abre la hoja nativa del sistema (que incluye
 * Facebook, WhatsApp, Instagram, etc.); en escritorio muestra un menú con
 * Facebook, WhatsApp, X y copiar enlace.
 */
export default function ShareMenu({
  text,
  url,
  className = "",
}: {
  text: string;
  url?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getUrl = () =>
    url || (typeof window !== "undefined" ? window.location.href : "");

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text, url: getUrl() });
      } catch {
        /* usuario canceló */
      }
      return;
    }
    setOpen((v) => !v);
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1200);
    } catch {}
  };

  const enc = encodeURIComponent;
  const shareUrl = getUrl();
  const targets = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}&quote=${enc(text)}`,
      Icon: FacebookIcon,
      color: "text-[#1877F2]",
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${enc(`${text} ${shareUrl}`)}`,
      Icon: WhatsAppIcon,
      color: "text-[#25D366]",
    },
    {
      label: "X (Twitter)",
      href: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(shareUrl)}`,
      Icon: XIcon,
      color: "text-navy",
    },
  ];

  return (
    <div className={`relative ${className}`}>
      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleToggle}
        aria-label="Compartir publicación"
        aria-expanded={open}
        className="w-9 h-9 rounded-full bg-navy-deep/60 text-pearl backdrop-blur-md border border-white/15 flex items-center justify-center hover:bg-navy-deep transition-colors duration-300 shadow-lg"
      >
        <Share2 className="w-4 h-4" strokeWidth={1.75} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(false);
              }}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-full mt-2 z-50 min-w-[190px] rounded-2xl bg-white border border-pearl-dark/60 shadow-floating p-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="px-3 pt-1.5 pb-1 text-[0.58rem] font-bold uppercase tracking-[0.2em] text-navy/40">
                Compartir en
              </p>
              {targets.map(({ label, href, Icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-navy/75 hover:bg-pearl/60 hover:text-navy transition-colors"
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                  {label}
                </a>
              ))}
              <button
                type="button"
                onClick={handleCopy}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-navy/75 hover:bg-pearl/60 hover:text-navy transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" /> ¡Copiado!
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-4 h-4 text-gold-dark" /> Copiar enlace
                  </>
                )}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
