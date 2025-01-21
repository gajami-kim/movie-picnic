const emailModal = document.querySelector('.findEModalArea');
const findEmail = document.querySelector('.findEmailBtn');
const findPw = document.querySelector('.findPwBtn');
const nick = document.querySelector('.findNickInput');
const pwNick = document.querySelector('.findPwInputN');
const pwEmail = document.querySelector('.findPwInputE');

window.addEventListener('load',()=>{
    // document.querySelector('.findEModal').innerHTML='';
    // const nickValue = nick.value;
    findEmail.addEventListener('click',()=>{
        if(!nick.value==''){
            console.log(nick.value)
            document.querySelector('.findNoNick').innerHTML='';
            findEmailF(nick.value).then(result=>{
                console.log(result)
                if(result==null){
                    document.querySelector('.findEModal').innerHTML=`
                    <button class="modalClose" onclick="closeModal()">X</button>
                    <div class="showNoEmail">존재하지 않는 닉네임입니다.<br>다시 입력 해주세요.</div>`;
                    emailModal.style.display='block';
                } else if(result.provider){
                    document.querySelector('.findEModal').innerHTML+=`
                    <button class="modalClose" onclick="closeModal()">X</button>`
                        if(result.provider=="google"){
                            document.querySelector('.findEModal').innerHTML+=`<div class="showEmail">${result.nickname}님은 구글로 회원가입 되었습니다.</div>`;
                        } else if(result.provider=="naver"){
                            document.querySelector('.findEModal').innerHTML+=`<div class="showEmail">${result.nickname}님은 네이버로 회원가입 되었습니다.</div>`;
                        } else {
                            document.querySelector('.findEModal').innerHTML+=`<div class="showEmail">${result.nickname}님은 카카오로 회원가입 되었습니다.</div>`;
                        }
                    document.querySelector('.findEModal').innerHTML+=`
                    <a href="/user/login" class="findUserLogin">로그인 하기</a>
                    <a href="/user/findUser">비밀번호 찾기</a>`;
                    emailModal.style.display='block';
                } else if(!result.provider){
                    document.querySelector('.findEModal').innerHTML=`
                    <button class="modalClose" onclick="closeModal()">X</button>
                    <div class="showEmail">${result.nickname}님의 이메일은 ${result.email} 입니다.</div>
                    <a href="/user/login" class="findUserLogin">로그인 하기</a>
                    <a href="/user/findUser">비밀번호 찾기</a>`;
                    emailModal.style.display='block';
                }
            })
        } else if(nick.value=='') {
            document.querySelector('.findNoNick').innerHTML='닉네임을 입력해주세요.';
        }
    })

    findPw.addEventListener('click',()=>{
        if(!pwNick.value==''&&!pwEmail.value==''){
            findPwF(pwNick.value,pwEmail.value).then(r=>{
                if(r==="1"){
                    alert("이메일 전송이 완료되었습니다.");
                    window.location.href="/";
                } else {
                    alert("존재하지 않는 닉네임 또는 이메일입니다. \n다시 입력해주세요.")
                }
            })
        } else{
            document.querySelector('.findNoPw').innerHTML='닉네임과 이메일을 모두 입력해주세요';
        }
    })
})

function closeModal(){
    console.log("닫힘버튼누름")
    emailModal.style.display='none';
    document.querySelector('.findEModal').innerHTML='';

}

//이메일 찾기
async function findEmailF(nick){
    try{
        const url = '/user/find/'+nick;
        const config={ method:'POST' };
        const resp = await fetch(url,config);
        const result = await resp.json();
        return result;
    } catch (error){
        console.log(error);
    }
}

//비밀번호 찾기
async function findPwF(nick,email) {
    try{
        const url = "/user/find/"+nick+"/"+email;
        const config = { method:'POST' };
        const resp = await fetch(url, config);
        const result = await resp.text();
        return result;
    } catch (error) {
        console.log(error);
    }
}