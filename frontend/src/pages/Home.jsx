/**
 * StadiumPilot AI — Home Page
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { HiArrowRight, HiSparkles } from "react-icons/hi";
import FeatureCard from "../components/FeatureCard";

const features = [
  {
    title: "AI Stadium Assistant",
    description:
      "Ask anything about the stadium — gates, food, restrooms, medical centers, parking, and more.",
    icon: "🤖",
    link: "/assistant",
    color: "purple",
  },
  {
    title: "Live Dashboard",
    description:
      "Real-time crowd analytics, KPIs, zone occupancy, alerts, and operational intelligence.",
    icon: "📊",
    link: "/dashboard",
    color: "magenta",
  },
  {
    title: "Operations Copilot",
    description:
      "AI-powered recommendations for crowd management, gate operations, and emergency response.",
    icon: "⚙️",
    link: "/operations",
    color: "teal",
  },
  {
    title: "Transport Intelligence",
    description:
      "Metro, bus, taxi, rideshare, and parking — real-time availability and AI guidance.",
    icon: "🚌",
    link: "/transport",
    color: "gold",
  },
  {
    title: "Accessibility Support",
    description:
      "Wheelchair routes, accessible facilities, medical assistance, and volunteer support.",
    icon: "♿",
    link: "/accessibility",
    color: "green",
  },
  {
    title: "Multilingual AI",
    description:
      "Get answers in English, Spanish, French, Arabic, Hindi, Japanese, and more.",
    icon: "🌍",
    link: "/assistant",
    color: "red",
  },
];

const Home = () => {
  return (
    <main className="flex-1 overflow-y-auto" role="main" aria-label="StadiumPilot AI Home">
      <Helmet>
        <title>StadiumPilot AI — Home</title>
        <meta name="description" content="Welcome to StadiumPilot AI, the definitive intelligence platform for the FIFA World Cup." />
      </Helmet>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-12 overflow-hidden"
      >
        <div className="relative glass-card p-8 lg:p-12 overflow-hidden">
          {/* Animated Background Gradient Orbs */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-fifa-purple/20 blur-[100px] animate-pulse-slow" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-fifa-magenta/15 blur-[100px] animate-float" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-fifa-teal/10 blur-[80px] animate-pulse-slow"
            style={{ animationDelay: "1.5s" }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="px-3 py-1 rounded-full bg-fifa-gradient text-xs font-bold text-white flex items-center gap-1.5 shadow-sm">
                <HiSparkles className="w-3.5 h-3.5" />
                Powered by Groq
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                FIFA World Cup 2026
              </div>
            </div>

            <h1 className="text-4xl lg:text-6xl font-black mb-4">
              <span className="gradient-text">StadiumPilot</span>
              <span className="text-text-primary"> AI</span>
            </h1>

            <p className="text-lg text-text-muted max-w-2xl mb-8 leading-relaxed">
              Enterprise-grade AI platform for stadium operations and fan
              experience. Navigate the stadium, get real-time crowd
              intelligence, and access AI-powered assistance — all at your
              fingertips.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/assistant"
                className="btn-primary flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-purple focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              >
                <HiSparkles className="w-4 h-4" />
                Start Chatting
                <HiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/dashboard"
                className="btn-secondary flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-purple focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              >
                View Dashboard
                <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Bar */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
      >
        {[
          { label: "Stadium Capacity", value: "82,500" },
          { label: "AI Response Time", value: "<2s" },
          { label: "Languages Supported", value: "6+" },
          { label: "Data Points", value: "50+" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4 text-center">
            <p className="text-2xl font-bold gradient-text">{stat.value}</p>
            <p className="text-xs text-text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.section>

      {/* Feature Cards */}
      <section>
        <h2 className="section-title">🚀 Platform Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} delay={0.1 * i} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 pt-8 border-t border-border text-center pb-8"
      >
        <p className="text-sm text-text-muted">
          Built for the{" "}
          <span className="text-text-primary font-semibold">
            FIFA World Cup 2026 GenAI Challenge
          </span>
        </p>
        <p className="text-xs text-text-muted mt-1">
          Powered by Groq · React · FastAPI
        </p>
      </motion.footer>
    </main>
  );
};

export default Home;
