import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import "../styles/foodModal.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import {
  getFoodItems,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem
} from "../services/foodItem.service";
import { getCategories } from "../services/category.service";
import { getIngredients } from "../services/ingredient.service";

export default function FoodItems() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const roles = user.roles || [];
  const canEdit = roles.some(r => ['Admin', 'Manager', 'Chef', 'Cashier'].includes(r));

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category_id: "",
    ingredient_ids: []
  });

  useEffect(() => {
    loadItems();
    loadDependencies();
  }, []);

  const loadItems = async () => {
    try {
      const res = await getFoodItems();
      setItems(res.data.data);
    } catch (err) {
      console.error("Failed to load food items", err);
    }
  };

  const loadDependencies = async () => {
      try {
          const [catRes, ingRes] = await Promise.all([
              getCategories(),
              getIngredients()
          ]);
          setCategories(catRes.data.data || catRes.data || []);
          setIngredients(ingRes.data.data || ingRes.data || []);
      } catch (err) {
          console.error("Failed to load deps", err);
      }
  }

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: "", price: "", description: "", category_id: "", ingredient_ids: [] });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    const ingIds = item.ingredient_ids_str 
        ? item.ingredient_ids_str.split(',').map(id => parseInt(id))
        : [];
        
    setFormData({
      name: item.name,
      price: item.price,
      description: item.description || "",
      category_id: item.category_id || "",
      ingredient_ids: ingIds
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        category_id: formData.category_id ? parseInt(formData.category_id) : null
      };

      if (editingItem) {
        await updateFoodItem(editingItem.food_item_id, payload);
      } else {
        await createFoodItem(payload);
      }
      setShowModal(false);
      loadItems();
    } catch (err) {
      console.error("Save failed", err);
      alert("Save failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteFoodItem(id);
      loadItems();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleIngredientCheckboxChange = (id) => {
    const currentIds = formData.ingredient_ids || [];
    if (currentIds.includes(id)) {
      setFormData({ ...formData, ingredient_ids: currentIds.filter(i => i !== id) });
    } else {
      setFormData({ ...formData, ingredient_ids: [...currentIds, id] });
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.food_item_id.toString().includes(searchTerm)
  );

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 className="dashboard-title">Food Items</h1>
          {canEdit && (
            <button style={styles.addBtn} onClick={openAddModal}>
                <FaPlus /> Add Food Item
            </button>
          )}
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
                <th>Price</th>
                <th>Category</th>
                <th>Ingredients</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.food_item_id}>
                  <td>{item.name}</td>
                  <td>${item.price}</td>
                  <td>{item.category_name || '-'}</td>
                  <td>{item.ingredients || '-'}</td>
                  <td>{item.description || '-'}</td>
                  <td>
                    {canEdit && (
                        <>
                            <button style={styles.iconBtn} onClick={() => openEditModal(item)}>
                            <FaEdit />
                            </button>
                            <button style={{ ...styles.iconBtn, color: "#991b1b" }} onClick={() => handleDelete(item.food_item_id)}>
                            <FaTrash />
                            </button>
                        </>
                    )}
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
            <h2>{editingItem ? "Edit Food Item" : "Add Food Item"}</h2>
            
            <div className="modal-group">
              <label>Name</label>
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            
            <div className="modal-group">
              <label>Price</label>
              <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            </div>

            <div className="modal-group">
              <label>Description</label>
              <input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div className="modal-group">
                <label>Category</label>
                <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
                </select>
            </div>

            <div className="modal-group">
                <label>Ingredients</label>
                <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #d1d5db', padding: '10px', borderRadius: '6px', background: '#fff' }}>
                    {ingredients.map(ing => (
                        <div key={ing.ingredient_id} style={{ marginBottom: '5px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.ingredient_ids.includes(ing.ingredient_id)}
                                    onChange={() => handleIngredientCheckboxChange(ing.ingredient_id)}
                                    style={{ width: 'auto' }}
                                />
                                {ing.name}
                            </label>
                        </div>
                    ))}
                </div>
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
