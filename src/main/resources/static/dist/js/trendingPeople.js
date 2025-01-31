console.log("trending people js in!");
const fetchTrendingData = async ()=> {
    try {
        const response = await fetch('https://api.themoviedb.org/3/trending/person/week?language=ko-KR', options);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching trending data:', error);
    }
};

    const displayPeopleData = async ()=>{
        const people = await fetchTrendingData();
        const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
        for(const p of people) {
            const innerContainer = document.querySelector('.trendingPeopleContainer');
            const posterPath = p.profile_path ? `${imageBaseUrl}${p.profile_path}` : `/dist/image/default_profile_m.jpg`;

            const peopleDiv = document.createElement('div');
            peopleDiv.classList.add('trendingPeople');
            const peopleDetails = `
                <img src = "${posterPath}" alt = "사진없음">
                <span>${p.name} </span>
        `;

            peopleDiv.innerHTML = peopleDetails;
            innerContainer.appendChild(peopleDiv);
        }

    }

    displayPeopleData();


