document.addEventListener('DOMContentLoaded', function() {
    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.navbar nav ul');
    hamburger.addEventListener('click', () => {
        navList.classList.toggle('active');
        hamburger.querySelector('i').classList.toggle('fa-bars');
        hamburger.querySelector('i').classList.toggle('fa-times');
    });
    document.querySelectorAll('.navbar nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        });
    });

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });
            faqItem.classList.toggle('active');
            question.setAttribute('aria-expanded', !isActive);
        });
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Lazy Load Images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '0px 0px 100px 0px' });
        lazyImages.forEach(img => observer.observe(img));
    }

    // Quote Modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">×</span>
            <h3>Request a Quote</h3>
            <form id="quoteForm">
                <div class="form-group"><label for="service">Service</label><input type="text" id="service" readonly></div>
                <div class="form-group"><label for="name">Name</label><input type="text" id="name" required></div>
                <div class="form-group"><label for="email">Email</label><input type="email" id="email" required></div>
                <div class="form-group"><label for="phone">Phone</label><input type="tel" id="phone" required></div>
                <div class="form-group"><label for="message">Message</label><textarea id="message" rows="4"></textarea></div>
                <button type="submit" class="btn-primary">Submit Request</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    const openModal = (service) => {
        modal.querySelector('#service').value = service;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };

    document.querySelectorAll('.quote-btn').forEach(button => {
        button.addEventListener('click', () => openModal(button.parentElement.querySelector('h3').textContent));
    });

    const stickyCta = document.querySelector('.sticky-cta');
    if (stickyCta) stickyCta.addEventListener('click', () => openModal('General Inquiry'));

    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    modal.querySelector('#quoteForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target));
        console.log('Quote Request:', formData);
        alert('Quote request submitted!');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        e.target.reset();
    });

    // Service Availability Checker
    const availabilityForm = document.querySelector('#availabilityForm');
    const availabilityResult = document.querySelector('.availability-result');

    availabilityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const location = document.querySelector('#location').value;
        const date = document.querySelector('#date').value;

        const mockAvailability = Math.random() > 0.3 ? 'Available' : 'Not Available';
        availabilityResult.innerHTML = `
            <p>Service in <strong>${location}</strong> on <strong>${date}</strong>: <span style="color: ${mockAvailability === 'Available' ? '#2ecc71' : '#e74c3c'}">${mockAvailability}</span></p>
            ${mockAvailability === 'Available' ? '<button class="btn-primary book-now">Book Now</button>' : ''}
        `;
        availabilityResult.style.display = 'block';
        availabilityResult.scrollIntoView({ behavior: 'smooth' });

        const bookNowBtn = availabilityResult.querySelector('.book-now');
        if (bookNowBtn) {
            bookNowBtn.addEventListener('click', () => {
                openModal('Service Booking');
            });
        }
    });

    // Vendor Spotlight Book Buttons
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const vendor = btn.parentElement.querySelector('h3').textContent;
            openModal(`${vendor} Service`);
        });
    });

    // Dynamic Service Filtering
    const servicesGrid = document.querySelector('.services-grid');
    const serviceCardsFilter = Array.from(servicesGrid.querySelectorAll('.service-card'));
    const filterInput = document.createElement('input');
    filterInput.type = 'text';
    filterInput.placeholder = 'Search services...';
    filterInput.className = 'service-filter';
    document.querySelector('.featured-services .container').insertBefore(filterInput, servicesGrid);

    filterInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        serviceCardsFilter.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            card.style.display = title.includes(searchTerm) ? 'block' : 'none';
        });
    });

    // Service Comparison Tool
    const serviceCards = document.querySelectorAll('.services-grid .service-card');
    const comparisonCheckboxes = document.querySelector('.comparison-checkboxes');
    const compareBtn = document.querySelector('.compare-btn');
    const comparisonResult = document.querySelector('.comparison-result');

    serviceCards.forEach((card, index) => {
        const serviceName = card.querySelector('h3').textContent;
        const checkbox = document.createElement('label');
        checkbox.innerHTML = `<input type="checkbox" value="${serviceName}" data-index="${index}"> ${serviceName}`;
        comparisonCheckboxes.appendChild(checkbox);
        card.dataset.originalHtml = card.innerHTML;
    });

    compareBtn.addEventListener('click', () => {
        const selectedServices = Array.from(comparisonCheckboxes.querySelectorAll('input:checked'))
            .map(input => ({
                name: input.value,
                description: serviceCards[input.dataset.index].querySelector('p').textContent,
                price: `AED ${Math.floor(Math.random() * 500) + 100}`,
                rating: (Math.random() * 2 + 3).toFixed(1)
            }));

        if (selectedServices.length < 2) {
            alert('Please select at least 2 services to compare.');
            return;
        }

        comparisonResult.innerHTML = `
            <h4>Comparison Results</h4>
            <table>
                <thead><tr><th>Service</th><th>Description</th><th>Price</th><th>Rating</th></tr></thead>
                <tbody>${selectedServices.map(s => `<tr><td>${s.name}</td><td>${s.description}</td><td>${s.price}</td><td>${s.rating} ★</td></tr>`).join('')}</tbody>
            </table>
        `;
        comparisonResult.style.display = 'block';
        comparisonResult.scrollIntoView({ behavior: 'smooth' });
    });

    // Skeleton Screens
    serviceCards.forEach(card => {
        card.innerHTML = `
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text" style="width: 60%;"></div>
        `;
        setTimeout(() => {
            card.innerHTML = card.dataset.originalHtml;
        }, 2000);
    });

    // Scroll-Based Animations
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.service-card, .benefit-card, .feature, .testimonial-card, .vendor-card').forEach(el => {
        el.classList.add('animate-ready');
        scrollObserver.observe(el);
    });

    // Animated Statistics Counter
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.stat-number').forEach(stat => {
                    const target = parseInt(stat.dataset.target);
                    let count = 0;
                    const increment = target / 100;
                    const updateCount = () => {
                        count += increment;
                        if (count < target) {
                            stat.textContent = Math.floor(count);
                            requestAnimationFrame(updateCount);
                        } else {
                            stat.textContent = target.toLocaleString();
                        }
                    };
                    updateCount();
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    document.querySelector('.stats')?.addEventListener('mouseenter', () => {
        statsObserver.observe(document.querySelector('.stats'));
    });

    // Back-to-Top Button
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 300);
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Dark Mode
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.className = 'dark-mode-toggle';
    document.querySelector('.navbar').appendChild(darkModeToggle);

    const applyDarkMode = (isDark) => {
        document.body.classList.toggle('dark-mode', isDark);
        darkModeToggle.querySelector('i').classList.toggle('fa-moon', !isDark);
        darkModeToggle.querySelector('i').classList.toggle('fa-sun', isDark);
        localStorage.setItem('darkMode', isDark);
    };
    darkModeToggle.addEventListener('click', () => applyDarkMode(!document.body.classList.contains('dark-mode')));
    applyDarkMode(localStorage.getItem('darkMode') === 'true');
});

