import React, { useState } from "react";

export default function CreateListModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Nový nákupní seznam</h2>

        <input
          style={styles.input}
          placeholder="Název seznamu"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div style={styles.buttons}>
          <button style={styles.primary} onClick={() => onCreate(title)}>
            Vytvořit
          </button>
          <button style={styles.secondary} onClick={onClose}>
            Zavřít
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "white",
    padding: 20,
    borderRadius: 8,
    minWidth: 320,
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  buttons: { display: "flex", gap: 8 },
  primary: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: 4,
  },
  secondary: {
    background: "#e5e7eb",
    border: "none",
    padding: "8px 12px",
    borderRadius: 4,
  },
};
