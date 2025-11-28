import { useState, useEffect } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { IoStar } from "react-icons/io5";
// replaced HiUser icon with demo avatar image
import axiosInstance from "../../../config/axiosInstance";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);

  // Fetch testimonials from API (exposed so other events can trigger a refetch)
  const fetchTestimonials = async () => {
    try {
      // axiosInstance returns response.data via interceptor, so this call returns the data directly
      const data = await axiosInstance.get("/api/reviews/");
  // raw response inspected during development; suppressed in production

      // Support multiple possible response shapes from backend
      let items = [];
      if (Array.isArray(data)) items = data;
      else if (data && Array.isArray(data.data)) items = data.data;
      else if (data && Array.isArray(data.reviews)) items = data.reviews;
      else if (data && Array.isArray(data.results)) items = data.results;

      const reviews = items.map((review) => ({
        id: review.id,
        rating: review.rating,
        text: review.comment || review.text || review.body || "",
        author: {
          name: review.user?.fullName || review.user?.name || review.user || review.author || "Anonymous",
          role: review.user?.role || review.role || "Customer",
        },
      }));

      setTestimonials(reviews);
    } catch {
      // Fallback to empty array if API fails
      setTestimonials([]);
    }
  };

  useEffect(() => {
    fetchTestimonials();

    // listen for same-tab custom event
    const handleUpdate = () => fetchTestimonials();

    // listen for cross-tab updates via localStorage
    const handleStorage = (e) => {
      if (e.key === "reviews_updated_at") fetchTestimonials();
    };

    window.addEventListener("reviews:updated", handleUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("reviews:updated", handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Responsive items per page: 1 mobile, 2 tablet, 3 desktop
  const getItemsPerPage = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 3; // lg
      if (window.innerWidth >= 768) return 2; // md
      return 1; // mobile
    }
    return 3;
  };

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  // Update items per page on resize
  useEffect(() => {
    const handleResize = () => setItemsPerPage(getItemsPerPage());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <section>
      <div className="bg-[#F5F2EC] py-10 lg:py-12">
        <div className="container paddingContainer">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-black mb-2 lg:mb-3">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-[#454545]">
              See what our customers have to say
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 xl:mb-12">
            {visibleTestimonials?.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Star Rating - 5 stars total, filled based on rating */}
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IoStar
                      key={star}
                      className={`w-5 h-5 ${
                        star <= testimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 mb-8 leading-relaxed">
                  {testimonial.text}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full bg-gray-100 border-2 border-[#3574ED]/20 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-[#3574ED]/10 to-[#5A8FFF]/10"></div>
                    <img
                      src="https://randomuser.me/api/portraits/women/68.jpg"
                      alt={`${testimonial.author.name} avatar`}
                      loading="lazy"
                      className="w-12 h-12 rounded-full object-cover relative z-10"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.author.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.author.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-12 h-12 rounded-full bg-white text-[#4ED35C] flex items-center justify-center transition-all duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous testimonials"
            >
              <BiChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="w-12 h-12 rounded-full bg-white text-[#4ED35C] flex items-center justify-center transition-all duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next testimonials"
            >
              <BiChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
