import React from "react";

export default function ListHeader({ title, isOwner, onRename, onBack }) {
  const handleChange = (e) => {
    onRename(e.target.value);
  };

  return (
    <header style={styles.header}>
      <div>
        <h1 style={styles.heading}>Nákupní seznam</h1>
        {isOwner ? (
          <input
            style={styles.titleInput}
            value={title}
            onChange={handleChange}
          />
        ) : (
          <h2 style={styles.title}>{title}</h2>
        )}
      </div>
      <button style={styles.backButton} onClick={onBack}>
        Zpět
      </button>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "8px",
  },
  heading: {
    margin: 0,
    fontSize: "1rem",
    textTransform: "uppercase",
    color: "#555",
  },
  title: {
    margin: "4px 0 0",
    fontSize: "1.8rem",
  },
  titleInput: {
    marginTop: "4px",
    fontSize: "1.4rem",
    padding: "4px 8px",
    width: "100%",
  },
  backButton: {
    padding: "6px 12px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
};
