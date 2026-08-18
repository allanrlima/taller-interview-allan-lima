"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/types/product";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLElement>({ rootMargin: "150px" });

  return (
    <article className="product-card" ref={ref}>
      <div className="product-image" aria-hidden={!isIntersecting}>
        {isIntersecting ? <Image src={product.imageUrl} alt="" width={480} height={320} /> : <span>Image pending</span>}
      </div>
      <div className="product-card__body">
        <p className="eyebrow">{product.category}</p>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p aria-label={`Rating: ${product.rating} out of 5`}>★ {product.rating}</p>
        <div className="product-card__footer">
          <strong>{formatPrice(product.priceInCents)}</strong>
          <button type="button" onClick={() => onAddToCart?.(product)} disabled={product.stock === 0}>
            {product.stock === 0 ? "Out of stock" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
