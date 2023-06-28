// 메인 페이지로 이동 버튼 클릭 시
document.getElementById('MainPgBtn').addEventListener('click', function () {
  window.location.href = 'index.html'; // 메인 페이지로 이동
});

// 등록 버튼 클릭시 게시글 생성 처리
document.getElementById('postCrBtn').addEventListener('click', async function () {
  const title = document.getElementById('postCrTitle').value;
  const content = document.getElementById('postCrContent').value;

  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data.message);
      alert('게시글이 등록되었습니다');
      window.location.href = 'index.html';
    } else {
      console.log(data.errMessage);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
