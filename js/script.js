'use strict';

// Capturing elements
const loader = document.getElementById('loader')
const searchForm = document.getElementById('searchForm'); 
const searchInput = document.getElementById('searchInput')
const resultsContainer = document.getElementById('results')

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const query = searchInput.value;

    if (query.trim() === ""){ // Checking if the search is not null
        alert("Please type something to search.");
        return;     
    }

    // Clean previous results and show loading screen
    resultsContainer.innerHTML = '';
    loader.classList.remove('hidden');


    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}`; // Bulding the API

    fetch (url)
        .then(response => response.json()) // Converting the response to json
        .then(data => {
            displayBooks(data);
            loader.classList.add('hidden');
        })
    .catch (error => {
        console.error("Coudn't find any data, error")
        resultsContainer.innerHTML = "There was an error in your search!";
        loader.classList.add('hidden');
    });
});

//Function to display the books
function displayBooks(data){
    // Cleaning previous results
    resultsContainer.innerHTML =''; 

    // Checking if the API returned something
    if(!data.items){
        resultsContainer.innerHTML = "No results found for this term.";
        return;
    }

    // Loop for each book on the list
    data.items.forEach(book => {
        // Now the code get every info needed from the book
        const volumeInfo = book.volumeInfo;
        const title = volumeInfo.title;

        // In case of missing cover / author
        const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknow author';
        const thumbnail = volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192.png?text=No+Image';
        const infoLink = volumeInfo.infoLink;

        // Creating the dynamic HTML elements for each book searched
        const bookElement = document.createElement('div');
        bookElement.classList.add('book-card'); // Add a class to manipulate with css

        //Now setting up the element model + clickable if theres a link

        if (infoLink){
            bookElement.innerHTML = `
                <a href="${infoLink}" target="_blank" rel="noopener noreferrer">
                    <img src="${thumbnail}" alt="Book Cover ${title}">
                    <h3>${title}</h3>
                    <p>${authors}</p>
                </a>
            `;
        }

        else {
        bookElement.innerHTML = `
            <img src="${thumbnail}" alt="Book Cover ${title}">
            <h3>${title}</h3>
            <p>${authors}</p>
        `;
        }

        resultsContainer.appendChild(bookElement); // Adding the lastest added book to the result div
    });
}