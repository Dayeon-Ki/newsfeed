const params = new URLSearchParams(window.location.search);
const userId = params.get('id');

window.addEventListener("DOMContentLoaded", function () {
  // 유저 정보(쿠키) 넘겨주기
  fetch("/api/users/currentUser", {
  }) // 유저정보 받아와서 뿌려주기
    .then((res) => res.json())
    .then((data) => {
      const idInfo = document.querySelector("#idInfo");
      idInfo.textContent = 'ID : ' + data.userId;
      const nicknameInfo = document.querySelector("#nickInfo");
      nicknameInfo.textContent = '닉네임 : ' + data.nickname;
      const introductionInfo = document.querySelector("#introInfo");
      introductionInfo.textContent = '자기소개 : ' + data.introduction;
      const createdAtInfo = document.querySelector("#createdAtInfo");
      createdAtInfo.textContent = '가입일 : ' + data.createdAt;
    })
    .then(() => {
      document.getElementById("modifyBtn").addEventListener("click", () => {
        openModal("modifyModal");
      });
    })
    .catch((error) => {
      console.error("유저 정보를 가져오는 도중 오류가 발생했습니다:", error);
    });
});

// 메인 페이지로 이동 버튼 클릭 시
document.getElementById("MainPgBtn").addEventListener("click", function () {
  window.location.href = "loginMain.html"; // 메인 페이지로 이동
});


// 모달 창 열기
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "block";
}

// 모달 창 닫기
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "none";
}
// 정보수정버튼 클릭 시
document.getElementById("modifyBtn").addEventListener("click", () => {
  openModal("modifyModal");
});


// 수정버튼에 click 이벤트 부여
document.getElementById("modifySubmit").addEventListener("click", modSubmit);

// 수정버튼 클릭 시 실행
function modSubmit() {
  const nickname = document.getElementById("nickname").value;
  const email = document.getElementById("email").value;
  const introduction = document.getElementById("introduction").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  try {
    fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname,
        introduction,
        email,
        password,
        confirmPassword,
      }),
    }).then((res) => res.json())
      .then((data) => {
        alert(data.message)
        location.reload()
      })
      .catch(console.error)
  } catch (error) {
    console.error("Error:", error);
    // 에러 처리 로직 수행
  }
}

// 쿠키 삭제

document.getElementById("logoutBtn").addEventListener("click", deleteCookie);


function deleteCookie() {
  fetch('/api/users/logout')
    .then((res) => res.json())
    .then((data) => {
      alert(data.message)
      window.location.href = "index.html"
    })
    .catch(console.error)
}

// 쿠키를 만들어주는것도 서버니까 삭제도 서버에서
// function deleteCookie() {
//   document.cookie = 'Authorization + =; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
// }

document.getElementById('MainPgBtn').addEventListener('click', function () {
  window.location.href = 'loginMain.html'; // 메인 페이지로 이동
});

