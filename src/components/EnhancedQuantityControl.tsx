import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface EnhancedQuantityControlProps {
  quantity: number;
  onUpdate: (change: number) => void;
  maxQuantity?: number;
  className?: string;
}

const EnhancedQuantityControl: React.FC<EnhancedQuantityControlProps> = ({ 
  quantity, 
  onUpdate, 
  maxQuantity = 10,
  className = ""
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleUpdate = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 0 && newQuantity <= maxQuantity) {
      setIsAnimating(true);
      onUpdate(change);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <div className={`enhanced-quantity-controls ${className}`}>
      <button 
        className="quantity-btn quantity-btn-minus"
        onClick={() => handleUpdate(-1)}
        disabled={quantity <= 0}
      >
        <Minus size={16} />
      </button>
      <span className={`quantity-display ${isAnimating ? 'count-animation' : ''}`}>
        {quantity}
      </span>
      <button 
        className="quantity-btn quantity-btn-plus"
        onClick={() => handleUpdate(1)}
        disabled={quantity >= maxQuantity}
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default EnhancedQuantityControl;