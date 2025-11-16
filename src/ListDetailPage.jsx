import React, { useState } from "react";

// Konstantní data – po reloadu se vrátí původní hodnoty
const INITIAL_LIST = {
  id: "list-1",
  title: "Víkendový nákup",
  items: [
    { id: "item-1", name: "Mléko", resolved: false },
    { id: "item-2", name: "Chléb", resolved: false },
    { id: "item-3", name: "Máslo", resolved: true },
  ],
};

export default function ListDetailPage() {
  const [title, setTitle] = useState(INITIAL_LIST.title);
  const [items, setItems] = useState(INITIAL_LIST.items);
  const [showResolved, setShowResolved] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  const visibleItems = items.filter(
    (item) => showResolved || !item.resolved
  );

  const handleToggleResolved = (itemId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, resolved: !item.resolved } : item
      )
    );
  };

  const handleDeleteItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      resolved: false,
    };

    setItems((prev) => [...prev, newItem]);
    setNewItemName("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>Nákupní seznam</h1>

        <label style={styles.blockLabel}>
          Název:
          <input
            style={styles.titleInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <div style={styles.toolbar}>
          <label>
            <input
              type="checkbox"
              checked={showResolved}
              onChange={() => setShowResolved(!showResolved)}
            />{" "}
            Zobrazit i vyřešené položky
          </label>
          <span style={styles.counter}>
            Nevyřešené: {items.filter((i) => !i.resolved).length} /{" "}
            {items.length} celkem
          </span>
        </div>

        <ul style={styles.list}>
          {visibleItems.map((item) => (
            <li key={item.id} style={styles.listItem}>
              <label
                style={item.resolved ? styles.itemResolved : undefined}
              >
                <input
                  type="checkbox"
                  checked={item.resolved}
                  onChange={() => handleToggleResolved(item.id)}
                />{" "}
                {item.name}
              </label>
              <button
                style={styles.smallButton}
                onClick={() => handleDeleteItem(item.id)}
              >
                🗑
              </button>
            </li>
          ))}

          {visibleItems.length === 0 && (
            <li style={{ color: "#777" }}>Žádné položky k zobrazení.</li>
          )}
        </ul>

        <form onSubmit={handleAddItem} style={styles.addForm}>
          <input
            style={styles.input}
            type="text"
            placeholder="Nová položka…"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <button style={styles.primaryButton} type="submit">
            Přidat
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "system-ui, sans-serif",
    backgroundColor: "#f5f5f7",
    minHeight: "100vh",
    padding: "24px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    maxWidth: "600px",
    width: "100%",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  blockLabel: {
    display: "block",
    marginBottom: "12px",
  },
  titleInput: {
    width: "100%",
    padding: "6px 8px",
    marginTop: "4px",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  counter: {
    color: "#444",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    marginBottom: "12px",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
  },
  itemResolved: {
    textDecoration: "line-through",
    color: "#888",
  },
  smallButton: {
    padding: "4px 8px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  addForm: {
    display: "flex",
    gap: "8px",
  },
  input: {
    flex: 1,
    padding: "6px 8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  primaryButton: {
    padding: "6px 12px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
