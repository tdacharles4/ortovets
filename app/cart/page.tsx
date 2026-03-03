"use client";

import { useCart } from "../context/cartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
    const { items, removeFromCart, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false)

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    console.log("CartPage rendered, items:", items);

    async function handleCheckout() {
        console.log("Checkout items:", items);
        setLoading(true);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items }),
            });

            const { webUrl } = await res.json();

            if (webUrl) {
                clearCart();
                window.location.href = webUrl;
            } else {
                alert("Failed to create checkout. Try again.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
        } finally {
            setLoading(false);
        }
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center pt-6 md:mt-[61px] mt-[41px]">
                <p className="text-xl mb-4">Tu carrito está vacío.</p>
                <Link href="/shop" className="underline">
                    Continua comprando.
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 lg:pt-6 md:mt-[61px] mt-[41px]">
            <h1 className="text-3xl font-bold mb-6">Tu carrito</h1>
            <div className="flex flex-col gap-4">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                        {item.image && (
                            <div className="relative w-20 h-20">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <p className="font-semibold">{item.title}</p>
                            {item.variantTitle && (
                                <p className="text-sm text-gray-500">{item.variantTitle}</p>
                            )}
                            <p>
                                {item.quantity} × ${item.price.toFixed(2)} ={" "}
                                <span className="font-semibold">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>
                            </p>
                        </div>
                        <button
                            className="text-red-500 hover:underline"
                            onClick={() => removeFromCart(item.id)}
                        >
                            Remover
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center mt-6">
                <button
                    onClick={clearCart}
                    className="border px-4 py-2 rounded hover:bg-gray-100 mb-4 lg:mb-0 w-full lg:w-auto"
                >
                    Limpiar carrito
                </button>

                <div className="flex flex-col lg:flex-row items-center gap-4  w-full lg:w-auto">
                    <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full lg:w-auto"
                    >
                        {loading ? "Loading..." : "Checkout"}
                    </button>
                </div>
            </div>
        </div>
    );
}
