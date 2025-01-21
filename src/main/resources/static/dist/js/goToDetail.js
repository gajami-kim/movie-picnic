console.log("goToDetail js in");
document.addEventListener('click', function (event) {
    var clickedElement = event.target;
    while (clickedElement) {
        if (clickedElement.className === 'nowPlayingMovie') {
            const movieId = clickedElement.id;
            console.log(movieId);
            window.location.href = `/movie/detail?movieId=${movieId}`;
            break;
        }else if(clickedElement.className === 'topMovie'){
            const movieId = clickedElement.id;
            console.log(movieId);
            window.location.href = `/movie/detail?movieId=${movieId}`;
            break;
        }
        clickedElement = clickedElement.parentElement;
    }
});

