import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import "../styles/foodModal.css";
import { FaPlus, FaTrash } from "react-icons/fa";
import { getOrders, createOrder, deleteOrder } from "../services/order.service";
import { getFoodItems } from "../services/foodItem.service";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  // Single item order for simplicity
  const [formData, setFormData] = useState({
    food_item_id: "",
    quantity: 1,
    order_type: "Dine-in"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [orderRes, foodRes] = await Promise.all([
        getOrders(),
        getFoodItems()
      ]);
      setOrders(orderRes.data.data);
      setFoodItems(foodRes.data.data);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  const openAddModal = () => {
    setFormData({ 
      food_item_id: foodItems.length > 0 ? foodItems[0].food_item_id : "", 
      quantity: 1, 
      order_type: "Dine-in" 
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const selectedFood = foodItems.find(f => f.food_item_id == formData.food_item_id);
      if (!selectedFood) return;

      const payload = {
        order_type: formData.order_type,
        total_amount: selectedFood.price * formData.quantity,
        food_item_id: formData.food_item_id,
        quantity: formData.quantity
      };

      await createOrder(payload);
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this order?")) {
      try {
        await deleteOrder(id);
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 className="dashboard-title">Orders</h1>
          <button style={styles.addBtn} onClick={openAddModal}>
            <FaPlus /> Add Order
          </button>
        </div>

        <div style={{ marginBottom: "15px" }}>
            <input 
                type="text" 
                placeholder="Search by Order ID or Date (YYYY-MM-DD)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: "10px", width: "100%", borderRadius: "6px", border: "1px solid #d1d5db" }}
            />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Type</th>
                <th>Total Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.filter(o => {
                  const dateStr = o.order_date ? new Date(o.order_date).toLocaleDateString() : '';
                  return o.order_id.toString().includes(searchTerm) || 
                         dateStr.includes(searchTerm);
              }).map((o) => (
                <tr key={o.order_id}>
                  <td>#{o.order_id}</td>
                  <td>{o.order_type}</td>
                  <td>${o.total_amount}</td>
                  <td>{o.order_date ? new Date(o.order_date).toLocaleDateString() : '-'}</td>
                  <td>
                    <button style={{ ...styles.iconBtn, color: "#991b1b" }} onClick={() => handleDelete(o.order_id)}>
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
            <h2>Add Order</h2>

            <div className="modal-group">
              <label>Food Item</label>
              <select
                value={formData.food_item_id}
                onChange={(e) => setFormData({ ...formData, food_item_id: e.target.value })}
              >
                <option value="" disabled>Select Item</option>
                {foodItems.map(f => (
                  <option key={f.food_item_id} value={f.food_item_id}>
                    {f.name} (${f.price})
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-group">
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>

            <div className="modal-group">
              <label>Order Type</label>
              <select
                value={formData.order_type}
                onChange={(e) => setFormData({ ...formData, order_type: e.target.value })}
              >
                <option>Dine-in</option>
                <option>Takeaway</option>
                <option>Delivery</option>
              </select>
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
