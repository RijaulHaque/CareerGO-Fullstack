// filepath: D:\7th Sem\JAVA\Mini Project\CareerGO\frontend\src\App.tsx

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion'; 
// Import new components
import { FeatureStats } from './components/FeatureStats'; 
import { DetailedFeatures } from './components/DetailedFeatures'; 

// --- Component Placeholders (Header/Footer remain) ---
const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-20 bg-white shadow-xl/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="text-2xl font-extrabold text-gray-800">
                Career<span className="text-purple-600">GO</span>
            </div>
            <nav className="hidden lg:flex space-x-8 text-gray-600 font-medium">
                <a href="#" className="hover:text-blue-600 transition-colors">Home</a>
                <a href="#career-form" className="hover:text-blue-600 transition-colors">Roadmap</a>
            </nav>
            <div className="flex items-center space-x-3">
                <button className="px-5 py-2 text-sm font-semibold border border-blue-500 text-blue-600 rounded-full">Login</button>
                <button className="px-5 py-2 text-sm font-semibold text-white bg-green-500 rounded-full">Signup</button>
            </div>
        </div>
    </header>
);

const Footer = () => (
    <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
            <p className="text-gray-400 mb-6">Empowering careers through AI-driven insights and recommendations</p>
            <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-500">
                © 2025 CareerGO. All rights reserved.
            </div>
        </div>
    </footer>
);
// --- End Component Placeholders ---


