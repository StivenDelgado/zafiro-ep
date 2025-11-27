import { useState, useEffect, useRef } from "react";
import Hero from "@/components/Hero";
import TrackSection from "@/components/TrackSection";
import MiniPlayer from "@/components/MiniPlayer";
import BehindTheAlbum from "@/components/BehindTheAlbum";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

import track1Bg from "@/assets/track-1-bg.jpg";
import track2Bg from "@/assets/track-2-bg.jpg";
import rosasAudio from "@/audio/MASTER ROSAS EN LA TINA.wav";
import bottegaAudio from "@/audio/BOTTEGA VENETA V12.wav";

const tracks = [
  { title: "ROSAS EN LA TINA", duration: "3:21", background: track1Bg, audio: rosasAudio },
  { title: "BOTTEGA VENETA", duration: "4:05", background: track2Bg, audio: bottegaAudio },
];

const Index = () => {
  const [activeTrackIndex, setActiveTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    if (typeof index === "number") {
      if (index === activeTrackIndex) {
        setIsPlaying((prev) => !prev);
      } else {
        setActiveTrackIndex(index);
        setIsPlaying(true);
      }
      return;
    }

    if (activeTrackIndex === null) {
      setActiveTrackIndex(0);
      setIsPlaying(true);
      return;
    }

    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (activeTrackIndex === null) {
      audio.pause();
      audio.currentTime = 0;
      return;
    }

    audio.load();
    if (isPlaying) {
      audio
        .play()
        .catch(() => setIsPlaying(false));
    }
  }, [activeTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || activeTrackIndex === null) return;

    if (isPlaying) {
      audio
        .play()
        .catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, activeTrackIndex]);

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };


  return (
    <div className="scroll-smooth">
      <div className="snap-y snap-mandatory h-screen overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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

      <audio
        ref={audioRef}
        src={activeTrackIndex !== null ? tracks[activeTrackIndex].audio : undefined}
        onEnded={handleAudioEnded}
        preload="auto"
      />
    </div>
  );
};

export default Index;
