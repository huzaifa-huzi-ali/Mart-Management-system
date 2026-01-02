import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import "../styles/foodModal.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import {
  getUnits,
  createUnit,
  updateUnit,
  deleteUnit
} from "../services/unit.service";

export default function Units() {
  const [units, setUnits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [formData, setFormData] = useState({
    unit_name: "",
    conversion_rate: ""
  });

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    try {
      const res = await getUnits();
      setUnits(res.data.data);
    } catch (err) {
      console.error("Failed to load units", err);
    }
  };

  const openAddModal = () => {
    setEditingUnit(null);
    setFormData({ unit_name: "", conversion_rate: "" });
    setShowModal(true);
  };

  const openEditModal = (unit) => {
    setEditingUnit(unit);
    setFormData({
      unit_name: unit.unit_name,
      conversion_rate: unit.conversion_rate
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingUnit) {
        await updateUnit(editingUnit.unit_id, formData);
      } else {
        await createUnit(formData);
      }
      setShowModal(false);
      loadUnits();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this unit?")) {
      try {
        await deleteUnit(id);
        loadUnits();
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
          <h1 className="dashboard-title">Units</h1>
          <button style={styles.addBtn} onClick={openAddModal}>
            <FaPlus /> Add Unit
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
                <th>Unit Name</th>
                <th>Conversion Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.filter(unit => 
                  unit.unit_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  unit.unit_id.toString().includes(searchTerm)
              ).map((unit) => (
                <tr key={unit.unit_id}>
                  <td>{unit.unit_name}</td>
                  <td>{unit.conversion_rate}</td>
                  <td>
                    <button
                      style={styles.iconBtn}
                      onClick={() => openEditModal(unit)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      style={{ ...styles.iconBtn, color: "#991b1b" }}
                      onClick={() => handleDelete(unit.unit_id)}
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
            <h2>{editingUnit ? "Edit Unit" : "Add Unit"}</h2>

            <div className="modal-group">
              <label>Unit Name</label>
              <input
                value={formData.unit_name}
                onChange={(e) =>
                  setFormData({ ...formData, unit_name: e.target.value })
                }
              />
            </div>

            <div className="modal-group">
              <label>Conversion Rate</label>
              <input
                type="number"
                step="0.0001"
                value={formData.conversion_rate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    conversion_rate: e.target.value
                  })
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
