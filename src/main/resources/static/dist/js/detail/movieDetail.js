const urlParams = new URLSearchParams(window.location.search);
const thumbnail = document.querySelector(".detail1");
const mainposter = document.querySelector(".mainposter");
const voteDiv = document.querySelector(".detailVote");
const detailTitlediv = document.querySelector(".detailTitle");
const detailCatediv = document.querySelector(".detailcate");
const detailRelease = document.querySelector(".detailReleaseDate");
const detailRunTime = document.querySelector(".detailRuntime");
const storyText = document.querySelector(".detailText");
const imageBaseUrl = 'https://image.tmdb.org/t/p/original';
const imageBasicurl = '/dist/image/no_image.png';
let mediaInfo = {
    mediaId: "",
    urlInfo: "",
    type: ""
};
var mycode = {}
let isWish = false;

if (urlParams.has("movieId")) {
    mediaInfo.mediaId = urlParams.get("movieId");
    mediaInfo.urlInfo = "movie";
    mediaInfo.type = "movie";
} else if (urlParams.has("tvId")) {
    mediaInfo.mediaId = urlParams.get("tvId");
    mediaInfo.urlInfo = "tv";
    mediaInfo.type = "tv";
}
console.log(mediaInfo);

// console.log(window.location.href.substring(window.location.href.indexOf("?")+1).includes("movieId"));
console.log(urlParams.has("movieId"));

getDetail(mediaInfo).then(result => {
    console.log(result.release_date);
    console.log(result.runtime);
    console.log(typeof (result.overview));
    console.log(changesecondToTime(result.runtime));
    const posterPath = result.poster_path != null ? `${imageBaseUrl}${result.poster_path}` : `${imageBasicurl}`;
    const backdropPath = result.backdrop_path != null ? `${imageBaseUrl}${result.backdrop_path}` : '';
    const backdropsrc = backdropPath;
    const mainpostersrc = posterPath;
    const voteNum = `⭐${result.vote_average} (${result.vote_count})`;
    const releaseTime = result.release_date != null ? result.release_date.replaceAll("-",".") : '';
    const runTime =result.runtime != null ? changesecondToTime(result.runtime) : '';
    const detailTitle = mediaInfo.type == "tv" ? result.name : result.title;
    let overView = " "
    if(result.overview.length == 0){
        overView = "줄거리가 제공되지 않습니다.";
        document.querySelector(".more-text").style.display="none";
        document.querySelector(".less-text").style.display="none";
    }else{
        overView = result.overview;
        document.querySelector(".less-text").style.display="none";
        document.querySelector(".detailText").style.overflow="hidden";
    }


    // 카테고리 목록 생성
    const cateul = document.createElement('ul');
    cateul.classList.add('detailCateUl'); // 스타일 적용
    for (const category of result.genres) {
        const cateLi = document.createElement('li');
        const span = document.createElement('span');
        span.classList.add(category.id);
        span.textContent = `#${category.name}`;
        cateLi.appendChild(span);
        cateul.appendChild(cateLi);
    }
    detailCatediv.appendChild(cateul);

    // 백그라운드 이미지 및 포스터 설정
    thumbnail.style.backgroundImage = backdropPath ? `url(${backdropsrc})` : `linear-gradient(to right, black,#000000e0, rgba(42,40,40,0.7))`;
    mainposter.src = mainpostersrc ? mainpostersrc : '기본 포스터 URL';
    voteDiv.innerText = voteNum;
    detailTitlediv.innerText = detailTitle;
    detailRelease.innerText = releaseTime;
    detailRunTime.innerText = runTime;
    storyText.innerText = overView;


}).catch(err => {
    console.error('Error fetching movie details:', err);
});