// Slick Carousel
$(document).ready(function() {
    $('.testimonial-carousel').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        dots: true,
        arrows: true,
        fade: true,
        adaptiveHeight: true,
        prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
        nextArrow: '<button type="button" class="slick-next"><i class="fas fa-chevron-right"></i></button>'
    });

    $('.vendor-carousel').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        dots: true,
        arrows: true,
        responsive: [
            { breakpoint: 768, settings: { slidesToShow: 1 } },
            { breakpoint: 1024, settings: { slidesToShow: 2 } }
        ],
        prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
        nextArrow: '<button type="button" class="slick-next"><i class="fas fa-chevron-right"></i></button>'
    });
});

// Resize Handler
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
            document.querySelector('.navbar nav ul').classList.remove('active');
            document.querySelector('.hamburger i').classList.replace('fa-times', 'fa-bars');
        }
    }, 250);
});

// Personalized Service Recommendations
const recommendationForm = document.querySelector('#recommendationForm');
const recommendationResult = document.querySelector('.recommendation-result');

recommendationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const need = document.querySelector('#need').value;
    const urgency = document.querySelector('#urgency').value;

    const recommendations = {
        cleaning: {
            today: 'Same-Day Deep Cleaning',
            week: 'Weekly Cleaning Subscription',
            later: 'Monthly Cleaning Package'
        },
        repairs: {
            today: 'Emergency Home Repairs',
            week: 'Scheduled Repair Service',
            later: 'Full Home Maintenance Check'
        },
        maintenance: {
            today: 'Urgent AC Servicing',
            week: 'Regular Maintenance Plan',
            later: 'Annual Maintenance Contract'
        }
    };

    const suggestion = recommendations[need][urgency];
    recommendationResult.innerHTML = `
        <p>We recommend: <strong>${suggestion}</strong></p>
        <button class="btn-primary book-recommendation">Book This Service</button>
    `;
    recommendationResult.style.display = 'block';
    recommendationResult.scrollIntoView({ behavior: 'smooth' });

    document.querySelector('.book-recommendation').addEventListener('click', () => {
        openModal(suggestion);
    });
});

