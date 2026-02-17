import { Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import {
  FaceSmileIcon,
  ShieldExclamationIcon,
  DocumentTextIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const aiServices = [
  {
    title: "Face Detection & Recognition",
    description: "AI-powered face detection with high accuracy and real-time processing.",
    link: "/face-regconize",
    icon: FaceSmileIcon,
    isAvailable: true,
  },
  {
    title: "Facemask Detection",
    description: "Detect whether individuals are wearing face masks in real-time.",
    link: "/face-mask",
    icon: ShieldExclamationIcon,
    isAvailable: false,
  },
  {
    title: "OCR Technology",
    description: "Extract and convert text from images and scanned documents.",
    link: "/services/ocr",
    icon: DocumentTextIcon,
    isAvailable: false,
  },
];

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <Typography variant="h4" className="text-gray-900 font-semibold">
            Dashboard
          </Typography>
          <Typography className="text-gray-500 text-sm mt-1">
            Overview of available AI services
          </Typography>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Accuracy", value: "99.9%" },
            { label: "Processed", value: "10K+" },
            { label: "Uptime", value: "24/7" },
            { label: "Response", value: "< 1s" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-gray-200 rounded-lg px-4 py-3"
            >
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              <p className="text-lg font-semibold text-gray-900 mt-0.5">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Services */}
        <div className="mb-6">
          <Typography variant="h6" className="text-gray-900 font-semibold mb-4">
            AI Services
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiServices.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className={`bg-white border border-gray-200 rounded-lg p-5 ${
                    service.isAvailable
                      ? "hover:border-gray-300 cursor-pointer"
                      : "opacity-60"
                  } transition-colors`}
                  onClick={() =>
                    service.isAvailable && navigate(service.link)
                  }
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                    {!service.isAvailable && (
                      <span className="text-xs text-gray-400 border border-gray-200 rounded px-2 py-0.5">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <Typography className="text-gray-900 font-medium text-sm mb-1">
                    {service.title}
                  </Typography>
                  <Typography className="text-gray-500 text-xs leading-relaxed mb-3">
                    {service.description}
                  </Typography>
                  {service.isAvailable && (
                    <button
                      className="text-blue-600 text-xs font-medium flex items-center gap-1 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(service.link);
                      }}
                    >
                      Open <ArrowRightIcon className="h-3 w-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
