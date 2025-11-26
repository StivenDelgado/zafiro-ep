import { motion } from "framer-motion";
import studio1 from "@/assets/behind-studio-1.jpg";
import studio2 from "@/assets/behind-studio-2.jpg";
import studio3 from "@/assets/behind-studio-3.jpg";
import studio4 from "@/assets/behind-studio-4.jpg";
import studio5 from "@/assets/behind-studio-5.jpg";

const BehindTheAlbum = () => {
  const images = [
    { src: studio1, alt: "Sesión de grabación", className: "col-span-2 row-span-2" },
    { src: studio2, alt: "Escribiendo letras", className: "col-span-1 row-span-1" },
    { src: studio3, alt: "Producción musical", className: "col-span-1 row-span-2" },
    { src: studio4, alt: "Waveforms", className: "col-span-2 row-span-1" },
    { src: studio5, alt: "En cabina", className: "col-span-1 row-span-1" },
  ];

  return (
    <section className="relative py-32 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-5xl md:text-6xl font-bold tracking-tighter mb-6 text-foreground">
            DETRÁS DE ZAFIRO
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-sans leading-relaxed">
            ZAFIRO nace de la noche, de sesiones infinitas en el estudio donde el arte cobra vida. 
            Cada track es una gema pulida con dedicación, donde los beats y las melodías se cristalizan 
            en un sonido único. Un proceso íntimo que captura la esencia de la creación musical.
          </p>
        </motion.div>

        {/* Collage Gallery */}
        <div className="grid grid-cols-3 md:grid-cols-4 auto-rows-[200px] gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, rotate: index % 2 === 0 ? -2 : 2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, rotate: index % 2 === 0 ? 1 : -1, zIndex: 10 }}
              className={`relative rounded-lg overflow-hidden group cursor-pointer shadow-elegant ${image.className}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-300" />
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  boxShadow: 'inset 0 0 60px hsl(var(--primary) / 0.4)',
                }}
              />
              {/* Label */}
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-foreground font-display text-sm tracking-wider">
                  {image.alt.toUpperCase()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BehindTheAlbum;
