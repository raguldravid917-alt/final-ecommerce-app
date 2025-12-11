import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Show login page first — hide nav on /login
  if (location.pathname === "/login") return null;

  return (
    <header className="navbar">
      <div className="brand" onClick={() => navigate(isAuthenticated ? "/products" : "/login")}>
        <span className="brand-main">Shop</span><span className="brand-accent">Lite</span>
        <div className="brand-sub">E-Commerce</div>
      </div>

      <nav className="nav-links">
        {isAuthenticated ? (
          <>
            <NavLink to="/products" className="nav-link">Products</NavLink>
            <NavLink to="/cart" className="nav-link">
              Cart {totalItems > 0 && <span className="badge">{totalItems}</span>}
            </NavLink>
          </>
        ) : (
          <>
            <button className="nav-link ghost" onClick={() => navigate("/login")}>Products</button>
            <button className="nav-link ghost" onClick={() => navigate("/login")}>Cart</button>
          </>
        )}
      </nav>

      <div className="nav-right">
        {user && <div className="user-email">{user.email}</div>}
        <button
          className={isAuthenticated ? "btn btn-logout" : "btn btn-login"}
          onClick={() => (isAuthenticated ? (logout(), navigate("/login")) : navigate("/login"))}
        >
          {isAuthenticated ? "Logout" : "Login"}
        </button>
      </div>
    </header>
  );
}
