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
      const postWriter = document.querySelector('.nickname');
      postWriter.textContent = data.post.user.nickname;
      const postContent = document.querySelector('.postContent');
      postContent.textContent = data.post.content;

      const userId = document.querySelector('.userId');
      userId.textContent = data.post.UserId;

      // 게시글 작성자 누르면 userInfo 페이지로 가기
      document.getElementById('writer').addEventListener('click', function () {
        window.location.href = 'userInfo.html?id=' + userId.textContent;
      });

      const likeCnt = document.querySelector('.likeCnt');
      likeCnt.textContent = data.post.likes.length;

      let postTitleEdit = document.querySelector('#modifyTitle');
      postTitleEdit.value = data.post.title;
      let postContentEdit = document.querySelector('#modifyContent');
      postContentEdit.value = data.post.content;

      let rows = data.post['comments'];
      const commentBox = document.getElementById('cards-box');
      rows.forEach(comment => {
        const content = comment['content']; // 댓글테스트
        const commentId = comment['commentId']; // 1
        const nickname = comment['user']['nickname'];

        const temp_html = `<div class="solo-card" data-commentId="${commentId}">
                          <div class="card w-75">
                            <div class="card-body">
                              <h5 class="card-title">${content}</h5>
                              <p class="card-writer">작성자: ${nickname}</p>
                              <div class="commentButtons">
                                <button id="commentEdit" type="button" class="btn btn-outline-secondary">수정</button>
                                <button id="commentDelete" type="button" class="btn btn-outline-secondary">삭제</button>
                              </div>
                              <!-- 댓글 수정 창 -->
                              <div id="commentEditBox" style="display: none;">
                                <div class="modal-body">
                                  <input id="editContent" type="text" placeholder="내용">
                                  <button id="editCancel" type="button">취소</button>
                                  <button id="editSubmit" type="button">확인</button>
                                </div>
                              </div>
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

// 댓글 수정 버튼 클릭 시 댓글 수정 창 띄우기
document.addEventListener('click', function (event) {
  if (event.target.id === 'commentEdit') {
    const commentEditBox = event.target.parentNode.nextElementSibling;
    commentEditBox.style.display = 'block';

    // 기존 댓글 내용 가져오기
    const commentContent = event.target.parentNode.previousElementSibling.textContent;

    // 인풋 요소에 기존 댓글 내용 설정
    const editContentInput = commentEditBox.querySelector('#editContent');
    editContentInput.value = commentContent;
  }
});

// 댓글 수정 창의 취소버튼 클릭 시 창 숨기기
document.addEventListener('click', function (event) {
  if (event.target.id === 'editCancel') {
    const commentEditBox = event.target.closest('#commentEditBox');
    commentEditBox.style.display = 'none';
  }
});

// 댓글 수정 확인 버튼 클릭 시 댓글 수정 처리
document.addEventListener('click', async function (event) {
  if (event.target.id === 'editSubmit') {
    const commentId = event.target.closest('.solo-card').dataset.commentid;
    const editedContent = document.querySelector('#editContent').value;
    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editedContent }),
      });
      if (response.ok) {
        const data = await response.json();
        // 수정 성공
        console.log(data.message);
        alert('댓글 수정이 완료되었습니다');
        location.reload();
      } else {
        // 삭제 실패
        console.log('댓글 수정에 실패했습니다.');
      }
    } catch (error) {
      console.log('오류가 발생했습니다.', error);
    }
  }
});

// 댓글 삭제 버튼 클릭 시 댓글 삭제 처리
document.addEventListener('click', async function (event) {
  if (event.target.id === 'commentDelete') {
    const commentId = event.target.closest('.solo-card').dataset.commentid;
    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const data = await response.json();
        // 삭제 성공
        console.log(data.message);
        alert('댓글이 삭제되었습니다');
        location.reload();
      } else {
        // 삭제 실패
        console.log('댓글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.log('오류가 발생했습니다.', error);
    }
  }
});

// 좋아요 버튼 누르면 게시글 좋아요 api처리하기
document.getElementById('likeBtn').addEventListener('click', async function () {
  try {
    const response = await fetch(`/api/posts/${postId}/like`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data.message);
      location.reload();
    } else {
      console.log(data.errMessage);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
