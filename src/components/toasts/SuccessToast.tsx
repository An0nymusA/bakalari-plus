import { BaseToast } from "./BaseToast";

import { ProgressDone } from "@images/index";
import { FC } from "react";

const SuccessToast: FC<{ text: string }> = ({ text }) => {
  return (
    <BaseToast backgroundColor="$green">
      <BaseToast.Icon>
        <ProgressDone />
      </BaseToast.Icon>
      <BaseToast.Text color="$grey100">{text}</BaseToast.Text>
    </BaseToast>
  );
};

export default SuccessToast;
