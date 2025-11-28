import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { scroller } from 'react-scroll';
import HeroSection from './Components/HeroSection';
import FeaturesSection from './Components/FeaturesSection';
import HowItWorksSection from './Components/HowItWorksSection';
import CTASection from './Components/CTASection';
import PricingSection from './Components/PricingSection';
import TestimonialsSection from './Components/TestimonialSection';
import UserReview from './Components/UserReview';

const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Scroll to section if hash is present in URL, then clear the hash
    useEffect(() => {
        if (location.hash) {
            const sectionId = location.hash.replace('#', '');
            setTimeout(() => {
                scroller.scrollTo(sectionId, {
                    duration: 300,
                    delay: 0,
                    smooth: 'easeInOutQuart',
                    offset: -120,
                });
                // Clear hash from URL after scrolling
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 400);
            }, 100);
        }
    }, [location, navigate]);

    return (
        <div>
            <HeroSection/>
            <div id='features'>
                <FeaturesSection/>
            </div>
            <div id='works'>
                <HowItWorksSection/>
            </div>
            
           <div id='reviews'>
             <TestimonialsSection/>
           </div>
           <UserReview/>
            <CTASection/>
        </div>
    );
};

export default Home;