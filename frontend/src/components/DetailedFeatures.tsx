// filepath: frontend/src/components/DetailedFeatures.tsx
import React from 'react'; // 🌟 ADD THIS LINE 🌟

const featureList = [
    { title: "Career Performance Analytics", description: "Track your progress and skill mastery over time.", iconColor: "text-blue-500" },
    { title: "Curated Learning Pathways", description: "Receive personalized courses and resources linked to your specific career goals.", iconColor: "text-green-500" },
    { title: "AI-Powered Career Insights", description: "Get deep intelligence reports on salary trends and market demands.", iconColor: "text-purple-500" },
    { title: "Advanced Skills Analytics", description: "Analyze existing skills against industry benchmarks and target competencies.", iconColor: "text-yellow-500" },
    { title: "Your Personalized Report", description: "Generate a comprehensive, printable intelligence report (PDF ready).", iconColor: "text-red-500" },
    { title: "Intelligent Career Analysis", description: "Predict future industry shifts to keep your career resilient.", iconColor: "text-indigo-500" },
];

const FeatureItem = ({ title, description, iconColor }: { title: string; description: string; iconColor: string }) => (
    <div className="flex space-x-4 p-4 border border-gray-200/50 rounded-lg bg-white shadow-sm hover:shadow-md transition duration-200">
        <div className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 ${iconColor}`}>
            {/* Placeholder for Icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    </div>
);

export const DetailedFeatures = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Future-Proof Your Career
                </h2>
                <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                    Connect & Grow Together: We provide the tools for your continuous development.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featureList.map((feature, index) => (
                        <FeatureItem key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};