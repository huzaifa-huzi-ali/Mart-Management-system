import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import "../styles/foodModal.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from "../services/supplier.service";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    phone: ""
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const res = await getSuppliers();
      setSuppliers(res.data.data);
    } catch (err) {
      console.error("Failed to load suppliers", err);
    }
  };

  const openAddModal = () => {
    setEditingSupplier(null);
    setFormData({ name: "", contact: "", phone: "" });
    setShowModal(true);
  };

  const openEditModal = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact: supplier.contact,
      phone: supplier.phone
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.supplier_id, formData);
      } else {
        await createSupplier(formData);
      }
      setShowModal(false);
      loadSuppliers();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this supplier?")) {
      try {
        await deleteSupplier(id);
        loadSuppliers();
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
          <h1 className="dashboard-title">Suppliers</h1>
          <button style={styles.addBtn} onClick={openAddModal}>
            <FaPlus /> Add Supplier
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

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact Person</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.filter(sup => 
                  sup.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  sup.supplier_id.toString().includes(searchTerm)
              ).map((sup) => (
                <tr key={sup.supplier_id}>
                  <td>{sup.name}</td>
                  <td>{sup.contact}</td>
                  <td>{sup.phone}</td>
                  <td>
                    <button
                      style={styles.iconBtn}
                      onClick={() => openEditModal(sup)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      style={{ ...styles.iconBtn, color: "#991b1b" }}
                      onClick={() => handleDelete(sup.supplier_id)}
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
            <h2>{editingSupplier ? "Edit Supplier" : "Add Supplier"}</h2>

            <div className="modal-group">
              <label>Supplier Name</label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="modal-group">
              <label>Contact Person</label>
              <input
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
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

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
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
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    marginRight: "8px",
    fontSize: "14px"
  }
};
