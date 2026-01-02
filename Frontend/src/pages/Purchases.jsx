import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import "../styles/foodModal.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { getPurchases, createPurchase, updatePurchase, deletePurchase } from "../services/purchase.service";
import { getSuppliers } from "../services/supplier.service";
import { getIngredients } from "../services/ingredient.service";

export default function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);

  const [formData, setFormData] = useState({
    supplier_id: "",
    purchaseDate: "",
    totalAmount: "",
    ingredient_id: "",
    quantity: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [purRes, supRes, ingRes] = await Promise.all([
        getPurchases(),
        getSuppliers(),
        getIngredients()
      ]);
      setPurchases(purRes.data.data);
      setSuppliers(supRes.data.data);
      setIngredients(ingRes.data.data);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  const openAddModal = () => {
    setEditingPurchase(null);
    setFormData({
      supplier_id: "",
      purchaseDate: "",
      totalAmount: "",
      ingredient_id: "",
      quantity: ""
    });
    setShowModal(true);
  };

  const openEditModal = (purchase) => {
    setEditingPurchase(purchase);
    setFormData({
      supplier_id: "", 
      purchaseDate: purchase.purchase_date ? purchase.purchase_date.split('T')[0] : "",
      totalAmount: purchase.total_amount,
      ingredient_id: "", 
      quantity: ""
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const payload = {
        supplier_id: formData.supplier_id,
        purchase_date: formData.purchaseDate,
        total_amount: formData.totalAmount,
        ingredient_id: formData.ingredient_id,
        quantity: formData.quantity
    };

    try {
        if (editingPurchase) {
            await updatePurchase(editingPurchase.purchase_id, payload);
        } else {
            await createPurchase(payload);
        }
        setShowModal(false);
        loadData();
    } catch (err) {
        console.error("Save failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this purchase?")) {
        try {
            await deletePurchase(id);
            loadData();
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
          <h1 className="dashboard-title">Purchases</h1>
          <button style={styles.addBtn} onClick={openAddModal}>
            <FaPlus /> Add Purchase
          </button>
        </div>

        <div style={{ marginBottom: "15px" }}>
            <input 
                type="text" 
                placeholder="Search by ID, Supplier or Date..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: "10px", width: "100%", borderRadius: "6px", border: "1px solid #d1d5db" }}
            />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Purchase Date</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {purchases.filter(p => {
                  const dateStr = p.purchase_date ? new Date(p.purchase_date).toLocaleDateString() : '';
                  return p.purchase_id.toString().includes(searchTerm) || 
                         (p.supplier_name && p.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         dateStr.includes(searchTerm);
              }).map((p) => (
                <tr key={p.purchase_id}>
                  <td>{p.supplier_name}</td>
                  <td>{p.purchase_date ? new Date(p.purchase_date).toLocaleDateString() : '-'}</td>
                  <td>Rs. {p.total_amount}</td>
                  <td style={{ display: "flex", gap: "10px" }}>
                    <button
                      style={styles.iconBtn}
                      onClick={() => openEditModal(p)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      style={{ ...styles.iconBtn, color: "#991b1b" }}
                      onClick={() => handleDelete(p.purchase_id)}
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
            <h2>{editingPurchase ? "Edit Purchase" : "Add Purchase"}</h2>

            <div className="modal-group">
              <label>Supplier</label>
              <select
                value={formData.supplier_id}
                onChange={(e) =>
                  setFormData({ ...formData, supplier_id: e.target.value })
                }
              >
                 <option value="" disabled>Select Supplier</option>
                 {suppliers.map(s => (
                     <option key={s.supplier_id} value={s.supplier_id}>{s.name}</option>
                 ))}
              </select>
            </div>

            <div className="modal-group">
              <label>Ingredient (To add to stock)</label>
              <select
                value={formData.ingredient_id}
                onChange={(e) =>
                  setFormData({ ...formData, ingredient_id: e.target.value })
                }
              >
                 <option value="" disabled>Select Ingredient</option>
                 {ingredients.map(i => (
                     <option key={i.ingredient_id} value={i.ingredient_id}>{i.name}</option>
                 ))}
              </select>
            </div>

            <div className="modal-group">
              <label>Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: e.target.value
                  })
                }
              />
            </div>

            <div className="modal-group">
              <label>Purchase Date</label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    purchaseDate: e.target.value
                  })
                }
              />
            </div>

            <div className="modal-group">
              <label>Total Amount</label>
              <input
                type="number"
                value={formData.totalAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalAmount: e.target.value
                  })
                }
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowModal(false);
                  setEditingPurchase(null);
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
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    marginRight: "8px"
  }
};
