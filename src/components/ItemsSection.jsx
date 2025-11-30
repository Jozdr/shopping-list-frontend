import React, { useState } from "react";

export default function ItemsSection({
  items,
  allItems,
  showResolved,
  setShowResolved,
  onToggleResolved,
  onDelete,
  onAdd,
}) {
  const [newItemName, setNewItemName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newItemName);
    setNewItemName("");
  };

  return (
    <section style={styles.card}>
      <h3>Položky</h3>

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
          Nevyřešené:{" "}
          {allItems.filter((i) => !i.resolved).length} / {allItems.length} celkem
        </span>
      </div>

      <ul style={styles.list}>
        {items.map((item) => (
          <li key={item.id} style={styles.item}>
            <label
              style={item.resolved ? styles.itemResolved : undefined}
            >
              <input
                type="checkbox"
                checked={item.resolved}
                onChange={() => onToggleResolved(item.id)}
              />{" "}
              {item.name}
            </label>
            <button
              style={styles.smallButton}
              onClick={() => onDelete(item.id)}
            >
              🗑
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li style={{ color: "#777" }}>Žádné položky k zobrazení.</li>
        )}
      </ul>

      <form onSubmit={handleSubmit} style={styles.form}>
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
    </section>
  );
}

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "0.9rem",
  },
  counter: {
    color: "#555",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 12px",
  },
  item: {
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
    fontSize: "0.8rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  form: {
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
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
};
