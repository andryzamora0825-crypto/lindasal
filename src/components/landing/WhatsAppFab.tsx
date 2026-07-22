"use client";

import { motion } from "framer-motion";

const WA_LINK = "https://wa.me/message/MYAWP2XPANQSH1";

export default function WhatsAppFab() {
  return (
    <motion.a
      initial={{ opacity: 0, scale: 0.5, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.92 }}
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-6 right-6 z-[85] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_36px_-10px_rgba(37,211,102,0.65)]"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#25D366]/50 animate-ping [animation-duration:2.5s]"
      />
      <svg viewBox="0 0 24 24" fill="currentColor" className="relative h-7 w-7">
        <path d="M12 2a10 10 0 0 0-8.5 15.32L2 22l4.82-1.45A10 10 0 1 0 12 2Zm0 18.18c-1.5 0-2.97-.4-4.25-1.16l-.3-.18-2.86.86.86-2.79-.2-.32A8.18 8.18 0 1 1 12 20.18Zm4.47-5.8c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.73-.65-1.22-1.45-1.36-1.69-.14-.24-.02-.38.1-.5.11-.11.25-.28.37-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.3-.22.24-.85.83-.85 2.04 0 1.2.87 2.37 1 2.53.12.16 1.72 2.63 4.17 3.69.58.25 1.04.4 1.39.51.59.19 1.12.16 1.54.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
      </svg>
    </motion.a>
  );
}
