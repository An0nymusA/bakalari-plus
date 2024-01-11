import { BaseToast } from "./BaseToast";

import { ProgressError } from "@images/index";
import { FC } from "react";

const ErrorToast: FC<{ text: string }> = ({ text }) => {
  return (
    <BaseToast backgroundColor={"$lightRed"}>
      <BaseToast.Icon>
        <ProgressError />
      </BaseToast.Icon>
      <BaseToast.Text color={"$grey20"}>{text}</BaseToast.Text>
    </BaseToast>
  );
};

export default ErrorToast;
