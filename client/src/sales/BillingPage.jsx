import React, { useEffect, useState } from 'react';

export default function BillingPage() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    useEffect(() => {
        fetch('http://localhost:5002/api/sales/products')
            .then(res => res.json())
            .then(setProducts);
    }, []);

    const addToCart = (product) => {
        const existing = cart.find(c => c._id === product._id);
        if(existing) {
            setCart(cart.map(c => c._id === product._id ? {...c, quantity: c.quantity+1, total: (c.quantity+1)*c.price} : c));
        } else {
            setCart([...cart, {...product, quantity:1, total: product.price}]);
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(c => c._id !== productId));
    };

    const handleCheckout = async () => {
        const res = await fetch('http://localhost:5002/api/sales/orders', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({ userId, items: cart })
        });
        const data = await res.json();
        alert('Order created, now you can print invoice');
        setCart([]);
    };

    const total = cart.reduce((sum, c)=>sum+c.total,0);

    return (
        <div className="flex h-screen">
            <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
                <h2 className="text-xl font-bold mb-6">Sales</h2>
                <button className="mb-4" onClick={()=>window.location.href='/sales'}>Billing</button>
                <button onClick={()=>window.location.href='/salesReport'}>Sales Report</button>
                <div className="mt-auto">Logged in: {username}</div>
                <button className="mt-4 bg-red-500 rounded px-2 py-1" onClick={()=>{
                    localStorage.clear(); window.location.href='/login';
                }}>Logout</button>
            </aside>
            <main className="flex-1 p-6 bg-gray-100">
                <h1 className="text-2xl font-semibold mb-4">Billing Page</h1>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {products.map(p=>(
                        <div key={p._id} className="p-4 border rounded shadow bg-white">
                            <h2>{p.name}</h2>
                            <p>${p.price}</p>
                            <button className="mt-2 bg-green-500 px-2 py-1 rounded" onClick={()=>addToCart(p)}>Add</button>
                        </div>
                    ))}
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="font-semibold">Cart</h2>
                    {cart.map(c=>(
                        <div key={c._id} className="flex justify-between my-1">
                            <span>{c.name} x {c.quantity}</span>
                            <span>${c.total}</span>
                            <button className="text-red-500" onClick={()=>removeFromCart(c._id)}>Remove</button>
                        </div>
                    ))}
                    <div className="mt-2 font-bold">Total: ${total}</div>
                    <button className="mt-2 bg-blue-500 px-2 py-1 rounded" onClick={handleCheckout}>Checkout & Generate PDF</button>
                </div>
            </main>
        </div>
    );
}
