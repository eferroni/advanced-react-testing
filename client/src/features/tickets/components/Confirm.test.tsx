import { App } from "../../../App";
import { render } from "../../../test-utils";

const testUser = {
  email: "edu@gmail.com",
};

describe("Confirm", () => {
  test("assert that the app redirects to tickets/:showId if holdId is missing", () => {
    const { history } = render(<App />, {
      preloadedState: { user: { userDetails: testUser } },
      routeHistory: ["/confirm/0?seatCount=2"],
    });
    expect(history.location.pathname).toBe("/tickets/0");
  });

  test("assert that the app redirects to tickets/:showId if seatCount is missing", () => {
    const { history } = render(<App />, {
      preloadedState: { user: { userDetails: testUser } },
      routeHistory: ["/confirm/0?holdId=12345"],
    });
    expect(history.location.pathname).toBe("/tickets/0");
  });
});
