"use client";

import React, { useState } from "react";

export function AdmissionsApplyForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [course, setCourse] = useState("");
  const [qualification, setQualification] = useState("");
  const [yearOfPassing, setYearOfPassing] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "Admission application",
          name,
          username: name,
          email,
          phone,
          course,
          message,
          dob,
          gender,
          state,
          city,
          qualification,
          yearOfPassing
        })
      });

      const data = (await response.json()) as { error?: string; success?: boolean };

      if (!response.ok) {
        setError(data.error ?? "Failed to send application");
        return;
      }

      setSuccess("Thank you. Your application request has been sent.");
      setName("");
      setEmail("");
      setPhone("");
      setDob("");
      setGender("");
      setState("");
      setCity("");
      setCourse("");
      setQualification("");
      setYearOfPassing("");
      setMessage("");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Failed to send application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" style={{ marginTop: "1.2rem" }}>
      <div>
        <label className="form-label" style={{ display: "block", marginBottom: "0.35rem" }}>Full Name</label>
        <input className="input" type="text" placeholder="Enter full name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="grid grid-2" style={{ gap: "0.8rem" }}>
        <div>
          <label className="form-label" style={{ display: "block", marginBottom: "0.35rem" }}>Email</label>
          <input className="input" type="email" placeholder="name@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="form-label" style={{ display: "block", marginBottom: "0.35rem" }}>Mobile Number</label>
          <input className="input" type="tel" placeholder="+91" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: "0.8rem" }}>
        <div>
          <label className="form-label" style={{ display: "block", marginBottom: "0.35rem" }}>Date of Birth</label>
          <input className="input" type="date" required value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>
        <div>
          <label className="form-label" style={{ display: "block", marginBottom: "0.35rem" }}>Gender</label>
          <select className="input" value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="" disabled>Select gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
            <option>Prefer not to say</option>
          </select>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: "0.8rem" }}>
        <div>
          <label className="form-label" style={{ display: "block", marginBottom: "0.35rem" }}>State</label>
          <input className="input" type="text" placeholder="State" required value={state} onChange={(e) => setState(e.target.value)} />
        </div>
        <div>
          <label className="form-label" style={{ display: "block", marginBottom: "0.35rem" }}>City</label>
          <input className="input" type="text" placeholder="City" required value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="form-label" style={{ display: "block", marginBottom: "0.35rem" }}>Course Interested In</label>
        <select className="input" value={course} onChange={(e) => setCourse(e.target.value)} required>
          <option value="" disabled>Select preferred course</option>
          <option>BCA (Artificial Intelligence and DevOps) with Certification in Cloud Computing by IBM</option>
          <option>BCA (Artificial Intelligence, Machine Learning and Robotics) with Certification in IoT by IBM</option>
          <option>BCA (Artificial Intelligence and Cyber Security) with Certification in Cloud Computing by IBM</option>
          <option>BCA (Artificial Intelligence and Data Analytics) with Certification in Cloud by Google</option>
          <option>BCA (Cyber Security and Ethical Hacking) with Certification in Cloud Computing by IBM</option>
          <option>BCA (Cyber Security and Digital Forensic) with Certification in Ethical Hacking by EC Council</option>
          <option>BBA (AI and Data Analytics) with Certification in Digital Business Management by IBM</option>
          <option>BBA (Aviation and Logistics) with certification in Airport and Cabin Crew Management</option>
          <option>BBA (International Business and Business Analytics) with Certification in Digital Marketing by Meta</option>
          <option>MBA (HR, Marketing, Finance, Logistics, Supply Chain, Healthcare and Hospital Administration)</option>
        </select>
      </div>

      <div className="grid grid-2" style={{ gap: "0.8rem" }}>
        <div>
          <label className="form-label" style={{ display: "block", marginBottom: "0.35rem" }}>Qualification</label>
          <select className="input" value={qualification} onChange={(e) => setQualification(e.target.value)} required>
            <option value="" disabled>Select qualification</option>
            <option>10th</option>
            <option>12th</option>
            <option>Diploma</option>
            <option>Graduate</option>
            <option>Postgraduate</option>
          </select>
        </div>
        <div>
          <label className="form-label" style={{ display: "block", marginBottom: "0.35rem" }}>Year of Passing</label>
          <input className="input" type="number" min="1990" max="2035" placeholder="YYYY" required value={yearOfPassing} onChange={(e) => setYearOfPassing(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="form-label" style={{ display: "block", marginBottom: "0.35rem" }}>Message</label>
        <textarea className="input" rows={4} placeholder="Tell us your career goals or any specific query." value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      {error ? <p style={{ margin: 0, color: "#b42318", fontSize: "0.9rem" }}>{error}</p> : null}
      {success ? <p style={{ margin: 0, color: "var(--primary)", fontSize: "0.9rem" }}>{success}</p> : null}

      <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }} disabled={submitting}>
        {submitting ? "Sending..." : "Submit Application Request"}
      </button>
    </form>
  );
}
