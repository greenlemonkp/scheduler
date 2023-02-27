import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
} from "@testing-library/react";

import Application from "components/Application";
describe("Application", () => {
  afterEach(cleanup);

  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });
});
