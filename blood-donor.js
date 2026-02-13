document.addEventListener("DOMContentLoaded", () => {
    initFaq();
    initSmoothScroll();
    initHeaderScroll();
    initStatsCounter();
    initModal(); // Added this to trigger the modal logic
});

// 1. Modal & Donation Button Logic
function initModal() {
    const modal = document.getElementById('donationModal');
    const closeBtn = document.querySelector('.close-modal');
    const donateButtons = document.querySelectorAll('.donate-btn');
    const donorForm = document.getElementById('donorForm');

    // Show/Hide logic
    donateButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if(!btn.closest('form')) modal.style.display = 'block';
        });
    });

    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };

    // Validation Logic
    donorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const name = document.getElementById('userName');
        const email = document.getElementById('userEmail');
        const blood = document.getElementById('userBlood');
        const phone = document.getElementById('userPhone');

        // Reset previous errors
        document.querySelectorAll('.error-msg').forEach(m => m.innerText = "");
        document.querySelectorAll('input, select').forEach(i => i.classList.remove('error'));

        // Name Validation
        if (name.value.trim().length < 3) {
            showError(name, "Name must be at least 3 characters");
            isValid = false;
        }

        // Email Validation (Regex)
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
            showError(email, "Enter a valid email address");
            isValid = false;
        }

        // Blood Group Validation
        if (blood.value === "") {
            showError(blood, "Please select your blood group");
            isValid = false;
        }

        // Phone Validation (Simple 10-digit check)
        if (phone.value.trim().length < 10) {
            showError(phone, "Enter a valid 10-digit phone number");
            isValid = false;
        }

        if (isValid) {
            const userData = {
                name: name.value,
                email: email.value,
                blood: blood.value,
                phone: phone.value
            };
            console.log("Verified Donor Data:", userData);
            alert(`Success! Thank you ${userData.name}. Check your email (${userData.email}) for confirmation.`);
            
            modal.style.display = 'none';
            donorForm.reset();
        }
    });

    function showError(input, message) {
        input.classList.add('error');
        input.parentElement.querySelector('.error-msg').innerText = message;
    }
}
// 2. FAQ Accordion Toggle
function initFaq() {
    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach((question) => {
        question.addEventListener("click", () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector("i");

            document.querySelectorAll(".faq-answer").forEach((item) => {
                if (item !== answer) item.classList.remove("active");
            });

            document.querySelectorAll(".faq-question i").forEach((item) => {
                if (item !== icon) item.style.transform = "rotate(0deg)";
            });

            answer.classList.toggle("active");
            icon.style.transform = answer.classList.contains("active") ? "rotate(180deg)" : "rotate(0deg)";
        });
    });
}

// 3. Smooth scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
}

// 4. Header Shadow on Scroll
function initHeaderScroll() {
    window.addEventListener("scroll", () => {
        const header = document.querySelector("header");
        if (window.scrollY > 50) {
            header.style.boxShadow = "0 5px 20px rgba(0,0,0,0.15)";
        } else {
            header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
        }
    });
}

// 5. Animate stats on scroll
function initStatsCounter() {
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute("data-target"));
                let count = 0;
                const duration = 2000;
                const increment = countTo / (duration / 16);

                const counter = setInterval(() => {
                    count += increment;
                    if (count >= countTo) {
                        target.innerText = countTo.toLocaleString() + "+";
                        clearInterval(counter);
                    } else {
                        target.innerText = Math.floor(count).toLocaleString() + "+";
                    }
                }, 16);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    // FIX: You must select the elements and tell the observer to watch them
    document.querySelectorAll(".stat-card h2").forEach(el => statsObserver.observe(el));
}
