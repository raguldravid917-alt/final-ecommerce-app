import React from "react";

export default function ProductCard({ product, onAdd, onView }) {
  return (
    <div className="product-card">
      <div className="product-thumb">
        <img src={product.thumbnail || product.images?.[0]} alt={product.title} />
      </div>

      <div className="product-body">
        <h3 className="product-title" title={product.title}>{product.title}</h3>
        <div className="product-meta">{product.brand || product.category}</div>

        <div className="product-price-row">
          <div>
            <div className="product-price">₹ {product.price}</div>
            {product.discountPercentage && <div className="product-discount">{product.discountPercentage}% OFF</div>}
          </div>
          <div className="card-actions">
            <button className="btn btn-outline" onClick={() => onView(product.id)}>View</button>
            <button className="btn btn-small" onClick={() => onAdd(product)}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}
