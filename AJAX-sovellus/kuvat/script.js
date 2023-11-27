const theaterSelect = document.getElementById("theater-select");
const timeSelect = document.getElementById("time-select");
const movieList = document.getElementById("laatikko");

function fetchData(selectedTheater, selectedDate) {
    const url = `https://www.finnkino.fi/xml/Schedule/?area=${selectedTheater}&dt=${selectedDate}`;

    fetch(url)
        .then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            movieList.innerHTML = ""; 

            const elokuvat = data.querySelectorAll('Show');
            for (let i = 0; i < elokuvat.length; i++) {
                let show = elokuvat[i];
                let title = show.getElementsByTagName('Title')[0].innerHTML;
                let genres = show.getElementsByTagName('Genres')[0].innerHTML;
                let eventSmallImagePortrait = show.getElementsByTagName('EventSmallImagePortrait')[0].innerHTML;
                let dtLocalRelease = show.getElementsByTagName('dtLocalRelease')[0].innerHTML;
                let director = ""; 
                let actors = "";   
                let duration = show.getElementsByTagName('LengthInMinutes')[0].innerHTML;

                let elokuvaContainer = document.createElement('div');
                elokuvaContainer.classList.add('elokuva-container');
                let html = `
                    <img src="${eventSmallImagePortrait}" alt="${title}">
                    <div class="elokuva-tiedot">
                        <h1>${title}</h1>
                        <p>Screening time: ${formatDate(dtLocalRelease)}</p>
                        <p>Genre: ${genres}</p>
                        <p>Director: ${director}</p>
                        <p>Actors: ${actors}</p>
                        <p>Duration: ${duration} min</p>
                    </div>`;
                elokuvaContainer.innerHTML = html;
                movieList.appendChild(elokuvaContainer);
            }
        })
        .catch(error => {
            console.error(error);
        });
}

function updateMovies() {
    const selectedTheater = theaterSelect.value;
    const selectedDate = timeSelect.value;

    fetchData(selectedTheater, selectedDate);
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
}

theaterSelect.addEventListener("change", updateMovies);
timeSelect.addEventListener("change", updateMovies);


const startDate = new Date('2023-11-26');
const endDate = new Date('2023-12-26');
let currentDate = startDate;

while (currentDate <= endDate) {
    const formattedDate = currentDate.toISOString().split('T')[0];
    const option = document.createElement('option');
    option.value = formattedDate;
    option.text = formatDate(formattedDate);
    timeSelect.add(option);
    currentDate.setDate(currentDate.getDate() + 1);
}


updateMovies();
