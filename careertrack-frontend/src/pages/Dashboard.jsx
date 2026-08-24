import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");

    // Dashboard statistics from backend
    const [stats, setStats] = useState({
        totalApplications: 0,
        applied: 0,
        interview: 0,
        selected: 0,
        rejected: 0,
        offer: 0
    });

    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");

    const navigate = useNavigate();


    // =========================
    // LOAD DASHBOARD
    // =========================

    useEffect(() => {

        fetchApplications();
        fetchStatistics();

    }, []);


    // =========================
    // LOAD APPLICATIONS
    // =========================

    const fetchApplications = async () => {

        setLoading(true);
        setError("");

        try {

            const response = await api.get("/applications");

            console.log(
                "Applications:",
                response.data
            );

            setApplications(
                response.data.content || []
            );

        } catch (error) {

            console.error(
                "Failed to fetch applications:",
                error
            );

            handleAuthError(error);

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // LOAD DASHBOARD STATISTICS
    // =========================

    const fetchStatistics = async () => {

        try {

            const response = await api.get(
                "/applications/dashboard/stats"
            );

            console.log(
                "Dashboard statistics:",
                response.data
            );

            setStats(response.data);

        } catch (error) {

            console.error(
                "Failed to fetch dashboard statistics:",
                error
            );

            handleAuthError(error);

        }
    };


    // =========================
    // SEARCH / FILTER
    // =========================

    const handleSearch = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            const params = {};

            if (company.trim()) {
                params.company = company.trim();
            }

            if (role.trim()) {
                params.role = role.trim();
            }

            if (status) {
                params.status = status;
            }

            const response = await api.get(
                "/applications/filter",
                {
                    params: params
                }
            );

            console.log(
                "Filtered applications:",
                response.data
            );

            setApplications(
                response.data.content || []
            );

        } catch (error) {

            console.error(
                "Search/filter error:",
                error
            );

            handleAuthError(error);

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // CLEAR FILTERS
    // =========================

    const clearFilters = () => {

        setCompany("");
        setRole("");
        setStatus("");

        fetchApplications();
    };


    // =========================
    // DELETE APPLICATION
    // =========================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this application?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(
                `/applications/${id}`
            );

            setDeleteMessage(
                "Application deleted successfully!"
            );

            // Refresh applications
            fetchApplications();

            // Refresh dashboard statistics
            fetchStatistics();

            setTimeout(() => {
                setDeleteMessage("");
            }, 2000);

        } catch (error) {

            console.error(
                "Delete application error:",
                error
            );

            handleAuthError(error);

        }
    };


    // =========================
    // AUTH ERROR
    // =========================

    const handleAuthError = (error) => {

        if (
            error.response?.status === 401 ||
            error.response?.status === 403
        ) {

            localStorage.removeItem("token");

            navigate("/login");

        } else {

            setError(
                error.response?.data?.message ||
                "Something went wrong"
            );

        }
    };


    // =========================
    // LOGOUT
    // =========================

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };


    // =========================
    // UI
    // =========================

    return (

        <div className="dashboard">


            {/* =========================
                HEADER
            ========================= */}

            <header className="dashboard-header">

                <h1>
                    CareerTrack
                </h1>

                <div className="header-actions">

                    <button
                        className="add-application-button"
                        onClick={() =>
                            navigate("/add-application")
                        }
                    >
                        + Add Application
                    </button>

                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* =========================
                WELCOME
            ========================= */}

            <section className="welcome-section">

                <h2>
                    Welcome back! 👋
                </h2>

                <p>
                    Track and manage your career journey.
                </p>

            </section>


            {/* =========================
                STATISTICS
            ========================= */}

            <section className="stats-grid">


                {/* TOTAL */}

                <div className="stat-card">

                    <h3>
                        Total Applications
                    </h3>

                    <p>
                        {stats.totalApplications}
                    </p>

                </div>


                {/* APPLIED */}

                <div className="stat-card">

                    <h3>
                        Applied
                    </h3>

                    <p>
                        {stats.applied}
                    </p>

                </div>


                {/* INTERVIEW */}

                <div className="stat-card">

                    <h3>
                        Interviews
                    </h3>

                    <p>
                        {stats.interview}
                    </p>

                </div>


                {/* SELECTED */}

                <div className="stat-card">

                    <h3>
                        Selected
                    </h3>

                    <p>
                        {stats.selected}
                    </p>

                </div>


                {/* REJECTED */}

                <div className="stat-card">

                    <h3>
                        Rejected
                    </h3>

                    <p>
                        {stats.rejected}
                    </p>

                </div>


                {/* OFFER */}

                <div className="stat-card">

                    <h3>
                        Offers
                    </h3>

                    <p>
                        {stats.offer}
                    </p>

                </div>

            </section>


            {/* =========================
                APPLICATIONS
            ========================= */}

            <section className="applications-section">

                <h2>
                    Applications
                </h2>


                {/* =========================
                    SEARCH / FILTER
                ========================= */}

                <form
                    className="filter-form"
                    onSubmit={handleSearch}
                >

                    <input
                        type="text"
                        placeholder="Search company..."
                        value={company}
                        onChange={(e) =>
                            setCompany(e.target.value)
                        }
                    />


                    <input
                        type="text"
                        placeholder="Search job role..."
                        value={role}
                        onChange={(e) =>
                            setRole(e.target.value)
                        }
                    />


                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                    >

                        <option value="">
                            All Status
                        </option>

                        <option value="APPLIED">
                            Applied
                        </option>

                        <option value="INTERVIEW">
                            Interview
                        </option>

                        <option value="SELECTED">
                            Selected
                        </option>

                        <option value="REJECTED">
                            Rejected
                        </option>

                        <option value="OFFER">
                            Offer
                        </option>

                    </select>


                    <button
                        type="submit"
                        className="search-button"
                    >
                        Search
                    </button>


                    <button
                        type="button"
                        className="clear-button"
                        onClick={clearFilters}
                    >
                        Clear
                    </button>

                </form>


                {/* =========================
                    MESSAGES
                ========================= */}

                {loading && (
                    <p>
                        Loading applications...
                    </p>
                )}


                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}


                {deleteMessage && (
                    <p className="success-message">
                        {deleteMessage}
                    </p>
                )}


                {/* =========================
                    EMPTY
                ========================= */}

                {!loading &&
                    !error &&
                    applications.length === 0 && (

                        <p>
                            No applications found.
                        </p>

                    )
                }


                {/* =========================
                    TABLE
                ========================= */}

                {!loading &&
                    applications.length > 0 && (

                        <div className="applications-table">


                            {/* HEADER */}

                            <div className="table-header">

                                <span>
                                    Company
                                </span>

                                <span>
                                    Role
                                </span>

                                <span>
                                    Status
                                </span>

                                <span>
                                    Actions
                                </span>

                            </div>


                            {/* ROWS */}

                            {applications.map(
                                (application) => (

                                    <div
                                        className="table-row"
                                        key={application.id}
                                    >

                                        <span>
                                            {
                                                application.companyName
                                            }
                                        </span>


                                        <span>
                                            {
                                                application.jobRole
                                            }
                                        </span>


                                        {/* STATUS BADGE */}

                                        <span
                                            className={`status-badge status-${application.status?.toLowerCase()}`}
                                        >
                                            {application.status}
                                        </span>


                                        {/* ACTIONS */}

                                        <span className="action-buttons">

                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/edit-application/${application.id}`
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>


                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        application.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    )}

            </section>

        </div>
    );
}

export default Dashboard;