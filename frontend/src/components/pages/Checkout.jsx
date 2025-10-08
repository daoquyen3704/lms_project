import React, { useState } from 'react';
import Layout from '../common/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { fetchJWT } from '../../utils/fetchJWT';
import { apiUrl } from '../common/Config';
import toast from 'react-hot-toast';

/*
    Checkout page layout
    Left column: Billing details + Payment method (future) + Place order button (mobile stacked)
    Right column: Order summary (sticky on large screens)
    Reuse existing card / form-control / btn-primary styles from global SCSS.
*/

const Checkout = () => {
    const navigate = useNavigate();
    // Mock cart data – in future replace with context/store
    const [items, setItems] = useState([
        { id: 1, title: 'Mastering React 18 + Hooks', price: 19.99, thumb: 'https://via.placeholder.com/80x60?text=R' },
        { id: 2, title: 'Advanced Laravel API', price: 24.5, thumb: 'https://via.placeholder.com/80x60?text=L' },
    ]);

    const [billing, setBilling] = useState({
        full_name: '',
        email: '',
        country: '',
        city: '',
        address: '',
        note: ''
    });

    const [placing, setPlacing] = useState(false);

    const subtotal = items.reduce((s, i) => s + i.price, 0);
    const tax = +(subtotal * 0.1).toFixed(2); // sample 10% tax
    const total = +(subtotal + tax).toFixed(2);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBilling(prev => ({ ...prev, [name]: value }));
    };

    const placeOrder = async (e) => {
        e.preventDefault();
        if (!billing.full_name || !billing.email) {
            toast.error('Please fill required fields.');
            return;
        }
        try {
            setPlacing(true);
            // Placeholder API call – adjust endpoint later
            const res = await fetchJWT(`${apiUrl}/checkout`, {
                method: 'POST',
                body: JSON.stringify({ billing, items }),
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            });
            const result = await res.json();
            if (res.ok && (result.status === 200 || result.success)) {
                toast.success(result.message || 'Order placed successfully');
                navigate('/account/my-learning');
            } else {
                toast.error(result.message || 'Failed to place order');
            }
        } catch (err) {
            console.error(err);
            toast.error('Server error');
        } finally {
            setPlacing(false);
        }
    };

    return (
        <Layout>
            <div className="container py-4 mt-3">
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="mb-3">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/courses">Courses</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Checkout</li>
                    </ol>
                </nav>

                <div className="row g-4">
                    {/* Billing + Payment */}
                    <div className="col-lg-8">
                        <form onSubmit={placeOrder} className="card border-0 shadow-sm mb-4">
                            <div className="card-body p-4">
                                <h3 className="h5 mb-3">Billing Details</h3>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Full Name *</label>
                                        <input name="full_name" value={billing.full_name} onChange={handleChange} type="text" className="form-control" placeholder="Your name" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email *</label>
                                        <input name="email" value={billing.email} onChange={handleChange} type="email" className="form-control" placeholder="you@example.com" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Country</label>
                                        <input name="country" value={billing.country} onChange={handleChange} type="text" className="form-control" placeholder="Country" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">City</label>
                                        <input name="city" value={billing.city} onChange={handleChange} type="text" className="form-control" placeholder="City" />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Address</label>
                                        <input name="address" value={billing.address} onChange={handleChange} type="text" className="form-control" placeholder="Street, number" />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Order Note</label>
                                        <textarea name="note" value={billing.note} onChange={handleChange} rows={3} className="form-control" placeholder="Optional note"></textarea>
                                    </div>
                                </div>

                                <hr className="my-4" />
                                <h3 className="h5 mb-3">Payment</h3>
                                <div className="alert alert-light border">(Demo) Payment method integration coming soon.</div>

                                <div className="d-flex justify-content-end mt-3">
                                    <button type="submit" disabled={placing} className="btn btn-primary">
                                        {placing ? 'Placing Order...' : `Place Order (${total.toFixed(2)}$)`}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm position-sticky" style={{ top: '90px' }}>
                            <div className="card-body p-4">
                                <h3 className="h5 mb-3">Order Summary</h3>
                                <ul className="list-unstyled mb-3">
                                    {items.map(i => (
                                        <li key={i.id} className="d-flex align-items-center mb-3">
                                            <img src={i.thumb} alt={i.title} className="me-3 rounded" width={70} height={50} style={{ objectFit: 'cover' }} />
                                            <div className="flex-grow-1">
                                                <div className="fw-semibold small">{i.title}</div>
                                                <div className="text-muted small">Single License</div>
                                            </div>
                                            <div className="fw-semibold small">${i.price}</div>
                                        </li>
                                    ))}
                                </ul>
                                <hr />
                                <div className="d-flex justify-content-between small mb-2">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between small mb-2">
                                    <span>Tax (10%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between small mb-2">
                                    <span>Discount</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="d-flex justify-content-between fw-bold mb-3">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <button onClick={placeOrder} disabled={placing} className="btn btn-primary w-100 d-lg-none">
                                    {placing ? 'Placing Order...' : `Place Order (${total.toFixed(2)}$)`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Checkout;
