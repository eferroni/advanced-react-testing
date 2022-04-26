import userEvent from "@testing-library/user-event";
import {
  DefaultRequestBody,
  RequestParams,
  ResponseComposition,
  rest,
  RestContext,
  RestRequest,
} from "msw";

import { App } from "../../../App";
import { baseUrl, endpoints } from "../../../app/axios/constants";
import { handlers } from "../../../mocks/handlers";
import { server } from "../../../mocks/server";
import { getByRole, render, screen, waitFor } from "../../../test-utils";

describe("Protected Routes", () => {
  test.each([
    { routeName: "Profile", routePath: "/profile" },
    { routeName: "Tickets", routePath: "/tickets/0" },
    { routeName: "Confirm", routePath: "/confirm/0?holdId=12345&seatCount=2" },
  ])(
    "redirects to sign-in from $routeName when not authenticated",
    async ({ routePath }) => {
      const { history } = render(<App />, { routeHistory: [routePath] });
      expect(history.location.pathname).toBe("/signin");
    }
  );

  test("successfull sign-in flow", async () => {
    // go to protected page
    const { history } = render(<App />, { routeHistory: ["/tickets/1"] });

    // Sign in (after redirect)
    const emailEl = screen.getByLabelText(/email/i);
    userEvent.type(emailEl, "edu@gmail.com");

    const passwordEl = screen.getByLabelText(/password/i);
    userEvent.type(passwordEl, "123456");

    const signInForm = screen.getByTestId("sign-in-form");

    const buttonEl = getByRole(signInForm, "button", { name: /sign in/i });
    userEvent.click(buttonEl);

    // test redirect back to protected page
    await waitFor(() => {
      expect(history.location.pathname).toBe("/tickets/1");
    });

    // sign-in page removed from history
    expect(history.entries).toHaveLength(1);
  });

  test("successfull sign-up flow", async () => {
    const { history } = render(<App />, { routeHistory: ["/tickets/1"] });

    const emailEl = screen.getByLabelText(/email/i);
    userEvent.type(emailEl, "edu@gmail.com");

    const passwordEl = screen.getByLabelText(/password/i);
    userEvent.type(passwordEl, "password");

    const buttonEl = screen.getByRole("button", { name: /sign up/i });
    userEvent.click(buttonEl);

    await waitFor(() => {
      expect(history.location.pathname).toBe("/tickets/1");
    });

    expect(history.entries).toHaveLength(1);
  });

  const signInFailure = (
    req: RestRequest<DefaultRequestBody, RequestParams>,
    res: ResponseComposition,
    ctx: RestContext
  ) => {
    return res(ctx.status(401));
  };

  const signInServerError = (
    req: RestRequest<DefaultRequestBody, RequestParams>,
    res: ResponseComposition,
    ctx: RestContext
  ) => {
    return res(ctx.status(500));
  };

  const serverError = (
    req: RestRequest<DefaultRequestBody, RequestParams>,
    res: ResponseComposition,
    ctx: RestContext
  ) => {
    return res(ctx.status(500));
  };

  const signUpFailure = (
    req: RestRequest<DefaultRequestBody, RequestParams>,
    res: ResponseComposition,
    ctx: RestContext
  ) => {
    return res(
      ctx.status(401),
      ctx.json({ message: "Email is already in use" })
    );
  };

  test("unsuccessful signin followed by successful signin", async () => {
    const errorHandler = rest.post(
      `${baseUrl}/${endpoints.signIn}`,
      signInFailure
    );
    server.resetHandlers(...handlers, errorHandler);

    const { history } = render(<App />, { routeHistory: ["/tickets/1"] });

    const emailEl = screen.getByLabelText(/email/i);
    userEvent.type(emailEl, "edu@gmail.com");

    const passwordEl = screen.getByLabelText(/password/i);
    userEvent.type(passwordEl, "password");

    const signInForm = screen.getByTestId("sign-in-form");
    const buttonEl = getByRole(signInForm, "button", { name: /sign in/i });
    userEvent.click(buttonEl);

    server.resetHandlers();
    userEvent.click(buttonEl);

    await waitFor(() => {
      expect(history.location.pathname).toBe("/tickets/1");
    });

    expect(history.entries).toHaveLength(1);
  });

  test("signin server error followed by successful signin", async () => {
    const errorHandler = rest.post(
      `${baseUrl}/${endpoints.signIn}`,
      signInServerError
    );
    server.resetHandlers(...handlers, errorHandler);

    const { history } = render(<App />, { routeHistory: ["/tickets/1"] });

    const emailEl = screen.getByLabelText(/email/i);
    userEvent.type(emailEl, "edu@gmail.com");

    const passwordEl = screen.getByLabelText(/password/i);
    userEvent.type(passwordEl, "password");

    const signInForm = screen.getByTestId("sign-in-form");
    const buttonEl = getByRole(signInForm, "button", { name: /sign in/i });
    userEvent.click(buttonEl);

    server.resetHandlers();
    userEvent.click(buttonEl);

    await waitFor(() => {
      expect(history.location.pathname).toBe("/tickets/1");
    });

    expect(history.entries).toHaveLength(1);
  });

  test.each([
    {
      endpoint: endpoints.signUp,
      outcome: "failure",
      responseResolver: signUpFailure,
      buttonNameRegex: /sign up/i,
    },
    {
      endpoint: endpoints.signUp,
      outcome: "error",
      responseResolver: serverError,
      buttonNameRegex: /sign up/i,
    },
  ])(
    "$endpoint $outcome followed by successful signup",
    async ({ endpoint, responseResolver, buttonNameRegex }) => {
      // reset the handler to response unsuccessfully
      const errorHandler = rest.post(
        `${baseUrl}/${endpoint}`,
        responseResolver
      );
      server.resetHandlers(...handlers, errorHandler);

      // go to protected page
      const { history } = render(<App />, { routeHistory: ["/tickets/1"] });

      // sign in (after redirect)
      const emailEl = screen.getByLabelText(/email/i);
      userEvent.type(emailEl, "edu@gmail.com");

      const passwordEl = screen.getByLabelText(/password/i);
      userEvent.type(passwordEl, "password");

      const buttonEl = screen.getByRole("button", { name: buttonNameRegex });
      userEvent.click(buttonEl);

      server.resetHandlers();
      userEvent.click(buttonEl);

      // test redirect to protected page
      await waitFor(() => {
        expect(history.location.pathname).toBe("/tickets/1");
      });

      // sign in page removed from history
      expect(history.entries).toHaveLength(1);
    }
  );
});
