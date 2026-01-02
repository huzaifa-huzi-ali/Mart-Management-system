import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import "../styles/foodModal.css";
import { FaPlus, FaTrash } from "react-icons/fa";
import { getPayments, createPayment, deletePayment } from "../services/payment.service";
import { getOrders } from "../services/order.service";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    method: "Cash",
    order_id: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [payRes, ordRes] = await Promise.all([
        getPayments(),
        getOrders()
      ]);
      const sortedPayments = (payRes.data.data || []).sort((a, b) => b.payment_id - a.payment_id);
      setPayments(sortedPayments);
      setOrders(ordRes.data.data);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  const handleSave = async () => {
    try {
      await createPayment(formData);
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this payment?")) {
      try {
        await deletePayment(id);
        loadData();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const openModal = () => {
      setFormData({ amount: "", method: "Cash", order_id: "" });
      setShowModal(true);
  }

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 className="dashboard-title">Payments</h1>
          <button style={styles.addBtn} onClick={openModal}>
            <FaPlus /> Add Payment
          </button>
        </div>

        <div style={{ marginBottom: "15px" }}>
            <input 
                type="text" 
                placeholder="Search by Payment ID or Date (if available)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: "10px", width: "100%", borderRadius: "6px", border: "1px solid #d1d5db" }}
            />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.filter(p => 
                  p.payment_id.toString().includes(searchTerm)
              ).map((p) => (
                <tr key={p.payment_id}>
                  <td>{p.payment_id}</td>
                  <td>{p.order_id || '-'}</td>
                  <td>{p.amount}</td>
                  <td>{p.method}</td>
                  <td>
                    <button
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#991b1b" }}
                      onClick={() => handleDelete(p.payment_id)}
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
            <h2>Add Payment</h2>

            <div className="modal-group">
                <label>Order ID</label>
                <select 
                    value={formData.order_id} 
                    onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
                >
                    <option value="">Select Order</option>
                    {orders.map(o => (
                        <option key={o.order_id} value={o.order_id}>Order #{o.order_id} - ${o.total_amount}</option>
                    ))}
                </select>
            </div>

            <div className="modal-group">
              <label>Amount</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>

            <div className="modal-group">
              <label>Method</label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              >
                <option>Cash</option>
                <option>Card</option>
                <option>Online</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
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
