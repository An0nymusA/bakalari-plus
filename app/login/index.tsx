import { useState } from "react";
import { View } from "tamagui";
import { useMutation } from "@tanstack/react-query";

import BakalariAPI from "bakalari-ts-api/build/models/BakalariApi";
import { AxiosError } from "axios";

import Toast from "react-native-toast-message";

import { HouseSearch, Key, User } from "@images/index";

import { LoginInput } from "@/src/components/form/LoginInput";
import { HorizontalLine } from "@/src/components/HorizontalLine";

import { Button } from "@/src/components/form/Button";

import { checkUrl } from "@utils/utils";
import { useFormInputs } from "@hooks/useFormInputs";
import toastHelper from "@/src/utils/toastHelper";

export default function Page() {
  const [disabled, setDisabled] = useState(false);

  /**
   * Hook pro správu dat formuláře
   */
  const { inputData, updateInput, inputErrors, setInputError } = useFormInputs({
    url: "",
    username: "",
    password: "",
  });

  /**
   * Komunikace s API
   */
  const mutation = useMutation({
    mutationFn: (data: { [key: string]: string }) => {
      return BakalariAPI.initialize({
        baseUrl: `https://${data.url}`,
        username: data.username,
        password: data.password,
      });
    },
    onSuccess: () => {
      Toast.hide();
      toastHelper.success("Přihlášení proběhlo úspěšně");

      setDisabled(false);
    },
    onError: (err: AxiosError) => {
      Toast.hide();

      if (err.code == "ERR_NETWORK" || err.response?.status == 404) {
        toastHelper.error("Adresa neexistuje, nebo je nedostupná");

        setInputError("url", true);
      }

      if (err.response?.status == 400) {
        toastHelper.error("Heslo / uživatelské jméno je špatně");

        setInputError("username", true);
        setInputError("password", true);
      }

      setDisabled(false);
    },
  });

  /**
   * Callback pro submit tlacitko
   */
  const onSubmit = () => {
    if (!inputData.url || !inputData.username || !inputData.password) {
      if (!inputData.url) setInputError("url", true);

      if (!inputData.username) setInputError("username", true);

      if (!inputData.password) setInputError("password", true);

      toastHelper.error("Musí být vyplněna všechna pole");
      return;
    }

    if (!checkUrl(inputData.url)) {
      setInputError("url", true);
      toastHelper.error("Nevalidní url adresa");
      return;
    }

    Object.keys(inputErrors).forEach((key) => {
      setInputError(key, false);
    });

    toastHelper.loading("Ověřování údajů...");

    setDisabled(true);

    mutation.mutate(inputData);
  };

  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <View width="100%" paddingHorizontal={20} gap={22}>
        {/* School URL input */}
        <LoginInput inputError={inputErrors.url} width="100%">
          <LoginInput.Icon>
            <HouseSearch />
          </LoginInput.Icon>
          <LoginInput.Input
            elementDisabled={disabled}
            autoCapitalize="none"
            autoComplete="url"
            textContentType="URL"
            onChangeText={(newText) => {
              newText = newText
                .replace("http://", "")
                .replace("https://", "")
                .replace("www.", "");

              updateInput("url", newText.toLowerCase());
            }}
            placeholder="URL adresa Bakalářů"
          />
        </LoginInput>

        <HorizontalLine />

        {/* Username input */}
        <LoginInput inputError={inputErrors.username} width="100%">
          <LoginInput.Icon>
            <User />
          </LoginInput.Icon>
          <LoginInput.Input
            elementDisabled={disabled}
            autoCapitalize="none"
            autoComplete="username"
            textContentType="username"
            onChangeText={(newText) => updateInput("username", newText)}
            placeholder="Uživatelské jméno"
          />
        </LoginInput>

        {/* Password input */}
        <LoginInput inputError={inputErrors.password} width="100%">
          <LoginInput.Icon>
            <Key />
          </LoginInput.Icon>
          <LoginInput.Input
            elementDisabled={disabled}
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
            onChangeText={(newText) => updateInput("password", newText)}
            secureTextEntry={true}
            placeholder="Heslo"
          />
        </LoginInput>

        <HorizontalLine />

        {/* Submit button */}
        <Button
          pointerEvents={disabled ? "none" : "auto"}
          onPress={onSubmit}
          elementDisabled={disabled}
        >
          <Button.Text>Přihlásit se</Button.Text>
        </Button>
      </View>
    </View>
  );
}
