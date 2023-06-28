window.addEventListener("DOMContentLoaded", function () {
  // 유저 정보(쿠키) 넘겨주기
  fetch("/api/users/currentUser", {
    headers: { cookie: this.document.cookie },
  }) // 유저정보 받아와서 뿌려주기
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      const nicknameField = document.querySelector(".nickname p");
      nicknameField.textContent = "사용자 이름: " + data.nickname;

      const introductionField = document.querySelector(".introduction p");
      introductionField.textContent = "한 줄 소개: " + data.introduction;

      const passwordField = document.querySelector(".password p");
      passwordField.textContent = "비밀번호: " + data.password;
    })
    .catch((error) => {
      console.error("유저 정보를 가져오는 도중 오류가 발생했습니다:", error);
    });
});

// 메인 페이지로 이동 버튼 클릭 시
document.getElementById("MainPgBtn").addEventListener("click", function () {
  window.location.href = "index.html"; // 메인 페이지로 이동
});
