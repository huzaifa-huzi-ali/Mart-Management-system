import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaUtensils,
  FaList,
  FaCarrot,
  FaBalanceScale,
  FaBoxes,
  FaClipboardList,
  FaTruck,
  FaShoppingBag,
  FaCashRegister
} from "react-icons/fa";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const roles = user.roles || [];

  const hasRole = (allowed) => roles.some(r => allowed.includes(r));

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>FoodMS</h2>

      <Link to="/dashboard" style={styles.link}>
        <FaTachometerAlt /> Dashboard
      </Link>

      {hasRole(['Admin', 'Manager']) && (
        <Link to="/users" style={styles.link}>
          <FaUsers /> Users & Roles
        </Link>
      )}

      <hr style={styles.hr} />

      {/* FoodItems: All roles */}
      <Link to="/food-items" style={styles.link}>
        <FaUtensils /> Food Items
      </Link>

      {hasRole(['Admin', 'Manager', 'Chef']) && (
        <>
          <Link to="/categories" style={styles.link}>
            <FaList /> Categories
          </Link>

          <Link to="/ingredients" style={styles.link}>
            <FaCarrot /> Ingredients
          </Link>

          <Link to="/units" style={styles.link}>
            <FaBalanceScale /> Units
          </Link>
        </>
      )}

      {hasRole(['Admin', 'Manager', 'Inventory Control']) && (
        <>
          <hr style={styles.hr} />
          <Link to="/stock" style={styles.link}>
            <FaBoxes /> Stock
          </Link>

          <Link to="/inventory-logs" style={styles.link}>
            <FaClipboardList /> Inventory Logs
          </Link>

          <hr style={styles.hr} />
          
           <Link to="/purchases" style={styles.link}>
            <FaShoppingBag /> Purchases
          </Link>
        </>
      )}

      {hasRole(['Admin', 'Manager', 'Inventory Control', 'Supplier Relations']) && (
          <Link to="/suppliers" style={styles.link}>
            <FaTruck /> Suppliers
          </Link>
      )}

      {hasRole(['Admin', 'Manager', 'Cashier']) && (
        <>
          <hr style={styles.hr} />
          <Link to="/orders" style={styles.link}>
            <FaUtensils /> Orders
          </Link>

          <Link to="/payments" style={styles.link}>
            <FaCashRegister /> Payments
          </Link>
        </>
      )}
    </div>
  );
}

const styles = {
  sidebar: {
    width: "240px",
    height: "100vh",
    background: "#1f2937",
    color: "#fff",
    padding: "20px",
    position: "fixed",
    left: 0,
    top: 0,
    overflowY: "auto"
  },
  logo: {
    marginBottom: "20px"
  },
  link: {
    display: "block",
    color: "#fff",
    textDecoration: "none",
    margin: "12px 0",
    fontSize: "15px"
  },
  hr: {
    border: "0.5px solid #374151",
    margin: "12px 0"
  }
};
