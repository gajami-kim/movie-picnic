//api key
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZmRmZTQ3YTQ0NzU2ZTI5MDAyNTcxNWE2YjQyZDhkNSIsIm5iZiI6MTcyMTA3OTk3NS4wMjMyMTQsInN1YiI6IjY2MDNkNTE3NjA2MjBhMDE3YzMwMjY0OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Yepq4-FusJE30k6cCnybO96yFv6CgiDyauetmowyE-U'
    }
};
let nickName = '';

//유저정보
async function getUserInfo(currentId) {
    try {
        const url = '/user/info/' + currentId;
        const config = {
            method: 'GET'
        };
        const resp = await fetch(url, config);
        return await resp.json();
    } catch (e) {
        console.log(e);
    }
}
getUserInfo(currentId).then(result => {
    const uploadPath = '/upload/';
    const imgPath = uploadPath+result.profile;
    if (result) {
        nickName = result.nickname;
        renderNickName();
        document.getElementById('email').innerText = result.email;
        document.getElementById('myProfile').src = result.profile ? imgPath : "/dist/image/person-circle.svg";
        renderCharts();
    }
});
//닉네임 렌더링함수
function renderNickName() {
    let str = '';
    str = `<span id="nickNameSpan">${nickName}</span>`;
    if(loginId != currentId){
        let isFollow = document.getElementById('isFollow').innerText;
        if(isFollow == "true"){
            str += `<button id="followBtn">언팔로우</button>`
        }else{
            str += `<button id="followBtn">팔로우</button>`
        }
        document.getElementById('changeProfileImage').style.display = 'none';
        document.getElementById('nickName').innerHTML = str;
        document.getElementById('followBtn').addEventListener('click', async ()=>{
            await userFollowStatus(currentId, loginId, nickName);
        })
    }else{
        str += ` <img src="/dist/image/pencil.svg" alt="noPic" id="changeNickName">`
        str += `<button id="withdrawalBtn">회원탈퇴</button>`;
        document.getElementById('nickName').innerHTML = str;
        document.getElementById('changeNickName').addEventListener('click', changeToInput);
        document.getElementById('withdrawalBtn').addEventListener('click', async () => {
            if (confirm("작성한 댓글과 별점은 삭제되지않습니다. \n정말 회원탈퇴하시겠습니까?")) {
                await withdrawalAccount(loginId);
            }
        });
    }
}
//팔로우 언팔로우 로직
async function userFollowStatus(followEmail, email, nickName) {
    try {
        let isFollow = document.getElementById('isFollow').innerText === 'true';
        const url = '/user/following';
        const method = isFollow ? 'DELETE' : 'PATCH';
        const data = { followEmail, email };
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(url, options);
        if (response.ok) {
            const result = await response.json();
            console.log(result.message);
            alert(isFollow ? `${nickName}님 팔로우 취소` : `${nickName}님 팔로우`);
            document.getElementById('isFollow').innerText = (!isFollow).toString();
            document.getElementById('followBtn').innerText = isFollow ? '팔로우' : '언팔로우';
            await followInfo(currentId).then(result => {
                let followerList = result.filter(user => user.email !== null);
                let followingList = result.filter(user => user.followEmail !== null);
                let followerCount = followerList.length;
                let followingCount = followingList.length;
                document.getElementById('followInfo').innerHTML = `
                    <span id="followerCount">팔로워 ${followerCount}명</span> | 
                    <span id="followingCount">팔로잉 ${followingCount}명</span>
                `;
                document.getElementById('followerCount').addEventListener('click', async () => {
                    await showFollowModal(followerList, '팔로워 목록');
                });
                document.getElementById('followingCount').addEventListener('click', async () => {
                    await showFollowModal(followingList, '팔로잉 목록');
                });
            });
            document.getElementById('followModal').style.display = "none";
        } else {
            console.error('팔로우 상태 변경 실패:', response.status);
        }
    } catch (error) {
        console.error('팔로우 상태 변경 중 오류 발생:', error);
    }
}

