import React, { useState } from "react";

export default function MembersSection({
  members,
  isOwner,
  currentUserId,
  onAdd,
  onRemove,
  onLeave,
}) {
  const [newMember, setNewMember] = useState("");

  const currentUser = members.find((m) => m.id === currentUserId);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newMember);
    setNewMember("");
  };

  return (
    <section style={styles.card}>
      <h3>Členové</h3>
      <ul style={styles.list}>
        {members.map((member) => (
          <li key={member.id} style={styles.item}>
            <span>
              {member.name}{" "}
              {member.role === "owner" && <strong>(vlastník)</strong>}
              {member.id === currentUserId && " – já"}
            </span>
            {isOwner && member.role !== "owner" && (
              <button
                style={styles.smallButton}
                onClick={() => onRemove(member.id)}
              >
                Odebrat
              </button>
            )}
          </li>
        ))}
      </ul>

      {isOwner && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Jméno / e-mail nového člena"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
          />
          <button style={styles.primaryButton} type="submit">
            Přidat člena
          </button>
        </form>
      )}

      {!isOwner && currentUser && (
        <button style={styles.dangerButton} onClick={onLeave}>
          Odejít ze seznamu
        </button>
      )}
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
  list: {
    listStyle: "none",
    padding: 0,
    margin: "8px 0 12px",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
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
    marginBottom: "8px",
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
  dangerButton: {
    padding: "6px 12px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#dc2626",
    color: "white",
    cursor: "pointer",
  },
};
