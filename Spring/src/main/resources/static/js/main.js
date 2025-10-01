// filepath: d:\7th Sem\JAVA\Mini Project\CareerGO\Spring\CareerGO\src\main\resources\static\js\main.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('career-form');
    const resultDiv = document.getElementById('result');
    const recommendationText = document.getElementById('recommendation-text');
    const downloadBtn = document.getElementById('download-pdf-btn');

    let animationInterval; // Variable to hold the interval for stopping the animation

    // Function to create the typing animation effect
    const startTypingAnimation = (message) => {
        let i = 0;
        recommendationText.innerHTML = '';
        
        // Stop any existing animation
        clearInterval(animationInterval); 

        // Start new animation
        animationInterval = setInterval(() => {
            if (i < message.length) {
                recommendationText.innerHTML += message.charAt(i);
                i++;
            } else {
                clearInterval(animationInterval);
                // Optionally restart the animation after a short delay
                setTimeout(() => startTypingAnimation(message), 1000); 
            }
        }, 50); // Speed of typing (milliseconds per character)
    };

    const stopTypingAnimation = () => {
        clearInterval(animationInterval);
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const data = {
            name: form.name.value,
            skills: form.skills.value,
            interests: form.interests.value,
            goal: form.goal.value
        };

        // 1. START ANIMATION
        startTypingAnimation(' Analyzing your profile... Please wait.');
        
        resultDiv.classList.remove('hidden');
        if (downloadBtn) {
            downloadBtn.style.display = 'none';
        }

        try {
            const response = await fetch('/api/career/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            // 2. STOP ANIMATION on API response
            stopTypingAnimation();

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const recommendationHtml = await response.text();
            recommendationText.innerHTML = recommendationHtml;
            
            if (downloadBtn) {
                downloadBtn.style.display = 'block';
            }

        } catch (error) {
            // 2. STOP ANIMATION on error
            stopTypingAnimation();

            console.error('Error fetching recommendation:', error);
            recommendationText.innerHTML = 'Failed to get a recommendation. Please try again later.';
            if (downloadBtn) {
                downloadBtn.style.display = 'none';
            }
        }
    });

    if (downloadBtn) {
        downloadBtn.addEventListener('click', async () => {
            // ... (rest of the PDF download code remains the same)
            const data = {
                name: form.name.value,
                skills: form.skills.value,
                interests: form.interests.value,
                goal: form.goal.value
            };

            try {
                const pdfResponse = await fetch('/api/career/download-pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (pdfResponse.ok) {
                    const blob = await pdfResponse.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = 'career_recommendation.pdf';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                } else {
                    alert('Failed to download PDF.');
                }
            } catch (error) {
                console.error('Error downloading PDF:', error);
                alert('An error occurred while downloading the PDF.');
            }
        });
    }
});