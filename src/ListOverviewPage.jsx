import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListTile from "./components/ListTile";
import CreateListModal from "./components/CreateListModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import * as listApi from "./services/listApi";
import { useApp } from "./app/AppProvider";


const CURRENT_USER_ID = "user-1";

export default function ListOverviewPage() {
  const { t } = useApp();
  const [lists, setLists] = useState([]);
  const [status, setStatus] = useState("pending"); 
  const [error, setError] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setStatus("pending");
    setError(null);

    listApi
      .getLists()
      .then((data) => {
        if (cancelled) return;
        setLists(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setError(err);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreateList = (title) => {
    if (!title.trim()) return;

    setStatus("pending");
    listApi
      .createList({ title: title.trim(), ownerId: CURRENT_USER_ID })
      .then((result) => {
        setLists((prev) => [...prev, result.overview]);
        setStatus("ready");
        setShowCreateModal(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
        setStatus("error");
      });
  };

  const handleDeleteList = (id) => {
    setStatus("pending");
    listApi
      .deleteList(id)
      .then(() => {
        setLists((prev) => prev.filter((l) => l.id !== id));
        setStatus("ready");
        setDeleteTarget(null);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
        setStatus("error");
      });
  };

  const filteredLists = lists.filter(
    (list) => showArchived || !list.isArchived
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1>{t("appTitle")}</h1>

          <button
            style={styles.createButton}
            onClick={() => setShowCreateModal(true)}
          >
            {t("createNew")}
          </button>
        </header>

        <div style={styles.filterBar}>
          <label style={styles.filterLabel}>
            <input
              type="checkbox"
              checked={showArchived}
              onChange={() => setShowArchived(!showArchived)}
            />
            {t("showArchived")}
          </label>
        </div>

        {status === "pending" && (
          <p style={styles.info}>Načítám nákupní seznamy…</p>
        )}
        {status === "error" && (
          <p style={styles.error}>
            Nastala chyba při načítání dat: {error?.message}
          </p>
        )}

        {status === "ready" && (
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
        )}
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
    fontFamily: "system-ui, -apple-system, sans-serif",
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
    marginBottom: 12,
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
  info: {
    marginTop: 8,
    color: "#4b5563",
  },
  error: {
    marginTop: 8,
    color: "#b91c1c",
  },
};
