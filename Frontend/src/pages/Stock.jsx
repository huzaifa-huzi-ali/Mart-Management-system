import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import "../styles/foodModal.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import {
  getStocks,
  createStock,
  updateStock,
  deleteStock
} from "../services/stock.service";
import { getIngredients } from "../services/ingredient.service";

export default function Stock() {
  const [stocks, setStocks] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    ingredient_id: "",
    quantity_available: ""
  });

  useEffect(() => {
    loadStocks();
    loadIngredients();
  }, []);

  const loadStocks = async () => {
    try {
      const res = await getStocks();
      setStocks(res.data.data);
    } catch (err) {
      console.error("Failed to load stock", err);
    }
  };

  const loadIngredients = async () => {
    try {
      const res = await getIngredients();
      setIngredients(res.data.data || []);
    } catch (err) {
      console.error("Failed to load ingredients", err);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ ingredient_id: "", quantity_available: "" });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      ingredient_id: item.ingredient_id,
      quantity_available: item.quantity_available
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        await updateStock(editingItem.stock_id, {
            quantity_available: formData.quantity_available
        });
      } else {
        await createStock({
            ingredient_id: formData.ingredient_id,
            quantity_available: formData.quantity_available
        });
      }
      setShowModal(false);
      loadStocks();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save stock. Maybe stock already exists for this item?");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteStock(id);
      loadStocks();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 className="dashboard-title">Stock Management</h1>
          <button style={styles.addBtn} onClick={openAddModal}>
            <FaPlus /> Add Stock
          </button>
        </div>

        <div style={{ marginBottom: "15px" }}>
            <input 
                type="text" 
                placeholder="Search by Ingredient Name or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: "10px", width: "100%", borderRadius: "6px", border: "1px solid #d1d5db" }}
            />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Quantity</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocks.filter(item => 
                  (item.ingredient_name && item.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase())) || 
                  item.stock_id.toString().includes(searchTerm)
              ).map((item) => (
                <tr key={item.stock_id}>
                  <td>{item.ingredient_name}</td>
                  <td>{item.quantity_available}</td>
                  <td>{new Date(item.last_updated).toLocaleString()}</td>
                  <td>
                    <button style={styles.iconBtn} onClick={() => openEditModal(item)}>
                      <FaEdit />
                    </button>
                    <button style={{ ...styles.iconBtn, color: "#991b1b" }} onClick={() => handleDelete(item.stock_id)}>
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
            <h2>{editingItem ? "Edit Stock" : "Add Stock"}</h2>
            
            <div className="modal-group">
                <label>Ingredient</label>
                <select 
                    disabled={!!editingItem}
                    value={formData.ingredient_id} 
                    onChange={(e) => setFormData({ ...formData, ingredient_id: e.target.value })}
                >
                    <option value="">Select Ingredient</option>
                    {ingredients.map(i => (
                        <option key={i.ingredient_id} value={i.ingredient_id}>{i.name}</option>
                    ))}
                </select>
            </div>

            <div className="modal-group">
              <label>Quantity</label>
              <input
                type="number"
                value={formData.quantity_available}
                onChange={(e) => setFormData({ ...formData, quantity_available: e.target.value })}
              />
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSave}>Save</button>
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
