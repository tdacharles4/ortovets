"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion } from "framer-motion";

interface CartToastProps {
    message: string;
    onClose: () => void;
}

export default function CartToast({ message, onClose }: CartToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (typeof window === "undefined") return null;

    return createPortal(
        <div className="fixed bottom-4 w-full flex justify-center pointer-events-none z-50">
            {/* MOBILE */}
            <Link href='/cart'>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="md:hidden mx-2 w-full bg-black text-white p-4 rounded-xl shadow-lg text-center pointer-events-auto"
                >
                    {message}
                    <p className="underline">Ver carrito</p>
                </motion.div>
            </Link>

            {/* DESKTOP */}
            <Link href='/cart'>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="hidden md:flex md:flex-col absolute right-4 bottom-4 bg-black text-white px-4 py-3 rounded-xl shadow-lg pointer-events-auto z-50"
                >
                    {message}
                    <p className="underline">Ver carrito</p>
                </motion.div>
            </Link >
        </div >,
        document.body
    );
}