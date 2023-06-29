// queryString에서 userId 가져오기
const params = new URLSearchParams(window.location.search);
const userId = params.get('id');


window.addEventListener("DOMContentLoaded", function () {
  // 유저 정보(쿠키) 넘겨주기
  fetch(`/api/users/${userId}`, {
  }) // 유저정보 받아와서 뿌려주기
    .then((res) => res.json())
    .then((data) => {
      const idInfo = document.querySelector("#idInfo");
      idInfo.textContent = 'ID : ' + data.user.userId;
      const nicknameInfo = document.querySelector("#nickInfo");
      nicknameInfo.textContent = '닉네임 : ' + data.user.nickname;
      const introductionInfo = document.querySelector("#introInfo");
      introductionInfo.textContent = '자기소개 : ' + data.user.introduction;
      const followerInfo = document.querySelector("#followerInfo");
      followerInfo.textContent = '팔로워 : ' + data.user.followees.length + '명' // userId가 followee인 경우의 수(userId를 follow하는 사람 수)를 조회
      document.querySelector('.follow').innerHTML =
        `<button id="followBtn" type="button" class="btn btn-outline-secondary" onclick='follow("${userId}")'>팔로우</button>`
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
document.getElementById("MainPgBtn").addEventListener("click", () => {
  window.location.href = "index.html"; // 메인 페이지로 이동
});

// 팔로우 버튼 클릭 시
document.getElementById("followBtn").addEventListener("click", follow);


// 팔로우 버튼 클릭 시 이벤트 실행
function follow(userId) {
  fetch(`/api/users/${userId}/follow`)
    .then(res => res.json())
    .then((data) => {
      alert(data.message)
      location.reload()
    })
    .catch(console.error)

}


// 수정버튼 클릭 시 실행
function modSubmit() {
  const userId = document.getElementById("userId").value;
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