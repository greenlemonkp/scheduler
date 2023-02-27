import React, { useState, useEffect } from "react";
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
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers"),
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

  // to update spots when save
  const updateSpotsOnSave = (appointment, id) => {
    if (
      state.appointments[id].interview === null &&
      appointment.interview !== null
    ) {
      const currentDay = state.days.find((day) => day.name === state.day);
      currentDay.spots--;
    }
  };

  // to update spots when delete
  const updateSpotsOnDelete = (appointment, id) => {
    if (
      state.appointments[id].interview !== null &&
      appointment.interview === null
    ) {
      const currentDay = state.days.find((day) => day.name === state.day);
      currentDay.spots++;
    }
  };

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
    updateSpotsOnSave(appointment, id);

    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      setState((prev) => ({ ...prev, appointments }));
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

    updateSpotsOnDelete(appointment, id);
    return axios.delete(`/api/appointments/${appointment.id}`).then(() => {
      setState({ ...state, appointments });
    });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