getCommentList(mediaInfo.mediaId).then(result => {
    const detailContainer = document.querySelector(".detail4");
    console.log(result.nickname); // 데이터 확인용
    const ul = document.createElement("ul");
    ul.classList.add("detailCommentUl");
    islikeBtn(userInfo.email).then(likeCodes =>{
    if (result.length == 0) {
        detailContainer.innerHTML = `<div class="detailNoComment"><span>아직 댓글이 없습니다.</span></div>`;
        return;
    }
    result.forEach(comment => {
        var isLiked = likeCodes.some(code => code == comment.commentCode);
        if (comment.email == user.innerText) {
            document.getElementById("commentText").innerText = `${comment.content}`;
            document.getElementById("commentBtn").style.display = "none";
            document.querySelector(".detailSubmitBtn").innerHTML =
                `<div class="detailCommentCode" style="display: none">${comment.commentCode}</div>
                    <button type = "button" class="detailCommentUpdate">수정</button>
                    <button type = "button" class="detailCommentDelete">삭제</button>`;
            if (comment.spoiler == 1) {
                spoilerCheckbox.checked = 1;
            }
        } else {
            const li = document.createElement('li');
            li.innerHTML = `
                    <div class="detailCommentCode" style="display: none">${comment.commentCode}</div>
                    <div class="detailUserName">${comment.nickname}</div>
                    <div class="detailRegDate">${elapsedTime(comment.regDate)}</div>`;
            if (comment.spoiler == 1) {
                li.innerHTML += `
                    <div class="detailspoiler">
                        <div class="detailContent" style="display: none">${comment.content}</div>
                        <span>스포일러입니다.</span>
                        <button type="button" class= "spoilerbtn"onclick="toggleSpoiler(this)">보기</button>
                    </div>
                    <div class="commentlikediv">
                    <div class="commentlikeCount">${comment.count}</div>
                    <button type="button" class="commentLikeBtn" onclick=${isLiked ? 'deleteLikeBtn(this)': 'addlikeBtn(this)'} id="commentLikeBtn" disabled="disabled"
                    style="background-color: ${isLiked ? 'red' : 'gray'}">좋아요</button>
                    </div>`;
            } else {
                li.innerHTML += `
                <div class ="detailnospoiler">
                <div class="detailContent" id="detail">${comment.content}</div>
                <div class="commnetlikediv">
                <div class="commentlikeCount">${comment.count}</div>
                <button type="button" class="commentLikeBtn" onclick=${isLiked ? 'deleteLikeBtn(this)': 'addlikeBtn(this)'} id="commentLikeBtn"
                style="background-color: ${isLiked ? 'red' : 'gray'}">좋아요</button>
                </div>`;
            }
            ul.appendChild(li);
        }
    });
    }).catch(err=>{
        console.error('Error fetching movie details:', err);
    })
    detailContainer.appendChild(ul);
});



document.addEventListener("click", (e) => {
    try {
        const target = e.target;
        let code = document.querySelector(".detailCommentCode").innerText;
        if (target.classList.contains("detailCommentUpdate")) {
            if (confirm("댓글을 수정 하시겠습니까?")) {
                const config = {
                    commentCode: code,
                    mediaId: userInfo.mediaId,
                    content: document.getElementById("commentText").value,
                    spoiler: spoilerCheckbox.value,
                };
                updateComment(config).then(result => {
                    if (result == 1) {
                        alert("댓글을 수정 하였습니다.");
                    } else {
                        alert("댓글을 수정 실패 하였습니다.")
                    }
                })
            }
            console.log("수정");
            console.log(code);
        }
        if (target.classList.contains("detailCommentDelete")) {
            if (confirm("댓글을 삭제 하시겠습니까?")) {
                deleteComment(code).then(result => {
                    if (result == 1) {
                        alert("댓글이 삭제 되었습니다.");
                        location.reload(true);
                    } else {
                        alert("댓글 삭제 실패");
                    }
                })
            } else {
                alert("삭제 취소하셨습니다.");
            }
        }
    } catch (err) {

    }
})

