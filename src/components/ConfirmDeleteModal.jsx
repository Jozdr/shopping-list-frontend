export default function ConfirmDeleteModal({ list, onCancel, onConfirm }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Smazat seznam?</h3>
        <p>Opravdu chcete smazat „{list.title}“?</p>

        <div style={styles.buttons}>
          <button style={styles.danger} onClick={onConfirm}>
            Smazat
          </button>
          <button style={styles.secondary} onClick={onCancel}>
            Zrušit
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
    minWidth: 300,
  },
  buttons: {
    display: "flex",
    gap: 8,
    marginTop: 16,
  },
  danger: {
    background: "#dc2626",
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
