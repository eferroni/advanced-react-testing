import userEvent from "@testing-library/user-event";

import { App } from "../../../App";
import { render, screen } from "../../../test-utils";
import { NavBar } from "./NavBar";

const testUser = {
  email: "edu@gmail.com",
};

describe("NavBar", () => {
  test("click in sign in button in navbar redirects to sign in page", () => {
    const { history } = render(<NavBar />);
    const signInButtonEl = screen.getByRole("button", { name: /sign in/i });
    userEvent.click(signInButtonEl);
    expect(history.location.pathname).toBe("/signin");
  });

  test("view signin page when click in signin button", () => {
    render(<App />);
    const signInButton = screen.getByRole("button", { name: /sign in/i });
    userEvent.click(signInButton);
    const textSignInEl = screen.getByRole("heading", {
      name: /sign in to your account/i,
    });
    expect(textSignInEl).toBeInTheDocument();
  });

  test("show sign in button when user is falsy", () => {
    render(<NavBar />);
    const signInButton = screen.getByRole("button", { name: /sign in/i });
    expect(signInButton).toBeInTheDocument();
  });

  test("show sign out button when user is truthy", () => {
    render(<NavBar />, {
      preloadedState: { user: { userDetails: testUser } },
    });
    const signInButton = screen.getByRole("button", { name: /sign out/i });
    expect(signInButton).toBeInTheDocument();

    expect(screen.queryByText(/edu@gmail.com/i)).toBeInTheDocument();
  });
});
