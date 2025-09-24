import { Typography, Button } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const aiServices = [
  {
    title: "Face Detection",
    description: "Advanced AI-powered face detection with high accuracy and real-time processing",
    image: "/images/face-detection.jpg",
    link: "/face-reg"
  },
  {
    title: "Facemask Detection",
    description: "Ensure safety compliance with our automated facemask detection system",
    image: "/images/facemask-detection.jpg",
    link: "/face-reg"
  },
  {
    title: "OCR Technology",
    description: "Convert images and documents to editable text with our powerful OCR solution",
    image: "/images/ocr.jpg",
    link: "/services/ocr"
  }
];

export const Dashboard = () => {
  const navigate = useNavigate();

  const handleServiceClick = (link: string) => {
    navigate(link);
  };

  const handleExploreServices = () => {
    document.getElementById('services-section')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("/images/ai-background.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Typography
              variant="h1"
              className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight drop-shadow-lg"
            >
              AI-Powered Solutions for Tomorrow
            </Typography>
            <Typography className="text-white text-base md:text-lg mb-8 max-w-2xl mx-auto opacity-95 leading-relaxed">
              Leverage cutting-edge AI technology for face detection, mask compliance, and document processing with enterprise-grade accuracy.
            </Typography>
            <Button 
              size="lg" 
              onClick={handleExploreServices}
              className="bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 px-6 py-3"
            >
              Explore Our Services
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services-section" className="py-12 md:py-16 px-4 sm:px-6 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-12"
          >
            <Typography
              variant="h3"
              className="text-gray-800 text-xl md:text-2xl lg:text-3xl font-bold mb-4"
            >
              Our AI Services
            </Typography>
            <Typography className="text-gray-600 text-base max-w-2xl mx-auto">
              Discover our comprehensive suite of AI-powered solutions designed to meet your business needs
            </Typography>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {aiServices.map((service, index) => (
              <motion.div
                key={`service-${service.title}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group cursor-pointer transform hover:-translate-y-2"
                onClick={() => handleServiceClick(service.link)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5">
                  <Typography
                    variant="h5"
                    className="text-gray-800 mb-2 font-bold text-lg group-hover:text-blue-600 transition-colors"
                  >
                    {service.title}
                  </Typography>
                  <Typography className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {service.description}
                  </Typography>
                  <Button 
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 w-full transform group-hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleServiceClick(service.link);
                    }}
                  >
                    Try Now →
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "99.9%", label: "Accuracy Rate" },
              { number: "10K+", label: "Images Processed" },
              { number: "24/7", label: "Uptime" },
              { number: "< 1s", label: "Response Time" }
            ].map((stat, index) => (
              <motion.div
                key={`stat-${stat.label}-${index}`}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Typography className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                  {stat.number}
                </Typography>
                <Typography className="text-gray-600 font-medium text-sm">
                  {stat.label}
                </Typography>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-12 md:py-16 relative bg-white">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234B5563' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-12"
          >
            <Typography
              variant="h3"
              className="text-gray-800 text-xl md:text-2xl lg:text-3xl font-bold mb-4"
            >
              Get in Touch
            </Typography>
            <Typography className="text-gray-600 text-base max-w-2xl mx-auto">
              Have a question or want to collaborate? Feel free to reach out and let's discuss your AI needs!
            </Typography>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100"
            >
              <Typography variant="h5" className="text-gray-800 mb-6 font-bold">
                Connect With Me
              </Typography>
              <div className="space-y-4">
                <a
                  href="https://github.com/mario-noobs"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 group border border-transparent hover:border-gray-200"
                >
                  <div className="bg-gray-100 p-3 rounded-full group-hover:bg-gray-800 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <Typography className="font-semibold text-gray-700 group-hover:text-gray-900">
                      GitHub
                    </Typography>
                    <Typography className="text-sm text-gray-500">
                      @mario-noobs
                    </Typography>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/dungbtn/"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-blue-50 transition-all duration-300 group border border-transparent hover:border-blue-200"
                >
                  <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-600 transition-all duration-300">
                    <svg className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div>
                    <Typography className="font-semibold text-gray-700 group-hover:text-blue-700">
                      LinkedIn
                    </Typography>
                    <Typography className="text-sm text-gray-500">
                      dungbtn
                    </Typography>
                  </div>
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100"
            >
              <Typography variant="h5" className="text-gray-800 mb-6 font-bold">
                Send us a Message
              </Typography>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="What's this about?"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    placeholder="Tell us more about your project or question..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none resize-none"
                  ></textarea>
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 py-3 flex items-center justify-center space-x-2 transform hover:scale-105"
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