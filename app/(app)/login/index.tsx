import { useState, useEffect, useRef } from "react";
import { TextInput } from "react-native";
import { useRouter, SplashScreen } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { AxiosError } from "axios";
import { View, useMedia } from "tamagui";
import { useMutation, onlineManager } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { BakalariApi } from "bakalari-ts-api";

import { HouseSearch, Key, LoginUser } from "@images/index";

import { useFormInputs } from "@hooks/useFormInputs";

import { LoginInput } from "@components/form/LoginInput";
import { HorizontalLine } from "@components/HorizontalLine";
import { Button } from "@components/form/Button";

import { checkUrl } from "@utils/utils";
import toastHelper from "@utils/toastHelper";
import StorageWrapper from "@utils/storage";
import useBakalariStore from "@utils/useBakalariStore";
import useLogger from "@hooks/useLogger";

const { log } = useLogger("login");

export default function Page() {
  const { setApi, setLoaderVisible } = useBakalariStore();
  const [disabled, setDisabled] = useState(false);
  const urlInputRef = useRef<TextInput>(null);
  const router = useRouter();
  const media = useMedia();

  useEffect(() => {
    setLoaderVisible(false);
    SplashScreen.hideAsync();

    (async () => {
      const lastUrl = await StorageWrapper.get("lastUrl");

      if (lastUrl) {
        updateInput("url", lastUrl.baseUrl);
        urlInputRef.current?.setNativeProps({ text: lastUrl.baseUrl });
      }
    })();

    if (media.xs)
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

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
      log.debug("fetching api", `https://${data.url}`);
      return BakalariApi.initialize({
        baseUrl: `https://${data.url}`,
        username: data.username,
        password: data.password,
      });
    },
    onSuccess: async (api: BakalariApi) => {
      if (!api.connector?.authOptions) throw new Error();

      log.debug("fetching success");
      Toast.hide();
      toastHelper.success("Přihlášení proběhlo úspěšně");

      // Saving login data for later use
      const authOptions = api.connector.authOptions;
      await StorageWrapper.set("loginData", {
        baseUrl: authOptions.baseUrl,
        username: authOptions.username,
        token: authOptions.token,
        refreshToken: authOptions.refreshToken,
      });
      await StorageWrapper.set("lastUrl", {
        baseUrl: authOptions.baseUrl.replace("https://", ""),
      });

      // Saving api to global state
      setApi(api);
      setDisabled(false);

      setLoaderVisible(true);
      onlineManager.setOnline(true);

      log.info("redirecting to timetable");
      router.replace("/modules/timetable");
    },
    onError: (err: AxiosError) => {
      log.error("fetching error", err);
      Toast.hide();

      // Checking if url is available
      if (err.code == "ERR_NETWORK" || err.response?.status == 404) {
        toastHelper.error("Adresa neexistuje, nebo je nedostupná");

        setInputError("url", true);
      }
      // Checking if username or password is wrong
      else if (err.response?.status == 400) {
        toastHelper.error("Heslo / uživatelské jméno je špatně");

        setInputError("username", true);
        setInputError("password", true);
      } else {
        toastHelper.error("Nastala chyba při přihlašování");
      }

      setDisabled(false);
    },
    networkMode: "always",
  });

  /**
   * Callback pro submit tlacitko
   */
  const onSubmit = () => {
    // Checking for empty inputs
    if (!inputData.url || !inputData.username || !inputData.password) {
      !inputData.url && setInputError("url", true);
      !inputData.username && setInputError("username", true);
      !inputData.password && setInputError("password", true);

      toastHelper.error("Musí být vyplněna všechna pole");
      return;
    }

    // Checking if url is valid
    if (!checkUrl(inputData.url)) {
      setInputError("url", true);
      toastHelper.error("Nevalidní url adresa");
      return;
    }

    // Removing old input errors
    Object.keys(inputErrors).forEach((key) => setInputError(key, false));

    toastHelper.loading("Ověřování údajů...");
    setDisabled(true);

    // Sending request
    mutation.mutate(inputData);
  };

  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <View maxWidth={600} width="100%" paddingHorizontal={20} gap={22}>
        {/* School URL input */}
        <LoginInput inputError={inputErrors.url} width="100%">
          <LoginInput.Icon>
            <HouseSearch />
          </LoginInput.Icon>
          <LoginInput.Input
            ref={urlInputRef}
            elementDisabled={disabled}
            autoComplete="off"
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
            <LoginUser />
          </LoginInput.Icon>
          <LoginInput.Input
            elementDisabled={disabled}
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
