import userEvent from "@testing-library/user-event";

import { App } from "../../../App";
import { render, screen } from "../../../test-utils";

const testUser = {
  email: "edu@gmail.com",
};

describe("Tickets", () => {
  test("ticket displays band data for showId", async () => {
    render(<App />, {
      preloadedState: { user: { userDetails: testUser } },
      routeHistory: ["/tickets/0"],
    });
    const bandName = await screen.findByRole("heading", {
      name: /avalanche of cheese/i,
    });
    expect(bandName).toBeInTheDocument();
  });

  test("purchase button pushes the correct URL", async () => {
    const { history } = render(<App />, {
      preloadedState: { user: { userDetails: testUser } },
      routeHistory: ["/tickets/0"],
    });
    const buttonEl = await screen.findByRole("button", { name: /purchase/i });
    userEvent.click(buttonEl);

    expect(history.location.pathname).toBe("/confirm/0");

    const searchRegex = expect.stringMatching(/holdId=\d+&seatCount=2/);
    expect(history.location.search).toEqual(searchRegex);
  });
});
