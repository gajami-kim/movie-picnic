console.log("random Comment js in");
async function fetchRandomComments() {
    try {
        const response = await fetch('/api/comments/random'); // 수정된 URL
        const comments = await response.json();
        console.log("comment >>>> ", comments);
        return comments;
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

async function getDetail(movieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`, options);
        if (!response.ok) {
            throw new Error('Movie details not found');
        }
        const result = await response.json();
        return result;
    } catch (err) {
        console.error('Error fetching movie details:', err);
        throw err;
    }
}

async function displayComments(comments) {
    const commentContainer = document.querySelector('.commentInBox');
    commentContainer.innerHTML = '';
    for (const comment of comments) {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        const movieId = comment.mediaId;
        getUserInfo(comment.email).then(async userInfo => {
            try {
                const result = await getDetail(movieId);
                const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
                const posterPath = result.poster_path ? `${imageBaseUrl}${result.poster_path}` : '기본 포스터 url';
                commentDiv.innerHTML = `
                <img class="mainposter" src="${posterPath}" alt="포스터">
                <small class="commentThing commentContents">${comment.content}</small>
                <hr>
                <small class="hiddenEmail" style="display: none">${comment.email}</small>
                <small class="commentThing commentWriter goToUserPage">${userInfo.nickname}</small>
            `;
                commentContainer.appendChild(commentDiv);
            } catch (error) {
                console.error('Error displaying comment details:', error);
            }
        });
    }

    setTimeout(() => {
        document.querySelectorAll('.goToUserPage').forEach(element => {
            element.addEventListener('click', (event) => {
                const email = event.target.closest('.comment').querySelector('.hiddenEmail').innerText;
                const form = document.createElement('form');
                form.method = 'post';
                form.action = '/user/mypage';
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = 'email';
                hiddenField.value = email;
                form.appendChild(hiddenField);
                document.body.appendChild(form);
                form.submit();
            });
        });
    }, 100);
}
window.onload = async () => {
    const comments = await fetchRandomComments();
    if (comments) {
        await displayComments(comments);
    }
};

async function getUserInfo(id) {
    try {
        const url = '/user/info/' + id;
        const config = {
            method: 'GET'
        };
        const resp = await fetch(url, config);
        return await resp.json();
    } catch (e) {
        console.log(e);
    }
}
