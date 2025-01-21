const InputC = document.getElementsByTagName('input');
const labelC = document.getElementsByTagName('label');
const joinBtn = document.querySelector('.JoinBtn');
const email = InputC.item(1);
const nick = InputC.item(2);
const pw = InputC.item(3);
const pwCheck = InputC.item(4);
const emailVerifi = document.getElementById('emailVerifi');
const checkEmailBtn = document.querySelector('.checkEmailBtn');
const emailRegExp= /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
const pwRegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

let duplicateEmail = false;
let duplicateNick = false;
let duplicatePw = false;
let duplicatePwCheck = false;


function emailValid(str){
    return emailRegExp.test(str);
}
function pwValid(str){
    return pwRegExp.test(str);
}
function pwCheckValid(pw, checkPw){
    return pw===checkPw;
}

email.onblur = function (){
    duplicateEmail=false;
    if(emailValid(email.value)){
        checkEmail(email.value).then(r=>{
            if(r==='0'){
                document.getElementById('JoinSpan0').innerHTML='사용가능한 이메일입니다.';
                document.querySelector('.sendEmailBtn').disabled=false;
                checkEmailBtn.disabled=false;
                emailVerifi.readOnly=false;
                duplicateEmail=false;
            } else {
                document.getElementById('JoinSpan0').innerHTML='중복된 이메일이 존재합니다.';
                document.querySelector('.sendEmailBtn').disabled=true;
                duplicateEmail=false;
            }
        })
    } else {
        document.getElementById('JoinSpan0').innerHTML='이메일 형식에 맞춰 작성해주세요.';
        document.querySelector('.sendEmailBtn').disabled=true;
        duplicateEmail=false;
    }
}

nick.onblur = function (){
    checkNick(nick.value).then(result=>{
        if(result==='0'){
            document.getElementById('JoinSpan1').innerHTML='사용가능한 닉네임입니다.';
            duplicateNick=true;
        } else if(result==='1'){
            document.getElementById('JoinSpan1').innerHTML='중복된 닉네임이 존재합니다.';
            duplicateNick=false;
        }
    })
}

pw.onkeyup = function (){
    const pwValue = pw.value;
    if(pwValid(pwValue)){
        document.getElementById('JoinSpan2').innerHTML='사용가능한 비밀번호입니다.';
        duplicatePw=true;
    } else {
        document.getElementById('JoinSpan2').innerHTML='대소문자,숫자,특수기호를 포함해 8~20자로 작성해주세요.';
        duplicatePw=false;
    }
    if(pw.onchange){
        if(!pwCheck.value==''){
            reCheckPw()
        }
    }
}

function reCheckPw(){
    const pwValue = pw.value;
    const pwCheckValue = pwCheck.value;
    if(pwCheckValid(pwValue,pwCheckValue)){
        document.getElementById('JoinSpan3').innerHTML='비밀번호가 일치합니다.';
        duplicatePwCheck=true;
    } else {
        document.getElementById('JoinSpan3').innerHTML='비밀번호가 일치하지않습니다.';
        duplicatePwCheck=false;
        return false;
    }
}
pwCheck.addEventListener('keyup',()=>{
    reCheckPw()
})

joinBtn.addEventListener('click',()=>{
    const formValid = duplicateEmail && duplicateNick && duplicatePw && duplicatePwCheck;
    console.log(formValid);
    if(formValid && (!email.value==''&&!nick.value==''&&!pw.value==''&&!pwCheck.value=='')){
        console.log("활성화")
        document.querySelector('.JoinBtn').type = 'submit';
    } else {
        if(email.value==''||nick.value==''||pw.value==''||pwCheck.value==''){
            alert("입력란을 모두 채워주세요.");
        }else if(!duplicateEmail){
            alert("이메일 인증을 완료해주세요.");
        } else if(!duplicateNick){
            alert("닉네임을 다시 입력해주세요.");
        } else if(!duplicatePw){
            alert("비밀번호를 다시 입력해주세요.");
        } else if(!duplicatePwCheck){
            alert("비밀번호가 일치하지 않습니다. \n다시 입력해주세요.");
        }
        document.querySelector('.JoinBtn').type = 'button';
    }
})

document.querySelector('.sendEmailBtn').addEventListener('click',()=>{
    emailVerifi.style.display="block";
    checkEmailBtn.style.display="block";
    sendEmail(email.value).then(r=>{
        document.getElementById('JoinSpan0').innerHTML='';
        document.getElementById('JoinSpan0').innerHTML='인증번호를 발송했습니다!';
    })
})

emailVerifi.onkeyup = function (){ checkEmailBtn.disabled=false; }

checkEmailBtn.addEventListener('click',()=>{
    confirmNumber(emailVerifi.value).then(r=>{
        if(r==="1"){
            alert("인증이 완료되었습니다.")
            document.getElementById('JoinSpan0').innerHTML='';
            document.getElementById('JoinSpan0').innerHTML='인증이 완료되었습니다.';
            checkEmailBtn.disabled=true;
            emailVerifi.readOnly=true;
            duplicateEmail = true;
            document.querySelector('.sendEmailBtn').disabled=false;
        } else {
            alert("인증번호가 맞지 않습니다. \n다시 입력해주세요.")
            emailVerifi.focus();
            duplicateEmail=false;
        }
    })
})

//닉네임 중복체크
async function checkNick(nick){
    try{
        const url='/user/nick';
        const config={
            method:'POST',
            headers:{ 'content-type':'text/plain; charset=UTF-8' },
            body:nick
        };
        const resp = await fetch(url, config);
        const result = await resp.text();
        return result;
    } catch (error) {
        console.log(error);
    }
}

//이메일 중복체크
async function checkEmail(email){
    try{
        const url='/user/email';
        const config={
            method:'POST',
            headers:{ 'content-type':'text/plain; charset=UTF-8' },
            body:email
        };
        const resp = await fetch(url, config);
        const result = await resp.text();
        return result;
    } catch (error) {
        console.log(error);
    }
}

//인증이메일 발송
async function sendEmail(email){
    try{
        const url = '/user/email/verification/'+email;
        const config={ method:'POST' };
        const resp = await fetch(url,config);
        const result = await resp.text();
        return result;
    } catch (error) {
        console.log(error);
    }
}

//인증번호 확인
async function confirmNumber(number){
    try{
        const url = '/user/email/'+number;
        const config={ method:'POST' };
        const resp = await fetch(url,config);
        const result = await resp.text();
        return result;
    } catch (error){
        console.log(error);
    }
}