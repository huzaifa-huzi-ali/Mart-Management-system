import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import {
  FaUtensils,
  FaBoxes,
  FaShoppingBag,
  FaUsers
} from "react-icons/fa";
import { getDashboardStats } from "../services/report.service";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalFoodItems: 0,
    itemsInStock: 0,
    monthlyPurchases: 0,
    systemUsers: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data.data);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <h1 className="dashboard-title">Dashboard Overview</h1>

        <div className="card-grid">
          <div className="stat-card">
            <FaUtensils className="stat-icon" />
            <div className="stat-info">
              <h3>{stats.totalFoodItems}</h3>
              <p>Total Food Items</p>
            </div>
          </div>

          <div className="stat-card">
            <FaBoxes className="stat-icon" />
            <div className="stat-info">
              <h3>{stats.itemsInStock}</h3>
              <p>Items in Stock</p>
            </div>
          </div>

          <div className="stat-card">
            <FaShoppingBag className="stat-icon" />
            <div className="stat-info">
              <h3>{stats.monthlyPurchases}</h3>
              <p>Total Purchases</p>
            </div>
          </div>

          <div className="stat-card">
            <FaUsers className="stat-icon" />
            <div className="stat-info">
              <h3>{stats.systemUsers}</h3>
              <p>System Users</p>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>System Summary</h3>
          <p>
            This dashboard provides a high-level overview of food inventory,
            purchases, orders, and user management activities. Each module is
            directly connected to the underlying database structure.
          </p>
        </div>
      </div>
    </div>
  );
}
