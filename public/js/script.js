// Mobile Menu Toggle
        document.getElementById('mobile-menu-button').addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        });

        // Back to Top Button
        const backToTopButton = document.getElementById('back-to-top');
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.remove('opacity-0', 'invisible');
                backToTopButton.classList.add('opacity-100', 'visible');
            } else {
                backToTopButton.classList.remove('opacity-100', 'visible');
                backToTopButton.classList.add('opacity-0', 'invisible');
            }
        });

        // Form Submission
        // document.getElementById('contactForm').addEventListener('submit', function(e) {
        //     e.preventDefault();
        //     alert('Thank you for your message! We will get back to you soon.');
        //     this.reset();
        // });
        


        document.getElementById('contactForm').addEventListener('submit', async function(e) {
    // 1. Crucial: Stop the browser from navigating/reloading the page
    e.preventDefault(); 
    
    // Get the form element
    const form = e.target;
    
    // --- Collect and structure the form data ---
    // FormData makes it easy to grab all inputs by their 'name' attribute
    const formData = new FormData(form);
    
    // Convert the FormData object into a plain JavaScript object
    // This makes it easy to send as JSON in the fetch request body
    const data = Object.fromEntries(formData.entries());

    // Basic UI Feedback (optional: disable button during sending)
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
        // 2. Manually send the POST request to your Express server route
        const response = await fetch('/contactForm', {
            method: 'POST',
            // Tell the server we are sending JSON data
            headers: { 'Content-Type': 'application/json' },
            // Send the data as a JSON string
            body: JSON.stringify(data), 
        });

        // 3. Handle the server's response
        if (response.ok) {
            // Server returned a 200 status (Success)
            alert('Your message was successfully sent! We will get back to you soon.');
            form.reset(); // Clear form on success
        } else {
            // Server returned a 400 or 500 status (Failure)
            const errorText = await response.text();
            alert(`Error sending message. Status: ${response.status}. Details: ${errorText.substring(0, 100)}`);
        }
    } catch (error) {
        // 4. Handle Network Errors (e.g., server offline)
        console.error('Network Error:', error);
        alert('A network error occurred. Please check your connection and try again.');
    } finally {
        // Always re-enable the button
        submitButton.textContent = 'Send Message';
        submitButton.disabled = false;
    }
});





        // Smooth Scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Hide mobile menu after clicking a link
                const mobileMenu = document.getElementById('mobile-menu');
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            });
        });


        // toggle Read More Section

  function toggleReadMore(id) {
            const content = document.getElementById(id);
            content.classList.toggle('expanded');
            const button = event.target;
            if (content.classList.contains('expanded')) {
                button.textContent = 'Read Less';
            } else {
                button.textContent = 'Read More';
            }
        }