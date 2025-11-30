export default function ListTile({ list, onOpen, onDelete }) {
  return (
    <div style={styles.card} onClick={onOpen}>
      <h3>{list.title}</h3>

      <button
        style={styles.deleteButton}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        🗑 Smazat
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: 16,
    borderRadius: 8,
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    cursor: "pointer",
    position: "relative",
  },
  deleteButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "6px 8px",
    borderRadius: 4,
    cursor: "pointer",
  },
};
