import { App } from "../../../App";
import { render, screen } from "../../../test-utils";

describe("Band", () => {
  test("screen display the correct band name", async () => {
    render(<App />, { routeHistory: ["/bands/0"] });
    const heading = await screen.findByRole("heading", {
      name: /avalanche of cheese/i,
    });
    expect(heading).toBeInTheDocument();
  });
});