// 더보기/간략히 보기 버튼 처리
document.querySelector('.detailStory').addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('more-text')) {
        target.style.display = 'none';
        document.querySelector('.less-text').style.display = 'inline-block';
        document.querySelector(".detailText").style.removeProperty("overflow");
        storyText.style.display = 'inline-block';
    } else if (target.classList.contains('less-text')) {
        target.style.display = 'none';
        document.querySelector('.more-text').style.display = 'inline-block';
        document.querySelector(".detailText").style.overflow ="hidden";
        storyText.style.display = '-webkit-box';
    }
});

// 좋아요 버튼 count 넣기
async function addCommentLikeCount(userInfo) {
    try {
        console.log(userInfo);
        const url = "/movie/addCommentLike";
        const config = {
            method: "POST",
            headers: {
                'content-type': 'application/json; charset =utf-8'
            },
            body: JSON.stringify(userInfo)
        }
        const resp = await fetch(url, config);
        const result = await resp.text();
        console.log(result);
        return result;
    } catch (err) {
        console.log(err);
    }
}

// 댓글 삭제
async function deleteComment(commentCode) {
    try {
        const url = "/movie/deleteComment/" + commentCode;
        const config = {
            method: "DELETE"
        }
        const resp = await fetch(url, config);
        const result = await resp.text();
        return result;
    } catch (err) {
        console.log("deleteComment fail" + err);
    }
}

// 댓글 수정
async function updateComment(commentConfig) {
    try {
        const url = "/movie/updateComment";
        const config = {
            method: "PUT",
            headers: {
                'content-type': 'application/json; charset =utf-8'
            },
            body: JSON.stringify(commentConfig)
        }
        const resp = await fetch(url, config);
        const result = await resp.text();
        return result;
    } catch (err) {
        console.log("updateComment fail" + err);
    }
}

// 스포일러 버튼 겸 좋아요 버튼 활성화 여부
function toggleSpoiler(button) {
    const detailContent = button.parentElement.querySelector('.detailContent');
    const spoilerElements = button.parentElement.querySelectorAll('span,.spoilerbtn');
    const siblingElement = button.parentElement.nextElementSibling;
    const likeBtn = siblingElement.querySelector(".commentLikeBtn");
    likeBtn.disabled = false;
    detailContent.style.display = 'block';
    spoilerElements.forEach(el => el.style.display = 'none');
}

//좋아요 삭제 버튼
function deleteLikeBtn(button){
    try{
    var code = button.parentElement.parentElement.querySelector(".detailCommentCode").innerText;
    const config = {
        commentCode: code,
        email: userInfo.email
    }
    deleteCommentLikeCount(config).then(result =>{
        if(result == 1){
            alert ("좋아요 삭제");
            location.reload(true);
        }
    })
    }catch (err){
        console.log(err);
    }
}

// 좋아요 버튼 기능
function addlikeBtn(button) {
    try{
    var code = button.parentElement.parentElement.querySelector(".detailCommentCode").innerText;
    console.log(code);
    const config = {
        commentCode: code,
        email: userInfo.email
    }
    addCommentLikeCount(config).then(result=>{
        console.log(result);
        if(result == 1){
            alert ("댓글 좋아요");
            location.reload(true);
        }
    })
    console.log(config);
    }catch (err){
        console.log(err);
    }
}

async function islikeBtn(user){
    try{
        const resp = await fetch("/movie/isLikeBtn/"+user);
        const result = await resp.json();
        return result;
    }catch (err){
        console.log(err);
    }
}

async function deleteCommentLikeCount(code){
    try{
        const url = "/movie/deleteCommentLike";
        const config = {
            method : "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(code)
        }
        const resp = await fetch(url,config);
        const result = await resp.text();
        return result
    }catch(err){
        console.log(err);
    }
}

