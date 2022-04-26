import { Show } from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";

import { getByRole, getByText, render, screen } from "../../../test-utils";
import { Shows } from "./Shows";

describe("Shows", () => {
  test("displays relevant show details for on-sold-out show", async () => {
    render(<Shows />);
    const shows = await screen.findAllByRole("listitem");
    const nonSoldOutShow = shows[0];

    const ticketButton = getByRole(nonSoldOutShow, "button", {
      name: /tickets/i,
    });
    expect(ticketButton).toBeInTheDocument();

    const bandName = getByRole(nonSoldOutShow, "heading", {
      name: /avalanche of cheese/i,
    });
    expect(bandName).toBeInTheDocument();

    const bandDescription = getByText(
      nonSoldOutShow,
      /rollicking country with ambitious kazoo solos/i
    );
    expect(bandDescription).toBeInTheDocument();
  });

  test("display relevant show details for a sold-out show", async () => {
    render(<Shows />);
    const shows = await screen.findAllByRole("listitem");
    const soldOutShow = shows[1];

    const soldOutEl = getByRole(soldOutShow, "heading", { name: /sold out/i });
    expect(soldOutEl).toBeInTheDocument();

    const bandName = getByRole(soldOutShow, "heading", {
      name: /the joyous nun riot/i,
    });
    expect(bandName).toBeInTheDocument();

    const bandDescription = getByText(
      soldOutShow,
      /serious world music with an iconic musical saw/i
    );
    expect(bandDescription).toBeInTheDocument();
  });

  test("redirects to correct tickets URL when tickets is clicked", async () => {
    const { history } = render(<Shows />);
    const ticketButtonEl = await screen.findByRole("button", {
      name: /tickets/i,
    });
    userEvent.click(ticketButtonEl);
    expect(history.location.pathname).toBe("/tickets/0");
  });
});
