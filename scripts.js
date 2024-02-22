const url = "./pagination.json";
const tableBody = document.getElementById('tableBody');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const pageNumbers = document.getElementById('page-numbers');
let limit = document.getElementById("limit").value;
let currentPage = 0;
let listLength = 0;
let data = [];
function fetchData(url) {
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((list) => {
            console.log("Success:", list);
            data = list;
            listLength = data.length;
            const start = Number(currentPage) * Number(limit);
            const end = Math.min(Number(start) + Number(limit), listLength);
            const currentPageData = data.slice(Number(start), Number(end));

            tableBody.innerHTML = "";
            for (const item of currentPageData) {

                const row = document.createElement("tr");
                for (const property in item) {
                    const cell = document.createElement("td");
                    cell.textContent = item[property];
                    row.appendChild(cell);
                }
                tableBody.appendChild(row);
            }
            updatePageNumbers();
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}


function updatePageNumbers() {
    const totalPages = Math.ceil(data.length / limit);
    let pageNumbersHTML = '';

    for (let i = 0; i < totalPages; i++) {
        pageNumbersHTML += `<button class="page-number" data-page="${i}">${i + 1}</button>`;
    }

    pageNumbers.innerHTML = pageNumbersHTML;

    const pageButtons = document.querySelectorAll('.page-number');
    pageButtons[currentPage].classList.add('active');

    for (const button of pageButtons) {
        button.addEventListener('click', handlePageChange);
    }
}

function handlePageChange(event) {
    const newPage = Number(event.target.dataset.page);
    if (newPage !== currentPage) {
        currentPage = newPage;
        fetchData(url);
    }
}

prevButton.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        fetchData(url);
    }
});

nextButton.addEventListener('click', () => {
    const totalPages = Math.ceil(data.length / limit);
    if (currentPage < totalPages - 1) {
        currentPage++;
        fetchData(url);
    }
});

function changeLimit() {
    limit = document.getElementById("limit").value;
    currentPage = 0;
    fetchData(url)
}


fetchData(url);