//회원탈퇴처리함수
async function withdrawalAccount(loginId){
    try {
        const response = await fetch(`/user/withdraw/${loginId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            alert('회원 탈퇴가 완료되었습니다.');
            window.location.href = "/user/logout"
        } else {
            const errorData = await response.json();
            alert(`회원 탈퇴 실패: ${errorData.message}`);
        }
    } catch (error) {
        console.error('회원 탈퇴 요청 중 오류 발생:', error);
        alert('회원 탈퇴 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
}

//input창 변경함수
function changeToInput() {
    document.getElementById('nickName').innerHTML = `
            <input type="text" id="nickNameInput" value="${nickName}">
            <button id="checkDuplicate">중복체크</button>
            <button id="cancelChange">취소</button>
        `;
    document.getElementById('checkDuplicate').addEventListener('click', checkDuplicateAndUpdate);
    document.getElementById('cancelChange').addEventListener('click', renderNickName);
}
//닉네임업데이트로직
function checkDuplicateAndUpdate() {
    let newNickName = document.getElementById('nickNameInput').value;
    let updateButton = document.getElementById('checkDuplicate');
    if(!newNickName.includes("_user")) {
        checkDuplicateNickName(newNickName).then(isDuplicate => {
            if (isDuplicate == "false") {
                alert("사용가능한 닉네임입니다. ")
                updateButton.removeEventListener('click', checkDuplicateAndUpdate);
                updateButton.textContent = '수정';
                updateButton.id = 'updateNickName';
                document.getElementById('updateNickName').addEventListener('click',()=>{
                    updateNickName(nickName, newNickName).then(result =>{
                        if(result == "success"){
                            alert("닉네임 변경이 완료되었습니다. ")
                            window.location.reload();
                        }else{
                            alert("닉네임 변경 오류\n관리자에게 문의해주세요. ")
                        }
                    })
                })
                //input창 감지해서 변동시 중복체크 다시하는 로직
                document.getElementById('nickNameInput').addEventListener('input', function () {
                    document.getElementById('updateNickName').textContent = '중복체크';
                    document.getElementById('updateNickName').id = 'checkDuplicate';
                    document.getElementById('checkDuplicate').addEventListener('click', checkDuplicateAndUpdate);
                });
            }else{
                alert("중복된 닉네임입니다. 다시 입력해주세요. ")
            }
        });
    }else{
        alert("_user는 포함될 수 없습니다. 다시 입력해주세요. ")
        document.getElementById('nickNameInput').value = '';
    }
}
//닉네임중복체크함수
async function checkDuplicateNickName(nickname) {
    try {
        let encodedNickname = encodeURIComponent(nickname);
        let response = await fetch(`/user/checkNickname?nickname=${encodedNickname}`);
        return await response.text();
    } catch (error) {
        console.log(error);
    }
}
//닉네임업데이트함수
async function updateNickName(oldNickname, newNickname){
    try {
        const url = "/user/updateNickname";
        const config = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                oldNickname: encodeURIComponent(oldNickname),
                newNickname: encodeURIComponent(newNickname)
            })
        };
        const resp = await fetch(url, config);
        return await resp.text();
    } catch (error) {
        console.log(error);
    }
}
//팔로우정보
async function followInfo(currentId){
    try {
        const url = "/user/follow/"+currentId;
        const config = {
            method: 'GET'
        };
        const resp = await fetch(url, config);
        return await resp.json();
    }catch (error) {
        console.log(error)
    }
}
followInfo(currentId).then(result => {
    let followerList = result.filter(user => user.email !== null);
    let followingList = result.filter(user => user.followEmail !== null);
    let followerCount = followerList.length;
    let followingCount = followingList.length;
    document.getElementById('followInfo').innerHTML = `
        <span id="followerCount">팔로워 ${followerCount}명</span> | 
        <span id="followingCount">팔로잉 ${followingCount}명</span>
    `;
    document.getElementById('followerCount').addEventListener('click', async () => {
        await showFollowModal(followerList, '팔로워 목록');
    });
    document.getElementById('followingCount').addEventListener('click', async () => {
        await showFollowModal(followingList, '팔로잉 목록');
    });
});
//팔로우 정보 관련 모달 출력함수
async function showFollowModal(list, title) {
    const modal = document.getElementById('followModal');
    const modalContent = document.getElementById('followModalContent');
    let userInfoPromises = list.map(user => getUserInfo(user.email || user.followEmail));
    let userInfos = await Promise.all(userInfoPromises);
    modalContent.innerHTML = `
        <button id="followModalClose">X</button>
        <h2>${title}</h2>
        <ul>
            ${userInfos.map(userInfo => `
                <li>
                    <span class="user-nickname" data-email="${userInfo.email}">${userInfo.nickname}</span>
                </li>
            `).join('')}
        </ul>
    `;
    modal.style.display = "block";
    document.querySelectorAll('.user-nickname').forEach(element => {
        element.addEventListener('click', (event) => {
            const email = event.target.getAttribute('data-email');
            goToMyPage(email);
        });
    });
    document.getElementById('followModalClose').addEventListener('click', () => {
        modal.style.display = "none";
    });
}
window.addEventListener('click', (event) => {
    const modal = document.getElementById('followModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
});
//유저페이지 이동 함수
function goToMyPage(currentId) {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/user/mypage';

    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = 'email';
    hiddenField.value = currentId;

    form.appendChild(hiddenField);
    document.body.appendChild(form);
    form.submit();
}
//프로필변경
function changeProfileImage() {
    let popupW = 500;
    let popupH = 600;
    let left = Math.ceil((window.screen.width - popupW)/2);
    let top = Math.ceil((window.screen.height - popupH)/2);

    window.open("/user/profile","blank",'width='+popupW+',height='+popupH+',left='+left+',top='+top+',scrollbars=yes,resizable=no,toolbar=no,menubar=no,location=no');
}

//수정작업시작
//캘린더
const calendarBody = document.getElementById('calendarBody');
const monthYear = document.getElementById('monthYear');
let currentDate = new Date();

async function loadCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    monthYear.innerHTML = `${year}년 ${month + 1}월`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    calendarBody.innerHTML = '';
    let row = document.createElement('tr');
    for (let i = 0; i < firstDay; i++) {
        const cell = document.createElement('td');
        row.appendChild(cell);
    }

    for (let date = 1; date <= lastDate; date++) {
        if (row.children.length === 7) {
            calendarBody.appendChild(row);
            row = document.createElement('tr');
        }
        const cell = document.createElement('td');

        // 날짜 정보를 셀에 저장
        const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
        cell.dataset.date = formattedDate;

        // 기본 크기의 빈 div 추가
        const posterContainer = document.createElement('div');
        posterContainer.style.position = 'relative';
        posterContainer.style.width = '80px';
        posterContainer.style.height = '120px';
        posterContainer.classList.add('poster-container');
        cell.appendChild(posterContainer);

        const dateText = document.createElement('div');
        dateText.textContent = date;
        dateText.classList.add('date-text');
        cell.appendChild(dateText);

        const dayOfWeek = new Date(year, month, date).getDay();
        if (dayOfWeek === 5) {
            cell.classList.add('saturday');
        } else if (dayOfWeek === 6) {
            cell.classList.add('sunday');
        }

        row.appendChild(cell);
    }

    while (row.children.length < 7) {
        const cell = document.createElement('td');
        row.appendChild(cell);
    }
    calendarBody.appendChild(row);

    try {
        const result = await getStar(currentId);
        if (Array.isArray(result) && result.length > 0) {
            const mediaInfo = result.map(item => ({
                mediaId: item.mediaId,
                date: item.date.split(' ')[0]
            }));
            // 각 mediaId에 대해 영화 정보를 가져오고 포스터 경로를 캘린더에 추가
            const results = await Promise.all(mediaInfo.map(info => {
                return fetch(`https://api.themoviedb.org/3/movie/${info.mediaId}?language=en-US`, options)
                    .then(response => response.json())
                    .then(data => ({
                        date: info.date,
                        mediaId: info.mediaId,
                        posterPath: data.poster_path
                    }));
            }));
            const postersByDate = results.reduce((acc, result) => {
                if (!acc[result.date]) acc[result.date] = [];
                acc[result.date].push(result);
                return acc;
            }, {});

            Object.keys(postersByDate).forEach(date => {
                const cell = document.querySelector(`[data-date="${date}"]`);
                if (cell) {
                    const posterContainer = cell.querySelector('.poster-container');
                    if (posterContainer) {
                        posterContainer.innerHTML = '';
                        const posters = postersByDate[date];
                        posters.forEach((poster, index) => {
                            const posterImg = document.createElement('img');
                            posterImg.src = `https://image.tmdb.org/t/p/w500${poster.posterPath}`;
                            posterImg.style.width = '100%';
                            posterImg.style.height = '100%';
                            posterImg.style.position = 'absolute';
                            posterImg.style.left = `${index * 10}px`; // 포스터가 겹치도록 설정
                            posterImg.dataset.mediaId = poster.mediaId;
                            posterContainer.appendChild(posterImg);
                            posterImg.addEventListener('click', () => {
                                // 링크로 이동하는 로직 추가
                                window.location.href = `/movie/detail?movieId=${poster.mediaId}`;
                            });
                        });
                        if (posters.length > 1) {
                            const badge = document.createElement('div');
                            badge.classList.add('badge');
                            badge.textContent = posters.length;
                            badge.addEventListener('click', () => {
                                showModal(posters);
                            });
                            posterContainer.appendChild(badge);
                        }
                    }
                }
            });
        }
    } catch (err) {
        console.error('Error fetching star data:', err);
    }
}

