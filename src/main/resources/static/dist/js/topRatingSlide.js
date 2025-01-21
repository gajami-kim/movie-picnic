console.log("topRatingSlide js in");

let currentSlide2 = 0;
const slideWidth2 = 1380;
const visibleItems2 = 5;

const slideSpeed3 = (speed) => {
    const innerContainer2 = document.querySelector('.innerContainer2');
    const movieItems = innerContainer2.querySelectorAll('.nowPlayingMovie2').length;
    const maxSlide = Math.floor(movieItems - visibleItems2);

    if (currentSlide2 < maxSlide) {
        currentSlide2 ++;
        innerContainer2.style.transform = `translateX(-${currentSlide2 * slideWidth2}px)`;
        innerContainer2.style.transition = `transform ${speed}s`;
    }

    updateButtonVisibility2();
};

const slideSpeed4 = (speed) => {
    if (currentSlide2 > 0) {
        currentSlide2--;
        document.querySelector('.innerContainer2').style.transform = `translateX(-${currentSlide2 * slideWidth2}px)`;
        document.querySelector('.innerContainer2').style.transition = `transform ${speed}s`;
    }

    updateButtonVisibility2();
};


document.getElementById('rightBtn2').addEventListener('click', () => {
    slideSpeed3(1);
    document.querySelector('.movieOutBox2').style.overflow = 'hidden';
});

document.getElementById('leftBtn2').addEventListener('click', () => {
    slideSpeed4(1);
    document.querySelector('.movieOutBox2').style.overflow = 'hidden';
});
const updateButtonVisibility2 = () => {
    const innerContainer2 = document.querySelector('.innerContainer2');
    const movieItems = innerContainer2.querySelectorAll('.nowPlayingMovie2').length;
    const visibleItems2 = 5;
    const maxSlide = movieItems / visibleItems2;
    const leftBtn2 = document.getElementById('leftBtn2');
    const rightBtn2 = document.getElementById('rightBtn2');

    console.log("max 슬라이드 개수 > > >", maxSlide);
    console.log("보여줄 영화 개수 > > > ", movieItems);
    console.log("슬라이드 개수 > > > ", currentSlide2);

    leftBtn2.style.display = (currentSlide2 > 0) ? 'block' : 'none';
    rightBtn2.style.display = (currentSlide2 + 1 < maxSlide) ? 'block' : 'none';
};


const fetchMovieData2 = async () => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1', options);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
};
const displayMovies2 = async () => {
    const movies = await fetchMovieData2();
    const innerContainer2 = document.querySelector('.innerContainer2');
    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

    for (const movie of movies) {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('nowPlayingMovieMain');

        const posterPath = movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : '';
        const movieDetails = `
                <div class="nowPlayingMovie2" style="cursor:pointer;" id="${movie.id}">
                    <img src="${posterPath}" alt="${movie.title} 포스터">
                    <ul>
                        <li>${movie.title}</li>
                        <li>${movie.release_date}</li>
                        <li>${movie.vote_average}</li>
                    </ul>
                </div>
            `;
        movieDiv.innerHTML = movieDetails;
        innerContainer2.appendChild(movieDiv);
    }
    updateButtonVisibility2();
};
displayMovies2();

