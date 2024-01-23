import Toast from "react-native-toast-message";

const visibilityTime = 2500;

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
  if (!props.text1 || isToastSame(props)) return;

  Toast.hide();

  lastToastData = {
    props: JSON.stringify(props),
    time: Date.now(),
  };
  Toast.show({ ...props, visibilityTime });
};

const toastHelper = {
  success: (text1: string) => {
    dispatchToast({ type: "success", text1 });
  },
  error: (text1: string) => {
    dispatchToast({ type: "error", text1 });
  },
  loading: (text1: string) => {
    dispatchToast({ type: "loading", text1, autoHide: false });
  },
  hide: () => Toast.hide(),
};

export default toastHelper;
export { visibilityTime as toastVisibilityTime };
