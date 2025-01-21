const rateWrap = document.querySelectorAll('.rating'),
    label = document.querySelectorAll('.rating .rating__label'),
    input = document.querySelectorAll('.rating .rating__input'),
    labelLength = label.length,
    opacityHover = '0.5';
const user = document.getElementById("userId");
const comment = document.getElementById("commentBtn");
const spoilerCheckbox = document.getElementById('spoiler');
var userInfo = {
    email: user.innerText,
    mediaId: mediaInfo.mediaId
};
let rate = 0;
israting(userInfo).then(result => {
    rate = result.rate;
    console.log(rate);
    if (rate >= 0) {
        const inputs = document.querySelectorAll(".rating__input");
        inputs.forEach(input => {
            const value = parseFloat(input.getAttribute('value'));
            if (value <= rate) {
                input.nextElementSibling.classList.add('filled');
            }
            if (value == rate) {
                const span = document.createElement('div');
                span.classList.add("cancelText");
                // span.style.display = "none";
                const spanText = document.createElement("span");
                spanText.innerHTML = "취소하기";
                spanText.classList.add("cancelTextSpan");
                span.appendChild(spanText);
                span.style.display = 'none';
                input.classList.add("cancelRating");
                input.nextElementSibling.classList.add('filled');
                input.parentElement.after(span);
            }

        });
    }
}).catch(err => {
    console.log(err);
});

spoilerCheckbox.addEventListener('change', function () {
    if (spoilerCheckbox.checked) {
        spoilerCheckbox.value = 1;
    } else {
        spoilerCheckbox.value = 0;
    }
});

// 이건 클릭하면 값 가지고 가는 용
const labels = document.querySelectorAll(".rating__label");
document.getElementById('ratingWrapDiv').addEventListener('click',()=>{
    label.forEach(label => label.addEventListener('click', (e) => {
        console.log(e.target.parentElement);
        const ratingInfo = {
            email: user.innerText,
            rate: e.target.value,
            mediaId: userInfo.mediaId
        }
        if (ratingInfo.email == 'anonymousUser') {
            if (confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")) {
                window.location.href = "/user/login";
                let currentUrl = encodeURI(window.location.href);
                setCookie("url",currentUrl);
            }
        } else if (e.target.classList.contains('cancelRating')) {
            deleteRating(ratingInfo).then(result => {
                if (result == 1) {
                    alert("별점을 삭제 하였습니다.")
                    location.reload(true);
                }
            })
        } else if (e.target.classList.contains('rating__input')) {
            ratingMovie(ratingInfo).then(result => {
                if (result == 1) {
                    alert("별점을 등록 하였습니다.");
                    location.reload(true);
                }
            })
        }
    })
)
})


document.querySelector(".rating").addEventListener('mouseover', (e) => {
    var span = e.target.parentElement.nextElementSibling;
    try {
        if (span.className == "cancelText") {
            span.style.display = "inline-block";
        }
    } catch (err) {
    }

});

document.querySelector(".rating").addEventListener('mouseout', (e) => {
    var span = e.target.parentElement.nextElementSibling;
    try {
        if (span.className == "cancelText") {
            span.style.display = "none";
        }
    } catch (err) {
    }

});

//로그인 전 코멘트달기 방지
document.getElementById('commentText').addEventListener('click',()=>{
    if (user.innerText == 'anonymousUser') {
        if (confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")) {
            let currentUrl = encodeURI(window.location.href);
            window.location.href = "/user/login";
            setCookie("url",currentUrl);
        }
    }
})

comment.addEventListener('click', () => {
     israting(userInfo).then(result => {
            if (result == null) {
                alert("별점 등록 후 리뷰 등록이 가능합니다.");
                document.getElementById("commentText").value = "";
            } else {
                const config = {
                    mediaId: userInfo.mediaId,
                    content: document.getElementById("commentText").value,
                    spoiler: spoilerCheckbox.value,
                    email: user.innerText
                };
                commentMovie(config).then(result => {
                    console.log(result);
                    if (result == 1) {
                        alert("댓글을 등록하였습니다.");
                        location.reload(true);
                    }
                })
            }
    })
});

