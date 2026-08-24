import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Application.css";

function AddApplication() {

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

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            const response = await api.post("/applications", {
                ...formData,
                salary: formData.salary
                    ? Number(formData.salary)
                    : null
            });

            console.log("Application created:", response.data);

            setMessage("Application added successfully!");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);

        } catch (error) {

            console.error("Create application error:", error);

            if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Unable to create application"
                );

            } else {

                setError("Unable to connect to server");

            }
        }
    };

    return (

        <div className="application-container">

            <div className="application-card">

                <div className="application-header">

                    <h1>Add Job Application</h1>

                    <p>
                        Track a new job application in CareerTrack.
                    </p>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-row">

                        <div className="form-group">
                            <label>Company Name</label>

                            <input
                                type="text"
                                name="companyName"
                                placeholder="e.g. Google"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Job Role</label>

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


                    <div className="form-row">

                        <div className="form-group">
                            <label>Application Date</label>

                            <input
                                type="date"
                                name="applicationDate"
                                value={formData.applicationDate}
                                onChange={handleChange}
                                required
                            />
                        </div>


                        <div className="form-group">
                            <label>Status</label>

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


                    <div className="form-row">

                        <div className="form-group">
                            <label>Location</label>

                            <input
                                type="text"
                                name="location"
                                placeholder="e.g. Bangalore"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>


                        <div className="form-group">
                            <label>Salary</label>

                            <input
                                type="number"
                                name="salary"
                                placeholder="e.g. 1200000"
                                value={formData.salary}
                                onChange={handleChange}
                            />
                        </div>

                    </div>


                    <div className="form-group">

                        <label>Notes</label>

                        <textarea
                            name="notes"
                            placeholder="Add any notes..."
                            value={formData.notes}
                            onChange={handleChange}
                            rows="4"
                        />

                    </div>


                    <div className="form-actions">

                        <button
                            type="submit"
                            className="submit-button"
                        >
                            Add Application
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            className="cancel-button"
                        >
                            Cancel
                        </button>

                    </div>


                    {message && (
                        <p className="success-message">
                            {message}
                        </p>
                    )}

                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                </form>

            </div>

        </div>
    );
}

export default AddApplication;