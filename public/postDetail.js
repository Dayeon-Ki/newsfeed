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

      let rows = data.post['comments'];
      const commentBox = document.getElementById('cards-box');
      rows.forEach(comment => {
        let content = comment['content'];

        let temp_html = `<div class="solo-card" onclick="goToPostDetail(${postId})">
                          <div class="card w-75">
                            <div class="card-body">
                              <h5 class="card-title">${content}</h5>
                            </div>
                          </div>
                        </div>`;
        commentBox.insertAdjacentHTML('beforeend', temp_html);
      });
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

// 삭제 버튼 클릭 시 게시글 삭제 api 요청
document.getElementById('postDlBtn').addEventListener('click', async function () {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      const data = await response.json();
      // 삭제성공
      console.log(data.message);
      alert('게시글이 삭제되었습니다');
      window.location.href = 'loginMain.html';
    } else {
      // 삭제 실패
      console.log('게시글 삭제에 실패했습니다.');
    }
  } catch (error) {
    console.log('오류가 발생했습니다.', error);
  }
});

// 메인 페이지로 이동 버튼 클릭 시
document.getElementById('MainPgBtn').addEventListener('click', function () {
  window.location.href = 'loginMain.html'; // 메인 페이지로 이동
});

// 댓글 작성 버튼 클릭시 댓글 생성 처리
document.getElementById('commentCr').addEventListener('click', async function () {
  const content = document.getElementById('commentIpt').value;

  try {
    const response = await fetch(`api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data.message);
      alert('댓글이 작성되었습니다');
      location.reload();
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
