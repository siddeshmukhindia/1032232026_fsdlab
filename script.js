const { useState } = React;

const defaultResume = {
  fullName: "Siddhant Deshmukh",
  role: "Frontend Developer",
  email: "siddhant@email.com",
  phone: "+91 11111 11111",
  location: "Pune, Maharashtra, India",
  careerObjective:
    "Seeking a challenging role where I can apply my technical skills, contribute to impactful products, and continue learning in a collaborative environment.",
  professionalSummary:
    "Motivated developer with experience building responsive web interfaces, solving real-world problems, and delivering user-focused digital experiences.",
  education:
    "B.Sc. Computer Science - ABC College (2022 - 2025)\nHigher Secondary - XYZ School (2020 - 2022)",
  experience:
    "Frontend Intern, Bright Labs (Jan 2025 - Apr 2025)\nBuilt reusable UI components and improved mobile responsiveness.",
  academicSkills:
    "Data Structures, DBMS, Operating Systems, Software Engineering",
  nonAcademicSkills:
    "Leadership, Communication, Event Coordination, Time Management",
  skills: "HTML, CSS, JavaScript, React, Git, Figma",
  achievements:
    "Winner - College Hackathon 2024\nOrganized National Tech Symposium",
};

const profileFields = [
  { name: "fullName", label: "Full Name", type: "text", placeholder: "Siddhant Deshmukh" },
  { name: "role", label: "Role / Title", type: "text", placeholder: "Frontend Developer" },
  { name: "email", label: "Email", type: "email", placeholder: "sid.deshmukh@email.com" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "+91 11111 11111" },
  { name: "location", label: "Location", type: "text", placeholder: "Pune, Maharashtra, India" },
];

function splitEntries(value) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function TextInput({ field, value, onChange }) {
  return (
    <label>
      {field.label}
      <input
        type={field.type}
        name={field.name}
        value={value}
        placeholder={field.placeholder}
        onChange={onChange}
      />
    </label>
  );
}

function TextArea({ label, name, value, onChange, rows, placeholder }) {
  return (
    <label>
      {label}
      <textarea
        name={name}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </label>
  );
}

function LineList({ value }) {
  return (
    <div className="line-list">
      {splitEntries(value).map((entry) => (
        <p key={entry}>{entry}</p>
      ))}
    </div>
  );
}

function PillList({ value }) {
  return (
    <div className="pill-list">
      {splitEntries(value).map((entry) => (
        <span key={entry}>{entry}</span>
      ))}
    </div>
  );
}

function ResumePreview({ resume }) {
  return (
    <section className="preview-panel">
      <div className="preview-toolbar">
        <span className="status-dot"></span>
        <p>Resume Preview</p>
      </div>

      <article className="resume-preview">
        <header className="resume-header">
          <div>
            <p className="resume-label">Resume</p>
            <h2>{resume.fullName}</h2>
            <p className="resume-role">{resume.role}</p>
          </div>
          <div className="contact-list">
            <p>{resume.email}</p>
            <p>{resume.phone}</p>
            <p>{resume.location}</p>
          </div>
        </header>

        <section className="resume-section">
          <h3>Career Objective</h3>
          <p>{resume.careerObjective}</p>
        </section>

        <section className="resume-section">
          <h3>Professional Summary</h3>
          <p>{resume.professionalSummary}</p>
        </section>

        <section className="resume-section">
          <h3>Education Qualifications</h3>
          <LineList value={resume.education} />
        </section>

        <section className="resume-section">
          <h3>Experience and Internships</h3>
          <LineList value={resume.experience} />
        </section>

        <section className="resume-section split-section">
          <div>
            <h3>Academic Skills</h3>
            <PillList value={resume.academicSkills} />
          </div>
          <div>
            <h3>Non-Academic Skills</h3>
            <PillList value={resume.nonAcademicSkills} />
          </div>
        </section>

        <section className="resume-section split-section">
          <div>
            <h3>Skills</h3>
            <PillList value={resume.skills} />
          </div>
          <div>
            <h3>Achievements</h3>
            <LineList value={resume.achievements} />
          </div>
        </section>
      </article>
    </section>
  );
}

