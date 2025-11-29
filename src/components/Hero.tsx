import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import albumCover from "@/assets/zafiro-cover.jpg";

const BOGOTA_OFFSET_MS = 5 * 60 * 60 * 1000; // UTC-5
const RELEASE_WEEKDAY = 6; // Saturday
const RELEASE_HOUR = 20; // 8 PM

interface Countdown {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

const getNextReleaseDate = () => {
  const now = new Date();
  const bogotaNow = new Date(now.getTime() - BOGOTA_OFFSET_MS);
  const target = new Date(bogotaNow);
  const currentDay = target.getUTCDay();
  let daysToAdd = (RELEASE_WEEKDAY - currentDay + 7) % 7;

  if (daysToAdd === 0 && target.getUTCHours() >= RELEASE_HOUR) {
    daysToAdd = 7;
  }

  target.setUTCDate(target.getUTCDate() + daysToAdd);
  target.setUTCHours(RELEASE_HOUR, 0, 0, 0);

  return new Date(target.getTime() + BOGOTA_OFFSET_MS);
};

const getCountdownValues = (releaseDate: Date): Countdown => {
  const diff = Math.max(0, releaseDate.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (value: number) => value.toString().padStart(2, "0");

  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  };
};

const Hero = () => {
  const [releaseDate, setReleaseDate] = useState<Date>(() => getNextReleaseDate());
  const [countdown, setCountdown] = useState<Countdown>(() => getCountdownValues(releaseDate));

  useEffect(() => {
    const updateCountdown = () => {
      const diff = releaseDate.getTime() - Date.now();

      if (diff <= 0) {
        const nextRelease = getNextReleaseDate();
        setReleaseDate(nextRelease);
        setCountdown(getCountdownValues(nextRelease));
        return;
      }

      setCountdown(getCountdownValues(releaseDate));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [releaseDate]);

  const releaseLabel = useMemo(
    () =>
      releaseDate
        .toLocaleDateString("es-CO", {
          timeZone: "America/Bogota",
          weekday: "long",
          day: "numeric",
          month: "long",
        })
        .toUpperCase(),
    [releaseDate]
  );

  const countdownDisplay = `${countdown.days} : ${countdown.hours} : ${countdown.minutes} : ${countdown.seconds}`;

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center snap-start">
      {/* Background with parallax */}
      <motion.div
        className="absolute inset-0 z-0 bg-black"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${albumCover})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-display text-8xl md:text-9xl font-bold tracking-tighter mb-4 text-foreground"
        >
          ZAFIRO
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-2xl md:text-3xl font-display font-semibold tracking-wide mb-8 text-muted-foreground"
        >
          KREMA
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-secondary text-foreground font-display text-lg px-8 py-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(166,20,32,0.6)]"
          >
            <a
              href="https://open.spotify.com/album/38VgiupEwu3tRve2oqFgqs?si=ZFNAoOl4SZefr6qeOVTgkA"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Play className="mr-2 h-5 w-5" />
              ESCUCHAR AHORA
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-foreground hover:bg-primary/10 font-display text-lg px-8 py-6 transition-all duration-300"
          >
            PRE-SAVE
          </Button>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="text-sm text-muted-foreground font-sans"
        >
          LANZAMIENTO EN
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="font-display text-4xl font-bold text-primary mt-2"
        >
          {countdownDisplay}
        </motion.div>

        {/* Streaming platforms */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex gap-6 justify-center mt-12"
        >
          <a
            href="https://open.spotify.com/artist/4k07OUNOsurHyNNFaxSM3c?si=2BaW7lTuRwelSOpbW6B4hw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
          </a>
          <a
            href="https://www.youtube.com/channel/UCDrRsSx4zZVqMFppwZR0aug"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M23.994 6.124a2.996 2.996 0 00-2.109-2.124C20.058 3.5 12 3.5 12 3.5s-8.057 0-9.885.5A2.996 2.996 0 00.006 6.124 31.933 31.933 0 000 12a31.933 31.933 0 00.006 5.876 2.996 2.996 0 002.109 2.124c1.828.5 9.885.5 9.885.5s8.057 0 9.885-.5a2.996 2.996 0 002.109-2.124A31.933 31.933 0 0024 12a31.933 31.933 0 00-.006-5.876zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
          </a>
          <a
            href="https://music.apple.com/co/artist/krema/1840102950"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" /></svg>
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-primary rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
