// URL 매개변수 추출
const params = new URLSearchParams(window.location.search);
const postId = params.get('id');

// 게시글 상세 정보 조회 api 요청
window.addEventListener('DOMContentLoaded', function () {
  console.log(postId);

  this.fetch(`api/posts/${postId}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      const postTitle = document.querySelector('.postTitle');
      postTitle.textContent = data.post.title;
      const postWriter = document.querySelector('#writer p');
      postWriter.textContent = data.post.user.nickname;
      const postContent = document.querySelector('.postContent');
      postContent.textContent = data.post.content;

      let postTitleEdit = document.querySelector('#modifyTitle');
      postTitleEdit.value = data.post.title;
      let postContentEdit = document.querySelector('#modifyContent');
      postContentEdit.value = data.post.content;
    })
    .catch(error => {
      console.log('error', error);
    });
});

// 모달 창 열기
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'block';
}

// 모달 창 닫기
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'none';
}

// 수정 버튼을 누르면 수정 모달 띄우기
document.getElementById('postMdBtn').addEventListener('click', function () {
  openModal('modifyModal');
});

// 확인 버튼 클릭 시 게시글 수정 api 요청
document.getElementById('modifySubmit').addEventListener('click', async function () {
  const modifiedTitle = document.getElementById('modifyTitle').value;
  const modifiedContent = document.querySelector('#modifyContent').value;

  fetch(`/api/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: modifiedTitle, content: modifiedContent }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      alert('게시글이 수정되었습니다');
      location.reload();
    })
    .catch(error => {
      console.log('error', error);
    });
});
