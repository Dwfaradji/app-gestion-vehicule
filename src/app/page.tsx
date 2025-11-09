"use client";

import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Car, BarChart3, Wrench, Shield } from "lucide-react";
import { useEffect } from "react";

export default function FleetLandingPage() {
  const router = useRouter();
  const controls = useAnimation();
  const scrollY = useMotionValue(0);

  // Parallax halo
  const haloY = useTransform(scrollY, [0, 500], [0, -20]);

  // Parallax léger pour features & logos
  const featureOffset = useTransform(scrollY, [0, 500], [0, -15]);

  useEffect(() => {
    controls.start({
      scale: [1, 1.05, 1],
      opacity: [0.6, 0.3, 0.6],
      transition: { duration: 3, repeat: Infinity },
    });

    const handleScroll = () => scrollY.set(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls, scrollY]);

  return (
    <main className="relative min-h-screen flex flex-col overflow-x-hidden bg-white text-gray-900">
      {/* BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/backgroundCars.jpg"
          alt="flotte automobile"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white/40 to-blue-100/40" />
      </div>

      {/* HERO */}
      <section className="relative z-10 flex flex-col items-center justify-center flex-1 text-center px-8 py-24">
        <motion.div
          animate={controls}
          style={{ y: haloY }}
          className="absolute -top-20 w-[300px] h-[300px] bg-blue-400 rounded-full blur-[120px] opacity-30"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto relative z-10"
        >
          <div className="flex justify-center mb-8">
            <div className="bg-white/20 p-6 rounded-full shadow-lg backdrop-blur-md">
              <Car className="text-blue-600" size={56} />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
            Devevoke Fleet
          </h1>

          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-10 max-w-2xl mx-auto">
            Gérez votre flotte automobile avec une interface moderne et des outils professionnels.
            Suivi des véhicules, des conducteurs et des coûts en un seul endroit.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/login")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
          >
            Accéder à mon espace
          </motion.button>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-8 bg-white z-10 relative">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">Fonctionnalités clés</h2>
          <p className="text-gray-600 mt-3">
            Tout ce dont vous avez besoin pour gérer efficacement votre flotte automobile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: <Wrench className="text-blue-600" size={36} />,
              title: "Suivi des entretiens",
              desc: "Planifiez et suivez les entretiens pour anticiper chaque intervention.",
            },
            {
              icon: <BarChart3 className="text-blue-600" size={36} />,
              title: "Tableaux de bord",
              desc: "Analysez vos dépenses et performances en temps réel.",
            },
            {
              icon: <Shield className="text-blue-600" size={36} />,
              title: "Sécurité & conformité",
              desc: "Assurez la conformité réglementaire de tous vos véhicules.",
            },
            {
              icon: <Car className="text-blue-600" size={36} />,
              title: "Gestion du parc",
              desc: "Centralisez les données de chaque véhicule et pilotez votre flotte facilement.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              style={{ y: featureOffset }}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -5, scale: 1.05, transition: { duration: 0.3 } }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-8 shadow-md hover:shadow-xl transition text-center"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CLIENTS */}
      {/*<section className="py-20 px-8 bg-gray-50 z-10 relative">*/}
      {/*    <div className="max-w-6xl mx-auto text-center mb-14">*/}
      {/*        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">*/}
      {/*            Confié par des entreprises de confiance*/}
      {/*        </h2>*/}
      {/*        <p className="text-gray-600 mt-3">*/}
      {/*            Nos clients utilisent Devevoke Fleet pour optimiser leur gestion de flotte automobile.*/}
      {/*        </p>*/}
      {/*    </div>*/}

      {/*    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 max-w-5xl mx-auto items-center justify-items-center">*/}
      {/*        {["logo1.png","logo2.png","logo3.png","logo4.png","logo5.png","logo6.png"].map((logo,i)=>(*/}
      {/*            <motion.div*/}
      {/*                key={i}*/}
      {/*                style={{ y: logoOffset }}*/}
      {/*                initial={{opacity:0,y:20}}*/}
      {/*                whileInView={{opacity:1,y:0}}*/}
      {/*                transition={{delay:i*0.1}}*/}
      {/*                viewport={{once:true}}*/}
      {/*                className="flex items-center justify-center"*/}
      {/*            >*/}
      {/*                <Image src={`/${logo}`} alt={`Logo client ${i+1}`} width={100} height={50}/>*/}
      {/*            </motion.div>*/}
      {/*        ))}*/}
      {/*    </div>*/}
      {/*</section>*/}

      {/* FOOTER */}
      <footer className="py-10 text-center text-gray-500 text-sm border-t border-gray-200 bg-white z-10 relative">
        <p>© {new Date().getFullYear()} Devevoke — Gestion de flotte automobile</p>
        <p className="mt-2">
          <a href="mailto:contact@devevoke.com" className="text-blue-600 hover:underline">
            contact@devevoke.com
          </a>
        </p>
      </footer>
    </main>
  );
}
