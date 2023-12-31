const params = new URLSearchParams(window.location.search);
const userId = params.get('id');

// 피드 불러오기
window.addEventListener('DOMContentLoaded', async function () {
  fetch('/api/posts')
    .then(response => response.json())
    .then(data => {
      let rows = data['results'];
      const cardBox = document.getElementById('cards-box');
      rows.forEach(post => {
        let nickname = post['writer'];
        let title = post['title'];
        let postId = post['postId'];
        let comment = post.comments.length;
        let temp_html = `<div class="solo-card" onclick="goToPostDetail(${postId})">
                          <div class="card w-75">
                            <div class="card-body">
                              <h5 class="card-title">제목: ${title}</h5>
                              <p class="card-text">작성자: ${nickname}</p>
                              <p> 댓글 : ${comment} 개 </p>
                            </div>
                          </div>
                        </div>`;
        cardBox.insertAdjacentHTML('beforeend', temp_html);
      });
    });
});

// 게시글 작성 클릭 시 게시글 페이지로 이동
document.getElementById('postPgBtn').addEventListener('click', function () {
  if (confirm('게시글 작성 페이지로 이동하시겠습니까?')) {
    window.location.href = 'postWrite.html';
  }
});

// 게시글 상세 정보 페이지로 이동
function goToPostDetail(postId) {
  window.location.href = 'postDetail.html?id=' + postId;
}

// 마이페이지 클릭시 myInfo 페이지로 이동
document.getElementById('myInfoBtn').addEventListener('click', function () {
  window.location.href = `myInfo.html?id=${userId}`;
});

//로그아웃

document.getElementById('logoutBtn').addEventListener('click', deleteCookie);

function deleteCookie() {
  fetch('/api/users/logout')
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      window.location.href = 'index.html';
    })
    .catch(console.error);
}