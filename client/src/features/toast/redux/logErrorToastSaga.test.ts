import { expectSaga } from "redux-saga-test-plan";

import { ToastOptions } from "../types";
import { logErrorToast, logErrorToasts } from "./LogErrorToastSaga";

const errorToastOptions: ToastOptions = {
  title: "Its time to panic!",
  status: "error",
};

const errorToastAction = {
  type: "test",
  payload: errorToastOptions,
};

test("saga calls analytics when it receives error toast", () => {
  return expectSaga(logErrorToasts, errorToastAction)
    .call(logErrorToast, "Its time to panic!")
    .run();
});

const infoToastOptions: ToastOptions = {
  title: "Its not time to panic!",
  status: "info",
};

const infoToastAction = {
  type: "test",
  payload: infoToastOptions,
};

test("saga doesnt calls analytics when it receives not error toast", () => {
  return expectSaga(logErrorToasts, infoToastAction)
    .not.call.fn(logErrorToast)
    .run();
});