function App() {
  const [resume, setResume] = useState(defaultResume);

  function handleChange(event) {
    const { name, value } = event.target;
    setResume((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleReset() {
    setResume(defaultResume);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Assignment 5</p>
          <h1>Resume Builder Application</h1>
          <p className="hero-text">
            Create a clean, professional resume with a guided form and instant
            preview. Every required section is included and updates live as you
            type.
          </p>
        </div>
        <div className="hero-card">
          <span>React UI</span>
          <strong>Live professional resume builder</strong>
          <p>Designed for student and early-career portfolios.</p>
        </div>
      </header>

      <main className="app-grid">
        <section className="builder-panel">
          <div className="panel-heading">
            <h2>Build Your Resume</h2>
            <p>Fill in your details to generate a polished resume preview.</p>
          </div>

          <form
            className="resume-form"
            onSubmit={(event) => event.preventDefault()}
            onReset={handleReset}
          >
            <section className="form-section">
              <h3>Profile</h3>
              <div className="field-grid two-col">
                {profileFields.slice(0, 2).map((field) => (
                  <TextInput
                    key={field.name}
                    field={field}
                    value={resume[field.name]}
                    onChange={handleChange}
                  />
                ))}
              </div>
              <div className="field-grid three-col">
                {profileFields.slice(2).map((field) => (
                  <TextInput
                    key={field.name}
                    field={field}
                    value={resume[field.name]}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </section>

            <section className="form-section">
              <h3>Career Objective</h3>
              <TextArea
                label="Objective"
                name="careerObjective"
                rows={4}
                value={resume.careerObjective}
                placeholder="Write your career objective"
                onChange={handleChange}
              />
            </section>

            <section className="form-section">
              <h3>Professional Summary</h3>
              <TextArea
                label="Summary"
                name="professionalSummary"
                rows={4}
                value={resume.professionalSummary}
                placeholder="Write your professional summary"
                onChange={handleChange}
              />
            </section>

            <section className="form-section">
              <h3>Education Qualifications</h3>
              <TextArea
                label="Education Details"
                name="education"
                rows={5}
                value={resume.education}
                placeholder="Add education qualifications"
                onChange={handleChange}
              />
            </section>

            <section className="form-section">
              <h3>Experience and Internships</h3>
              <TextArea
                label="Experience"
                name="experience"
                rows={5}
                value={resume.experience}
                placeholder="Add internships and work experience"
                onChange={handleChange}
              />
            </section>

            <section className="form-section">
              <h3>Academic and Non-Academic Skills</h3>
              <div className="field-grid two-col">
                <TextArea
                  label="Academic Skills"
                  name="academicSkills"
                  rows={4}
                  value={resume.academicSkills}
                  placeholder="Add academic skills"
                  onChange={handleChange}
                />
                <TextArea
                  label="Non-Academic Skills"
                  name="nonAcademicSkills"
                  rows={4}
                  value={resume.nonAcademicSkills}
                  placeholder="Add non-academic skills"
                  onChange={handleChange}
                />
              </div>
            </section>

            <section className="form-section">
              <h3>Skills and Achievements</h3>
              <div className="field-grid two-col">
                <TextArea
                  label="Technical Skills"
                  name="skills"
                  rows={4}
                  value={resume.skills}
                  placeholder="Add technical skills"
                  onChange={handleChange}
                />
                <TextArea
                  label="Achievements"
                  name="achievements"
                  rows={4}
                  value={resume.achievements}
                  placeholder="Add achievements"
                  onChange={handleChange}
                />
              </div>
            </section>

            <div className="form-actions">
              <button type="reset" className="secondary-btn">
                Reset
              </button>
              <button type="button" className="primary-btn" onClick={handlePrint}>
                Download / Print
              </button>
            </div>
          </form>
        </section>

        <ResumePreview resume={resume} />
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
