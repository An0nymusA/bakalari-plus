import Toast from "react-native-toast-message";

const visibilityTime = 4000;

var lastToastData = {
  time: Date.now(),
  props: {},
};

interface ToastHelperProps {
  text1: string;
  type: string;
  autoHide?: boolean;
}

const isToastSame = (props: ToastHelperProps) =>
  lastToastData.time - Date.now() < visibilityTime &&
  JSON.stringify(lastToastData.props) === JSON.stringify(props);

const dispatchToast = (props: ToastHelperProps) => {
  if (isToastSame(props)) return;

  Toast.hide();

  lastToastData = {
    props: JSON.stringify(props),
    time: Date.now(),
  };
  Toast.show({ ...props, visibilityTime });
};

const toastHelper = {
  success: (message: string) => {
    dispatchToast({ type: "success", text1: message });
  },
  error: (message: string) => {
    dispatchToast({ type: "error", text1: message });
  },
  loading: (message: string) => {
    dispatchToast({ type: "loading", text1: message, autoHide: false });
  },
};

export default toastHelper;
