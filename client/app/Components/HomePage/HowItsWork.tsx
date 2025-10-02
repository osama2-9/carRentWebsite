import { Search, Calendar, Car, CheckCircle } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Find Your Car",
    description:
      "Browse our selection of premium vehicles and choose the perfect one for your needs.",
    icon: Search,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 2,
    title: "Make a Reservation",
    description:
      "Select your pick-up and return dates, and complete the booking process.",
    icon: Calendar,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: 3,
    title: "Pick Up Vehicle",
    description:
      "Visit our convenient location to pick up your car with minimal paperwork.",
    icon: Car,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    id: 4,
    title: "Enjoy Your Ride",
    description:
      "Hit the road with our well-maintained, clean, and reliable vehicles.",
    icon: CheckCircle,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Renting a car with us is quick and hassle-free
          </p>
        </div>

        <div className="mt-12 lg:mt-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.id} className="text-center">
                  <div className="mx-auto h-20 w-20 rounded-full flex items-center justify-center text-lg font-bold relative">
                    <div
                      className={`absolute inset-0 rounded-full ${step.iconBg}`}
                    ></div>
                    <Icon size={36} className={`relative ${step.iconColor}`} />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 bg-blue-50 rounded-xl p-8 lg:p-12">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Ready to Get Started?
              </h3>
              <p className="mt-4 text-lg text-gray-500">
                Join thousands of satisfied customers who choose our premium
                rental service. We offer transparent pricing, no hidden fees,
                and excellent customer support.
              </p>
              <div className="mt-8">
                <a
                  href="#search"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Find Your Car
                </a>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 space-y-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-gray-900">
                    Free Cancellation
                  </h4>
                  <p className="mt-1 text-gray-500">
                    Cancel up to 24 hours before your rental starts for a full
                    refund
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-gray-900">
                    No Hidden Fees
                  </h4>
                  <p className="mt-1 text-gray-500">
                    Know exactly what you're paying for with our transparent
                    pricing
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-gray-900">
                    24/7 Support
                  </h4>
                  <p className="mt-1 text-gray-500">
                    Our customer service team is always available to assist you
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
