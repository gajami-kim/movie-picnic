async function getUserInfo(currentId) {
    try {
        const url = '/user/info/' + currentId;
        const config = {
            method: 'GET'
        };
        const resp = await fetch(url, config);
        const result = await resp.json();
        return result;
    } catch (e) {
        console.log(e);
    }
}
if (typeof currentId !== 'undefined' && currentId !== null) {
    getUserInfo(currentId).then(result => {
        const uploadPath = '/upload/';
        const imgPath = uploadPath + result.profile;
        if (result) {
            document.getElementById('myProfile').src = result.profile ? imgPath : "/dist/image/person-circle.svg";
        }
    })
}

//쿠키설정
function setCookie( name, value, expiredays ) {
    var todayDate = new Date();
    todayDate.setDate( todayDate.getDate() + expiredays );
    document.cookie = name + '=' + ( value ) + '; path=/; expires=' + todayDate.toGMTString() + ';'
}

//쿠키 불러오기
function getCookie(name)
{
    var obj = name + "=";
    var x = 0;
    while ( x <= document.cookie.length )
    {
        var y = (x+obj.length);
        if ( document.cookie.substring( x, y ) == obj )
        {
            if ((endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
                endOfCookie = document.cookie.length;
            return ( document.cookie.substring( y, endOfCookie ) );
        }
        x = document.cookie.indexOf( " ", x ) + 1;

        if ( x == 0 ) break;
    }
    return "";
}