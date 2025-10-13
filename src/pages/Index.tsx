import { useState, useEffect, useRef } from "react";
import Hero from "@/components/Hero";
import TrackSection from "@/components/TrackSection";
import MiniPlayer from "@/components/MiniPlayer";
import BehindTheAlbum from "@/components/BehindTheAlbum";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

import axm1Bg from "@/assets/axm-1-bg.jpg";
import axm2Bg from "@/assets/axm-2-bg.jpg";
import axm3Bg from "@/assets/axm-3-bg.jpg";
import axm4Bg from "@/assets/axm-4-bg.jpg";

const tracks = [
  { title: "AXM I", duration: "3:21", background: axm1Bg },
  { title: "AXM II", duration: "4:05", background: axm2Bg },
  { title: "AXM III", duration: "2:58", background: axm3Bg },
  { title: "AXM IV", duration: "3:47", background: axm4Bg },
];

const Index = () => {
  const [activeTrackIndex, setActiveTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = trackRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) {
            setActiveTrackIndex(index);
            // Auto-play when track comes into view (respecting autoplay policies)
            setIsPlaying(true);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    trackRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      trackRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const handleTogglePlay = (index?: number) => {
    if (index !== undefined) {
      setActiveTrackIndex(index);
    }
    setIsPlaying(!isPlaying);
  };


  return (
    <div className="scroll-smooth">
      <div className="snap-y snap-mandatory h-screen overflow-y-auto">
        <Hero />
        
        {tracks.map((track, index) => (
          <div
            key={track.title}
            ref={(el) => (trackRefs.current[index] = el)}
          >
            <TrackSection
              title={track.title}
              duration={track.duration}
              background={track.background}
              isActive={activeTrackIndex === index}
              isPlaying={isPlaying && activeTrackIndex === index}
              onTogglePlay={() => handleTogglePlay(index)}
            />
          </div>
        ))}
      </div>

      <BehindTheAlbum />
      <CTASection />
      <Footer />

      <MiniPlayer
        currentTrack={activeTrackIndex !== null ? tracks[activeTrackIndex]?.title : null}
        isPlaying={isPlaying}
        onTogglePlay={() => handleTogglePlay()}
      />
    </div>
  );
};

export default Index;
