/**
 * Get elements from the form
 */
let first_name = document.getElementById("first_name");
let last_name = document.getElementById("last_name");
let email = document.getElementById("email");
let age = document.getElementById("age");
let password = document.getElementById("password");
/**
 * Buttons from the form
 */
let loginBtn = document.getElementById("login");
let registerBtn = document.getElementById("register");
let logoutBtn = document.getElementById("logout");
let githubLogin = document.getElementById("githubLogin");

/**
 * Logout button, this function redirect after
 */
logoutBtn?.addEventListener("click", async () => {
  const response = await fetch("/session/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    window.location.href = response.url;
  } catch (error) {
    console.log(error);
  }
});
/**
 * Register button, this function get the body data
 * and send this to the API with a fetch and register
 * the user
 */
registerBtn?.addEventListener("click", async () => {
  const body = {
    first_name: first_name.value,
    last_name: last_name.value,
    email: email.value,
    age: age.value,
    password: password.value,
  };
  const response = await fetch("/session/register", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    if(response.status == 401 && response.status == 500){
      return window.location.href = response.url;
    }
    window.location.href = response.url;
  } catch (error) {
    alert('Cant register that email, because it exists')
  }
});

/**
 * Login button, this function send the body data
 * thru the a fetch and redirect if is validate in the backend
 */
loginBtn?.addEventListener("click", async () => {
  const body = {
    email: email.value,
    password: password.value,
  };
  const response = await fetch("/session/login", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  try {
    if(response.status == 401){
      return alert('Authentication failed')
    }
    window.location.href = response.url;
  } catch (error) {
    console.log(error);
  }
});

githubLogin?.addEventListener("click", () => {
  window.location.href = 'http://localhost:8080/session/github'
});