function showModal(posters) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = '';

    // 포스터 크기 및 간격 설정
    const posterWidth = 100;
    const posterHeight = 150;
    const posterMargin = 10;
    const maxPostersPerRow = 5;

    // 포스터 생성 및 추가
    posters.forEach(poster => {
        const posterImg = document.createElement('img');
        posterImg.src = `https://image.tmdb.org/t/p/w500${poster.posterPath}`;
        posterImg.style.width = `${posterWidth}px`;
        posterImg.style.height = `${posterHeight}px`;
        posterImg.style.margin = `0 ${posterMargin / 2}px`;
        posterImg.dataset.mediaId = poster.mediaId;
        modalContent.appendChild(posterImg);
        posterImg.addEventListener('click', () => {
            window.location.href = `/movie/detail?movieId=${poster.mediaId}`;
        });
    });

    // 한 줄에 들어갈 포스터 수와 모달 너비 결정
    const postersInRow = Math.min(posters.length, maxPostersPerRow);
    const modalWidth = (postersInRow * (posterWidth + posterMargin)) - posterMargin;
    modal.style.width = `${modalWidth}px`;
    modal.style.display = 'block';
}

document.getElementById('modalClose').addEventListener('click', () => {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
});

async function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    await loadCalendar(currentDate);
}

