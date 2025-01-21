//엔터키로 검색
document.querySelector('.searchInput').addEventListener('keyup',(e)=>{
    if(e.keyCode===13){
        goToSearch();
    }
})
//버튼으로 검색
document.querySelector('.searchBtn').addEventListener('click',()=>{
    goToSearch();
})

function goToSearch(){
    if(document.querySelector('.searchInput').value==''){
        alert('검색어를 입력해주세요.');
    } else {
        let keyword = document.querySelector('.searchInput');
        window.location.href=`/movie/searchResult?keyword=${keyword.value}`;
        console.log(keyword.value);
        searchMovieList(keyword.value).then(r=>{
            console.log(r);
        })
    }
}