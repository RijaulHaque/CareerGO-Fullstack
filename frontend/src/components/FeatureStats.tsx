// filepath: frontend/src/components/FeatureStats.tsx
import React from 'react'; // 🌟 ADD THIS LINE 🌟

const StatCard = ({ title, description }: { title: string; description: string }) => (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100/70 text-center transform hover:scale-[1.02] transition duration-300">
        <p className="text-2xl font-bold mb-2 text-gray-800">
            {title}
        </p>
        <p className="text-sm font-medium text-gray-500">
            {description}
        </p>
    </div>
);

export const FeatureStats = () => {
    return (
        <section className="py-16 bg-gray-50/70">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                    Harness the power of AI to discover your next path.
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    <StatCard 
                        title="AI-Powered Career Insights" 
                        description="Deep learning analyzes millions of data points to find your optimal career fit." 
                    />
                    
                    <StatCard 
                        title="Advanced Skills Analytics" 
                        description="Identify your current skill gaps and track your progress toward future goals." 
                    />
                    
                    <StatCard 
                        title="Future-Proof Your Career" 
                        description="Get recommendations for emerging technologies and high-growth industries." 
                    />

                </div>
            </div>
        </section>
    );
};