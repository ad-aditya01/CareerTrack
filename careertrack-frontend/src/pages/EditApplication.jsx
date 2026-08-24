import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./EditApplication.css";
import "./Application.css";

function EditApplication() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        companyName: "",
        jobRole: "",
        applicationDate: "",
        status: "APPLIED",
        location: "",
        salary: "",
        notes: ""
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // =========================
    // LOAD APPLICATION
    // =========================

    useEffect(() => {

        const fetchApplication = async () => {

            try {

                const response = await api.get(
                    `/applications/${id}`
                );

                console.log(
                    "Application loaded:",
                    response.data
                );

                const application = response.data;

                setFormData({
                    companyName: application.companyName || "",
                    jobRole: application.jobRole || "",
                    applicationDate:
                        application.applicationDate || "",
                    status:
                        application.status || "APPLIED",
                    location:
                        application.location || "",
                    salary:
                        application.salary !== null &&
                        application.salary !== undefined
                            ? application.salary
                            : "",
                    notes:
                        application.notes || ""
                });

            } catch (error) {

                console.error(
                    "Failed to load application:",
                    error
                );

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {

                    localStorage.removeItem("token");

                    navigate("/login");

                } else if (
                    error.response?.status === 404
                ) {

                    setError(
                        "Application not found."
                    );

                } else {

                    setError(
                        "Unable to load application."
                    );
                }

            } finally {

                setLoading(false);

            }
        };

        fetchApplication();

    }, [id, navigate]);


    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };


    // =========================
    // UPDATE APPLICATION
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            const response = await api.put(
                `/applications/${id}`,
                {
                    ...formData,

                    salary: formData.salary
                        ? Number(formData.salary)
                        : null
                }
            );

            console.log(
                "Application updated:",
                response.data
            );

            setMessage(
                "Application updated successfully!"
            );

            setTimeout(() => {

                navigate("/dashboard");

            }, 1000);

        } catch (error) {

            console.error(
                "Update application error:",
                error
            );

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                localStorage.removeItem("token");

                navigate("/login");

            } else if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Unable to update application"
                );

            } else {

                setError(
                    "Unable to connect to server"
                );
            }
        }
    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="edit-application-container">

                <div className="edit-application-card">

                    <div className="edit-loading">

                        <h1>
                            Loading Application...
                        </h1>

                        <p>
                            Please wait while we load the application.
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    // =========================
    // ERROR
    // =========================

    if (error && !formData.companyName) {

        return (
            <div className="edit-application-container">

                <div className="edit-application-card">

                    <div className="edit-application-header">

                        <h1>
                            Edit Application
                        </h1>

                    </div>

                    <p className="edit-error-message">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        className="edit-back-button"
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>
        );
    }


    // =========================
    // UI
    // =========================

    return (

        <div className="edit-application-container">

            <div className="edit-application-card">

                <div className="edit-application-header">

                    <h1>
                        Edit Job Application
                    </h1>

                    <p>
                        Update your job application details.
                    </p>

                </div>


                <form onSubmit={handleSubmit}>


                    {/* COMPANY + ROLE */}

                    <div className="edit-form-row">

                        <div className="edit-form-group">

                            <label>
                                Company Name
                            </label>

                            <input
                                type="text"
                                name="companyName"
                                placeholder="e.g. Google"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="edit-form-group">

                            <label>
                                Job Role
                            </label>

                            <input
                                type="text"
                                name="jobRole"
                                placeholder="e.g. Java Backend Developer"
                                value={formData.jobRole}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    {/* DATE + STATUS */}

                    <div className="edit-form-row">

                        <div className="edit-form-group">

                            <label>
                                Application Date
                            </label>

                            <input
                                type="date"
                                name="applicationDate"
                                value={formData.applicationDate}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="edit-form-group">

                            <label>
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >

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

                        </div>

                    </div>


                    {/* LOCATION + SALARY */}

                    <div className="edit-form-row">

                        <div className="edit-form-group">

                            <label>
                                Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                placeholder="e.g. Bangalore"
                                value={formData.location}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="edit-form-group">

                            <label>
                                Salary
                            </label>

                            <input
                                type="number"
                                name="salary"
                                placeholder="e.g. 1200000"
                                value={formData.salary}
                                onChange={handleChange}
                            />

                        </div>

                    </div>


                    {/* NOTES */}

                    <div className="edit-form-group">

                        <label>
                            Notes
                        </label>

                        <textarea
                            name="notes"
                            placeholder="Add any notes..."
                            value={formData.notes}
                            onChange={handleChange}
                            rows="4"
                        />

                    </div>


                    {/* ACTIONS */}

                    <div className="edit-form-actions">

                        <button
                            type="submit"
                            className="edit-update-button"
                        >
                            Update Application
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            className="edit-cancel-button"
                        >
                            Cancel
                        </button>

                    </div>


                    {/* SUCCESS */}

                    {message && (

                        <p className="edit-success-message">
                            {message}
                        </p>

                    )}


                    {/* ERROR */}

                    {error && (

                        <p className="edit-error-message">
                            {error}
                        </p>

                    )}

                </form>

            </div>

        </div>
    );
}

export default EditApplication;