// 디테일 가져오기
async function getDetail(mediaInfo) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/${mediaInfo.urlInfo}/${mediaInfo.mediaId}?language=ko-KR`, options);
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

// 댓글 리스트 가져오기
async function getCommentList(movieId) {
    try {
        const response = await fetch(`/movie/getCommentList/${movieId}`);
        if (!response.ok) {
            throw new Error('Comment list not found');
        }
        const result = await response.json();
        return result;
    } catch (err) {
        console.error('Error fetching comment list:', err);
        throw err;
    }
}

// 글쓴 시간 나타내는 메서드
function elapsedTime(date) {
    const start = new Date(date);
    const end = new Date();
    const diff = (end - start) / 1000;
    const times = [
        {name: '년', milliSeconds: 60 * 60 * 24 * 365},
        {name: '개월', milliSeconds: 60 * 60 * 24 * 30},
        {name: '일', milliSeconds: 60 * 60 * 24},
        {name: '시간', milliSeconds: 60 * 60},
        {name: '분', milliSeconds: 60},
    ];

    for (const value of times) {
        const betweenTime = Math.floor(diff / value.milliSeconds);

        if (betweenTime > 0) {
            return `${betweenTime}${value.name} 전`;
        }
    }
    return '방금 전';
}


async function getWishInfo() {
    try {
        const url = "/user/wish/" + currentId + "/" + mediaInfo.mediaId;
        const config = {
            method: "GET"
        }
        const resp = await fetch(url, config);
        return await resp.text();
    } catch (error) {
        console.log(error)
    }
}


document.getElementById('detailWish').addEventListener('click', () => {
    addWish(currentId, mediaInfo).then(result => {
        if (result == "pass") {
            alert("좋아요 추가")
            document.getElementById('detailWish').innerText = "좋아요취소";
            isWish = true;
        } else if (result == "fail") {
            alert("추가 실패");
        } else if (result == "delPass") {
            alert("좋아요 취소 성공");
            document.getElementById('detailWish').innerText = "좋아요";
            isWish = false;
        } else if (result == "delFail") {
            alert("좋아요 취소 실패")
        }
    })
})

async function addWish(currentId, mediaInfo) {
    try {
        const url = "/user/wish/" + currentId;
        const data = {
            mediaType: mediaInfo.type,
            mediaId: mediaInfo.mediaId
        };
        const config = {
            method: isWish ? 'DELETE' : 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
        const resp = await fetch(url, config);
        return await resp.text();
    } catch (error) {
        console.log(error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    getHeartCount().then(countResult => {
        const detailWish = document.getElementById('detailWish');
        const count = document.createElement('span');
        if (typeof currentId !== 'undefined') {
            try {
                getWishInfo().then(result => {
                    detailWish.innerHTML = '';
                    const button = document.createElement('button');
                    button.type = 'button';
                    if (result === "true") {
                        isWish = true;
                        button.innerText = '좋아요취소';
                    } else {
                        button.innerText = '좋아요';
                    }
                    detailWish.appendChild(button);
                    count.innerText ="좋아요갯수 : "+ countResult;
                    detailWish.appendChild(count);
                });
            } catch (error) {
                console.log(error);
            }
        }else{
            count.innerText = "좋아요갯수 : "+ countResult;
            detailWish.appendChild(count);
        }
    });
});

async function getHeartCount() {
    try {
        const url = `/movie/heartCount/?mediaType=${encodeURIComponent(mediaInfo.type)}&mediaId=${encodeURIComponent(mediaInfo.mediaId)}`;
        const config = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };
        const resp = await fetch(url, config);
        return await resp.text();
    } catch (error) {
        console.log(error);
    }
}
document.getElementById('detailCollection').addEventListener('click', () => {
    const url = '/collection/list?currentId='+currentId+'&mediaId='+mediaInfo.mediaId;
    let width='500';
    let height='750';
    let left=Math.ceil((window.screen.width-width)/2);
    let top=Math.ceil((window.screen.height -height)/2);
    window.open(url, '_blank', 'width='+width+',height='+height+',left='+left+',top='+top);
});

function changesecondToTime(time){
    const totalTime = time;
    const hour = parseInt(totalTime/60);
    const min = totalTime % 60;
    return hour + '시간 '+min + '분';
}