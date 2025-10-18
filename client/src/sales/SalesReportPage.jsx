import React, { useEffect, useState } from 'react';

export default function SalesReportPage() {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState({ startDate:'', endDate:'' });
    const username = localStorage.getItem('username');

    const fetchOrders = () => {
        const params = new URLSearchParams(filter).toString();
        fetch(`http://localhost:5002/api/sales/salesReport?${params}`)
            .then(res=>res.json())
            .then(setOrders);
    };

    useEffect(fetchOrders, []);

    return (
        <div className="flex h-screen">
            <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
                <h2 className="text-xl font-bold mb-6">Sales</h2>
                <button className="mb-4" onClick={()=>window.location.href='/sales'}>Billing</button>
                <button>Sales Report</button>
                <div className="mt-auto">Logged in: {username}</div>
                <button className="mt-4 bg-red-500 rounded px-2 py-1" onClick={()=>{
                    localStorage.clear(); window.location.href='/login';
                }}>Logout</button>
            </aside>
            <main className="flex-1 p-6 bg-gray-100">
                <h1 className="text-2xl font-semibold mb-4">Sales Report</h1>
                <div className="mb-4">
                    <input type="date" className="mr-2" value={filter.startDate} onChange={e=>setFilter({...filter,startDate:e.target.value})}/>
                    <input type="date" className="mr-2" value={filter.endDate} onChange={e=>setFilter({...filter,endDate:e.target.value})}/>
                    <button className="bg-blue-500 px-2 py-1 rounded" onClick={fetchOrders}>Filter</button>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    {orders.map(o=>(
                        <div key={o._id} className="border-b py-2 flex justify-between">
                            <span>Order: {o._id}</span>
                            <span>Total: ${o.totalAmount}</span>
                            <button className="text-red-500" onClick={()=>{
                                fetch(`http://localhost:5002/api/sales/orders/${o._id}`,{method:'DELETE'})
                                .then(fetchOrders)
                            }}>Delete</button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
