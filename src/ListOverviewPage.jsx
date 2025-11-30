import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ListTile from "./components/ListTile";
import CreateListModal from "./components/CreateListModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

const INITIAL_LISTS = [
  {
    id: "list-1",
    title: "Víkendový nákup",
    ownerId: "user-1",
  },
  {
    id: "list-2",
    title: "Party nákup",
    ownerId: "user-2",
  },
];

export default function ListOverviewPage() {
  const [lists, setLists] = useState(INITIAL_LISTS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const navigate = useNavigate();

  const handleCreateList = (title) => {
    const newList = {
      id: `list-${Date.now()}`,
      title,
      ownerId: "user-1",
    };
    setLists((prev) => [...prev, newList]);
    setShowCreateModal(false);
  };

  const handleDeleteList = (id) => {
    setLists((prev) => prev.filter((l) => l.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1>Nákupní seznamy</h1>
        <button style={styles.createButton} onClick={() => setShowCreateModal(true)}>
          + Nový seznam
        </button>
      </header>

      <div style={styles.grid}>
        {lists.map((list) => (
          <ListTile
            key={list.id}
            list={list}
            onOpen={() => navigate(`/lists/${list.id}`)}
            onDelete={() => setDeleteTarget(list)}
          />
        ))}
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
  page: { padding: 24, fontFamily: "sans-serif" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  createButton: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 16,
  },
};
