// ملف js/script.js

// Dark/Light Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
// Check for saved theme preference or use preferred color scheme
const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
html.classList.add(savedTheme);
// Update button icon based on current theme
if (savedTheme === 'dark') {
    themeToggle.innerHTML = '<i class="fas fa-sun text-xl"></i>';
} else {
    themeToggle.innerHTML = '<i class="fas fa-moon text-xl"></i>';
}
themeToggle.addEventListener('click', () => {
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon text-xl"></i>';
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun text-xl"></i>';
    }
});
// Language Toggle (English/Arabic)
const languageToggle = document.getElementById('languageToggle');
const currentLang = document.querySelector('.current-lang');
let isRTL = false;
languageToggle.addEventListener('click', () => {
    if (isRTL) {
        document.body.classList.remove('rtl-support');
        currentLang.textContent = 'EN';
        isRTL = false;
    } else {
        document.body.classList.add('rtl-support');
        currentLang.textContent = 'AR';
        isRTL = true;
    }
});
// Side Menu Toggle
const profileBtn = document.getElementById('profileBtn');
const sideMenu = document.getElementById('sideMenu');
const closeMenuBtn = document.getElementById('closeMenuBtn');
profileBtn.addEventListener('click', () => {
    sideMenu.classList.remove('translate-x-full');
});
closeMenuBtn.addEventListener('click', () => {
    sideMenu.classList.add('translate-x-full');
});
// Cart Modal Toggle
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.getElementById('closeCartBtn');
cartBtn.addEventListener('click', () => {
    cartModal.classList.remove('hidden');
});
closeCartBtn.addEventListener('click', () => {
    cartModal.classList.add('hidden');
});
// Show tracking modal (demo)
setTimeout(() => {
    const trackingModal = document.getElementById('trackingModal');
    const closeTrackingBtn = document.getElementById('closeTrackingBtn');
    // Show tracking modal after 3 seconds (demo)
    setTimeout(() => {
        trackingModal.classList.remove('hidden');
    }, 3000);
    closeTrackingBtn.addEventListener('click', () => {
        trackingModal.classList.add('hidden');
    });
}, 1000);
// Simulate vendor page navigation
document.querySelectorAll('.vendor-card').forEach(card => {
    card.addEventListener('click', () => {
        // In a real app, this would navigate to the vendor page
        alert('Navigating to vendor page');
    });
});
// Simulate category navigation
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        // In a real app, this would show items in the selected category
        alert(`Showing items in ${card.querySelector('p').textContent} category`);
    });
});

// --- دوال جديدة للتعامل مع الـ API ---
// Base URL للـ Backend
const API_BASE_URL = 'https://tunnel-url.localtunnel.me/api'; // رابط LocalTunnel

// دوال مساعدة للتعامل مع الـ API
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            // لو في توكن، نضيفه للـ header
            ...(localStorage.getItem('token') && {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            })
        },
        ...options
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error(`API Error (${url}):`, error);
        throw error;
    }
};

// Auth APIs
window.ZaboxAPI = {
    registerUser: (userData) => apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),

    loginUser: (credentials) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),

    // Vendor APIs
    getVendors: () => apiRequest('/vendors'),

    // Order APIs
    createOrder: (orderData) => apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
    }),

    getMyOrders: () => apiRequest('/orders/myorders'),

    // Driver APIs
    getDrivers: () => apiRequest('/drivers'),

    // دوال للتعامل مع التوكن
    setAuthToken: (token) => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

// Function to load vendors from API
async function loadVendors() {
    try {
        console.log('جاري تحميل البائعين...');
        const vendors = await ZaboxAPI.getVendors();
        console.log('البائعين اللي اتجابوا:', vendors);
        // هنا هنرسم البائعين على الصفحة
        renderVendors(vendors);
    } catch (error) {
        console.error('خطأ في تحميل البائعين:', error);
        // نظهر رسالة للمستخدم
        alert('فشل في تحميل البائعين: ' + error.message);
    }
}

// Function to render vendors on the page
function renderVendors(vendors) {
    // نجيب الـ div اللي فيه البائعين (grid)
    const vendorsContainer = document.querySelector('.grid.grid-cols-2.gap-4');
    if (!vendorsContainer) {
        console.error('ما لقيناش الـ container بتاع البائعين');
        return;
    }
    
    // نمسح المحتوى القديم
    vendorsContainer.innerHTML = '';
    
    // نرسم بطاقة لكل بائع
    vendors.forEach(vendor => {
        const vendorCard = document.createElement('div');
        vendorCard.className = 'vendor-card bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transition-transform';
        vendorCard.innerHTML = `
            <div class="relative">
                <img src="${vendor.coverPhoto || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'}" 
                    alt="${vendor.businessName}" class="w-full h-32 object-cover">
                <div class="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <i class="fas fa-star text-yellow-400 mr-1"></i>
                    ${vendor.rating?.average || 'N/A'}
                </div>
            </div>
            <div class="p-3">
                <h3 class="font-semibold dark:text-white">${vendor.businessName}</h3>
                <div class="flex justify-between items-center mt-2">
                    <span class="text-xs text-gray-500 dark:text-gray-300 flex items-center">
                        <i class="fas fa-clock mr-1"></i> 20-40 min
                    </span>
                    <span class="text-xs font-medium text-secondary">EGP ${vendor.deliveryFee || 0} Delivery</span>
                </div>
            </div>
        `;
        vendorsContainer.appendChild(vendorCard);
    });
}

// نبدأ نحمل البائعين لما الصفحة تتحمل
document.addEventListener('DOMContentLoaded', async function() {
    console.log('الصفحة اتحملت، نبدأ نجيب البائعين...');
    await loadVendors();
});