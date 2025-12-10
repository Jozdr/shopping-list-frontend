export default function ListTile({ list, isOwner, onOpen, onDelete }) {
  const handleDeleteClick = (e) => {
    e.stopPropagation();

    // Pokud není owner → zákaz mazání
    if (!isOwner) {
      alert("Seznam může smazat pouze vlastník.");
      return;
    }

    // Archivovaný seznam nelze mazat (můžeš změnit podle potřeby)
    if (list.isArchived) {
      alert("Archivovaný seznam není možné mazat.");
      return;
    }

    onDelete();
  };

  return (
    <div style={styles.card} onClick={onOpen}>
      <div style={styles.titleRow}>
        <h3 style={styles.title}>{list.title}</h3>

        {/* štítek archivace */}
        {list.isArchived && (
          <span style={styles.badge}>Archivováno</span>
        )}
      </div>

      <button
        style={{
          ...styles.deleteButton,
          ...((!isOwner || list.isArchived) ? styles.deleteButtonDisabled : {}),
        }}
        onClick={handleDeleteClick}
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
    borderRadius: 10,
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  title: {
    margin: 0,
    fontSize: "1.1rem",
  },
  badge: {
    fontSize: "0.75rem",
    backgroundColor: "#e5e7eb",
    padding: "3px 6px",
    borderRadius: 6,
    color: "#374151",
  },
  deleteButton: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  deleteButtonDisabled: {
    background: "#9ca3af",
    cursor: "not-allowed",
  },
};
