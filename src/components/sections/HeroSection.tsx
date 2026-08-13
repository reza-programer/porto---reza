'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiEye,
  FiCheckCircle,
} from 'react-icons/fi';
import type { Profile } from '@/types';

interface HeroSectionProps {
  profile: Profile;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-28 pb-20 relative overflow-hidden section-cream mesh-blob-1 dot-matrix"
    >
      {/* Decorative corner elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#edf1eb]/30 via-transparent to-transparent rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#edf1eb]/40 via-transparent to-transparent rounded-tr-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#edf1eb] text-[#3b4d35] border border-[#dce4db] mb-6 shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-[#5c7254]" />
                Available for New Roles &amp; Freelance
              </motion.div>

              {/* Mono greeting */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="text-xs font-mono tracking-widest text-[#5c7254] uppercase mb-3"
              >
                // Hello, I am {profile.name}
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.1] text-[#20261e]"
              >
                Junior Fullstack Developer &amp;{' '}
                <span className="text-[#3b4d35]">
                  Manual Quality Assurance
                </span>
              </motion.h1>

              {/* Bio */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="mt-5 text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed mx-auto lg:mx-0"
              >
                {profile.bio}
              </motion.p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <a
                href="#projects"
                className="px-7 py-3.5 bg-[#3b4d35] hover:bg-[#2d3a28] text-white font-bold text-sm rounded-full shadow-xs hover:shadow-md transition-all flex items-center gap-2"
              >
                Explore Projects <FiArrowRight className="w-4 h-4" />
              </a>

              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 border border-[#dce4db] text-slate-700 font-semibold text-sm rounded-full transition-all flex items-center gap-2 shadow-xs"
                >
                  Lihat CV <FiEye className="w-4 h-4 text-[#5c7254]" />
                </a>
              )}
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: 0.45 }}
              className="mt-12 pt-8 border-t border-[#dce4db] grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <div className="text-3xl font-extrabold text-[#20261e]">{profile.stats.projectsCompleted}+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Projects Done</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, delay: 0.55 }}
              >
                <div className="text-3xl font-extrabold text-[#20261e]">{profile.stats.yearsExperience}+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Years Exp.</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <div className="text-3xl font-extrabold text-[#20261e]">{profile.stats.certificatesEarned}+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Certifications</div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Clean Sage Photo Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative shrink-0 order-1 lg:order-2"
          >
            {/* Outer Card */}
            <div className="relative bg-white border border-[#dce4db] rounded-3xl p-3 shadow-lg w-72 sm:w-80 lg:w-96">
              <div className="relative rounded-2xl overflow-hidden aspect-3/4 bg-[#edf1eb]">
                <img
                  src={profile.avatar || '/images/profile.png'}
                  alt={profile.name}
                  className="w-full h-full object-cover object-top hover:scale-103 transition-transform duration-500"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                {/* Card Footer */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xs font-mono text-[#dce4db] flex items-center gap-1.5 mb-0.5">
                    <FiCheckCircle className="w-3.5 h-3.5 text-[#edf1eb]" /> Fullstack &amp; QA
                  </div>
                  <h3 className="font-bold text-lg text-white">{profile.name}</h3>
                  <p className="text-xs text-[#dce4db] font-medium">{profile.title}</p>
                </div>
              </div>

              {/* Floating Pill Tag 1 */}
              <div className="absolute -top-3 -left-4 bg-white border border-[#dce4db] rounded-xl px-3.5 py-2 shadow-md flex items-center gap-2 z-20 text-xs font-semibold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5c7254]" />
                Fullstack Web Dev
              </div>

              {/* Floating Pill Tag 2 */}
              <div className="absolute -bottom-3 -right-4 bg-white border border-[#dce4db] rounded-xl px-3.5 py-2 shadow-md flex items-center gap-2 z-20 text-xs font-semibold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8fa382]" />
                Manual QA &amp; Testing
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