// Component for the Form and Results
const CareerFormAndResults = () => {
    // ... (All logic including state, handleSubmit, handlePdfDownload, and JSX structure remains the same) ...
    const [resultHtml, setResultHtml] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const [rawHtmlForPdf, setRawHtmlForPdf] = useState(''); 

    const [formData, setFormData] = useState({ name: '', skills: '', interests: '', goal: '' });
    
    const [typingText, setTypingText] = useState('');
    let typingInterval: number | undefined;

    const startTypingAnimation = (message: string) => {
        let i = 0;
        setTypingText('');
        clearInterval(typingInterval);

        typingInterval = setInterval(() => {
            if (i < message.length) {
                setTypingText(prev => prev + message.charAt(i));
                i++;
            } else {
                clearInterval(typingInterval);
                setTimeout(() => startTypingAnimation(message), 1000);
            }
        }, 50) as unknown as number;
    };

    const stopTypingAnimation = () => {
        clearInterval(typingInterval);
    };

    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        
        const data = {
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            skills: (form.elements.namedItem('skills') as HTMLTextAreaElement).value,
            interests: (form.elements.namedItem('interests') as HTMLTextAreaElement).value,
            goal: (form.elements.namedItem('goal') as HTMLTextAreaElement).value,
        };
        setFormData(data); 
        
        setIsLoading(true);
        setResultHtml('');
        setRawHtmlForPdf(''); 
        startTypingAnimation('Analyzing your profile... Please wait.');

        try {
            const response = await fetch('http://localhost:8080/api/career/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            stopTypingAnimation();
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const html = await response.text();
            setRawHtmlForPdf(html); 
            setResultHtml(html); 

        } catch (error) {
            stopTypingAnimation();
            console.error('Error fetching recommendation:', error);
            setResultHtml('<p class="text-red-500">Failed to get a recommendation. Please try again later. Check backend logs for LLM errors (409 Conflict, 503 Service Unavailable).</p>');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handlePdfDownload = async () => {
        if (!rawHtmlForPdf) {
            alert('Please generate a recommendation first.');
            return;
        }

        try {
            const pdfResponse = await fetch('http://localhost:8080/api/career/download-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' }, 
                body: rawHtmlForPdf, 
            });

            if (pdfResponse.ok) {
                const blob = await pdfResponse.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'CareerGO_Recommendation.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                alert('Failed to download PDF. The backend reported an error.');
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('An error occurred during PDF download.');
        }
    };

    return (
        <div className="flex-1 w-full max-w-lg">
            <motion.div 
                className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200" 
                id="career-form"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Get Your Personalized Career Roadmap</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 mt-3">Your Name:</label>
                    <input type="text" id="name" name="name" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4" />

                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Skills:</label>
                    <textarea id="skills" name="skills" rows={2} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4" />

                    <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">Interests:</label>
                    <textarea id="interests" name="interests" rows={2} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4" />

                    <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">Career Goal:</label>
                    <textarea id="goal" name="goal" rows={2} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-6" />

                    <button type="submit" disabled={isLoading} className="w-full text-white font-semibold py-3 px-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition duration-300 shadow-lg disabled:opacity-50">
                        {isLoading ? 'Analyzing...' : 'Get Recommendation'}
                    </button>
                </form>
            </motion.div>

            {/* Recommendation Result Section */}
            {(resultHtml || isLoading) && (
                <div id="result" className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 w-full">
                    <h3 className="text-xl font-semibold mb-3 text-blue-600">Recommendation Result:</h3>
                    
                    {isLoading ? (
                        <pre className="text-gray-700">{typingText}</pre>
                    ) : (
                        <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: resultHtml }} />
                    )}
                    
                    {/* Show button only when content is ready */}
                    {rawHtmlForPdf && !isLoading && (
                        <button 
                            onClick={handlePdfDownload} 
                            className="w-full mt-4 text-white font-semibold py-3 px-4 rounded-lg bg-red-500 hover:bg-red-600 transition duration-300"
                        >
                            Download as PDF
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};


// --- Main App Component (App.tsx) ---
const App = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            
            <section className="relative min-h-screen pt-24 pb-16 overflow-hidden">
                {/* Background Styling */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
                
                {/* Floating elements */}
                <motion.div
                    className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"
                    animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-40 right-20 w-32 h-32 bg-purple-200/30 rounded-full blur-xl"
                    animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="relative container mx-auto px-6 flex flex-col lg:flex-row items-start gap-16 min-h-[calc(100vh-6rem)]">
                    
                    {/* Left content: Marketing Info */}
                    <motion.div 
                        className="flex-1 text-center lg:text-left pt-12 lg:pt-0"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        
                        <motion.div
                             initial={{ y: 20, opacity: 0 }}
                             animate={{ y: 0, opacity: 1 }}
                             transition={{ delay: 0.2, duration: 0.6 }}
                            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200/50 mb-8"
                        >
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-700">AI-Powered Career Intelligence</span>
                        </motion.div>
                        
                        <motion.h1
                            className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            Discover Your
                            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Dream Career
                            </span>
                        </motion.h1>
                        
                        <motion.p
                            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            Get personalized career recommendations powered by advanced AI. 
                            Transform your skills and interests into your perfect career path.
                        </motion.p>
                        
                        {/* Feature Pills */}
                        <motion.div
                            className="flex flex-wrap gap-6 justify-center lg:justify-start mb-12"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-700">95% Success Rate</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-gray-700">Precision Matching</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-sm text-gray-700">Instant Results</span>
                            </div>
                        </motion.div>

                        {/* Testimonial */}
                        <motion.div
                            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto lg:mx-0"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm">RH</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Rijaul Haque</p>
                                    <p className="text-xs text-gray-600">Software Engineer</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 italic">
                                "CareerGO helped me transition from web development to AI engineering. 
                                The recommendations were spot-on!"
                            </p>
                        </motion.div>
                    </motion.div>
                    
                    {/* Right content - Form & Results */}
                    <CareerFormAndResults />
                </div>
            </section>
            
            {/* --- NEW: FeatureStats Component Rendered Here --- */}
            <FeatureStats /> 
            
            {/* --- NEW: DetailedFeatures Component Rendered Here --- */}
            <DetailedFeatures />
            
            <Footer />
            
        </div>
    );
}

export default App;