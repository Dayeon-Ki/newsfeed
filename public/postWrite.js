// 메인 페이지로 이동 버튼 클릭 시
document.getElementById('MainPgBtn').addEventListener('click', function () {
  window.location.href = 'loginMain.html'; // 메인 페이지로 이동
});

// 등록 버튼 클릭시 게시글 생성 처리
document.getElementById('postCrBtn').addEventListener('click', async function () {
  const title = document.getElementById('postCrTitle').value;
  const content = document.getElementById('postCrContent').value;

  fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      content,
    }),
  })
    .then(res => res.json())
    .then((data) => {
      alert(data.message);
      window.location.href = 'loginMain.html';
    })
    .catch(console.error(data.message))
});

// 로그아웃
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