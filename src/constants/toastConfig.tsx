import { ToastConfigParams } from "react-native-toast-message";

import ErrorToast from "@components/toasts/ErrorToast";
import LoadingToast from "@components/toasts/LoadingToast";
import SuccessToast from "@components/toasts/SuccessToast";

/**
 * Setting up toasts
 */
const toastConfig = {
  success: ({ text1 }: ToastConfigParams<any>) => (
    <SuccessToast text={text1 || ""} />
  ),
  error: ({ text1 }: ToastConfigParams<any>) => (
    <ErrorToast text={text1 || ""} />
  ),
  loading: ({ text1 }: ToastConfigParams<any>) => (
    <LoadingToast text={text1 || ""} />
  ),
};

export default toastConfig;
