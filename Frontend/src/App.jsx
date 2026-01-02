import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import FoodItems from "./pages/FoodItems";
import Categories from "./pages/Categories";
import Ingredients from "./pages/Ingredients";
import Units from "./pages/Units";
import Stock from "./pages/Stock";
import InventoryLogs from "./pages/InventoryLogs";
import Suppliers from "./pages/Suppliers";
import Purchases from "./pages/Purchases";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
	<Route path="/food-items" element={<FoodItems />} />
	<Route path="/categories" element={<Categories />} />
	<Route path="/ingredients" element={<Ingredients />} />
	<Route path="/units" element={<Units />} />
	<Route path="/stock" element={<Stock />} />
	<Route path="/inventory-logs" element={<InventoryLogs />} />
	<Route path="/suppliers" element={<Suppliers />} />
	<Route path="/purchases" element={<Purchases />} />
	<Route path="/orders" element={<Orders />} />
	<Route path="/payments" element={<Payments />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
