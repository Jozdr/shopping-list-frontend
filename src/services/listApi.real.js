
const BASE_URL = "http://localhost:3001"; 

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP error ${res.status}`);
  }
  return res.json();
}

export async function getLists() {
  const res = await fetch(`${BASE_URL}/lists`);
  return handleResponse(res);
}

export async function getListById(id) {
  const res = await fetch(`${BASE_URL}/lists/${id}`);
  return handleResponse(res);
}

export async function createList(data) {
  const res = await fetch(`${BASE_URL}/lists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteList(id) {
  const res = await fetch(`${BASE_URL}/lists/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