let stars = document.querySelectorAll('.rating .star-icon');

rateWrap.forEach(wrap => {
    wrap.addEventListener('mouseover', () => {
        stars = wrap.querySelectorAll('.star-icon');
        stars.forEach((starIcon, idx) => {
            starIcon.addEventListener('mouseover', () => {
                initStars();
                filledRate(idx, labelLength);
                for (let i = 0; i < stars.length; i++) {
                    if (stars[i].classList.contains('filled')) {
                        stars[i].style.opacity = opacityHover;
                    }
                }
            });
            starIcon.addEventListener('mouseout', () => {
                starIcon.style.opacity = '1';
                checkedRate();
            });
            wrap.addEventListener('mouseout', () => {
                starIcon.style.opacity = '1';
                initStars();
                if (rate >= 0) {
                    const inputs = document.querySelectorAll(".rating__input");
                    inputs.forEach(input => {
                        const value = parseFloat(input.getAttribute('value'));
                        if (value <= rate) {
                            input.nextElementSibling.classList.add('filled');
                        }
                    });
                }
            });
        });
    });
});

function filledRate(index, length) {
    if (index <= length) {
        for (let i = 0; i <= index; i++) {
            stars[i].classList.add('filled');
        }
    }
}

function checkedRate() {
    let checkedRadio = document.querySelectorAll('.rating input[type="radio"]:checked');
    checkedRadio.forEach(radio => {
        let previousSiblings = prevAll(radio);
        for (let i = 0; i < previousSiblings.length; i++) {
            previousSiblings[i].querySelector('.star-icon').classList.add('filled');
        }
        radio.nextElementSibling.classList.add('filled');

        function prevAll() {
            let radioSiblings = [],
                prevSibling = radio.parentElement.previousElementSibling;
            while (prevSibling) {
                radioSiblings.push(prevSibling);
                prevSibling = prevSibling.previousElementSibling;
            }
            return radioSiblings;
        }
    });
}

//코멘트 넣기
async function commentMovie(commentInfo) {
    try {
        const url = "/movie/comment";
        const config = {
            method: "POST",
            headers: {
                'content-type': 'application/json; charset =utf-8'
            },
            body: JSON.stringify(commentInfo)
        };
        const resp = await fetch(url, config);
        const result = await resp.text();
        return result;
    } catch (err) {
        console.log("댓글 작성 실패 " + err);
    }
}

// 별점 넣는 기능
async function ratingMovie(ratingInfo) {
    try {
        const url = "/movie/ratingMovie";
        const config = {
            method: "POST",
            headers: {
                'content-type': 'application/json; charset =utf-8'
            },
            body: JSON.stringify(ratingInfo)
        };
        const resp = await fetch(url, config);
        const result = await resp.text();
        return result;
    } catch (err) {
        console.log(err);
    }
}

async function deleteRating(ratingInfo) {
    try {
        const url = "/movie/deleteRating";
        const config = {
            method: "Delete",
            headers: {
                'content-type': 'application/json; charset =utf-8'
            },
            body: JSON.stringify(ratingInfo)
        }
        const resp = await fetch(url, config);
        const result = await resp.text();
        return result;
    } catch (err) {
        console.log(err);
    }
}

// 별점 등록을 했는지
async function israting(userInfo) {
    try {
        const url = "/movie/isRating";
        const config = {
            method: "POST",
            headers: {
                'content-type': 'application/json; charset =utf-8'
            },
            body: JSON.stringify(userInfo)
        };
        const resp = await fetch(url, config);
        const result = await resp.json();
        return result;
    } catch (err) {
        console.log(err);
    }
}

function initStars() { // 별 초기화 함수
    for (let i = 0; i < stars.length; i++) {
        stars[i].classList.remove('filled');
    }
}