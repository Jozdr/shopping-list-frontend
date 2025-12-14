
let mockLists = [
  {
    id: "list-1",
    title: "Víkendový nákup",
    ownerId: "user-1",
    isArchived: false,
    members: [
      { id: "user-1", name: "Jan", role: "owner" },
      { id: "user-2", name: "Eva", role: "member" },
      { id: "user-3", name: "Petr", role: "member" },
    ],
    items: [
      { id: "item-1", name: "Mléko", resolved: false },
      { id: "item-2", name: "Chléb", resolved: false },
      { id: "item-3", name: "Máslo", resolved: true },
    ],
  },
  {
    id: "list-2",
    title: "Party nákup",
    ownerId: "user-2",
    isArchived: false,
    members: [
      { id: "user-2", name: "Pavel", role: "owner" },
      { id: "user-4", name: "Karel", role: "member" },
    ],
    items: [
      { id: "x1", name: "Rum", resolved: false },
      { id: "x2", name: "Limetky", resolved: false },
      { id: "x3", name: "Led", resolved: true },
    ],
  },
  {
    id: "list-3",
    title: "Starý seznam (archivovaný)",
    ownerId: "user-1",
    isArchived: true,
    members: [
      { id: "user-1", name: "Jan", role: "owner" },
      { id: "user-2", name: "Eva", role: "member" },
    ],
    items: [{ id: "z1", name: "Staré zásoby", resolved: true }],
  },
];

function simulateDelay(result, shouldFail = false, delay = 400) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Mock server error"));
      } else {
        resolve(result);
      }
    }, delay);
  });
}

export function getLists() {
  const overview = mockLists.map(({ items, members, ...rest }) => rest);
  return simulateDelay(overview);
}

export function getListById(id) {
  const found = mockLists.find((l) => l.id === id);
  if (!found) {
    return simulateDelay(null, true);
  }
  const clone = JSON.parse(JSON.stringify(found));
  return simulateDelay(clone);
}

export function createList(data) {
  const newList = {
    id: `list-${Date.now()}`,
    title: data.title,
    ownerId: data.ownerId,
    isArchived: false,
    members: [
      { id: data.ownerId, name: "Já (mock)", role: "owner" },
    ],
    items: [],
  };
  mockLists = [...mockLists, newList];

  const { items, members, ...overview } = newList;
  return simulateDelay({ full: newList, overview });
}

export function deleteList(id) {
  const exists = mockLists.some((l) => l.id === id);
  if (!exists) {
    return simulateDelay(null, true);
  }
  mockLists = mockLists.filter((l) => l.id !== id);
  return simulateDelay({ ok: true });
}
