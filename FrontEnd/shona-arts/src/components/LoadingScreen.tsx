import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-gallery-paper dark:bg-zinc-950">
      <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 1.4 }} className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-gallery-red border-t-transparent" />
        <p className="font-display text-3xl font-extrabold text-gallery-red">Shona Arts</p>
      </motion.div>
    </div>
  );
}
