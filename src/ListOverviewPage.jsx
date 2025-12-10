import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ListTile from "./components/ListTile";
import CreateListModal from "./components/CreateListModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

const CURRENT_USER_ID = "user-1";

const INITIAL_LISTS = [
  {
    id: "list-1",
    title: "Víkendový nákup",
    ownerId: "user-1",
    isArchived: false,
  },
  {
    id: "list-2",
    title: "Party nákup",
    ownerId: "user-2",
    isArchived: false,
  },
  {
    id: "list-3",
    title: "Starý seznam (archivovaný)",
    ownerId: "user-1",
    isArchived: true,
  },
];

export default function ListOverviewPage() {
  const [lists, setLists] = useState(INITIAL_LISTS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  const navigate = useNavigate();

  const handleCreateList = (title) => {
    if (!title.trim()) return;

    const newList = {
      id: `list-${Date.now()}`,
      title: title.trim(),
      ownerId: CURRENT_USER_ID,
      isArchived: false,
    };

    setLists((prev) => [...prev, newList]);
    setShowCreateModal(false);
  };

  const handleDeleteList = (id) => {
    setLists((prev) => prev.filter((l) => l.id !== id));
    setDeleteTarget(null);
  };

  // filtr archivovaných
  const filteredLists = lists.filter(
    (list) => showArchived || !list.isArchived
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Nákupní seznamy</h1>

          <button
            style={styles.createButton}
            onClick={() => setShowCreateModal(true)}
          >
            + Nový seznam
          </button>
        </header>

        <div style={styles.filterBar}>
          <label style={styles.filterLabel}>
            <input
              type="checkbox"
              checked={showArchived}
              onChange={() => setShowArchived(!showArchived)}
            />
            <span style={{ marginLeft: 6 }}>Zobrazit včetně archivovaných</span>
          </label>
        </div>

        <div style={styles.grid}>
          {filteredLists.map((list) => (
            <ListTile
              key={list.id}
              list={list}
              isOwner={list.ownerId === CURRENT_USER_ID}
              onOpen={() => navigate(`/lists/${list.id}`)}
              onDelete={() => setDeleteTarget(list)}
            />
          ))}
        </div>
      </div>

      {showCreateModal && (
        <CreateListModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateList}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          list={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => handleDeleteList(deleteTarget.id)}
        />
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: 24,
    backgroundColor: "#f4f4f5",
    minHeight: "100vh",
  },
  container: {
    maxWidth: 960,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: 700,
  },
  createButton: {
    padding: "10px 16px",
    borderRadius: 6,
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: "1rem",
  },
  filterBar: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: "0.95rem",
    display: "flex",
    alignItems: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 20,
  },
};
