"use client";

import { useMemo, useState } from "react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_COUNSELLOR_NUMBER ?? "9686267744";

type CampusKey = "bangalore" | "mangalore" | "moodbidri" | "mudipu" | "zulekha";

type CampusOption = {
  value: CampusKey;
  label: string;
  courses: string[];
};

const campusOptions: CampusOption[] = [
  {
    value: "bangalore",
    label: "Bangalore Campus",
    courses: [
      "BBA (Aviation, Travel and Tourism)",
      "BCA (Artificial Intelligence & Cyber Security)",
      "MBA (General)",
      "Other"
    ]
  },
  {
    value: "mangalore",
    label: "Mangalore Campus",
    courses: [
      "BBA (Logistics & Supply Chain)",
      "BCA (Cloud Computing & DevOps)",
      "B.Com (Finance and Analytics)",
      "Other"
    ]
  },
  {
    value: "moodbidri",
    label: "Moodbidri Campus",
    courses: [
      "B.Sc Nursing",
      "BPT",
      "MPT",
      "Other"
    ]
  },
  {
    value: "mudipu",
    label: "Mudipu Campus",
    courses: [
      "BCA (Artificial Intelligence & Cyber Security)",
      "BCA (Cloud Computing & DevOps)",
      "BBA (Human Resource & Marketing)",
      "Other"
    ]
  },
  {
    value: "zulekha",
    label: "Zulekha Nursing College",
    courses: [
      "B.Sc Nursing",
      "Post Basic B.Sc Nursing",
      "M.Sc Nursing",
      "Other"
    ]
  }
];

export function KnowYourFeesForm() {
  const [campus, setCampus] = useState("");
  const [course, setCourse] = useState("");
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedCampus = useMemo(
    () => campusOptions.find((option) => option.value === campus),
    [campus]
  );

  const whatsappText = useMemo(() => {
    const parts = [
      "Hello counsellor, I want to know my fees details.",
      `Campus: ${selectedCampus?.label ?? ""}`,
      `Course: ${course}`,
      `Name: ${name}`,
      `Place: ${place}`,
      `Phone: ${phone}`
    ];

    return encodeURIComponent(parts.join("\n"));
  }, [selectedCampus, course, name, place, phone]);

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${whatsappText}`;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          source: "Know your fees enquiry",
          campus: selectedCampus?.label,
          course,
          name,
          username: name,
          place,
          phone,
          message: "WhatsApp counsellor request from Know Your Fees page"
        })
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Could not submit enquiry. Please try again.");
        return;
      }

      window.location.assign(whatsappUrl);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Could not submit enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <div>
        <label className="form-label" style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.86rem" }}>
          Campus
        </label>
        <select
          className="input"
          required
          value={campus}
          onChange={(event) => {
            setCampus(event.target.value);
            setCourse("");
          }}
        >
          <option value="" disabled>
            Select your campus
          </option>
          {campusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="form-label" style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.86rem" }}>
          Course
        </label>
        <select
          className="input"
          required
          value={course}
          disabled={!selectedCampus}
          onChange={(event) => setCourse(event.target.value)}
        >
          <option value="" disabled>
            {selectedCampus ? "Select your course" : "Select campus first"}
          </option>
          {(selectedCampus?.courses ?? []).map((courseOption) => (
            <option key={courseOption} value={courseOption}>
              {courseOption}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="form-label" style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.86rem" }}>
          Name
        </label>
        <input
          className="input"
          type="text"
          placeholder="Enter your full name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div>
        <label className="form-label" style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.86rem" }}>
          Place
        </label>
        <input
          className="input"
          type="text"
          placeholder="Enter your city or place"
          required
          value={place}
          onChange={(event) => setPlace(event.target.value)}
        />
      </div>

      <div>
        <label className="form-label" style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.86rem" }}>
          Phone Number
        </label>
        <input
          className="input"
          type="tel"
          inputMode="tel"
          pattern="[0-9]{10,15}"
          placeholder="Enter your phone number"
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value.replace(/[^0-9]/g, ""))}
        />
      </div>

      {error ? <p style={{ margin: 0, color: "#b42318", fontSize: "0.92rem" }}>{error}</p> : null}

      <button className="button button-primary" type="submit" disabled={submitting} style={{ width: "100%", marginTop: "0.5rem" }}>
        {submitting ? "Please wait..." : "Contact Student Counsellor on WhatsApp"}
      </button>
    </form>
  );
}
