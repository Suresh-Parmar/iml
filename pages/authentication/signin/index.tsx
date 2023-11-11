import {
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  rem,
  ActionIcon,
  // useMantineColorScheme,
  LoadingOverlay,
  Box,
} from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { signInWithEMail } from "../../../pageComponents/state";
import { Recaptcha } from "@/components/common";
import { ForgotPassword } from "@/components/auth";
import { forgotCreds } from "@/utilities/API";
import { notifications } from "@mantine/notifications";
import { checkValidCred } from "@/helpers/validations";
import { useFinduserGeoLocationQuery } from "@/redux/apiSlice";
import { ControlApplicationShellComponents, UpdateUserRedux, changeColorTheme } from "@/redux/slice";
import { useDispatch, useSelector } from "react-redux";
import { setGetData } from "@/helpers/getLocalStorage";

const useStyles = createStyles((theme) => {
  return {
    wrapper: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      minWidth: "100%",
      width: "100%",
      maxWidth: "100%",
      minHeight: "100%",
      height: "100%",
      maxHeight: "100%",
    },

    form: {
      borderRight: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]}`,
      minHeight: "100%",
      height: "100%",
      maxHeight: "100%",
      maxWidth: "30%",
      width: "30%",
      minWidth: "30%",

      [theme.fn.smallerThan("sm")]: {
        maxWidth: "100%",
      },
    },

    showcase: {
      borderRight: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]}`,

      backgroundSize: "cover",
      backgroundImage: `url(${
        theme.colorScheme === "dark"
          ? "https://images.unsplash.com/photo-1655721528985-c491cc1a3d57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1548&q=80"
          : "https://images.unsplash.com/photo-1664447972862-e26efc5b709f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80"
      })`,
    },

    title: {
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },
  };
});

