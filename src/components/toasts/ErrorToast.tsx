import { BaseToast } from "./BaseToast";

import { ProgressError } from "@images/index";
import { FC } from "react";

const ErrorToast: FC<{ text: string }> = ({ text }) => {
  return (
    <BaseToast>
      <BaseToast.Icon>
        <ProgressError />
      </BaseToast.Icon>
      <BaseToast.Text color={"$grey40"}>{text}</BaseToast.Text>
    </BaseToast>
  );
};

export default ErrorToast;
