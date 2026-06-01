/**
 * AYDIN OTO SERVİS - MAIN DYNAMIC INTERACTIONS
 * Responsive Controls, Form Submissions & HUD Visuals
 */

// 0. GÜVENLİK: Clickjacking (UI Redressing) Koruması
if (window.top !== window.self) {
    window.top.location = window.self.location;
}

// 1. ACTIVE LINK INDICATOR, SCROLLING NAVBAR & NAVIGATION
function initializeNavigation() {
    const navbar = document.querySelector("nav");
    const navLinks = document.querySelectorAll(".nav-link");
    const currentPath = window.location.pathname;

    // Highlight the active page link
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (currentPath.endsWith(href) || (currentPath.endsWith("/") && href === "index.html")) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // Toggle navbar transparent/solid background on scroll
    window.addEventListener("scroll", () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        }
    });

    // 2. RESPONSIVE MOBILE NAVIGATION DRAWER
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener("click", () => {
            const isHidden = mobileMenu.classList.contains("hidden");
            if (isHidden) {
                mobileMenu.classList.remove("hidden");
                mobileMenu.classList.add("flex");
                // Animate entry
                setTimeout(() => {
                    mobileMenu.classList.remove("opacity-0", "-translate-y-4");
                }, 10);
            } else {
                mobileMenu.classList.add("opacity-0", "-translate-y-4");
                // Wait for transition before hiding
                setTimeout(() => {
                    mobileMenu.classList.add("hidden");
                    mobileMenu.classList.remove("flex");
                }, 300);
            }
        });
    }

    // Close mobile menu when clicking any link
    const mobileLinks = document.querySelectorAll("#mobile-menu a");
    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (mobileMenu) {
                mobileMenu.classList.add("opacity-0", "-translate-y-4");
                setTimeout(() => {
                    mobileMenu.classList.add("hidden");
                    mobileMenu.classList.remove("flex");
                }, 300);
            }
        });
    });

    // Sayfa yüklendiğinde diğer bileşenleri de başlat
    initializeBookingForm();
    initializeCalendar();
}

