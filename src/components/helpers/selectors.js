export function getAppointmentsForDay(state, day) {
  const filteredDay = state.days.find((days) => days.name === day);

  if (!filteredDay || filteredDay.appointments.length === 0) {
    return [];
  }
  return filteredDay.appointments.map((appointmentId) => {
    return state.appointments[appointmentId];

    /**
     * key = 1
     * state.appointments.1 = { id: 1, time: "12pm", interview: null },
     * state.appointments[1] = { id: 1, time: "12pm", interview: null },
     * state.appointments.key = undefined
     * state.appointments['key'] = undefined
     * state.appointments[key] = { id: 1, time: "12pm", interview: null }
     *        */
  });
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  const result = {};
  result.student = interview.student;
  result.interviewer = state.interviewers[interview.interviewer];

  return result;
}

export function getInterviewersForDay(state, day) {
  const filteredDay = state.days.find((days) => days.name === day);
  if (!filteredDay || filteredDay.interviewers.length === 0) {
    return [];
  }
  const filteredInterviewers = filteredDay.interviewers.map((id) => {
    const interviewer = state.interviewers[id];
    return interviewer;
  });

  return filteredInterviewers;
}
