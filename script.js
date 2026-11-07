
/* =========================================
   GLOBAL TAXI SERVICE - UPDATED JAVASCRIPT
   ========================================= */

const whatsappNumber = "919707141880";
const phoneNumber = "+919707141880";

const welcomeMessage =
    "Welcome to Global Taxi Service.\n" +
    "Hello Global Taxi Service, I want to book a taxi.";

// =========================================
// CURRENT YEAR
// =========================================

document.getElementById("year").textContent =
    new Date().getFullYear();

// =========================================
// WHATSAPP LINK GENERATOR
// =========================================

function getWhatsAppLink(message) {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// Add the default WhatsApp message to all WhatsApp links.

const whatsappLinks = document.querySelectorAll(".whatsapp-link");

whatsappLinks.forEach(link => {
    link.href = getWhatsAppLink(welcomeMessage);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
});

// =========================================
// WHATSAPP QR CODE
// =========================================

const qrImage = document.getElementById("whatsappQR");
const qrLink = document.getElementById("qrLink");

const qrWhatsAppLink = getWhatsAppLink(welcomeMessage);

qrLink.href = qrWhatsAppLink;

// Generate QR code dynamically.

qrImage.dataset.fallback = "WhatsApp-QR.png";

qrImage.src =
    "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
    encodeURIComponent(qrWhatsAppLink);

// Use the existing local QR image if the QR service fails.
// The local image should be checked to ensure it points to the same number.

qrImage.addEventListener("error", () => {
    if (qrImage.dataset.fallback) {
        const fallback = qrImage.dataset.fallback;
        qrImage.dataset.fallback = "";
        qrImage.src = fallback;
    }
});

// =========================================
// MOBILE NAVIGATION
// =========================================

const navToggle = document.getElementById("navToggle");
const navigation = document.getElementById("navigation");

navToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    navToggle.setAttribute("aria-expanded", isOpen);

    navToggle.textContent = isOpen ? "✕" : "☰";
});

navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navigation.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.textContent = "☰";
    });
});

// =========================================
// SELECT CAR FROM FLEET
// =========================================

document.querySelectorAll(".car-book").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("car").value =
            link.dataset.car;
    });
});

// =========================================
// SELECT DESTINATION FROM ROUTES
// =========================================

document.querySelectorAll(".route-card").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("destinationInput").value =
            link.dataset.route.replace("Jorhat to ", "");
    });
});

// =========================================
// BOOKING FORM - WHATSAPP
// =========================================

document.getElementById("bookingForm").addEventListener("submit", event => {

    event.preventDefault();

    const fields = {
        name: document.getElementById("name").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        pickup: document.getElementById("pickup").value.trim(),
        destination: document.getElementById("destinationInput").value.trim(),
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        car: document.getElementById("car").value,
        trip: document.getElementById("trip").value,
        message: document.getElementById("message").value.trim()
    };

    const text = [
        welcomeMessage,
        "",
        "BOOKING DETAILS",
        `Name: ${fields.name}`,
        `Phone: ${fields.phone}`,
        `Pickup: ${fields.pickup}`,
        `Destination: ${fields.destination}`,
        `Date: ${fields.date}`,
        `Time: ${fields.time}`,
        `Car: ${fields.car}`,
        `Trip type: ${fields.trip}`,
        `Message: ${fields.message || "None"}`
    ].join("\n");

    window.open(
        getWhatsAppLink(text),
        "_blank",
        "noopener,noreferrer"
    );

});

// =========================================
// CUSTOMER STAR RATING
// =========================================

const starButtons = document.querySelectorAll("#starRating button");
const reviewStars = document.getElementById("reviewStars");

starButtons.forEach(button => {

    button.addEventListener("click", () => {

        const rating = Number(button.dataset.rating);

        reviewStars.value = rating;

        starButtons.forEach(star => {

            const starRating = Number(star.dataset.rating);

            star.classList.toggle(
                "active",
                starRating <= rating
            );

            star.setAttribute(
                "aria-pressed",
                starRating === rating ? "true" : "false"
            );

        });

    });

});

// =========================================
// CUSTOMER REVIEWS - LOCAL STORAGE
// =========================================

const reviewForm = document.getElementById("reviewForm");
const reviewList = document.getElementById("reviewList");
const reviewCount = document.getElementById("reviewCount");

const STORAGE_KEY = "globalTaxiCustomerReviews";

function getReviews() {

    try {
        const savedReviews = localStorage.getItem(STORAGE_KEY);

        return savedReviews ? JSON.parse(savedReviews) : [];

    } catch (error) {
        return [];
    }

}

function saveReviews(reviews) {

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(reviews)
        );

        return true;

    } catch (error) {
        alert("Unable to save your review in this browser.");
        return false;
    }

}
// =========================================
// DISPLAY CUSTOMER REVIEWS
// =========================================

function displayReviews() {

    const reviews = getReviews();

    reviewList.replaceChildren();

    reviewCount.textContent =
        reviews.length === 1
            ? "1 review"
            : `${reviews.length} reviews`;

    if (reviews.length === 0) {

        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty-reviews";

        emptyMessage.textContent =
            "Be the first to share your experience with Global Taxi Service!";

        reviewList.appendChild(emptyMessage);

        return;
    }

    reviews.slice().reverse().forEach((review, reversedIndex) => {

        const originalIndex = reviews.length - 1 - reversedIndex;

        const card = document.createElement("article");
        card.className = "review-item";

        const name = document.createElement("h4");
        name.textContent = review.name;

        const stars = document.createElement("div");
        stars.className = "review-stars";
        stars.textContent =
            "★".repeat(review.rating) +
            "☆".repeat(5 - review.rating);

        const message = document.createElement("p");
        message.textContent = review.text;

        const date = document.createElement("div");
        date.className = "review-date";
        date.textContent = review.date;

        // DELETE BUTTON

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete Review";
        deleteButton.className = "delete-review";

        deleteButton.addEventListener("click", () => {

            const confirmDelete = confirm(
                "Are you sure you want to delete this review?"
            );

            if (!confirmDelete) {
                return;
            }

            const latestReviews = getReviews();

            latestReviews.splice(originalIndex, 1);

            if (saveReviews(latestReviews)) {
                displayReviews();
            }

        });

        card.append(name, stars, message, date, deleteButton);

        reviewList.appendChild(card);

    });

}

// =========================================
// SUBMIT CUSTOMER REVIEW
// =========================================

reviewForm.addEventListener("submit", event => {

    event.preventDefault();

    const name = document.getElementById("reviewName").value.trim();

    const rating = Number(reviewStars.value);

    const message = document.getElementById("reviewText").value.trim();

    if (!rating || rating < 1 || rating > 5) {
        alert("Please select a star rating.");
        return;
    }

    if (!name || !message) {
        alert("Please complete all review fields.");
        return;
    }

    const reviews = getReviews();

    const newReview = {
        name: name,
        rating: rating,
        text: message,
        date: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        })
    };

    reviews.push(newReview);

    if (!saveReviews(reviews)) {
        return;
    }

    displayReviews();

    reviewForm.reset();

    reviewStars.value = "";

    starButtons.forEach(star => {
        star.classList.remove("active");
        star.setAttribute("aria-pressed", "false");
    });

    alert("Thank you! Your review has been saved in this browser.");

});

// =========================================
// LOAD EXISTING REVIEWS
// =========================================

displayReviews();