export default function SignIn() {
  const gioLocationData = useFinduserGeoLocationQuery("")?.data?.data;

  // const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  let themeColor = setGetData("colorScheme");

  const { classes } = useStyles(themeColor);
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState<"super_admin" | "users">("users");
  const [recaptcha, setRecaptcha] = useState("bypass");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [registrationNo, setRegistrationNo] = useState<string>("");

  const router = useRouter();
  let authentication: any = setGetData("userData", false, true);

  let reduxData: any = useSelector((state: any) => state);
  let colorScheme = reduxData?.data?.colorScheme || themeColor;
  let isDarkTheme = colorScheme === "dark";

  let dispatch = useDispatch();

  const toggleColorScheme = () => {
    dispatch(changeColorTheme(""));
  };

  const toggleOverlay = () => {
    setVisible((prevVisible) => {
      return !prevVisible;
    });
  };

  useEffect(() => {
    if (authentication?.metadata?.status === "authenticated") {
      if (authentication?.metadata?.role != "student") {
        router.replace("/console");
      } else {
        router.replace("/profile");
      }
    } else {
      dispatch(
        ControlApplicationShellComponents({
          showHeader: false,
          showFooter: false,
          showNavigationBar: false,
          hideNavigationBar: true,
          showAsideBar: false,
        })
      );
    }
  }, [authentication?.metadata?.role, authentication?.metadata?.status, dispatch, router]);

  let getUserData: any = setGetData("userData");

  useEffect(() => {
    try {
      getUserData = JSON.parse(getUserData);
      if (getUserData?.metadata?.status == "authenticated") {
        if ((getUserData && getUserData?.metadata?.role == "super_admin") || getUserData?.metadata?.role == "admin") {
          router.push("/console");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [getUserData]);

  const onClickSignIn = async () => {
    if (!recaptcha) {
      setError("Please complete the reCAPTCHA");
      return;
    }

    if (isForgotPassword) {
      let isValid = checkValidCred(registrationNo);

      if (!isValid) {
        setError("Invalid email id or registration number");
        return;
      }
      toggleOverlay();
      let data = { registration_details: registrationNo };
      forgotCreds(data)
        .then((res) => {
          toggleOverlay();
          notifications.show({
            title: "Success !",
            message: "",
          });
          setIsForgotPassword(false);
          setRegistrationNo("");
          console.log(res);
        })
        .catch((err) => {
          toggleOverlay();
          notifications.show({
            title: "Something went wrong!",
            message: "",
            color: "red",
          });
          console.log(err);
        });
    } else {
      toggleOverlay();
      try {
        const response = await signInWithEMail(value, emailInput, passwordInput, gioLocationData);
        toggleOverlay();
        if (response.metadata.status == "unauthenticated") {
          setError("Invalid email or password");
          setEmailInput("");
          setPasswordInput("");
        } else {
          setGetData("userData", response, true);
          // setTimeout(() => {
          // dispatch(UpdateUserRedux(response));
          if (response.user.role != "student") {
            // router.replace("/console");
            window.location.pathname = "/console";
          } else {
            window.location.pathname = "/";
            // router.replace("/");
          }
          // }, 100);
        }
      } catch (err) {
        console.log(err, "errrrr");
        notifications.show({
          title: "Something went wrong!",
          message: "",
          color: "red",
        });
        toggleOverlay();
      }
    }
  };

  const renderLoginInputs = () => {
    return (
      <>
        <TextInput
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setError("");
            setEmailInput(event.currentTarget.value);
          }}
          value={emailInput}
          label="E-Mail"
          placeholder="john.doe@foo.bar"
          size="md"
        />
        <PasswordInput
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setError("");
            setPasswordInput(event.currentTarget.value);
          }}
          value={passwordInput}
          label="Password"
          placeholder="Enter your password"
          mt="md"
          size="md"
        />
        <Box ta="end" mt={5}>
          <Box
            onClick={() => {
              setIsForgotPassword(true);
            }}
            ml="auto"
            pt={5}
            w="max-content"
          >
            Forgot Password
          </Box>
        </Box>
      </>
    );
  };

  const renderForGotPasswordInputs = () => {
    return (
      <ForgotPassword
        registrationNo={registrationNo}
        setIsForgotPassword={setIsForgotPassword}
        setError={setError}
        setRegistrationNo={setRegistrationNo}
      />
    );
  };

  let color = isDarkTheme ? "#ffffff" : "#000000";
  const styleTheme = { background: isDarkTheme ? "#000000" : "#ffffff", color };

  return (
    <div className={`login-page ${classes.showcase}`}>
      <div className="container" style={{ minHeight: "75%" }}>
        <div className="col-md-6 offset-lg-3 d-flex flex-column m-auto">
          <div className="d-flex mb-3 justify-content-between">
            <h3 className="mb-3" style={{ color: color }}>
              {" "}
              Welcome!
            </h3>
            <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>
              {isDarkTheme ? <IconSun size="16px" /> : <IconMoonStars size="16px" />}
            </ActionIcon>
          </div>
          <div className="shadow rounded" style={styleTheme}>
            <div className="form-left h-100 p-3 py-5">
              <LoadingOverlay visible={visible} overlayBlur={2} />
              {isForgotPassword ? renderForGotPasswordInputs() : renderLoginInputs()}
              <Recaptcha captchaSize="normal" setRecaptcha={setRecaptcha} />
              {error ? (
                <Text fz="md" c="red" mt="xl">
                  {error}
                </Text>
              ) : null}
              <Button onClick={onClickSignIn} fullWidth mt="xl" size="md">
                {isForgotPassword ? "Reset Password" : "Sign-In"}
              </Button>
              <Text
                ta="end"
                mt="md"
                onClick={() => {
                  router.push("/authentication/signup");
                }}
              >
                Don&apos;t have an account?
                <Anchor<"a">
                  href="#"
                  onClick={() => {
                    router.replace("/authentication/signup");
                  }}
                  weight={700}
                >
                  Sign-Up
                </Anchor>
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
