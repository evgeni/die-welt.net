// Initialization
var searchIndex = new FlexSearch.Index({});
var searchData = {};

// Load the search index
fetch('/search_index.json')
    .then(response => response.json())
    .then(data => {
        searchData = data;
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                // Change here which keys should be used for the search index.
                searchIndex.add(key, data[key].title + " " + data[key].content + data[key].tags + " " + data[key].content);
            }
        }
        console.log("Search index loaded successfully");
    })
    .catch(error => {
        console.error("Error loading search index:", error);
    });

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");

    // Get DOM elements
    var searchButton = document.getElementById('search_button');
    var searchInput = document.getElementById('search_input');

    // Add event listener to search button
    if (searchButton) {
        console.log("Search button found and event listener added");
        searchButton.addEventListener('click', function() {
            doSearch();
        });
    } else {
        console.error("Search button not found");
    }

    // Add event listener for Enter key
    if (searchInput) {
        console.log("Search input found and event listener added");
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                doSearch();
            }
        });
    } else {
        console.error("Search input not found");
    }

    // Add ESC key listener for closing overlay
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            var overlay = document.getElementById('search_overlay');
            if (overlay && overlay.style.display !== 'none') {
                overlay.style.display = 'none';
            }
        }
    });
});

// Separate function outside any event handlers
function doSearch() {
    console.log("Search function called");
    var query = document.getElementById('search_input').value;
    if (!query || query.trim() === '') {
        console.log("Empty search query");
        return;
    }

    console.log("Searching for:", query);
    var results = searchIndex.search(query);
    console.log("Search results:", results);

    var resultsContainer = document.getElementById('search_results');
    if (!resultsContainer) {
        console.error("Results container not found");
        return;
    }

    // Clear previous results
    resultsContainer.innerHTML = '';

    // Display results
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found</p>';
    } else {
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var div = document.createElement('div');
            var link = document.createElement('a');
            link.href = searchData[result].url +'?utm_source=internal_search';
            link.textContent = searchData[result].title;
            if (searchData[result].type) {
                var typeSpan = document.createElement('span');
                typeSpan.style.marginRight = '5px';
                typeSpan.style.padding = '2px 5px';
                typeSpan.style.backgroundColor = '#f0f0f0';
                typeSpan.style.borderRadius = '3px';
                typeSpan.style.fontSize = '0.8em';
                typeSpan.textContent = searchData[result].type;
                div.appendChild(typeSpan);
            }
            div.appendChild(link);
            resultsContainer.appendChild(div);
        }
    }

    // Show the overlay
    var overlay = document.getElementById('search_overlay');
    if (overlay) {
        overlay.style.display = 'flex';
    } else {
        console.error("Search overlay not found");
    }
}

// Global function for closing the overlay
function closeSearch() {
    console.log("Close search called");
    var overlay = document.getElementById('search_overlay');
    if (overlay) {
        overlay.style.display = 'none';
    } else {
        console.error("Search overlay not found in closeSearch");
    }
}
