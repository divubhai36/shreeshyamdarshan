async function testLogin() {
  try {
    const resp = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "9999999999", password: "password123" })
    });
    
    console.log("Status:", resp.status);
    const data = await resp.json();
    console.log("Data:", data);
  } catch (e) {
    console.error("Fetch Error:", e.message);
  }
}

testLogin();
