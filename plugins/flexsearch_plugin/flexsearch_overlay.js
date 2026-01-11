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
    }

    // Set up escape key to close overlay
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && searchOverlay && searchOverlay.style.display === 'flex') {
            closeSearch();
        }
    });

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

        var searchOpts = { merge: true, enrich: true };
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
            titleElem.textContent = result.doc.title;
            link.appendChild(titleElem);

            // Add a snippet of content if available
            if (result.doc.content) {
                var contentSnippet = getSnippet(result.doc.content, query, 100);
                if (contentSnippet) {
                    var snippetElem = document.createElement('div');
                    snippetElem.className = 'result-snippet';
                    snippetElem.innerHTML = contentSnippet;
                    link.appendChild(snippetElem);
                }
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

    // Helper function to get content snippet with highlighted search term
    function getSnippet(content, query, maxLength) {
        if (!content) return '';

        // Find the position of the query in the content (case insensitive)
        var lowerContent = content.toLowerCase();
        var lowerQuery = query.toLowerCase();
        var position = lowerContent.indexOf(lowerQuery);

        if (position === -1) {
            // If exact match not found, look for any word from the query
            var queryWords = lowerQuery.split(' ').filter(w => w.length > 2);
            for (var i = 0; i < queryWords.length; i++) {
                position = lowerContent.indexOf(queryWords[i]);
                if (position !== -1) break;
            }
        }

        if (position === -1) {
            // If still not found, just take the beginning of the content
            return content.substring(0, maxLength) + '...';
        }

        // Calculate snippet start position to center the found term
        var start = Math.max(0, position - Math.floor(maxLength / 2));
        var end = Math.min(content.length, start + maxLength);

        // Adjust start if we're near the end to always show maxLength characters
        if (end === content.length) {
            start = Math.max(0, end - maxLength);
        }

        // Get snippet and add ellipsis if needed
        var snippet = (start > 0 ? '...' : '') +
                      content.substring(start, end) +
                      (end < content.length ? '...' : '');

        // Highlight the search term (simple approach)
        return highlightSearchTerm(snippet, query);
    }

    // Function to highlight search terms in a snippet
    function highlightSearchTerm(snippet, query) {
        var lowerSnippet = snippet.toLowerCase();
        var lowerQuery = query.toLowerCase();
        var result = snippet;
        var terms = lowerQuery.split(' ').filter(t => t.length > 2);

        // Add the full query as a term to highlight
        if (terms.indexOf(lowerQuery) === -1 && lowerQuery.length > 2) {
            terms.push(lowerQuery);
        }

        // Sort terms by length (descending) to highlight longer matches first
        terms.sort(function(a, b) {
            return b.length - a.length;
        });

        // Replace each term with a highlighted version
        for (var i = 0; i < terms.length; i++) {
            var term = terms[i];
            var startIndex = 0;
            var position;

            while ((position = lowerSnippet.indexOf(term, startIndex)) !== -1) {
                var actualTerm = snippet.substring(position, position + term.length);
                var highlighted = '<strong class="search-highlight">' + actualTerm + '</strong>';

                // Replace the term with its highlighted version
                result = result.substring(0, position) + highlighted + result.substring(position + term.length);

                // Update the working copies to account for the added HTML
                var lengthDiff = highlighted.length - actualTerm.length;
                lowerSnippet = lowerSnippet.substring(0, position) + term + lowerSnippet.substring(position + term.length);
                startIndex = position + term.length;

                // Update the result length
                snippet = result;
                lowerSnippet = snippet.toLowerCase();
                break; // Only highlight the first occurrence of each term
            }
        }

        return result;
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
