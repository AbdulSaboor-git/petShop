import { useDispatch } from "react-redux";
import { triggerNotification } from "@/redux/notificationThunk";

let dispatch;

export function initMessageHook(storeDispatch) {
  dispatch = storeDispatch;
}

export function showMessage(msg, success) {
  if (!dispatch) {
    console.error("Dispatch is not initialized. Call initMessageHook() first.");
    return;
  }
  dispatch(
    triggerNotification({
      msg,
      success,
    })
  );
}
