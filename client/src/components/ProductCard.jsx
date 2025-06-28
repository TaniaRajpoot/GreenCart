import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  return product && (
    <div
      onClick={() => {
        navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
        scrollTo(0, 0);
      }}
      className="border border-gray-200 rounded-md px-4 py-3 bg-white w-full h-full flex flex-col"
    >
      {/* Image */}
      <div className="group cursor-pointer flex items-center justify-center px-2 mb-3">
        <img
          className="group-hover:scale-105 transition w-28 h-28 md:w-36 md:h-36 object-cover rounded"
          src={product.image[0]}
          alt={product.name}
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow">
        <p className="text-gray-500/60 text-sm">{product.category}</p>

        <p className="text-gray-700 font-medium text-lg truncate w-full mt-1">
          {product.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-0.5 mt-1">
          {Array(5).fill('').map((_, i) => (
            <img
              key={i}
              className="md:w-3.5 w-3"
              src={i < 4 ? assets.star_icon : assets.star_dull_icon}
              alt="star"
            />
          ))}
          <p className="text-sm">(4)</p>
        </div>

        {/* Price */}
        <p className="md:text-xl text-base font-medium text-primary mt-3">
          {currency}{product.price}{" "}
          {/* <span className="text-gray-500/60 md:text-sm text-xs line-through ml-2">
            {currency}{product.rice}
          </span> */}
        </p>

        {/* Spacer pushes Add to Cart to bottom */}
        <div className="flex-grow"></div>

        {/* Add to Cart / Quantity Controls */}
        <div
          onClick={(e) => { e.stopPropagation(); }}
          className="flex items-center justify-end mt-3 gap-2"
        >
          {!cartItems[product._id] ? (
            <button
              className="flex items-center justify-center gap-1 bg-primary-10 border border-primary-40 md:w-[80px] w-[64px] h-[34px] rounded cursor-pointer text-sm font-semibold text-primary"
              onClick={() => addToCart(product._id)}
            >
              <img src={assets.cart_icon} alt="cart_icon" className="w-4 h-4" />
              Add
            </button>
          ) : (
            <div className="flex items-center gap-2 md:w-24 w-20 h-[34px] bg-primary/25 rounded select-none px-2">
              <button
                onClick={() => removeFromCart(product._id)}
                className="cursor-pointer text-lg font-bold text-primary px-2"
              >
                -
              </button>
              <span className="w-6 text-center font-semibold">{cartItems[product._id]}</span>
              <button
                onClick={() => addToCart(product._id)}
                className="cursor-pointer text-lg font-bold text-primary px-2"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
