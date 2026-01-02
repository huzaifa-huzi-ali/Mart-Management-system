import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import "../styles/foodModal.css";
import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from "../services/user.service";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "Staff", // Note: Backend might handle roles differently (UserRole table), but keeping simplified for now
    status: 1, // 1 for Active, 0 for Inactive
    password: ""
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data.data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ 
      full_name: "", 
      email: "", 
      phone: "", 
      role: "Staff", 
      status: 1,
      password: "" 
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: "Staff", // Backend doesn't return role in simple getAll, would need separate fetch or join
      status: user.status,
      password: "" // Don't show password
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        // Only send password if provided
        const data = { ...formData };
        if (!data.password) delete data.password;
        
        await updateUser(editingUser.user_id, data);
      } else {
        await createUser(formData);
      }
      setShowModal(false);
      loadUsers();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      try {
        await deleteUser(id);
        loadUsers();
      } catch (err) {
        console.error("Delete failed", err);
      }
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
          <h1 className="dashboard-title">Users</h1>
          <button
            style={styles.addBtn}
            onClick={openAddModal}
          >
            <FaUserPlus /> Add User
          </button>
        </div>

        <div style={{ marginBottom: "15px" }}>
            <input 
                type="text" 
                placeholder="Search by Name or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: "10px", width: "100%", borderRadius: "6px", border: "1px solid #d1d5db" }}
            />
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={headerCell}>Full Name</th>
              <th style={headerCell}>Email</th>
              <th style={headerCell}>Phone</th>
              <th style={headerCell}>Status</th>
              <th style={headerCell}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.filter(u => 
              u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              u.user_id.toString().includes(searchTerm)
            ).map((u) => (
              <tr key={u.user_id}>
                <td style={cell}>{u.full_name}</td>
                <td style={cell}>{u.email}</td>
                <td style={cell}>{u.phone}</td>
                <td
                  style={{
                    ...cell,
                    color: (u.status === 1 || u.status === true) ? "green" : "red",
                    fontWeight: 600
                  }}
                >
                  {(u.status === 1 || u.status === true) ? "Active" : "Inactive"}
                </td>

                {/* Actions */}
                <td style={{ ...cell, display: "flex", gap: "10px" }}>
                  <button style={styles.iconBtn} onClick={() => openEditModal(u)}>
                    <FaEdit />
                  </button>
                  <button
                    style={{ ...styles.iconBtn, color: "#991b1b" }}
                    onClick={() => handleDelete(u.user_id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{editingUser ? "Edit User" : "Add User"}</h2>

            <div className="modal-group">
              <label>Full Name</label>
              <input
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />
            </div>

            <div className="modal-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="modal-group">
              <label>Phone</label>
              <input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="modal-group">
              <label>Password {editingUser && "(Leave blank to keep current)"}</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <div className="modal-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: parseInt(e.target.value) })
                }
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-save"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- styles ---------- */

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
  },
  table: {
    width: "100%",
    marginTop: "20px",
    background: "#fff",
    borderRadius: "10px",
    borderCollapse: "separate",
    borderSpacing: "0",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "15px"
  }
};

const cell = {
  padding: "14px 18px",
  textAlign: "left",
  verticalAlign: "middle",
  fontSize: "15px"
};

const headerCell = {
  padding: "16px 18px",
  background: "#f9fafb",
  fontWeight: "700",
  fontSize: "14px",
  color: "#111827",
  borderBottom: "1px solid #e5e7eb"
};