// 4. FLOATING CUSTOM HUD NOTIFICATION SYSTEM
function showHUDNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `fixed bottom-5 right-5 z-50 px-6 py-4 rounded-lg backdrop-blur-lg border text-sm font-bold tracking-wider transition-all duration-500 transform translate-y-10 opacity-0 uppercase ${
        type === "error" 
            ? "bg-red-950/80 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]" 
            : "bg-cyan-950/80 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-base animate-pulse">
                ${type === "error" ? "report" : "info"}
            </span>
            <span id="notification-message"></span>
        </div>
    `;
    
    notification.querySelector("#notification-message").textContent = message;
    
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.remove("translate-y-10", "opacity-0"), 10);

    setTimeout(() => {
        notification.classList.add("translate-y-10", "opacity-0");
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// 5. GORGEOUS HUD SUCCESS MODAL
function showHUDSuccessModal(clientName, category) {
    const modalOverlay = document.createElement("div");
    modalOverlay.className = "fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md opacity-0 transition-opacity duration-300";
    
    modalOverlay.innerHTML = `
        <div class="bg-[#121222]/90 border border-cyan-500 rounded-xl p-8 max-w-md w-full mx-4 shadow-[0_0_30px_rgba(0,210,255,0.4)] scanline-top transform scale-90 transition-transform duration-300 relative">
            <div class="absolute top-4 right-4 cursor-pointer text-cyan-500 hover:text-white transition-colors" id="close-modal-btn">
                <span class="material-symbols-outlined">close</span>
            </div>
            <div class="flex flex-col items-center text-center gap-4">
                <div class="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(0,210,255,0.3)] animate-bounce">
                    <span class="material-symbols-outlined text-cyan-400 text-3xl">task_alt</span>
                </div>
                <h3 class="font-headline-lg text-2xl text-cyan-400 glow-text uppercase tracking-wider italic">Randevu Talebi Alındı!</h3>
                <p id="modal-dynamic-text" class="font-body-md text-on-surface-variant leading-relaxed"></p>
                <div class="w-full bg-[#1e1e2f] border border-cyan-500/20 rounded p-3 text-left font-mono text-xs text-cyan-300 mt-2">
                    <div class="flex justify-between"><span>DURUM:</span> <span class="text-green-400">BAĞLANTI AKTİF</span></div>
                    <div class="flex justify-between"><span>İŞLEM:</span> <span>RANDEVU_KAYDI_OK</span></div>
                    <div class="flex justify-between"><span>SUNUCU:</span> <span>AVCI_L_09</span></div>
                </div>
                <button class="mt-4 px-6 py-2 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all duration-300 uppercase tracking-widest text-xs font-bold scale-95 active:scale-90" id="close-modal-action">
                    Terminali Kapat
                </button>
            </div>
        </div>
    `;

    const pElement = modalOverlay.querySelector("#modal-dynamic-text");
    
    const strongName = document.createElement("strong");
    strongName.className = "text-white";
    strongName.textContent = clientName;

    const strongCategory = document.createElement("strong");
    strongCategory.textContent = category;

    pElement.appendChild(document.createTextNode("Sayın "));
    pElement.appendChild(strongName);
    pElement.appendChild(document.createTextNode(", "));
    pElement.appendChild(strongCategory);
    pElement.appendChild(document.createTextNode(" talebiniz sistem veri tabanımıza başarıyla kaydedilmiştir. Müşteri temsilcilerimiz en kısa sürede sizinle iletişime geçecektir."));

    document.body.appendChild(modalOverlay);

    setTimeout(() => {
        modalOverlay.classList.remove("opacity-0");
        modalOverlay.querySelector("div").classList.remove("scale-90");
    }, 10);

    const closeModal = () => {
        modalOverlay.classList.add("opacity-0");
        modalOverlay.querySelector("div").classList.add("scale-90");
        setTimeout(() => {
            modalOverlay.remove();
        }, 300);
    };

    document.getElementById("close-modal-btn").addEventListener("click", closeModal, { once: true });
    document.getElementById("close-modal-action").addEventListener("click", closeModal, { once: true });
}

// 3. APPOINTMENT FORM ANIMATION & VALİDATION (On randevu.html)
function initializeBookingForm() {
    const bookingForm = document.getElementById("booking-form");
    if (!bookingForm) return;

    bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Inputs
        const nameInput = document.getElementById("client-name");
        const contactInput = document.getElementById("client-contact");
        const categorySelect = document.getElementById("service-category");
        const dateInput = document.getElementById("service-date");
        const detailsTextarea = document.getElementById("service-details");
        const submitBtn = document.getElementById("submit-booking-btn");

        // Simple validation check
        const contactValue = contactInput.value.trim();
        if (!nameInput.value.trim() || !contactValue) {
            showHUDNotification("Hata: Lütfen adınızı ve iletişim bilgilerinizi giriniz!", "error");
            return;
        }

        // Advanced Contact Validation (Turkish Phone Number or Email Address)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const cleanPhone = contactValue.replace(/[\s()+-]/g, "");
        const phoneRegex = /^(0?\s?)?[5][0-9]{9}$/; // Matches 5xxxxxxxxx or 05xxxxxxxxx after cleaning

        if (!emailRegex.test(contactValue) && !phoneRegex.test(cleanPhone)) {
            showHUDNotification("Hata: Geçerli bir telefon numarası veya e-posta adresi giriniz!", "error");
            return;
        }

        // High-tech processing state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            ŞİFRELEME AKTİF // GÖNDERİLİYOR...
        `;

        // Mock network latency for tech HUD feel
        setTimeout(() => {
            const clientName = nameInput.value;
            const clientContact = contactInput.value;
            const category = categorySelect.value;
            const serviceDate = dateInput ? dateInput.value : "";
            const details = detailsTextarea ? detailsTextarea.value : "";

            // Success Modal Display
            showHUDSuccessModal(clientName, category);

            // WhatsApp Mesajı Oluşturma
            const dateObj = new Date(serviceDate);
            const formattedDate = isNaN(dateObj.getTime()) ? serviceDate : dateObj.toLocaleDateString("tr-TR");

            const whatsappMessage = `*Yeni Randevu Talebi (Aydın Oto Servis)*\n\n` +
                                    `👤 *Müşteri:* ${clientName}\n` +
                                    `📞 *İletişim:* ${clientContact}\n` +
                                    `🛠️ *Hizmet:* ${category}\n` +
                                    `📅 *Tarih:* ${formattedDate}\n` +
                                    `📝 *Şikayet/Açıklama:* ${details || "Belirtilmedi"}`;

            const whatsappUrl = `https://wa.me/905352119011?text=${encodeURIComponent(whatsappMessage)}`;

            // Formu sıfırla ama butonu hemen aktif etme, "Başarılı" state'ine al
            bookingForm.reset();
            submitBtn.innerHTML = "RANDEVU OLUŞTURULDU";
            submitBtn.classList.replace("bg-[#E63946]", "bg-green-600");
            submitBtn.classList.replace("hover:bg-[#ff4d5a]", "hover:bg-green-500");
            
            // WhatsApp Yönlendirmesini tetikle
            window.open(whatsappUrl, '_blank');

            // Double-submit (Spam) engellemek için butonu bir süre kilitli tut
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                submitBtn.classList.replace("bg-green-600", "bg-[#E63946]");
                submitBtn.classList.replace("hover:bg-green-500", "hover:bg-[#ff4d5a]");
            }, 5000); // 5 saniye soğuma süresi (Cooldown)
        }, 1800);
    });
}

