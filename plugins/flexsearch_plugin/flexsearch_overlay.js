document.addEventListener('DOMContentLoaded', function() {
    // Initialize FlexSearch indices
    var docIndex = new FlexSearch.Document({
        id: "id",
        store: true,
        index: [{
            field: "title",
            tokenize: "forward",
            resolution: 9
        },{
            field:  "content",
            resolution: 3
        },{
            field: "tags",
            resolution: 6
        }]
    });
    var searchMode = 'all'; // Default search mode: 'all', 'title', 'content', 'tags'

    // Get DOM elements
    var searchInput = document.getElementById('search_input');
    var searchButton = document.getElementById('search_button');
    var searchOverlay = document.getElementById('search_overlay');
    var searchContent = searchOverlay ? document.getElementById('search_content') : null;
    var searchResults = document.getElementById('search_results');

    // Initialize search overlay structure if it exists
    if (searchOverlay && searchContent && searchResults) {
        // Create the header if it doesn't exist
        if (!document.getElementById('search_header')) {
            var header = document.createElement('div');
            header.id = 'search_header';
            header.innerHTML = `
                <div class="search-title">Search Results</div>
                <button onclick="closeSearch()" class="close-button">×</button>
            `;
            searchContent.insertBefore(header, searchContent.firstChild);
        }

        // Create filters container if it doesn't exist
        if (!document.getElementById('search_filters')) {
            var filters = document.createElement('div');
            filters.id = 'search_filters';
            filters.className = 'search-filters';
            searchContent.insertBefore(filters, searchResults);

            // Create results header
            var resultsHeader = document.createElement('div');
            resultsHeader.id = 'search_results_header';
            resultsHeader.className = 'search-results-header';
            searchContent.insertBefore(resultsHeader, searchResults);
        }
    }

    // Set up search button click event
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            performSearch();
        });
    }

    // Set up enter key press event
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === "Enter" || event.keyCode === 13) {
                event.preventDefault();
                performSearch();
            }
        });

        searchInput.addEventListener('focus', function(event) {
            loadDocIndex();
        }, {once: true});
    }

    // Set up escape key to close overlay
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && searchOverlay && searchOverlay.style.display === 'flex') {
            closeSearch();
        }
    });

    function loadDocIndex() {
      // Fetch the search index data
      fetch('/search_index.json')
      .then(response => response.json())
      .then(data => {
        // Load data into indices
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                docIndex.add({id: key, title: data[key].title, content: data[key].content, tags: data[key].tags, type: data[key].type, url: data[key].url});
            }
        }
        // Set up filters after data is loaded
        setupSearchFilters();
      })
      .catch(error => {
        console.error('Error loading search index:', error);
      });
    }

    // Function to perform search
    function performSearch() {
        if (!searchInput || !searchResults || !searchOverlay) return;

        var query = searchInput.value;
        if (query.trim() === '') return; // Don't search for empty strings

        var filterContainer = document.getElementById('search_filters');
        var resultsHeader = document.getElementById('search_results_header');
        searchResults.innerHTML = ''; // Clear previous results

        // Determine which indices to search based on search mode
        var allResults = [];

        var searchOpts = { merge: true, enrich: true, highlight: { template: '<strong class="search-highlight">$1</strong>', boundary: 200 } };
        if (searchMode !== 'all') {
            searchOpts['index'] = searchMode;
        }
        allResults = docIndex.search(query, searchOpts);


        // Update results count
        if (resultsHeader) {
            var searchModeText = searchMode.charAt(0).toUpperCase() + searchMode.substring(1)
            resultsHeader.innerHTML = `<div class="search-stats">${allResults.length} results found · Search mode: ${searchModeText}</div>`;
        }

        // Show message if no results
        if (allResults.length === 0) {
            searchResults.innerHTML = '<p class="no-results">No results found. Try a different search term or change search mode.</p>';
            searchOverlay.style.display = 'flex'; // Show the overlay even for no results
            return;
        }

        // Show warning if too many results
        if (allResults.length > 30) {
            var infoBox = document.createElement('div');
            infoBox.className = 'results-info';
            infoBox.innerHTML = `<p>Showing ${allResults.length} results. Try a more specific search term or use the filters to refine your search.</p>`;
            searchResults.appendChild(infoBox);
        }

        // Limit the number of displayed results to avoid performance issues
        var maxResults = 200;
        var displayedResults = allResults.slice(0, maxResults);

        // Display results
        displayedResults.forEach(function(result) {
            var div = document.createElement('div');
            div.className = 'search-result-item';
            var link = document.createElement('a');
            link.href = result.doc.url;

            // Add a badge for content type
            var badge = document.createElement('span');
            badge.className = 'badge';
            badge.textContent = result.doc.type || 'post';
            div.appendChild(badge);

            // Add the title
            var titleElem = document.createElement('span');
            titleElem.className = 'result-title';
            titleElem.innerHTML = result.highlight.title ? result.highlight.title : result.doc.title;
            link.appendChild(titleElem);

            // Add a snippet of content if available
            if (result.doc.content) {
                var snippetElem = document.createElement('div');
                snippetElem.className = 'result-snippet';
                snippetElem.innerHTML = result.highlight.content ? result.highlight.content : result.doc.content.substring(0, 100) + '...';;
                link.appendChild(snippetElem);
            }

            div.appendChild(link);
            searchResults.appendChild(div);
        });

        // Show message if results were limited
        if (allResults.length > maxResults) {
            var limitMessage = document.createElement('div');
            limitMessage.className = 'results-limit-message';
            limitMessage.textContent = `Showing ${maxResults} of ${allResults.length} results. Please refine your search to see more relevant results.`;
            searchResults.appendChild(limitMessage);
        }

        // Show the overlay
        searchOverlay.style.display = 'flex';
    }

    // Function to set up search filters
    function setupSearchFilters() {
        var filterContainer = document.getElementById('search_filters');
        if (!filterContainer) return;

        filterContainer.innerHTML = `
            <div class="search-filter-group">
                <span class="filter-label">Search in:</span>
                <button id="filter_all" class="filter-button active">All</button>
                <button id="filter_title" class="filter-button">Title</button>
                <button id="filter_content" class="filter-button">Content</button>
                <button id="filter_tags" class="filter-button">Tags</button>
            </div>
        `;

        // Add event listeners for filter buttons
        document.getElementById('filter_all').addEventListener('click', function() {
            setSearchMode('all');
            highlightActiveFilter('filter_all');
            performSearch();
        });

        document.getElementById('filter_title').addEventListener('click', function() {
            setSearchMode('title');
            highlightActiveFilter('filter_title');
            performSearch();
        });

        document.getElementById('filter_content').addEventListener('click', function() {
            setSearchMode('content');
            highlightActiveFilter('filter_content');
            performSearch();
        });

        document.getElementById('filter_tags').addEventListener('click', function() {
            setSearchMode('tags');
            highlightActiveFilter('filter_tags');
            performSearch();
        });
    }

    // Function to set search mode
    function setSearchMode(mode) {
        searchMode = mode;
    }

    // Function to highlight active filter button
    function highlightActiveFilter(activeId) {
        var buttons = document.querySelectorAll('.filter-button');
        buttons.forEach(function(button) {
            button.classList.remove('active');
        });
        document.getElementById(activeId).classList.add('active');
    }
});

// Function to close the search overlay - must be defined outside DOMContentLoaded
// to be accessible to the onclick handler
function closeSearch() {
    var searchOverlay = document.getElementById('search_overlay');
    if (searchOverlay) {
        searchOverlay.style.display = 'none';
    }
}