async function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    await loadCalendar(currentDate);
}

async function getStar(currentId){
    try {
        const url = '/user/star/'+currentId;
        const config = {
            method: 'GET'
        };
        const resp = await fetch(url, config);
        return await resp.json();
    }catch(err){
        console.log(err);
    }
}

window.onload = async () => {
    await loadCalendar(currentDate);
}

//count section 정보가져오기
async function getCountSection(currentId){
    try {
        const url = "/user/getCountInfo/"+currentId;
        const config = {
            method: 'GET'
        }
        const resp = await fetch(url, config);
        const result = await resp.json();
        return result;
    }catch (error){
        console.log(error);
    }
}
//채워주기
getCountSection(currentId).then(result =>{
    document.getElementById('countWish').innerText = result.wish_count+"개";
    document.getElementById('countStar').innerText = result.star_count+"개";
    document.getElementById('countComment').innerText = result.comment_count+"개";
})

// 차트 섹션
// 사용자 정보를 가져온 후에 nickName을 설정하고 차트를 렌더링하는 함수
function renderCharts() {
    // 취향 분석 데이터 가져오기
    let topGenresElement = document.getElementById('topGenresData');
    let topGenresData = JSON.parse(topGenresElement.getAttribute('data-top-genres'));

    // 상위 10개 장르와 그 점수 추출
    let topGenres = topGenresData.slice(0, 10);

    // 값이 0인 항목을 필터링
    let zeroValueCount = topGenres.filter(entry => Object.values(entry)[0] === 0).length;

    // 만약 값이 0인 항목이 5개 이상이라면
    if (zeroValueCount >= 5) {
        document.querySelector('.trend-analysis').innerHTML = `
            <h2>취향분석을 위해 별점이나 좋아요를 눌러보세요!</h2>
        `;
    } else {
        document.getElementById('userAnalysis').innerText = nickName + "님의 취향분석";

        // labels와 data를 추출
        let labels = topGenres.map(entry => Object.keys(entry)[0]);
        let data = topGenres.map(entry => Object.values(entry)[0]);

        // 상위 10개의 선호도 총합 계산
        let total = data.reduce((sum, value) => sum + value, 0);

        // 비율 계산 함수
        function calc(number, total) {
            return (number / total * 100).toFixed(1);
        }

        // 도넛 차트 생성
        let ctx = document.getElementById('donutChart').getContext('2d');
        let donutChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data.map(value => calc(value, total)),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#5ccd00', '#C9CBCF', '#4D5360', '#B39DDB'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#5ccd00', '#C9CBCF', '#4D5360', '#B39DDB']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });

        // 막대 차트 생성
        let ctxBar = document.getElementById('barChart').getContext('2d');
        let barChart = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '선호도 비율 (%)',
                    data: data.map(value => calc(value, total)),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#5ccd00', '#C9CBCF', '#4D5360', '#B39DDB']
                }]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    }
}

