"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Team members data
const teamMembers = [
  {
    name: "Ahmed Rahman",
    title: "Chief Executive Officer",
    bio: "With over 20 years of experience in luxury hospitality, Ahmed brings unparalleled vision and leadership to La Safari Hotel.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
  {
    name: "Sophia Chen",
    title: "Operations Director",
    bio: "Sophia ensures that every aspect of your stay meets our exacting standards of excellence and luxury.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
  },
  {
    name: "James Rodriguez",
    title: "Executive Chef",
    bio: "Award-winning Chef James creates culinary masterpieces that blend international techniques with local flavors.",
    image: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
  {
    name: "Aisha Patel",
    title: "Guest Relations Manager",
    bio: "Aisha's dedication to personalized service ensures that every guest feels welcomed and valued.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80",
  },
];

// Timeline events
const milestones = [
  {
    year: 2005,
    title: "Breaking Ground",
    description: "Construction began on what would become the crown jewel of Kenya's luxury hospitality."
  },
  {
    year: 2008,
    title: "Grand Opening",
    description: "La Safari Hotel welcomed its first guests, setting a new standard for luxury in East Africa."
  },
  {
    year: 2012,
    title: "First Expansion",
    description: "The addition of our renowned spa and wellness center enhanced our offerings."
  },
  {
    year: 2016,
    title: "Five-Star Recognition",
    description: "Awarded prestigious five-star status, recognizing our commitment to excellence."
  },
  {
    year: 2020,
    title: "Sustainability Initiative",
    description: "Launched comprehensive sustainability program, balancing luxury with environmental responsibility."
  },
  {
    year: 2023,
    title: "Digital Transformation",
    description: "Introduced state-of-the-art digital services while maintaining our personal touch."
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80"
          alt="La Safari Hotel"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight"
          >
            <span className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-700 bg-clip-text text-transparent">
              Our Story
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl text-xl text-gray-200"
          >
            Excellence and luxury redefined on Kenya's breathtaking coast
          </motion.p>
        </div>
      </div>

      {/* Our Vision Section */}
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-6 text-yellow-800">Our Vision</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            At La Safari Hotel, we envision a sanctuary where luxury meets authentic African hospitality. Our mission is to create unforgettable experiences that blend the rich cultural heritage of Kenya with world-class service and amenities.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            We strive to be more than just a place to stay—we aim to be a destination that captures the essence of luxury, comfort, and cultural immersion, leaving our guests with memories that last a lifetime.
          </p>
        </motion.div>

        {/* Values */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {[
            {
              title: "Excellence",
              description: "We pursue perfection in every detail, from the design of our spaces to the quality of our service.",
              icon: "✨"
            },
            {
              title: "Authenticity",
              description: "We celebrate and share the rich cultural heritage of Kenya while providing modern luxury.",
              icon: "🌍"
            },
            {
              title: "Sustainability",
              description: "We are committed to responsible luxury that respects and preserves our natural environment.",
              icon: "🌱"
            }
          ].map((value, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300 border-t-4 border-yellow-600"
            >
              <span className="text-4xl mb-4 block">{value.icon}</span>
              <h3 className="text-xl font-bold mb-3 text-yellow-800">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Timeline Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl font-bold mb-12 text-center text-yellow-800"
          >
            Our Journey
          </motion.h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-yellow-200 h-full"></div>

            {/* Timeline events */}
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div className="flex-1"></div>
                <div className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-yellow-600 shadow-lg text-white font-bold">
                  {milestone.year}
                </div>
                <div className="flex-1 p-6 bg-white rounded-lg shadow-lg ml-6 mr-6 hover:shadow-xl transition-shadow duration-300 max-w-xs">
                  <h3 className="text-xl font-bold mb-2 text-yellow-800">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-6 text-yellow-800">Our Leadership Team</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Meet the visionaries behind La Safari Hotel who bring decades of experience in luxury hospitality and a passion for excellence.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <p className="text-white text-sm">{member.bio}</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-yellow-800">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.title}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Call to Action */}
      <div className="bg-yellow-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Experience Our Legacy of Luxury</h2>
          <p className="max-w-2xl mx-auto mb-8 text-yellow-100">
            Join us for an unforgettable stay where every moment is crafted with care and every detail speaks of excellence.
          </p>
          <Link href="/reservations">
            <Button className="px-8 py-3 bg-white text-yellow-800 rounded-lg font-semibold hover:bg-yellow-100 transition-colors shadow-lg">
              Book Your Experience
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
