import React, { createContext, useContext, useEffect, useState } from "react"
import Swal from "sweetalert2"


import type { Categoria, Plato, PlatoConOpciones, Opciones } from '../types/type'



type cartContextType = {
    cart: PlatoConOpciones[]
    handleAddCart: (product: Plato, opciones: string[], nota: string, cantidad: number) => void
    removeFromCart: (index: number) => void
    getTotal: () => number
    realizarPedido: (name: string, telefono: string) => void
}

const cartContext = createContext<cartContextType | undefined>(undefined)

const urlApi = import.meta.env.VITE_API_URL


export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setcart] = useState<PlatoConOpciones[]>([]);


    const handleAddCart = (product: Plato, opcionSeleccionada: string[], nota: string, cantidad: number) => {
        const productoConOpciones: PlatoConOpciones = {
            ...product,
            opcionesSeleccionadas: product.opciones?.filter(op => opcionSeleccionada.includes(op.id)) || [],
            nota: nota.trim() !== "" ? nota.trim() : undefined,
            cantidad,
        };

        setcart((prev) => [...prev, productoConOpciones]);

        Swal.fire({
            title: "¡Éxito!",
            icon: "success",
            text: `${product.nombre} agregado al carrito.`,
        });
    };



    const removeFromCart = (index: number) => {
        const updateCart = [...cart]
        updateCart.splice(index, 1)
        setcart(updateCart)
    }



    const getTotal = () => {
        return cart.reduce((acc, item) => {
            const precioBase = Number(item.precio) || 0;
            const precioOpciones = item.opcionesSeleccionadas?.reduce((sum, opc) => sum + (Number(opc.precioExtra) || 0), 0) || 0;
            const subtotal = (precioBase + precioOpciones) * item.cantidad
            return acc + subtotal;
        }, 0);
    };




    const realizarPedido = async (name: string, telefono: string) => {
        if (!name.trim() || !telefono.trim()) {
            Swal.fire({ icon: "error", title: "Error", text: "Completa nombre y teléfono" });
            return;
        }

        if (cart.length === 0) {
            Swal.fire({ icon: "error", title: "Error", text: "El carrito está vacío." });
            return;
        }

        const pedidoData = {
            cliente: { nombre: name.trim(), telefono: telefono.trim() },
            total: getTotal(),
            items: cart.map(item => ({
                idPlato: item.id,
                nombre: item.nombre,
                precio: item.precio,
                opcionesSeleccionadas: item.opcionesSeleccionadas.map(opc => ({
                    id: opc.id,
                    nombre: opc.nombre,
                    precioExtra: opc.precioExtra ?? 0
                })),
                cantidad: item.cantidad,
                nota: item.nota || ""
            })),
            fecha: new Date().toISOString()
        };

        try {
            const response = await fetch(`${urlApi}pedidosClient`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pedidoData),
            });

            if (!response.ok) throw new Error("Error al enviar el pedido");

            const itemsTexto = cart.map((item, i) => {
                const opciones = item.opcionesSeleccionadas?.map(op => `- ${op.nombre} (+$${op.precioExtra})`).join("\n") || "";
                return `${i + 1}. ${item.nombre}\n${opciones}`;
            }).join("\n\n");

            const total = getTotal().toFixed(2);
            const mensaje = `Hola! Quiero pedir:\n${itemsTexto}\nTotal: $${total}\nNombre: ${name}\nTel: ${telefono}`;
            const url = `https://wa.me/3512445293?text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank');

            setcart([]);
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo enviar el pedido." });
        }
    };





    return (
        <cartContext.Provider value={{ cart, handleAddCart, removeFromCart, getTotal, realizarPedido }}>
            {children}
        </cartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(cartContext)
    if (!context) throw new Error("useCart debe usarse dentro de un CartProvider")
    return context
}