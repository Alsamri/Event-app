import { motion, useInView } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  CreditCard, 
  PlusSquare, 
  Sparkles, 
  ArrowRight,
  Zap,
  Heart,
  Users,
  TrendingUp,CheckCircle2
} from "lucide-react";
import { SignUpButton } from "@clerk/clerk-react";

export default function PremiumLanding() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const features = [
    {
      title: "Create Effortlessly",
      description: "Design, publish, and manage your events with a smooth, minimal interface built for speed.",
      icon: <PlusSquare className="w-8 h-8" />,
      gradient: "from-pink-500 via-rose-500 to-purple-600",
      iconBg: "from-pink-100 to-purple-100",
      darkIconBg: "from-pink-900/30 to-purple-900/30"
    },
    {
      title: "Secure Payments",
      description: "Integrated with Stripe for fast, global, and secure transactions — no setup hassle.",
      icon: <CreditCard className="w-8 h-8" />,
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      iconBg: "from-blue-100 to-cyan-100",
      darkIconBg: "from-blue-900/30 to-cyan-900/30"
    },
    {
      title: "Calendar Sync",
      description: "Add events directly to attendees' Google Calendar with one click.",
      icon: <Calendar className="w-8 h-8" />,
      gradient: "from-emerald-500 via-teal-500 to-green-500",
      iconBg: "from-emerald-100 to-green-100",
      darkIconBg: "from-emerald-900/30 to-green-900/30"
    },
    {
      title: "Grow Communities",
      description: "Build loyal audiences and transform them into thriving communities.",
      icon: <Sparkles className="w-8 h-8" />,
      gradient: "from-amber-500 via-orange-500 to-pink-500",
      iconBg: "from-amber-100 to-orange-100",
      darkIconBg: "from-amber-900/30 to-orange-900/30"
    }
  ];

  const stats = [
    { number: "20+", label: "Events Created", icon: <Calendar className="w-5 h-5" /> },
    { number: "10+", label: "Happy Users", icon: <Users className="w-5 h-5" /> },
    { number: "99.9%", label: "Uptime", icon: <Zap className="w-5 h-5" /> },
    { number: "24/7", label: "Support", icon: <Heart className="w-5 h-5" /> }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1]
      }
    }
  };

 

  const handleViewEvents = () => {
    navigate("/events");
  };

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-150/10 to-pink-150/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-150/20 to-cyan-150/10 rounded-full blur-3xl" />
      
     
      <section className="relative py-24 px-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
       
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200/50 dark:border-purple-700/50 mb-8 shadow-soft"
          >
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              The Future of Event Management
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
          >
            <span className="gradient-text-rainbow">
              EventX
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-6 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            The modern platform for creating and managing
            <span className="gradient-text-purple-pink font-bold"> unforgettable events</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto"
          >
            Simple, powerful tools for creators and communities
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
             
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group px-8 py-4 gradient-purple-pink text-white rounded-2xl font-semibold text-lg shadow-colored-purple hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            ><SignUpButton mode="modal">
  <motion.button>
    Get Started Free
  </motion.button>
</SignUpButton>
             
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <motion.button
              onClick={handleViewEvents}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 glass border-2 border-purple-200/50 dark:border-purple-700/50 text-pink-500 dark:text-purple-300 rounded-2xl font-semibold text-lg hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300"
            >
              Browse Events
            </motion.button>
          </motion.div>

          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-10 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            No credit card required • Free Events available
          </motion.p>
        </motion.div>
      </section>

    
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative py-16 px-6"
      >
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-3xl p-8 border border-white/20 dark:border-white/10 shadow-soft">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="text-center group cursor-default"
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-colored-purple group-hover:shadow-xl transition-shadow">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold gradient-text-purple-pink mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      
      <section ref={sectionRef} className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-700/50 mb-6 shadow-soft">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold gradient-text-blue-purple">
                Everything you need
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Powerful features for
              <span className="gradient-text-purple-pink"> modern creators</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              All the tools you need to create, manage, and grow your events — beautifully designed and incredibly simple
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative h-full glass rounded-3xl p-8 border border-white/20 dark:border-white/10 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.iconBg} dark:bg-gradient-to-br dark:${feature.darkIconBg} shadow-soft group-hover:shadow-colored-purple transition-shadow duration-300 mb-6`}>
                      <div className={`bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`}>
                        {feature.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 group-hover:gradient-text-purple-pink transition-all duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                 
                  <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.gradient} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-500`} />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

     
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative py-24 px-6 mb-12"
      >
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl gradient-purple-pink p-12 shadow-colored-purple">
           
            <div className="absolute inset-0 bg-dots-pattern opacity-5" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
            
            <div className="relative z-10 text-center text-white">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="inline-flex p-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 mb-6"
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                Ready to get started?
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-xl mb-10 text-white/90 max-w-2xl mx-auto"
              >
                Join creators who trust EventX for their events
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-white text-purple-600 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
                ><SignUpButton mode="modal">
  <motion.button>
    Get Started Free
  </motion.button>
</SignUpButton>
                
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <motion.button
                  onClick={handleViewEvents}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 border-2 border-white/40 text-white rounded-2xl font-semibold backdrop-blur-sm hover:bg-white/10 hover:border-white/60 transition-all duration-300"
                >
                  Explore Events
                </motion.button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                viewport={{ once: true }}
                className="mt-8 text-white/70 text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                No credit card required • Free Events available
              </motion.p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}


