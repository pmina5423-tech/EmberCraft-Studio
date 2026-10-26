/* EmberCraft Studio - Part 3 script
   Sections:
     1. Mobile navigation toggle
     2. Gallery lightbox
     3. Forms: validation, enquiry response, contact email
     4. Products: built from a list, with search, filter and sort
     5. FAQ accordion
     6. Interactive Leaflet map
*/

document.addEventListener('DOMContentLoaded', function () {

    /* 1. Mobile navigation toggle
       The button is hidden on desktop by CSS. On mobile, a click:
       - adds or removes .nav-open on the nav so the links show or hide
       - updates aria-expanded so screen readers know the menu state
       Escape closes the menu, and resizing to desktop width resets it. */

    var navToggle = document.querySelector('.nav-toggle');
    var primaryNav = document.getElementById('primary-nav');

    function setNavOpen(isOpen) {
        navToggle.setAttribute('aria-expanded', String(isOpen));
        primaryNav.classList.toggle('nav-open', isOpen);
    }

    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', function () {
            var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            setNavOpen(!isOpen);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' &&
                navToggle.getAttribute('aria-expanded') === 'true') {
                setNavOpen(false);
                navToggle.focus();
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 600) {
                setNavOpen(false);
            }
        });
    }

    /* 2. Gallery lightbox
       Every <a class="gallery-item"> links to the large image and wraps a
       small thumbnail. Clicking one opens an overlay with the large image.
       The overlay is built here, so the HTML only needs the gallery itself.
       Close: X button, click on the dark backdrop, or Escape.
       Browse: Previous and Next buttons, or the left and right arrow keys. */

    var galleryLinks = Array.prototype.slice.call(
        document.querySelectorAll('.gallery-item')
    );

    if (galleryLinks.length > 0) {
        var currentIndex = 0;
        var lastFocused = null;

        var overlay = document.createElement('div');
        overlay.className = 'lightbox';
        overlay.hidden = true;
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Image viewer');
        overlay.innerHTML =
            '<button class="lightbox-close" type="button" aria-label="Close image viewer">&times;</button>' +
            '<button class="lightbox-prev" type="button" aria-label="Previous image">&#8249;</button>' +
            '<figure class="lightbox-figure">' +
                '<img class="lightbox-img" src="" alt="">' +
                '<figcaption class="lightbox-caption"></figcaption>' +
            '</figure>' +
            '<button class="lightbox-next" type="button" aria-label="Next image">&#8250;</button>';
        document.body.appendChild(overlay);

        var lightboxImg = overlay.querySelector('.lightbox-img');
        var lightboxCaption = overlay.querySelector('.lightbox-caption');
        var closeButton = overlay.querySelector('.lightbox-close');

        function showImage(index) {
            // Wrap around at both ends
            currentIndex = (index + galleryLinks.length) % galleryLinks.length;
            var link = galleryLinks[currentIndex];
            var thumb = link.querySelector('img');
            var altText = thumb ? thumb.getAttribute('alt') : '';

            lightboxImg.setAttribute('src', link.getAttribute('href'));
            lightboxImg.setAttribute('alt', altText);
            lightboxCaption.textContent = altText;
        }

        function openLightbox(index) {
            lastFocused = document.activeElement;
            showImage(index);
            overlay.hidden = false;
            document.body.style.overflow = 'hidden';
            closeButton.focus();
        }

        function closeLightbox() {
            overlay.hidden = true;
            document.body.style.overflow = '';
            if (lastFocused) {
                lastFocused.focus();
            }
        }

        galleryLinks.forEach(function (link, index) {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                openLightbox(index);
            });
        });

        closeButton.addEventListener('click', closeLightbox);
        overlay.querySelector('.lightbox-prev').addEventListener('click', function () {
            showImage(currentIndex - 1);
        });
        overlay.querySelector('.lightbox-next').addEventListener('click', function () {
            showImage(currentIndex + 1);
        });

        // Clicking the dark area around the image closes the viewer
        overlay.addEventListener('click', function (event) {
            if (event.target === overlay) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (overlay.hidden) {
                return;
            }
            if (event.key === 'Escape') {
                closeLightbox();
            } else if (event.key === 'ArrowLeft') {
                showImage(currentIndex - 1);
            } else if (event.key === 'ArrowRight') {
                showImage(currentIndex + 1);
            }
        });
    }


    /* 3. Forms
       Both forms use novalidate, so these rules and messages replace the
       browser's default pop-ups. A field is checked when the user leaves it,
       then re-checked on every keystroke once it has shown an error.
       Enquiry form: shows a price and availability response without reloading.
       Contact form: builds an email and opens it in the visitor's mail app. */

    var CONTACT_EMAIL = 'hello@embercraftstudio.co.za'; // change to the real recipient

    // Candle prices come from products.html. The workshop price is a placeholder:
    // replace it with the real price.
    var COLLECT_TEXT = 'Collect at the Hazel Food Market on Saturdays, 9am to 2pm, ' +
        'or at the studio by appointment, Tuesday to Friday, 10am to 4pm.';

    var ENQUIRY_OPTIONS = {
        'ember-oak': { label: 'Ember & Oak candle', unit: 250, per: 'candle',
            availability: COLLECT_TEXT },
        'sunday-morning': { label: 'Sunday Morning candle', unit: 220, per: 'candle',
            availability: COLLECT_TEXT },
        'firelight-grove': { label: 'Firelight Grove candle', unit: 280, per: 'candle',
            availability: COLLECT_TEXT },
        'workshop': { label: 'Scent-blending workshop', unit: 450, per: 'person',
            availability: 'Workshops run by appointment at the studio, Tuesday to Friday, 10am to 4pm.' },
        'gift': { label: 'Gift or gift set', unit: null,
            priceNote: 'gift sets are priced on request.',
            availability: 'We reply within one to two business days with options and pricing.' }
    };

    var BUDGET_LIMITS = {
        'under-500': 500,
        '500-1000': 1000,
        '1000-2500': 2500,
        'over-2500': Infinity,
        'not-sure': Infinity
    };

    function formatRand(amount) {
        return 'R' + amount.toLocaleString('en-ZA');
    }

    function todayString() {
        var d = new Date();
        var month = String(d.getMonth() + 1).padStart(2, '0');
        var day = String(d.getDate()).padStart(2, '0');
        return d.getFullYear() + '-' + month + '-' + day;
    }

    // Returns an error message for one field, or an empty string if it is valid.
    function getError(field) {
        var value = field.value.trim();
        var digits;
        var quantity;

        switch (field.name) {
            case 'name':
                if (value === '') { return 'Please enter your full name.'; }
                if (!/^[A-Za-z\u00C0-\u024F' -]{2,}$/.test(value)) {
                    return 'Use letters only, at least 2 characters.';
                }
                return '';
            case 'email':
                if (value === '') { return 'Please enter your email address.'; }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
                    return 'Enter a valid email address, for example name@example.com.';
                }
                return '';
            case 'phone':
                if (value === '') { return 'Please enter your phone number.'; }
                digits = value.replace(/[\s-]/g, '');
                if (!/^(0\d{9}|\+27\d{9})$/.test(digits)) {
                    return 'Enter a South African number, for example 082 123 4567 or +27 82 123 4567.';
                }
                return '';
            case 'type':
                return value === '' ? 'Please choose an option.' : '';
            case 'quantity':
                quantity = Number(value);
                if (value === '' || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
                    return 'Enter a whole number from 1 to 100.';
                }
                return '';
            case 'date':
                if (value === '') { return 'Please choose a preferred date.'; }
                if (value < todayString()) { return 'The date cannot be in the past.'; }
                return '';
            case 'budget':
                return value === '' ? 'Please choose a budget range.' : '';
            case 'message':
                if (value.length < 10) { return 'Please write at least 10 characters.'; }
                if (value.length > 500) { return 'Keep the message to 500 characters or fewer.'; }
                return '';
            default:
                return '';
        }
    }

    function showError(field, message) {
        var errorBox = document.getElementById(field.id + '-error');
        if (errorBox) { errorBox.textContent = message; }
        field.classList.toggle('input-invalid', message !== '');
        field.setAttribute('aria-invalid', message !== '' ? 'true' : 'false');
    }

    function validateField(field) {
        var message = getError(field);
        showError(field, message);
        return message === '';
    }

    // Checks every field, shows all errors, and moves focus to the first bad one.
    function validateForm(form) {
        var fields = form.querySelectorAll('input[name], select[name], textarea[name]');
        var firstInvalid = null;
        Array.prototype.forEach.call(fields, function (field) {
            if (!validateField(field) && !firstInvalid) { firstInvalid = field; }
        });
        if (firstInvalid) { firstInvalid.focus(); }
        return firstInvalid === null;
    }

    function setupForm(form) {
        var fields = form.querySelectorAll('input[name], select[name], textarea[name]');
        Array.prototype.forEach.call(fields, function (field) {
            field.addEventListener('blur', function () { validateField(field); });
            field.addEventListener('input', function () {
                if (field.getAttribute('aria-invalid') === 'true') { validateField(field); }
            });
            field.addEventListener('change', function () { validateField(field); });
        });

        // Live character counter for the message box
        var message = form.querySelector('textarea[name="message"]');
        var counter = message ? document.getElementById(message.id + '-count') : null;
        if (message && counter) {
            var updateCount = function () {
                counter.textContent = message.value.length + ' / 500 characters';
            };
            message.addEventListener('input', updateCount);
            updateCount();
        }
    }

    function addLine(parent, tag, text, className) {
        var el = document.createElement(tag);
        el.textContent = text;
        if (className) { el.className = className; }
        parent.appendChild(el);
        return el;
    }

    /* Enquiry form */
    function renderEnquiryResponse(form, box) {
        var fields = form.elements;
        var option = ENQUIRY_OPTIONS[fields['type'].value];
        var quantity = Number(fields['quantity'].value);
        var firstName = fields['name'].value.trim().split(' ')[0];
        var parts = fields['date'].value.split('-');
        var niceDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
            .toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });

        box.innerHTML = '';
        addLine(box, 'h3', 'Thank you, ' + firstName);
        addLine(box, 'p', option.label + ', quantity ' + quantity + ', preferred date ' + niceDate + '.');

        if (option.unit === null) {
            addLine(box, 'p', 'Cost: ' + option.priceNote, 'response-price');
        } else {
            var total = option.unit * quantity;
            addLine(box, 'p', 'Cost: ' + quantity + ' x ' + formatRand(option.unit) + ' = ' +
                formatRand(total) + ' (' + formatRand(option.unit) + ' per ' + option.per + ').',
                'response-price');
            if (total > BUDGET_LIMITS[fields['budget'].value]) {
                addLine(box, 'p', 'This is above the budget range you chose. Reply to our email ' +
                    'and we can suggest a smaller option.', 'response-note');
            }
        }

        addLine(box, 'p', 'Availability: ' + option.availability);
        addLine(box, 'p', 'We will confirm by email at ' + fields['email'].value.trim() + '.');
        box.focus();
    }

    var enquiryForm = document.getElementById('enquiry-form');
    if (enquiryForm) {
        setupForm(enquiryForm);
        enquiryForm.elements['date'].setAttribute('min', todayString());

        // Links such as enquiry.html?type=ember-oak preselect that option
        var wantedType = new URLSearchParams(window.location.search).get('type');
        if (wantedType && ENQUIRY_OPTIONS[wantedType]) {
            enquiryForm.elements['type'].value = wantedType;
        }

        var enquiryResponse = document.getElementById('enquiry-response');
        enquiryForm.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!validateForm(enquiryForm)) { return; }

            // Handled in the page with no reload; the short delay mimics a server reply.
            enquiryResponse.hidden = false;
            enquiryResponse.innerHTML = '';
            addLine(enquiryResponse, 'p', 'Checking price and availability...');
            setTimeout(function () {
                renderEnquiryResponse(enquiryForm, enquiryResponse);
            }, 600);
        });
    }

    /* Contact form */
    var contactForm = document.getElementById('contact-form');
    if (contactForm) {
        setupForm(contactForm);

        var contactStatus = document.getElementById('contact-status');
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!validateForm(contactForm)) { return; }

            var fields = contactForm.elements;
            var typeText = fields['type'].options[fields['type'].selectedIndex].text;
            var subject = typeText + ' from ' + fields['name'].value.trim();
            var body = [
                'Name: ' + fields['name'].value.trim(),
                'Email: ' + fields['email'].value.trim(),
                'Phone: ' + fields['phone'].value.trim(),
                'Message type: ' + typeText,
                '',
                'Message:',
                fields['message'].value.trim()
            ].join('\r\n');

            var mailto = 'mailto:' + CONTACT_EMAIL +
                '?subject=' + encodeURIComponent(subject) +
                '&body=' + encodeURIComponent(body);

            contactStatus.hidden = false;
            contactStatus.innerHTML = '';
            addLine(contactStatus, 'h3', 'Your message is ready');
            addLine(contactStatus, 'p', 'Your email app should open with everything filled in. ' +
                'Press Send there to deliver it to ' + CONTACT_EMAIL + '.');
            var again = addLine(contactStatus, 'a', 'Open the email again');
            again.setAttribute('href', mailto);
            contactStatus.focus();

            window.location.href = mailto;
        });
    }


    /* 4. Products: dynamic content, search, filter and sort
       The candle cards are built here from the PRODUCTS list, not typed into
       the HTML. To add a candle, add one more object to the list; the cards,
       the scent-family menu and the results count all update by themselves.
       The id must match an option value in the enquiry form. */

    var PRODUCTS = [
        {
            id: 'ember-oak', name: 'Ember & Oak', price: 250, family: 'Woody',
            image: 'product-placeholder-1',
            alt: 'Ember & Oak hand-poured candle with a warm amber and cedar scent',
            description: 'A warm, woody blend of amber and cedar, finished with a subtle hint of smoke. Our most popular scent and a reliable choice for any occasion.',
            gift: "A versatile option well-suited as a gift when the recipient's preferences are unknown."
        },
        {
            id: 'sunday-morning', name: 'Sunday Morning', price: 220, family: 'Fresh',
            image: 'product-placeholder-2',
            alt: 'Sunday Morning hand-poured candle with a fresh citrus and linen scent',
            description: 'A fresh blend of citrus and clean linen, designed to evoke slow mornings and open windows.',
            gift: 'Ideal for those who prefer a lighter, more subtle fragrance.'
        },
        {
            id: 'firelight-grove', name: 'Firelight Grove', price: 280, family: 'Warm spice',
            image: 'product-placeholder-3',
            alt: 'Firelight Grove hand-poured candle with cedarwood, vanilla and clove',
            description: 'A rich combination of cedarwood, vanilla, and clove, offering warmth without being overpowering.',
            gift: 'A popular choice for housewarmings and seasonal gifting.'
        }
    ];

    var productResults = document.getElementById('product-results');
    var filterForm = document.getElementById('product-filter-form');

    if (productResults && filterForm) {
        var searchInput = document.getElementById('product-search');
        var familySelect = document.getElementById('product-family');
        var sortSelect = document.getElementById('product-sort');
        var resetButton = document.getElementById('product-reset');
        var countText = document.getElementById('product-count');
        var emptyText = document.getElementById('product-empty');

        // Scent-family menu is built from the list, so it always matches the products
        var families = [];
        PRODUCTS.forEach(function (product) {
            if (families.indexOf(product.family) === -1) { families.push(product.family); }
        });
        families.sort().forEach(function (family) {
            var option = document.createElement('option');
            option.value = family;
            option.textContent = family;
            familySelect.appendChild(option);
        });

        function createProductCard(product) {
            var card = document.createElement('article');
            card.className = 'product';

            var picture = document.createElement('img');
            var base = 'images/' + product.image;
            picture.src = base + '.jpg';
            picture.srcset = base + '-400w.jpg 400w, ' + base + '-600w.jpg 600w, ' + base + '-800w.jpg 800w';
            picture.sizes = '(max-width: 600px) 100vw, (max-width: 992px) 50vw, 33vw';
            picture.alt = product.alt;
            card.appendChild(picture);

            addLine(card, 'h3', product.name);
            addLine(card, 'p', product.description);
            addLine(card, 'p', product.gift, 'gift-note');
            addLine(card, 'p', 'R' + product.price, 'price');

            var link = addLine(card, 'a', 'Enquire about ' + product.name, 'cta-button');
            link.setAttribute('href', 'enquiry.html?type=' + encodeURIComponent(product.id));
            return card;
        }

        // Every search word must appear in the name, scent family, description or gift note
        function matchesSearch(product, words) {
            var text = (product.name + ' ' + product.family + ' ' +
                product.description + ' ' + product.gift).toLowerCase();
            return words.every(function (word) { return text.indexOf(word) !== -1; });
        }

        function getVisibleProducts() {
            var words = searchInput.value.toLowerCase().split(/\s+/).filter(Boolean);
            var family = familySelect.value;

            var visible = PRODUCTS.filter(function (product) {
                return (family === 'all' || product.family === family) &&
                    matchesSearch(product, words);
            });

            switch (sortSelect.value) {
                case 'price-asc':
                    visible.sort(function (a, b) { return a.price - b.price; });
                    break;
                case 'price-desc':
                    visible.sort(function (a, b) { return b.price - a.price; });
                    break;
                case 'name':
                    visible.sort(function (a, b) { return a.name.localeCompare(b.name); });
                    break;
            }
            return visible;
        }

        function renderProducts() {
            var visible = getVisibleProducts();
            productResults.innerHTML = '';
            visible.forEach(function (product) {
                productResults.appendChild(createProductCard(product));
            });
            countText.textContent = 'Showing ' + visible.length + ' of ' + PRODUCTS.length +
                (PRODUCTS.length === 1 ? ' candle' : ' candles');
            emptyText.hidden = visible.length > 0;
        }

        searchInput.addEventListener('input', renderProducts);
        familySelect.addEventListener('change', renderProducts);
        sortSelect.addEventListener('change', renderProducts);
        filterForm.addEventListener('submit', function (event) { event.preventDefault(); });
        resetButton.addEventListener('click', function () {
            searchInput.value = '';
            familySelect.value = 'all';
            sortSelect.value = 'featured';
            renderProducts();
            searchInput.focus();
        });

        renderProducts();
    }

    /* 5. FAQ accordion
       Each question is a real button, so Enter and Space work with no extra code.
       Opening one answer closes the others. aria-expanded keeps screen readers informed. */

    var accordionTriggers = Array.prototype.slice.call(
        document.querySelectorAll('.accordion-trigger')
    );

    function setAccordion(trigger, isOpen) {
        var panel = document.getElementById(trigger.getAttribute('aria-controls'));
        trigger.setAttribute('aria-expanded', String(isOpen));
        if (panel) { panel.hidden = !isOpen; }
    }

    accordionTriggers.forEach(function (trigger) {
        trigger.addEventListener('click', function () {
            var wasOpen = trigger.getAttribute('aria-expanded') === 'true';
            accordionTriggers.forEach(function (other) { setAccordion(other, false); });
            setAccordion(trigger, !wasOpen);
        });
    });

    /* 6. Interactive map (Leaflet + OpenStreetMap tiles)
       Shows the studio and the market stall. Visitors can drag, zoom, click a
       marker for details, or press a "Show on map" button to fly to a location.
       Coordinates are approximate for each suburb: replace them with the exact
       latitude and longitude (right-click a spot in Google Maps and copy it). */

    var mapBox = document.getElementById('map');

    if (mapBox && typeof L !== 'undefined') {
        var LOCATIONS = {
            studio: {
                name: 'EmberCraft Studio',
                detail: '12 Jacaranda Street, Hatfield, Pretoria. Visits by appointment only.',
                lat: -25.7487, lng: 28.2380
            },
            market: {
                name: 'Weekend Market Stall',
                detail: 'Hazel Food Market, Brooklyn, Pretoria. Every Saturday, 9am to 2pm.',
                lat: -25.7605, lng: 28.2354
            }
        };

        var map = L.map(mapBox, { scrollWheelZoom: false });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        var markers = {};
        var bounds = [];

        Object.keys(LOCATIONS).forEach(function (key) {
            var place = LOCATIONS[key];
            var popup = document.createElement('div');
            addLine(popup, 'strong', place.name);
            addLine(popup, 'p', place.detail);

            markers[key] = L.marker([place.lat, place.lng], { title: place.name })
                .addTo(map)
                .bindPopup(popup);
            bounds.push([place.lat, place.lng]);
        });

        map.fitBounds(bounds, { padding: [50, 50] });

        Array.prototype.forEach.call(document.querySelectorAll('.map-focus'), function (button) {
            button.addEventListener('click', function () {
                var key = button.getAttribute('data-location');
                var place = LOCATIONS[key];
                if (!place) { return; }
                map.flyTo([place.lat, place.lng], 16, { duration: 1 });
                markers[key].openPopup();
                mapBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
    }

});