//배우 감독 팔로우
async function getStarFollowInfo(){
    try {
        const url = "/user/starFollow/"+currentId;
        const config = {
            method: 'GET'
        };
        const resp = await fetch(url, config);
        return await resp.json();
    }catch(error){
        console.log(error);
    }
}

// 인물데이터가져오기
async function fetchPersonData(personId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/person/${personId}?language=ko-KR'`, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch person data:', error);
    }
}

// 요소렌더링
function createProfileElement(person) {
    const profileDiv = document.createElement('div');
    profileDiv.className = 'profileContainer';

    const img = document.createElement('img');
    img.className = "personImg";
    img.src = person.profile_path
        ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
        : (person.gender === 1
            ? '/dist/image/default_profile_w.jpg'
            : '/dist/image/default_profile_m.jpg');

    const name = document.createElement('div');
    name.className = "personName"
    name.textContent = person.name;

    profileDiv.appendChild(img);

    const link = document.createElement('a');
    link.href = `/movie/person?personId=${person.id}`;
    link.appendChild(img);
    link.appendChild(name);
    link.className = "personLink"

    return link;
}

// 이미지이름렌더링
async function renderProfiles(profileData, container) {
    for (const profile of profileData) {
        const personId = profile.actorId || profile.crewId;
        if (personId) {
            const personData = await fetchPersonData(personId);
            if (personData) {
                const profileElement = createProfileElement(personData);
                container.appendChild(profileElement);
            }
        }
    }
}

getStarFollowInfo().then(result => {
    const actors = result.filter(item => item.type === 'actor');
    const crew = result.filter(item => item.type === 'crew');
    renderProfiles(actors, actorContainer);
    renderProfiles(crew, crewContainer);
});