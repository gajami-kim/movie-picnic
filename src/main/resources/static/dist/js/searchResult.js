const UrlParams = new URLSearchParams(window.location.search);
const keyword = UrlParams.get('keyword');
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

searchMovieList(keyword).then(result => {
    console.log(result);
    // 검색 결과가 없을 때
    if (result.results.length < 1) {
        console.log("검색 결과 없음");
        return;
    }

    // popularity 기준으로 내림차순 정렬
    result.results.sort((a, b) => b.popularity - a.popularity);

    for (let rr of result.results) {
        const posterPath = rr.poster_path ? `${imageBaseUrl}${rr.poster_path}` : '';
        const profilePath = rr.profile_path ? `${imageBaseUrl}${rr.profile_path}` : '';

        if (rr.media_type === "person") {
            document.querySelector('.personSpan').style.display = 'block';
            const personDiv = document.createElement('div');
            personDiv.classList.add('personResultDiv');
            let personDetails = `<div class="personOne">
                                <a href="/movie/person?personId=${rr.id}"><div class="personImg" style="background: url('${profilePath}') no-repeat center -16px /100%">`;
            if (profilePath == '') {
                if (rr.gender === 1) {
                    personDetails += `<img src="/dist/image/default_profile_w.jpg">`;
                } else {
                    personDetails += `<img src="/dist/image/default_profile_m.jpg">`;
                }
                personDetails += `</a><div class="nameDiv">${rr.name}</div></div>`;
            } else if (profilePath !== '') {
                personDetails += `</div></a><div class="nameDiv2">${rr.name}</div>`;
            }
            personDiv.innerHTML = personDetails;
            document.querySelector('.personResult').appendChild(personDiv);
        }

        if (rr.media_type !== "person") {
            const isMovie = rr.media_type === 'movie';
            const mediaSpanClass = isMovie ? '.movieSpan' : '.tvSpan';
            const mediaResultClass = isMovie ? 'movieResultDiv' : 'tvResultDiv';
            const mediaResultDiv = isMovie ? '.movieResult' : '.tvResult';
            const mediaOneDiv = isMovie ? 'movieOne' : 'tvOne';
            const mediaTitle = isMovie ? rr.title : rr.name;
            const locationHref = isMovie ? `movieId=${rr.id}` : `tvId=${rr.id}`;

            document.querySelector(mediaSpanClass).style.display = 'block';
            const mediaDiv = document.createElement('div');
            mediaDiv.classList.add(mediaResultClass);
            let structure = `
                <div class="${mediaOneDiv}">
                    <a href="/movie/detail?${locationHref}">`;
            if (posterPath !== '') {
                structure += `<img src="${posterPath}">`;
            } else {
                structure += `<img src="/dist/image/no_image.png">`;
            }
            structure += `</a><div class="nameDiv">${mediaTitle}</div></div>`;
            mediaDiv.innerHTML = structure;
            document.querySelector(mediaResultDiv).appendChild(mediaDiv);
        }
    }
})

async function searchMovieList(keyword) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${keyword}&include_adult=false&language=ko-KR&page=1`, options);
        const result = await response.json();
        return result;
    } catch (err) {
        console.log("movie not found :" + err);
    }
}

