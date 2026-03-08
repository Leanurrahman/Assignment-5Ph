// script.js

// গ্লোবাল ভেরিয়েবল যেখানে সব ডাটা রাখবো
let allIssuesData = [];

// ১. ডাটা লোড করার ফাংশন (আপনার স্টাইলে)
const loadAllIssues = () => {
    const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
    
    fetch(url)
    .then(res => res.json())
    .then(json => {
        // ডাটা সেভ করা
        allIssuesData = json.data;
        console.log("✅ Data Loaded:", allIssuesData);
        
        // ডাটা আসার পর অটোমেটিক 'All' বাটনের মতো আচরণ করানো
        // যাতে পেজ লোড হলেই সব ইস্যু দেখা যায়
        filterAndDisplay('all');
    });
};

// ২. ফিল্টার করে ডাটা দেখানোর ফাংশন
const filterAndDisplay = (type) => {
    const container = document.getElementById("issues-container");
    container.innerHTML = ""; // আগের কন্টেন্ট মুছে ফেলা

    // ডাটা ফিল্টার করা
    let filteredData = [];
    
    if (type === 'all') {
        filteredData = allIssuesData;
    } else if (type === 'open') {
        filteredData = allIssuesData.filter(issue => issue.status === 'open');
    } else if (type === 'closed') {
        filteredData = allIssuesData.filter(issue => issue.status === 'closed');
    }

    // ডাটা না থাকলে কিছু না করা (অথবা চাইলে মেসেজ দেখাতে পারেন)
    if (filteredData.length === 0) {
        container.innerHTML = "<p>No issues found.</p>";
        return;
    }

    // প্রতিটি আইটেমের জন্য কার্ড তৈরি করা
    filteredData.forEach(issue => {
        const card = document.createElement("div");
        
        // স্ট্যাটাস এবং প্রায়োরিটি এর রং ঠিক করা
        const statusColor = issue.status === 'open' 
            ? "bg-green-100 text-green-700 border-green-200" 
            : "bg-purple-100 text-purple-700 border-purple-200";
            
        const priorityColor = issue.priority === 'high' 
            ? "text-red-600 bg-red-50" 
            : (issue.priority === 'medium' ? "text-orange-600 bg-orange-50" : "text-blue-600 bg-blue-50");

        card.className = "bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full";
        
        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-3">
                    <span class="text-xs font-semibold px-2 py-1 rounded border ${statusColor} uppercase tracking-wide">
                        ${issue.status}
                    </span>
                    <span class="text-xs font-medium px-2 py-1 rounded ${priorityColor}">
                        ${issue.priority}
                    </span>
                </div>
                
                <h3 class="font-bold text-gray-900 text-lg leading-tight mb-2">
                    ${issue.title}
                </h3>
                
                <p class="text-gray-600 text-sm mb-4">
                    ${issue.description}
                </p>

                <!-- Labels -->
                <div class="flex flex-wrap gap-2 mb-4">
                    ${issue.labels.map(label => `
                        <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200">
                            ${label}
                        </span>
                    `).join('')}
                </div>
            </div>

            <div class="border-t border-gray-100 pt-3 mt-auto">
                <div class="flex justify-between items-center text-xs text-gray-500">
                    <span>#${issue.id} by <span class="font-medium text-gray-700">${issue.author}</span></span>
                    <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
};

// ৩. বাটন ক্লিক হ্যান্ডলার সেটআপ
const setupFilterButtons = () => {
    const allBtn = document.getElementById("all-btn");
    const openBtn = document.getElementById("open-btn");
    const closedBtn = document.getElementById("closed-btn");

    // স্টাইল আপডেট করার হেল্পার ফাংশন
    const updateButtonStyles = (activeButton) => {
        const buttons = [allBtn, openBtn, closedBtn];
        buttons.forEach(btn => {
            btn.className = "btn bg-white hover:bg-gray-100 text-gray-600 font-medium px-8 py-2 rounded-md border border-gray-300 shadow-sm min-w-[120px] h-10 transition-colors";
        });
        activeButton.className = "btn bg-[#4A00FF] hover:bg-[#3b00cc] text-white font-medium px-8 py-2 rounded-md border-none shadow-sm min-w-[120px] h-10 transition-colors";
    };

    // All Button Click
    allBtn.addEventListener("click", () => {
        updateButtonStyles(allBtn);
        filterAndDisplay('all');
    });

    // Open Button Click
    openBtn.addEventListener("click", () => {
        updateButtonStyles(openBtn);
        filterAndDisplay('open');
    });

    // Closed Button Click
    closedBtn.addEventListener("click", () => {
        updateButtonStyles(closedBtn);
        filterAndDisplay('closed');
    });
};

// ৪. পেজ লোড হলে কাজ শুরু
document.addEventListener("DOMContentLoaded", () => {
    setupFilterButtons(); // বাটন রেডি করা
    loadAllIssues();      // ডাটা লোড করা
});