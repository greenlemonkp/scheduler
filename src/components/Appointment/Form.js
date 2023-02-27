import React, { useEffect, useState } from "react";
import InterviewerList from "components/InterviewerList";
import Button from "components/Button";

export default function Form(props) {
  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");

  function reset() {
    setStudent("");
    setInterviewer(null);
  }

  function cancel() {
    reset();
    props.onCancel();
  }
  function save() {
    if (student.length === 0) {
      setError("student name cannot be blank");
      return;
    }
    if (!interviewer) {
      setError("please select an interviewer");
      return;
    }
    props.onSave(student, interviewer);
  }
  useEffect(() => {
    setError("");
  }, [student, interviewer]);
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={(event) => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            onChange={(event) => setStudent(event.target.value)}
            data-testid="student-name-input"
            value={student}
          />
          <p>{error}</p>
        </form>
        <InterviewerList
          onChange={setInterviewer}
          interviewer={interviewer}
          interviewers={props.interviewers}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>
            Cancel
          </Button>
          <Button confirm onClick={save}>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}
