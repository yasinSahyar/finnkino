// script.js

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
                let showDate = new Date(show.getElementsByTagName('dttmShowStart')[0].innerHTML);

                // Extract year, month, and day from the show date
                let showYear = showDate.getFullYear();
                let showMonth = showDate.getMonth() + 1; // Month is zero-based
                let showDay = showDate.getDate();

                // Extract year, month, and day from the selected date
                let [selectedYear, selectedMonth, selectedDay] = selectedDate.split('-').map(Number);

                // Check if the movie date matches the selected date (ignoring time)
                if (showYear === selectedYear && showMonth === selectedMonth && showDay === selectedDay) {
                    let title = show.getElementsByTagName('Title')[0].innerHTML;
                    let genres = show.getElementsByTagName('Genres')[0].innerHTML;
                    let eventSmallImagePortrait = show.getElementsByTagName('EventSmallImagePortrait')[0].innerHTML;
                    let dtLocalRelease = show.getElementsByTagName('dttmShowStart')[0].innerHTML;
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
            }
        })
        .catch(error => {
            console.error(error);
        });
}

function updateMovies() {
    const selectedTheater = theaterSelect.value;
    const selectedDate = timeSelect.value;
    console.log(selectedDate); // Add this line to check the selected date value
    fetchData(selectedTheater, selectedDate);
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
}

theaterSelect.addEventListener("change", updateMovies);
timeSelect.addEventListener("change", updateMovies);





// Initialize with the first option values
updateMovies();
