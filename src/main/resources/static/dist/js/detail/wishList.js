const params = new URLSearchParams(window.location.search);
const currentId = params.get('currentId');
const mediaId = params.get('mediaId');

document.getElementById('newList').addEventListener('click', () => {
    const inputModal = document.getElementById('inputModal');
    inputModal.classList.add('active');
});

document.querySelector('#inputModal .close').addEventListener('click', () => {
    const inputModal = document.getElementById('inputModal');
    inputModal.classList.remove('active');
});

document.getElementById('confirmAdd').addEventListener('click', async () => {
    const listName = document.getElementById('listNameInput').value.trim();
    if (listName) {
        await addCollectionList(listName);
        alert(`${listName} 리스트가 추가되었습니다.`);
        location.reload();
    }
});

document.getElementById('cancelAdd').addEventListener('click', () => {
    const inputModal = document.getElementById('inputModal');
    inputModal.classList.remove('active');
});

document.querySelectorAll('ul li').forEach(li => {
    li.addEventListener('click', async () => {
        const collectionId = li.dataset.cno;
        await changeCollectionStatus(collectionId, mediaId);
        alert(`리스트에 ${mediaId}가 추가/삭제되었습니다.`);
        location.reload();
    });
});

async function changeCollectionStatus(collectionId, mediaId){
    try{
        const url = `/collection/${collectionId}/media/${mediaId}`;
        const config = {
            method: "POST",
            headers: {
                'content-type': 'application/json; charset=UTF-8'
            },
        };
        const resp = await fetch(url, config);
        const result = await resp.text();
        console.log(result);
    }catch(error){
        console.log(error);
    }
}

async function addCollectionList(name){
    try{
        const url = "/collection/newList";
        const data = {
            collectionName: name,
            email: currentId
        }
        const config = {
            method: "POST",
            headers: {
                'content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(data)
        }
        const resp = await fetch(url, config);
        return await resp.text();
    }catch (error){
        console.log(error);
    }
}
