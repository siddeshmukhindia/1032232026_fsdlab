import { useEffect, useMemo, useState } from 'react';
import './App.css';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/bookings`;

const emptyForm = {
  passengerName: '',
  from: '',
  to: '',
  travelDate: '',
  departureDate: '',
  arrivalDate: '',
  phoneNumber: '',
  email: '',
};

const formatDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

function App() {
  const [formData, setFormData] = useState(emptyForm);
  const [bookings, setBookings] = useState([]);
  const [searchPhone, setSearchPhone] = useState('');
  const [deletePhone, setDeletePhone] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitLabel = useMemo(() => (isEditing ? 'Update Passenger' : 'Add Passenger'), [isEditing]);

  const showStatus = (type, text) => setStatus({ type, text });

  const loadBookings = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to load bookings.');
      }

      setBookings(data);
    } catch (error) {
      showStatus('error', error.message);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setIsEditing(false);
    setSearchPhone('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_URL}/${encodeURIComponent(searchPhone || formData.phoneNumber)}` : API_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to save passenger details.');
      }

      showStatus('success', data.message || 'Passenger details saved successfully.');
      resetForm();
      await loadBookings();
    } catch (error) {
      showStatus('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchPhone.trim()) {
      showStatus('error', 'Enter a phone number to search for a booking.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/${encodeURIComponent(searchPhone.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Passenger record not found.');
      }

      setFormData({
        passengerName: data.passengerName || '',
        from: data.from || '',
        to: data.to || '',
        travelDate: data.travelDate ? data.travelDate.slice(0, 10) : '',
        departureDate: data.departureDate ? data.departureDate.slice(0, 10) : '',
        arrivalDate: data.arrivalDate ? data.arrivalDate.slice(0, 10) : '',
        phoneNumber: data.phoneNumber || '',
        email: data.email || '',
      });
      setIsEditing(true);
      showStatus('success', 'Passenger record loaded. You can update the details now.');
    } catch (error) {
      showStatus('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePhone.trim()) {
      showStatus('error', 'Enter a phone number to delete a passenger record.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/${encodeURIComponent(deletePhone.trim())}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete passenger record.');
      }

      if (searchPhone.trim() === deletePhone.trim()) {
        resetForm();
      }

      setDeletePhone('');
      showStatus('success', data.message || 'Passenger record deleted successfully.');
      await loadBookings();
    } catch (error) {
      showStatus('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="hero-panel">
        <div>
          <p className="eyebrow">MERN Stack Project</p>
          <h1>Flight Booking Management System</h1>
          <p className="hero-copy">
            Insert passenger details, search and update bookings by phone number, remove records,
            and review the latest booking list in one dashboard.
          </p>
        </div>
        <div className="hero-card">
          <p>Operations Covered</p>
          <strong>Create, Read, Update, Delete</strong>
          <span>MongoDB + Express + React + Node.js</span>
        </div>
      </header>

      {status.text ? <div className={`status-banner ${status.type}`}>{status.text}</div> : null}

      <main className="content-grid">
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="section-label">Passenger Form</p>
              <h2>{isEditing ? 'Update Flight Booking' : 'Add Flight Booking'}</h2>
            </div>
            {isEditing ? (
              <button type="button" className="ghost-button" onClick={resetForm}>
                Cancel Edit
              </button>
            ) : null}
          </div>

          <form className="booking-form" onSubmit={handleSubmit}>
            <label>
              Passenger Name
              <input name="passengerName" value={formData.passengerName} onChange={handleChange} required />
            </label>
            <label>
              From
              <input name="from" value={formData.from} onChange={handleChange} required />
            </label>
            <label>
              To
              <input name="to" value={formData.to} onChange={handleChange} required />
            </label>
            <label>
              Date
              <input type="date" name="travelDate" value={formData.travelDate} onChange={handleChange} required />
            </label>
            <label>
              Departure Date
              <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} required />
            </label>
            <label>
              Arrival Date
              <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} required />
            </label>
            <label>
              Phone Number
              <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            </label>
            <label>
              Email ID
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </label>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Saving...' : submitLabel}
            </button>
          </form>
        </section>

        <section className="panel side-panel">
          <div className="section-heading compact">
            <div>
              <p className="section-label">Update Search</p>
              <h2>Find by Phone Number</h2>
            </div>
          </div>
          <div className="action-card">
            <input
              placeholder="Enter phone number"
              value={searchPhone}
              onChange={(event) => setSearchPhone(event.target.value)}
            />
            <button type="button" className="primary-button" onClick={handleSearch} disabled={loading}>
              Search Record
            </button>
          </div>

          <div className="section-heading compact danger-heading">
            <div>
              <p className="section-label">Delete Record</p>
              <h2>Remove Passenger</h2>
            </div>
          </div>
          <div className="action-card danger-card">
            <input
              placeholder="Enter phone number"
              value={deletePhone}
              onChange={(event) => setDeletePhone(event.target.value)}
            />
            <button type="button" className="danger-button" onClick={handleDelete} disabled={loading}>
              Delete Record
            </button>
          </div>
        </section>
      </main>

      <section className="panel table-panel">
        <div className="section-heading">
          <div>
            <p className="section-label">Passenger Records</p>
            <h2>Flight Booking Details</h2>
          </div>
          <button type="button" className="ghost-button" onClick={loadBookings}>
            Refresh Table
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Passenger Name</th>
                <th>From</th>
                <th>To</th>
                <th>Date</th>
                <th>Departure Date</th>
                <th>Arrival Date</th>
                <th>Phone Number</th>
                <th>Email ID</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length ? (
                bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.passengerName}</td>
                    <td>{booking.from}</td>
                    <td>{booking.to}</td>
                    <td>{formatDate(booking.travelDate)}</td>
                    <td>{formatDate(booking.departureDate)}</td>
                    <td>{formatDate(booking.arrivalDate)}</td>
                    <td>{booking.phoneNumber}</td>
                    <td>{booking.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-state">
                    No passenger records found. Add a booking to populate the table.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default App;
