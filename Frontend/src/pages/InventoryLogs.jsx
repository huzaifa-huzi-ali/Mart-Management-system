import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import "../styles/foodModal.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  getInventoryLogs,
  createInventoryLog,
  updateInventoryLog,
  deleteInventoryLog
} from "../services/inventory.service";

export default function InventoryLogs() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLog, setEditingLog] = useState(null);

  const [formData, setFormData] = useState({
    food_item_id: "",
    ingredient_id: "",
    user_id: "",
    action_type: "IN",
    quantity_change: ""
  });

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const res = await getInventoryLogs();
      setLogs(res.data.data);
    } catch (err) {
      console.error("Failed to load inventory logs", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this inventory log?")) {
      try {
        await deleteInventoryLog(id);
        loadLogs();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const openAddModal = () => {
    setEditingLog(null);
    setFormData({
      food_item_id: "",
      ingredient_id: "",
      user_id: "",
      action_type: "IN",
      quantity_change: ""
    });
    setShowModal(true);
  };

  const openEditModal = (log) => {
    setEditingLog(log);
    setFormData({
      food_item_id: log.food_item_id,
      ingredient_id: log.ingredient_id,
      user_id: log.user_id,
      action_type: log.action_type,
      quantity_change: log.quantity_change
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingLog) {
        await updateInventoryLog(editingLog.log_id, formData);
      } else {
        await createInventoryLog(formData);
      }
      setShowModal(false);
      loadLogs();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <h1 className="dashboard-title">Inventory Logs</h1>
          <button style={styles.addBtn} onClick={openAddModal}>
            Add Log
          </button>
        </div>

        <div style={{ marginBottom: "15px" }}>
            <input 
                type="text" 
                placeholder="Search by Log ID, Food ID or User ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: "10px", width: "100%", borderRadius: "6px", border: "1px solid #d1d5db" }}
            />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Item Name</th>
                <th>User</th>
                <th>Action</th>
                <th>Quantity Change</th>
                <th>Timestamp</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {logs.filter(log => 
                  log.log_id.toString().includes(searchTerm) || 
                  (log.food_item_name && log.food_item_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (log.ingredient_name && log.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (log.user_name && log.user_name.toLowerCase().includes(searchTerm.toLowerCase()))
              ).map((log) => (
                <tr key={log.log_id}>
                  <td>{log.log_id}</td>
                  <td>{log.ingredient_name || log.food_item_name || '-'}</td>
                  <td>{log.user_name || log.user_id}</td>
                  <td>
                    {log.action_type === "IN" ? (
                      <span className="status-available">{log.action_type}</span>
                    ) : (
                      <span className="status-not-available">{log.action_type}</span>
                    )}
                  </td>
                  <td>{log.quantity_change}</td>
                  <td>{new Date(log.timestamp).toLocaleDateString()}</td>

                  {/* Actions */}
                  <td style={{ display: "flex", gap: "10px" }}>
                    <button
                      className="icon-btn"
                      onClick={() => openEditModal(log)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-btn danger"
                      onClick={() => handleDelete(log.log_id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{editingLog ? "Edit Inventory Log" : "Add Inventory Log"}</h2>

            <div className="modal-group">
              <label>Food Item ID</label>
              <input
                type="number"
                value={formData.food_item_id}
                onChange={(e) =>
                  setFormData({ ...formData, food_item_id: e.target.value })
                }
              />
            </div>

            <div className="modal-group">
              <label>Ingredient ID</label>
              <input
                type="number"
                value={formData.ingredient_id}
                onChange={(e) =>
                  setFormData({ ...formData, ingredient_id: e.target.value })
                }
              />
            </div>

            <div className="modal-group">
              <label>User ID</label>
              <input
                type="number"
                value={formData.user_id}
                onChange={(e) =>
                  setFormData({ ...formData, user_id: e.target.value })
                }
              />
            </div>

            <div className="modal-group">
              <label>Action</label>
              <input
                type="text"
                value={formData.action_type}
                onChange={(e) =>
                  setFormData({ ...formData, action_type: e.target.value })
                }
                placeholder="e.g. IN, OUT, ADJUSTMENT"
              />
            </div>

            <div className="modal-group">
              <label>Quantity Change</label>
              <input
                type="number"
                value={formData.quantity_change}
                onChange={(e) =>
                  setFormData({ ...formData, quantity_change: e.target.value })
                }
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowModal(false);
                  setEditingLog(null);
                }}
              >
                Cancel
              </button>
              <button className="btn-save" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  addBtn: {
    background: "#111827",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  }
};
