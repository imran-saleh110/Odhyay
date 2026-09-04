import '../styles/SignIn.css'
import { X } from 'lucide-react'
import { useFormik } from 'formik'
import { useNavigate, NavLink } from 'react-router'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
const SignIn = () => {
    const navigate = useNavigate();
    const { signin } = useAuth();
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validate: (values) => {
            const errors = {};
            if (!values.email) {
                errors.email = 'ইমেইল অ্যাড্রেস দিন';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
                errors.email = 'সঠিক ইমেইল অ্যাড্রেস দিন';
            }
            if (!values.password) {
                errors.password = 'পাসওয়ার্ড দিন';
            }
            return errors;
        },
        onSubmit: (values) => {
            setServerError('');
            setLoading(true);

            signin(values)
                .then(() => {
                    navigate('/');
                })
                .catch((err) => {
                    const message = err.response?.data?.error || 'কিছু একটা সমস্যা হয়েছে';
                    setServerError(message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    });


    return (
        <div className="sign-in-overlay">
            <div className="floating-card">
                <X onClick={() => navigate(-1)} size={18} className="close-button"/>
                <h3 className="welcome-text">আবারও স্বাগতম!</h3>
                <p className="welcome-description">অধ্যায় এর সকল সেবা পেতে সাইন ইন করুন</p>
                {serverError && <p className="server-error">{serverError}</p>}
                <form onSubmit={formik.handleSubmit}>
                    <label className="input-label" htmlFor="email">ইমেইল অ্যাড্রেস</label>
                    <br/>
                    <input
                        className={formik.touched.email && formik.errors.email ? 'input-field error' : 'input-field'}
                        id="email"
                        name="email"
                        type="text"
                        placeholder={formik.touched.email && formik.errors.email ? formik.errors.email : 'ইমেইল অ্যাড্রেস'}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    <br/>
                    <label className="input-label" htmlFor="password">পাসওয়ার্ড</label>
                    <br/>
                    <input
                        className={formik.touched.password && formik.errors.password ? 'input-field error' : 'input-field'}
                        id="password"
                        name="password"
                        type="password"
                        placeholder={formik.touched.password && formik.errors.password ? formik.errors.password : 'পাসওয়ার্ড'}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    <br/>
                    <p className="query-text">পাসওয়ার্ড ভুলে গেছেন?</p>
                    <br/>
                    <button className="submit-button" type="submit" disabled={loading}>
                        {loading ? 'অপেক্ষা করুন...' : 'সাইন ইন'}
                    </button>
                </form>
                <div className="divider" />
                <p className="query-text">
                    অ্যাকাউন্ট নেই?
                    <NavLink to="/register" replace  className="register-now"> রেজিস্টার করুন</NavLink>
                </p>
            </div>
        </div>
    );
};

export default SignIn;