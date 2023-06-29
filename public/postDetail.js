// URL 매개변수 추출
const params = new URLSearchParams(window.location.search);
const postId = params.get('id');

window.addEventListener('DOMContentLoaded', function () {
  console.log(postId);

  this.fetch(`api/posts/${postId}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      const postTitle = document.querySelector('#postdetailBox h3');
      postTitle.textContent = '게시글 제목: ' + data.post.title;
      const postWriter = document.querySelector('#writer p');
      postWriter.textContent = '작성자: ' + data.post.user.nickname;
      const postContent = document.querySelector('.postContent');
      postContent.textContent = data.post.content;
    })
    .catch(error => {
      console.log('error', error);
    });
});
