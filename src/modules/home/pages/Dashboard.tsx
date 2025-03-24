import { Typography, Button } from "@material-tailwind/react";
import { motion } from "framer-motion";

const aiServices = [
  {
    title: "Face Detection",
    description: "Advanced AI-powered face detection with high accuracy and real-time processing",
    image: "/images/face-detection.jpg",
    link: "/services/face-detection"
  },
  {
    title: "Facemask Detection",
    description: "Ensure safety compliance with our automated facemask detection system",
    image: "/images/facemask-detection.jpg",
    link: "/services/facemask-detection"
  },
  {
    title: "OCR Technology",
    description: "Convert images and documents to editable text with our powerful OCR solution",
    image: "/images/ocr.jpg",
    link: "/services/ocr"
  }
];

export const Dashboard = () => {

  return (
    <div className="overflow-y-auto h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center bg-gradient-to-r from-blue-600 to-blue-400">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("/images/ai-background.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h1" className="text-white text-5xl font-bold mb-6">
              AI-Powered Solutions for Tomorrow
            </Typography>
            <Typography className="text-white text-xl mb-8 max-w-2xl opacity-90">
              Leverage cutting-edge AI technology for face detection, mask compliance, and document processing.
            </Typography>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Explore Services
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <Typography variant="h3" className="text-gray-800 text-center mb-12 text-3xl font-bold">
            Our AI Services
          </Typography>
          <div className="grid md:grid-cols-3 gap-8">
            {aiServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-6">
                  <Typography variant="h5" className="text-gray-800 mb-2 font-semibold">
                    {service.title}
                  </Typography>
                  <Typography className="text-gray-600 mb-4">
                    {service.description}
                  </Typography>
                  <Button 
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 transition-colors"
                  >
                    Learn More
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-20 relative">
        {/* AI-themed background pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234B5563' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Typography variant="h3" className="text-gray-800 text-4xl font-bold mb-4">
              Get in Touch
            </Typography>
            <Typography className="text-gray-600 max-w-2xl mx-auto">
              Have a question or want to collaborate? Feel free to reach out!
            </Typography>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <Typography variant="h5" className="text-gray-800 mb-6 font-semibold">
                Connect With Me
              </Typography>
              <div className="space-y-6">
                <a 
                  href="https://github.com/mario-noobs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-all group"
                >
                  <div className="bg-gray-100 p-3 rounded-full group-hover:bg-gray-200 transition-colors">
                    <svg className="w-6 h-6 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <Typography className="font-medium text-gray-700">GitHub</Typography>
                    <Typography className="text-sm text-gray-500">@mario-noobs</Typography>
                  </div>
                </a>
                <a 
                  href="https://www.linkedin.com/in/dungbtn/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-all group"
                >
                  <div className="bg-gray-100 p-3 rounded-full group-hover:bg-gray-200 transition-colors">
                    <svg className="w-6 h-6 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div>
                    <Typography className="font-medium text-gray-700">LinkedIn</Typography>
                    <Typography className="text-sm text-gray-500">dungbtn</Typography>
                  </div>
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg backdrop-blur-sm bg-white/90"
            >
              <form className="space-y-6">
                <div className="space-y-2">
                  <Typography className="text-sm font-medium text-gray-700">Name</Typography>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Typography className="text-sm font-medium text-gray-700">Email</Typography>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Typography className="text-sm font-medium text-gray-700">Subject</Typography>
                  <input
                    type="text"
                    placeholder="How can I help you?"
                    className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Typography className="text-sm font-medium text-gray-700">Message</Typography>
                  <textarea
                    placeholder="Your message here..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all"
                  ></textarea>
                </div>
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600 transition-all py-3 flex items-center justify-center space-x-2"
                  size="lg"
                >
                  <span>Send Message</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;