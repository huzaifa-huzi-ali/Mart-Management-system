import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import "../styles/foodModal.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient
} from "../services/ingredient.service";

export default function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      const res = await getIngredients();
      setIngredients(res.data.data);
    } catch (err) {
      console.error("Failed to load ingredients", err);
    }
  };

  const openAddModal = () => {
    setEditingIngredient(null);
    setFormData({ name: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (ingredient) => {
    setEditingIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      description: ingredient.description
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingIngredient) {
        await updateIngredient(editingIngredient.ingredient_id, formData);
      } else {
        await createIngredient(formData);
      }
      setShowModal(false);
      loadIngredients();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this ingredient?")) {
      try {
        await deleteIngredient(id);
        loadIngredients();
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
          <h1 className="dashboard-title">Ingredients</h1>
          <button style={styles.addBtn} onClick={openAddModal}>
            <FaPlus /> Add Ingredient
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
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.filter(ing => 
                  ing.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  ing.ingredient_id.toString().includes(searchTerm)
              ).map((ing) => (
                <tr key={ing.ingredient_id}>
                  <td>{ing.name}</td>
                  <td>{ing.description}</td>
                  <td>
                    <button
                      style={styles.iconBtn}
                      onClick={() => openEditModal(ing)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      style={{ ...styles.iconBtn, color: "#991b1b" }}
                      onClick={() => handleDelete(ing.ingredient_id)}
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
            <h2>{editingIngredient ? "Edit Ingredient" : "Add Ingredient"}</h2>

            <div className="modal-group">
              <label>Name</label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="modal-group">
              <label>Description</label>
              <input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
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
