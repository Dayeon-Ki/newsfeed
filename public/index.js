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

// 로그인 버튼 클릭 시 로그인 모달 열기
document.getElementById("loginBtn").addEventListener("click", function () {
  openModal("loginModal");
});

// 회원가입 버튼 클릭 시 회원가입 모달 열기
document.getElementById("signupBtn").addEventListener("click", function () {
  openModal("signupModal");
});

// 회원가입 버튼 클릭 시 회원가입 처리
document
  .getElementById("signupSubmit")
  .addEventListener("click", async function () {
    const userId = document.getElementById("userId").value;
    const nickname = document.getElementById("nickname").value;
    const email = document.getElementById("email").value;
    const introduction = document.getElementById("introduction").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    try {
      console.log(userId)
      console.log(nickname)
      console.log(email);
      console.log(introduction);
      console.log(password);
      console.log(confirmPassword);

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
        console.log(data.message);
        alert("회원가입 성공!"); // 알림 창 띄우기
        location.reload(); // 페이지 새로고침
        // 회원가입 후 필요한 동작 수행
      } else {
        // 회원가입 실패
        console.log(data.errMessage);
        // 실패 처리 로직 수행
      }
    } catch (error) {
      console.error("Error:", error);
      // 에러 처리 로직 수행
    }
  });

// 로그인 버튼 클릭 시 로그인 처리
document
  .getElementById("loginSubmit")
  .addEventListener("click", async function () {
    const userId = document.getElementById("lgUserId").value;
    const password = document.getElementById("lgPassword").value;

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // 로그인 성공
        console.log(data.message);
        alert("로그인 성공!"); // 알림 창 띄우기
        window.location.href = "user.html"; // 새로운 페이지로 이동
        // 로그인 후 필요한 동작 수행
      } else {
        // 로그인 실패
        console.log(data.errMessage);
        // 실패 처리 로직 수행
      }
    } catch (error) {
      console.error("Error:", error);
      // 에러 처리 로직 수행
    }
  });
