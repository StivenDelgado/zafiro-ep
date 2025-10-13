import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Play, Pause } from "lucide-react";

interface TrackSectionProps {
  title: string;
  duration: string;
  background: string;
  isActive: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const TrackSection = ({ title, duration, background, isActive, isPlaying, onTogglePlay }: TrackSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax effect: move background slower than scroll (more subtle)
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0.5]);
  const contentScale = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0.98]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full flex items-center justify-center overflow-hidden snap-start"
    >
      {/* Parallax background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <div 
          className="absolute inset-0 w-full h-[120%] bg-cover bg-center"
          style={{ backgroundImage: `url(${background})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/80" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity, scale: contentScale }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto will-change-transform"
      >
        <motion.div
          initial={false}
          animate={isActive ? { scale: 1 } : { scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <h2 className="font-display text-7xl md:text-8xl font-bold tracking-tighter text-foreground">
            {title}
          </h2>
          
          <p className="text-xl text-muted-foreground font-sans">
            {duration}
          </p>

          {/* Play button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onTogglePlay}
            className={`
              relative w-20 h-20 rounded-full flex items-center justify-center
              transition-all duration-300
              ${isActive && isPlaying 
                ? 'bg-primary shadow-[0_0_40px_rgba(166,20,32,0.6)]' 
                : 'bg-primary/20 border-2 border-primary hover:bg-primary/40'
              }
            `}
          >
            {isPlaying && isActive ? (
              <Pause className="w-8 h-8 text-foreground" />
            ) : (
              <Play className="w-8 h-8 text-foreground ml-1" />
            )}
          </motion.button>

          {/* Progress bar (shown when active) */}
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-md mx-auto mt-8"
            >
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: isPlaying ? "100%" : "0%" }}
                  transition={{ duration: 30, ease: "linear" }}
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TrackSection;
