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

// 로그인 버튼 클릭 시 로그인 모달 열기
document.getElementById('loginBtn').addEventListener('click', function () {
  openModal('loginModal');
});

// 로그인 버튼 클릭 시 로그인 모달 열기
document.getElementById('emailAuth').addEventListener('click', function () {
  openModal('emailModal');
});

// 회원가입 버튼 클릭 시 회원가입 모달 열기
document.getElementById('signupBtn').addEventListener('click', function () {
  openModal('signupModal');
});

// 회원가입 버튼 클릭 시 회원가입 처리
document.getElementById("signupSubmit").addEventListener("click", async function () {
  const userId = document.getElementById("userId").value;
  const nickname = document.getElementById("nickname").value;
  const email = document.getElementById("email").value;
  const introduction = document.getElementById("introduction").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  try {
    const response = await fetch("/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        nickname,
        email,
        introduction,
        password,
        confirmPassword,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      // 회원가입 성공
      alert(data.message); // 알림 창 띄우기
      location.reload(); // 페이지 새로고침
      // 회원가입 후 필요한 동작 수행
    } else {
      // 회원가입 실패
      alert(data.message);
      // 실패 처리 로직 수행
    }
  } catch (error) {
    console.error("Error:", error);
    // 에러 처리 로직 수행
  }
});

// 로그인 버튼 클릭 시 로그인 처리
document.getElementById('loginSubmit').addEventListener('click', async function () {
  const userId = document.getElementById('lgUserId').value;
  const password = document.getElementById('lgPassword').value;

  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        password,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      // 로그인 성공
      alert(data.message); // 알림 창 띄우기
      window.location.href = `myInfo.html?id=${userId}`; // 새로운 페이지로 이동
      // 로그인 후 필요한 동작 수행
    } else {
      // 로그인 실패
      alert(data.message);
      // 실패 처리 로직 수행
    }
  } catch (error) {
    console.error("Error:", error);
    // 에러 처리 로직 수행
  }
});

// 이메일 인증 버튼 클릭 시 로그인 처리
document.getElementById('emailSubmit').addEventListener('click', async function () {
  const userId = document.getElementById('emailUserId').value;
  const code = document.getElementById('emailCode').value;

  try {
    const response = await fetch(`/api/users/mail/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        code,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      // 메일인증 성공
      alert(data.message); // 알림 창 띄우기
      window.location.href = `myInfo.html?id=${userId}`; // 새로운 페이지로 이동
    } else {
      // 인증 실패
      alert(data.message);
      // 실패 처리 로직 수행
    }
  } catch (error) {
    console.error("Error:", error);
    // 에러 처리 로직 수행
  }
});

// 피드 불러오기
window.addEventListener("DOMContentLoaded", async function () {
  fetch("/api/posts", {})
    .then((response) => response.json())
    .then((data) => {
      let rows = data["results"];
      const cardBox = document.getElementById("cards-box");
      rows.forEach((post) => {
        let nickname = post["writer"];
        let title = post["title"];
        let content = post['content']
        let comments = post['comments'].length;

        let temp_html = `<div class="solo-card">
                          <div class="card w-75">
                            <div class="card-body">
                              <h5 class="card-title">제목: ${title}</h5>
                              <p class="card-text">작성자: ${nickname}</p>
                              <p class="card-text">${content}</p>
                              <p class="card-text">댓글: ${comments}개</p>
                            </div>
                          </div>
                        </div>`;
        cardBox.insertAdjacentHTML("beforeend", temp_html);
      });
    });
});


const userInfo = (userId) => {
  window.location.href = `userInfo.html?id=${userId}`; // 메인 페이지로 이동

}