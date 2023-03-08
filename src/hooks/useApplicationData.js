import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ])
      .then((all) => {
        const days = all[0].data;
        const appointments = all[1].data;
        const interviewers = all[2].data;

        setState((prev) => ({ ...prev, days, appointments, interviewers }));
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const setDay = (day) => setState({ ...state, day });

  // book new interview
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      const days = updateSpots(id, appointments);

      setState((prev) => ({ ...prev, appointments, days }));
    });
  }

  // delete already existing interview
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.delete(`/api/appointments/${appointment.id}`).then(() => {
      const days = updateSpots(id, appointments);

      setState((prev) => ({ ...prev, appointments, days }));
    });
  }

  function updateSpots(id, appointments) {
    let counter = 0;
    const days = state.days;

    const index = days.findIndex((day) => {
      return day.name === state.day;
    });

    for (const appointmentId of days[index].appointments) {
      if (appointments[appointmentId].interview === null) {
        counter++;
      }
    }
    const dayState = [...state.days];
    dayState[index] = { ...dayState[index], spots: counter };

    return dayState;
  }

  return { state, setDay, bookInterview, cancelInterview };
}
