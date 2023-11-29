import { BaseToast } from "./BaseToast";

import { ProgressError } from "@images/index";
import { FC } from "react";

const ErrorToast: FC<{ text: string }> = ({ text }) => {
  return (
    <BaseToast borderColor="$red">
      <BaseToast.Icon>
        <ProgressError />
      </BaseToast.Icon>
      <BaseToast.Text>{text}</BaseToast.Text>
    </BaseToast>
  );
};

export default ErrorToast;
