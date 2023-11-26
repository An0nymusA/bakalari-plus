import { View } from "tamagui";
import { useState } from "react";

import { HouseSearch, Key, User } from "@images/index";

import { LoginInput } from "@components/LoginInput";
import { HorizontalLine } from "@/src/components/HorizontalLine";

import { Button } from "@components/Button";

import { checkUrl } from "@/src/utils/utils";

export default function Page() {
  const [values, setValues] = useState({
    url: "",
    username: "",
    password: "",
  });

  const onSubmit = () => {
    if (!values.url || !values.username || !values.password) return;

    if (!checkUrl(values.url)) {
      alert("Invalid url");
      return;
    }

    alert("Process login");
  };

  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <View width="100%" paddingHorizontal={20} gap={22}>
        <LoginInput width="100%">
          <LoginInput.Icon>
            <HouseSearch />
          </LoginInput.Icon>
          <LoginInput.Input
            onChangeText={(newText) =>
              setValues((val) => ({
                ...val,
                url: newText.toLowerCase().trim(),
              }))
            }
            placeholder="URL adresa Bakalářů"
          />
        </LoginInput>
        <HorizontalLine />
        <LoginInput width="100%">
          <LoginInput.Icon>
            <User />
          </LoginInput.Icon>
          <LoginInput.Input
            onChangeText={(newText) =>
              setValues((val) => ({ ...val, username: newText.trim() }))
            }
            placeholder="Uživatelské jméno"
          />
        </LoginInput>
        <LoginInput width="100%">
          <LoginInput.Icon>
            <Key />
          </LoginInput.Icon>
          <LoginInput.Input
            onChangeText={(newText) =>
              setValues((val) => ({ ...val, password: newText.trim() }))
            }
            secureTextEntry={true}
            placeholder="Heslo"
          />
        </LoginInput>
        <HorizontalLine />
        <Button onPress={onSubmit}>
          <Button.Text>Přihlásit se</Button.Text>
        </Button>
      </View>
    </View>
  );
}
