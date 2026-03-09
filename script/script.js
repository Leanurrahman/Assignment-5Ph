let allIssuesData = [];

const loadAllIssues = () => {
    const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
    
  
    const loadingSection = document.getElementById("loading-section");
    const issuesContainer = document.getElementById("issues-container");

    if (loadingSection) loadingSection.classList.remove("hidden");
    if (issuesContainer) issuesContainer.innerHTML = "";

    fetch(url)
    .then(res => res.json())
    .then(json => {
        allIssuesData = json.data;
        
   
        if (loadingSection) loadingSection.classList.add("hidden");
        
        filterAndDisplay('all');
    });
    
};

const filterAndDisplay = (type) => {
      const container = document.getElementById("issues-container");
    const loadingSection = document.getElementById("loading-section"); 
    const countElement = document.getElementById("issues-count");

    if (!container) return;

    // loading section dekhano and container khali kora
    if (loadingSection) loadingSection.classList.remove("hidden");
    container.innerHTML = ""; 

    let filteredData = [];
    
    if (type === 'all') {
        filteredData = allIssuesData;
    } else if (type === 'open') {
        filteredData = allIssuesData.filter(issue => issue.status === 'open');
    } else if (type === 'closed') {
        filteredData = allIssuesData.filter(issue => issue.status === 'closed');
    }

    // counter update kora
    if (countElement) {
        countElement.innerText = `${filteredData.length} Issues`;
    }


    
    setTimeout(() => {
        
        if (loadingSection) loadingSection.classList.add("hidden");

        if (filteredData.length === 0) {
            container.innerHTML = "<p class='text-center col-span-full text-gray-500 py-10'>No issues found.</p>";
            return;
        }

        filteredData.forEach(issue => {
            const card = createIssueCard(issue);
            container.appendChild(card);
        });
    }, 250); //250 milisec wait korbe loading hote

    filteredData.forEach(issue => {
        const card = document.createElement("div");
        
        //image eikhne store korbo
        let statusImgSrc = "";
        let borderColorClass = "";
        let iconImgSrc = "";

        if (issue.status === 'open') {
            statusImgSrc = "./assets/Open-Status.png"; 
            borderColorClass = "border-t-[3px] border-t-green-500";
            iconImgSrc = "./assets/Open-Status.png"; 
        } else {
            
            statusImgSrc = "./assets/Closed- Status .png"; 
            borderColorClass = "border-t-[3px] border-t-purple-500";
            iconImgSrc = "./assets/Closed- Status .png";
        }

        // color logic
        const priorityColor = issue.priority === 'high' ? "text-red-600 bg-red-50" : (issue.priority === 'medium' ? "text-orange-600 bg-orange-50" : "text-blue-600 bg-blue-50");

        
        card.className = `bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full ${borderColorClass}`;
        
        
        card.style.cursor = "pointer"; 
        card.addEventListener('click', () => {
            showIssueDetails(issue); // click korle modal function call hbe
        });
   

        card.innerHTML = `
            <div class="flex flex-col h-full">

                <div class="flex justify-between items-start mb-4">
                    <img src="${statusImgSrc}" alt="${issue.status}" class="h-6 w-6 object-contain">
                    
                    <span class="text-xs font-medium px-3 py-1 rounded-full ${priorityColor}">
                        ${issue.priority.toUpperCase()}
                    </span>
                </div>
                
                
                <h3 class="font-bold text-gray-900 text-lg leading-snug mb-2 line-clamp-2">
                    ${issue.title}
                </h3>
                
                <p class="text-gray-500 text-sm mb-4 line-clamp-2">
                    ${issue.description}
                </p>

                
                <div class="flex flex-wrap gap-2 mb-auto"> 
                    ${issue.labels.map(label => {
                        let labelText = label.toUpperCase();
                        let iconSrc = "";
                        let labelStyle = "bg-gray-100 text-gray-700 border-gray-200";

                   
                        if(label.toLowerCase() === 'bug') {
                            labelStyle = "bg-red-50 text-red-600 border-red-200";
                            iconSrc = "./assets/BugDroid.png";
                        }
                      
                        else if(label.toLowerCase() === 'help wanted') {
                            labelStyle = "bg-yellow-50 text-yellow-700 border-yellow-200";
                            iconSrc = "./assets/Lifebuoy.png";
                        } else if(label.toLowerCase() === 'good first issue') {
                            labelStyle = "bg-yellow-50 text-yellow-700 border-yellow-200";
                            iconSrc = "./assets/Lifebuoy.png";
                        }
                 
                        else if(label.toLowerCase() === 'enhancement') {
                             labelStyle = "bg-green-50 text-green-600 border-green-200";
                            iconSrc = "./assets/Sparkle.png";

                        } else if(label.toLowerCase() === 'documentation') {
                             labelStyle = "bg-green-50 text-green-600 border-green-200";
                            iconSrc = "./assets/Sparkle.png";

                        }

                        return `
                            <span class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${labelStyle}">
                                ${iconSrc ? `<img src="${iconSrc}" alt="" class="w-3.5 h-3.5 object-contain">` : ''}
                                ${labelText}
                            </span>
                        `;
                    }).join('')}
                </div>

              
                <div class="border-t border-gray-100 pt-4 mt-4">
                    <div class="flex flex-col items-start gap-1 text-xs text-gray-500">
                        <div>
                            <span class="font-medium text-gray-700">#${issue.id}</span>
                            <span> by </span>
                            <span class="font-medium text-gray-700">${issue.author}</span>
                        </div>
                        <div>
                            ${new Date(issue.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
};


//btn event listener
const setupFilterButtons = () => {
    const allBtn = document.getElementById("all-btn");
    const openBtn = document.getElementById("open-btn");
    const closedBtn = document.getElementById("closed-btn");

    if (!allBtn || !openBtn || !closedBtn) {
        console.error("Filter buttons not found in HTML!");
        return;
    }

    const updateButtonStyles = (activeButton) => {
        const buttons = [allBtn, openBtn, closedBtn];
        buttons.forEach(btn => {
            btn.className = "btn bg-white hover:bg-gray-100 text-gray-600 font-medium px-8 py-2 rounded-md border border-gray-300 shadow-sm min-w-[120px] h-10 transition-colors";
        });
        activeButton.className = "btn bg-[#4A00FF] hover:bg-[#3b00cc] text-white font-medium px-8 py-2 rounded-md border-none shadow-sm min-w-[120px] h-10 transition-colors";
    };

    allBtn.addEventListener("click", () => {
        updateButtonStyles(allBtn);
        filterAndDisplay('all');
    });

    openBtn.addEventListener("click", () => {
        updateButtonStyles(openBtn);
        filterAndDisplay('open');
    });

    closedBtn.addEventListener("click", () => {
        updateButtonStyles(closedBtn);
        filterAndDisplay('closed');
    });
};

// page load event
// document.addEventListener("DOMContentLoaded", () => {
//     setupFilterButtons();
//     loadAllIssues();
// });



// Modal function 
const showIssueDetails = (issue) => {
    const modal = document.getElementById('issue-details-modal');
    
    // title
    document.getElementById('modal-title').innerText = issue.title;
    
    // status badge
    const statusBadge = document.getElementById('modal-status-badge');
    if (issue.status === 'open') {
        statusBadge.className = "px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600 text-white";
        statusBadge.innerText = "Opened";
    } else {
        statusBadge.className = "px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500 text-white";
        statusBadge.innerText = "Closed";
    }

    //others information
    document.getElementById('modal-author').innerText = issue.author;
    document.getElementById('modal-date').innerText = new Date(issue.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    document.getElementById('modal-description').innerText = issue.description;
    document.getElementById('modal-assignee').innerText = issue.assignee || 'Unassigned';

    // priority part
    const priorityEl = document.getElementById('modal-priority');
    priorityEl.innerText = issue.priority.toUpperCase();
    if (issue.priority === 'high') {
        priorityEl.className = "inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white";
    } else if (issue.priority === 'medium') {
        priorityEl.className = "inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white";
    } else {
        priorityEl.className = "inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-500 text-white";
    }

    const labelsContainer = document.getElementById('modal-labels');
    labelsContainer.innerHTML = issue.labels.map(label => {
        let labelText = label.toUpperCase();
        let iconSrc = "";
        let labelStyle = "bg-gray-100 text-gray-700 border-gray-200";

        // bug er jnno style and icon
        if (label.toLowerCase() === 'bug') {
            labelStyle = "bg-red-50 text-red-600 border-red-200";
            iconSrc = "./assets/BugDroid.png";
        }
   
        else if (label.toLowerCase() === 'help wanted' || label.toLowerCase() === 'good first issue') {
            labelStyle = "bg-yellow-50 text-yellow-700 border-yellow-200";
            iconSrc = "./assets/Lifebuoy.png";
        }
     
        else if (label.toLowerCase() === 'enhancement' || label.toLowerCase() === 'documentation') {
            labelStyle = "bg-green-50 text-green-600 border-green-200";
            iconSrc = "./assets/Sparkle.png";
        }

        
        const iconHTML = iconSrc ? `<img src="${iconSrc}" alt="" class="w-3.5 h-3.5 object-contain">` : '';

        return `
            <span class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${labelStyle}">
                ${iconHTML}${labelText}
            </span>
        `;
    }).join('');

    
    modal.showModal();
};



// search function eikhne
const setupSearchFunctionality = () => {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (!searchInput || !searchBtn) return;

    // search korar main function
    const performSearch = () => {
        const query = searchInput.value.trim();
        
        if (!query) {
            // khali tkle issue dekhabe
            loadAllIssues();
            return;
        }

        const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(query)}`;
        const container = document.getElementById("issues-container");

        
        container.innerHTML = `
            <div class="col-span-full flex justify-center items-center py-20">
                <span class="loading loading-spinner loading-lg text-[#4A00FF]"></span>
            </div>
        `;

        fetch(url)
        .then(res => res.json())
        .then(json => {

            const results = json.data || json; 
            console.log(results);
            
            displaySearchResults(results);
            
            // counter update
            const countElement = document.getElementById("issues-count");
            if (countElement) {
                countElement.innerText = `${results.length} Issues`;
            }
        })
        .catch(error => {
            console.error("Search error:", error);
            container.innerHTML = "<p class='text-center text-red-500 col-span-full'>Search failed. Please try again.</p>";
        });
    };


    searchBtn.addEventListener('click', performSearch);

    // enter chaple search hbe
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
};

// search result dekhabor function
const displaySearchResults = (results) => {
    const container = document.getElementById("issues-container");
    if (!container) return;

    container.innerHTML = "";

    if (results.length === 0) {
        container.innerHTML = "<p class='text-center col-span-full text-gray-500 py-10'>No issues found matching your search.</p>";
        return;
    }

    results.forEach(issue => {
        const card = document.createElement("div");
        
   
        let statusImgSrc = "";
        let borderColorClass = "";

        if (issue.status === 'open') {
            statusImgSrc = "./assets/Open-Status.png"; 
            borderColorClass = "border-t-[3px] border-t-green-500";
        } else {
         
            statusImgSrc = "./assets/Closed- Status .png"; 
            borderColorClass = "border-t-[3px] border-t-purple-500";
        }
   
        const priorityColor = issue.priority === 'high' ? "text-red-600 bg-red-50" : (issue.priority === 'medium' ? "text-orange-600 bg-orange-50" : "text-blue-600 bg-blue-50");

        card.className = `bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full ${borderColorClass}`;
        card.style.cursor = "pointer";
        
      
        card.addEventListener('click', () => showIssueDetails(issue));

      
        const labelsHTML = issue.labels.map(label => {
            let labelText = label.toUpperCase();
            let iconSrc = "";
            let labelStyle = "bg-gray-100 text-gray-700 border-gray-200";

            if (label.toLowerCase() === 'bug') {
                labelStyle = "bg-red-50 text-red-600 border-red-200";
                iconSrc = "./assets/BugDroid.png";
            } else if (label.toLowerCase() === 'help wanted' || label.toLowerCase() === 'good first issue') {
                labelStyle = "bg-yellow-50 text-yellow-700 border-yellow-200";
                iconSrc = "./assets/Lifebuoy.png";
            } else if (label.toLowerCase() === 'enhancement' || label.toLowerCase() === 'documentation') {
                labelStyle = "bg-green-50 text-green-600 border-green-200";
                iconSrc = "./assets/Sparkle.png";
            }

            const iconHTML = iconSrc ? `<img src="${iconSrc}" alt="" class="w-3.5 h-3.5 object-contain">` : '';
            return `<span class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${labelStyle}">${iconHTML}${labelText}</span>`;
        }).join('');

        card.innerHTML = `
            <div class="flex flex-col h-full">

                <div class="flex justify-between items-start mb-4">
                    <img src="${statusImgSrc}" alt="${issue.status}" class="h-6 w-6 object-contain">
                    <span class="text-xs font-medium px-3 py-1 rounded-full ${priorityColor}">${issue.priority.toUpperCase()}</span>
                </div>
                
                <h3 class="font-bold text-gray-900 text-lg leading-snug mb-2 line-clamp-2">${issue.title}</h3>
                <p class="text-gray-500 text-sm mb-4 line-clamp-2">${issue.description}</p>
                
                <!-- lebel section -->
                <div class="flex flex-wrap gap-2 mb-auto">${labelsHTML}</div>
                
                <div class="border-t border-gray-100 pt-4 mt-4">
                    <div class="flex flex-col items-start gap-1 text-xs text-gray-500">
                        <div><span class="font-medium text-gray-700">#${issue.id}</span> by <span class="font-medium text-gray-700">${issue.author}</span></div>
                        <div>${new Date(issue.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
};

//Updated dom load event here
document.addEventListener("DOMContentLoaded", () => {
    setupFilterButtons();
    setupSearchFunctionality(); // new function call
    loadAllIssues();
});