// 6. CUSTOM HUD CALENDAR DATEPICKER
function initializeCalendar() {
    const dateInput = document.getElementById("service-date");
    const hudCalendar = document.getElementById("hud-calendar");
    
    if (!dateInput || !hudCalendar) return;

    const monthSelect = document.getElementById("cal-month-select");
    const yearSelect = document.getElementById("cal-year-select");
    const daysGrid = document.getElementById("cal-days-grid");
    const prevBtn = document.getElementById("cal-prev-btn");
    const nextBtn = document.getElementById("cal-next-btn");
    
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    
    const monthNames = [
        "OCAK", "ŞUBAT", "MART", "NİSAN", "MAYIS", "HAZİRAN", 
        "TEMMUZ", "AĞUSTOS", "EYLÜL", "EKİM", "KASIM", "ARALIK"
    ];

    // Populate month select dropdown dynamically
    monthSelect.innerHTML = "";
    monthNames.forEach((name, index) => {
        const opt = document.createElement("option");
        opt.value = index;
        opt.textContent = name;
        monthSelect.appendChild(opt);
    });

    // Populate year select dropdown dynamically (current year to current year + 5)
    yearSelect.innerHTML = "";
    const startYear = new Date().getFullYear();
    for (let y = startYear; y <= startYear + 5; y++) {
        const opt = document.createElement("option");
        opt.value = y;
        opt.textContent = y;
        yearSelect.appendChild(opt);
    }
    
    function renderCalendar(month, year) {
        daysGrid.innerHTML = "";
        
        // Set header select values
        monthSelect.value = month;
        yearSelect.value = year;
        
        // Find first day index of the month (Monday-based indexing)
        const firstDayRaw = new Date(year, month, 1).getDay();
        const firstDayIndex = (firstDayRaw - 1 + 7) % 7;
        
        // Get total days in month
        const totalDays = new Date(year, month + 1, 0).getDate();
        
        // Today's date with zeroed time for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Render empty cells before the first day
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.className = "cal-day-cell empty";
            daysGrid.appendChild(emptyCell);
        }
        
        // Render days
        for (let day = 1; day <= totalDays; day++) {
            const cell = document.createElement("div");
            cell.className = "cal-day-cell";
            cell.textContent = day;
            
            const cellDate = new Date(year, month, day);
            const formattedDay = String(day).padStart(2, "0");
            const formattedMonth = String(month + 1).padStart(2, "0");
            const dateStr = `${formattedDay}.${formattedMonth}.${year}`;
            
            if (cellDate < today || cellDate.getDay() === 0) {
                cell.classList.add("disabled");
            } else {
                if (dateInput.value === dateStr) {
                    cell.classList.add("selected");
                }
                
                cell.addEventListener("click", (e) => {
                    e.stopPropagation();
                    dateInput.value = dateStr;
                    
                    // Hide calendar
                    hudCalendar.classList.add("hidden");
                });
            }
            daysGrid.appendChild(cell);
        }

        // Render empty cells after the last day
        const totalCellsRendered = firstDayIndex + totalDays;
        const remainingCells = 42 - totalCellsRendered;
        for (let i = 0; i < remainingCells; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.className = "cal-day-cell empty";
            daysGrid.appendChild(emptyCell);
        }
    }
    
    // Initial Render
    renderCalendar(currentMonth, currentYear);
    
    // Dropdown selection changes
    monthSelect.addEventListener("change", () => {
        currentMonth = parseInt(monthSelect.value, 10);
        renderCalendar(currentMonth, currentYear);
    });

    yearSelect.addEventListener("change", () => {
        currentYear = parseInt(yearSelect.value, 10);
        renderCalendar(currentMonth, currentYear);
    });
    
    // Input click toggles calendar visibility
    dateInput.addEventListener("click", (e) => {
        e.stopPropagation();
        const isHidden = hudCalendar.classList.contains("hidden");
        if (isHidden) {
            renderCalendar(currentMonth, currentYear);
            hudCalendar.classList.remove("hidden");
        } else {
            hudCalendar.classList.add("hidden");
        }
    });
    
    // Previous Month click
    prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });
    
    // Next Month click
    nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });
    
    // Close calendar when clicking outside
    document.addEventListener("click", (e) => {
        if (!hudCalendar.classList.contains("hidden") && !dateInput.contains(e.target) && !hudCalendar.contains(e.target)) {
            hudCalendar.classList.add("hidden");
        }
    });
}

// Sayfa yüklendiğinde sadece initializeNavigation(); tetiklenir
document.addEventListener("DOMContentLoaded", () => {
    initializeNavigation();
});
