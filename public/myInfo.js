const params = new URLSearchParams(window.location.search);
const userId = params.get('id');

window.addEventListener('DOMContentLoaded', function () {
  // 유저 정보(쿠키) 넘겨주기
  fetch('/api/users/currentUser', {}) // 유저정보 받아와서 뿌려주기
    .then(res => res.json())
    .then(data => {
      console.log(data)
      const photo = this.document.querySelector('#profilePhoto');
      photo.innerHTML = data.user.img
      const idInfo = document.querySelector('#idInfo');
      idInfo.textContent = 'ID : ' + data.user.userId;
      const nicknameInfo = document.querySelector('#nickInfo');
      nicknameInfo.textContent = '닉네임 : ' + data.user.nickname;
      const introductionInfo = document.querySelector('#introInfo');
      introductionInfo.textContent = '자기소개 : ' + data.user.introduction;
      const createdAtInfo = document.querySelector('#createdAtInfo');
      createdAtInfo.textContent = '가입일 : ' + data.user.createdAt;
    })
    .then(() => {
      document.getElementById('modifyBtn').addEventListener('click', () => {
        openModal('modifyModal');
      });
    })
    .catch(error => {
      console.error('유저 정보를 가져오는 도중 오류가 발생했습니다:', error);
    });
});

// 메인 페이지로 이동 버튼 클릭 시
document.getElementById('MainPgBtn').addEventListener('click', function () {
  window.location.href = 'loginMain.html'; // 메인 페이지로 이동
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
// 정보수정버튼 클릭 시
document.getElementById('modifyBtn').addEventListener('click', () => {
  openModal('modifyModal');
});

// 수정버튼에 click 이벤트 부여
document.getElementById('modifySubmit').addEventListener('click', modSubmit);

// 수정버튼 클릭 시 실행
function modSubmit() {
  const nickname = document.getElementById('nickname').value;
  const email = document.getElementById('email').value;
  const introduction = document.getElementById('introduction').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  try {
    fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname,
        introduction,
        email,
        password,
        confirmPassword,
      }),
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        location.reload();
      })
      .catch(console.error);
  } catch (error) {
    console.error('Error:', error);
    // 에러 처리 로직 수행
  }
}

// // 프로필사진 업로드
const fileInput = document.querySelector("#image");
const uploadBtn = document.querySelector("#uploadBtn");

uploadBtn.addEventListener("click", function () {

  var formData = new FormData();
  // form Data 객체 생성
  formData.append("image", fileInput.files[0]); // formData에 append해줄때는 append시의 이름으로 전송되기 때문에 multer에 오는 이름과 맞춰줘야함
  // 파일 인풋에 들어간 파일들은 files 라는 리스트로 저장된다.
  // input에 multiple을 선언해 여러개의 파일을 선택한 경우가 아니라면 files[0] 으로 input에 추가한 파일 객체를 찾을 수 있다.
  console.log(userId)
  fetch(`/api/users/photo/${userId}`, {
    method: 'POST',
    cache: 'no-cache',
    body: formData
  })
    .then(res => res.json())
    .then((data) => {
      console.log(data)
    })

});


fileInput.onchange = () => {
  const selectedFile = fileInput.files[0];
  console.log(selectedFile);
};


// 쿠키 삭제

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

// 쿠키를 만들어주는것도 서버니까 삭제도 서버에서
// function deleteCookie() {
//   document.cookie = 'Authorization + =; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
// }

document.getElementById('MainPgBtn').addEventListener('click', function () {
  window.location.href = 'loginMain.html'; // 메인 페이지로 이동
});
