import { motion } from "framer-motion";
import { ArrowRight, Code, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-accent/5 to-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-6"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">
              Welcome to my Portfolio
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="gradient-text">Nhlanhla Malaza</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-4"
          >
            Full Stack Developer & Tech Enthusiast
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8"
          >
            A passionate software developer, willing to learn and adapt to any software environment. I am always striving to improve myself and my skills. I enjoy working with others and within a team.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link to="/contact" className="px-8 py-4 rounded-full border border-border bg-card/50 text-foreground font-semibold hover:bg-card transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Get In Touch
            </Link>
            <a
              href="https://fxw7x7luycssvogx.public.blob.vercel-storage.com/pdf/Nhlanhla_Junior_Malaza%20CV.pdf"
              target="_blank"
              className="px-8 py-4 rounded-full gradient-bg text-foreground font-semibold hover:opacity-90 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Resume
              <ArrowRight className="w-4 h-4" />
            </a>

          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex gap-8 mt-12 justify-center lg:justify-start"
          >
            {[
              { value: "5+", label: "Years Experience" },
              { value: "10+", label: "Projects Completed" },
              { value: "3+", label: "Happy Clients" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Animated Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative flex items-center justify-center"
        >
          <div className="relative w-80 h-80 md:w-96 md:h-96">
            {/* Gradient Ring */}
            <div className="absolute inset-0 rounded-full gradient-bg opacity-20 animate-pulse-slow" />
            <div className="absolute inset-4 rounded-full bg-background" />

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 right-8 p-4 rounded-xl bg-card border border-border shadow-xl"
            >
              <Code className="w-8 h-8 text-accent" />
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-12 left-4 p-4 rounded-xl bg-card border border-border shadow-xl"
            >
              <Zap className="w-8 h-8 text-primary" />
            </motion.div>

            <motion.div
              animate={{ y: [-5, 15, -5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 -right-4 p-4 rounded-xl bg-card border border-border shadow-xl"
            >
              <Sparkles className="w-8 h-8 text-accent" />
            </motion.div>

            {/* Center Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl md:text-8xl font-bold gradient-text mb-2">
                  {"</>"}
                </div>
                <p className="text-muted-foreground">Building the Future</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex justify-center pt-2"
        >
          <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};
