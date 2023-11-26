import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@mantine/form";
import {
  Paper,
  createStyles,
  Button,
  Text,
  rem,
  Group,
  Box,
  Flex,
  LoadingOverlay,
  ScrollArea,
  Stepper,
  Alert,
} from "@mantine/core";
import { Notifications, notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCreditCard, IconHome } from "@tabler/icons-react";

import { MatrixRowType } from "@/components/Matrix";
import {
  VerifyPaymentData,
  createOrder,
  createStudentSignUp,
  loadPaymentScript,
  verifyPaymantData,
} from "@/utilities/API";

import FirstForm from "../../../components/signupComponents/FirstForm";
import SecondForm from "../../../components/signupComponents/SecondForm";
import ThirdForm from "../../../components/signupComponents/ThirdForm";
import { getInternationalDailingCode } from "@/utilities/countriesUtils";
import { useDispatch, useSelector } from "react-redux";
import { ControlApplicationShellComponents } from "@/redux/slice";
import { setGetData } from "@/helpers/getLocalStorage";
import SummaryForm from "@/components/signupComponents/SummaryForm";

const useStyles = createStyles((theme, colorScheme: any) => ({
  wrapper: {
    minHeight: "100%",
    height: "100%",
    maxHeight: "100%",
    backgroundSize: "cover",
    backgroundImage: `url(${
      theme.colorScheme === "dark"
        ? "https://images.unsplash.com/photo-1655721528985-c491cc1a3d57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1548&q=80"
        : "https://images.unsplash.com/photo-1664447972862-e26efc5b709f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80"
    })`,
  },

  form: {
    borderRight: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]}`,
    minHeight: "100%",
    height: "100%",
    maxHeight: "100%",
    // maxWidth: rem(450),
    paddingTop: rem(80),

    [theme.fn.smallerThan("sm")]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

export default function SignUp() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [invoiceBreakdown, setInvoiceBreakdown] = useState<any>({});

  useEffect(() => {
    dispatch(
      ControlApplicationShellComponents({
        showHeader: true,
        showFooter: false,
        showNavigationBar: false,
        hideNavigationBar: true,
        showAsideBar: false,
      })
    );
  }, [dispatch]);

  let reduxData = useSelector((state: any) => state.data);
  let selectedCountryLocal = setGetData("selectedCountry", "", true);

  const getSelectedCountry = () => {
    return reduxData?.selectedCountry?.country_code || selectedCountryLocal?.country_code || "";
  };

  const getMobileCode = () => {
    return `+${getSelectedCountry()}`;
  };

  let colorScheme = setGetData("colorScheme");

  const { classes } = useStyles(colorScheme);
  const form = useForm({
    initialValues: {
      name: "",
      address: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
      email_1: "",
      email_2: "",
      mobile_1: "",
      mobile_2: "",
      dob: "",
      gender: "",
      school_name: "",
      section: "",
      class_id: "",
      competition: "",
      role: "student",
      status: true,
      exam_center_code: "",
      consented: true,
      exam_center_id: "",
      class_code: "",
      competition_code: "",
      country_code: getSelectedCountry(),
      password: "",
    },

    validate: (values) => {
      if (active === 0) {
        return {
          class_id: values.class_id === "" ? "Class must be selected" : null,
          competition: values.competition === "" ? "Competition must be selected" : null,
        };
      }

      if (active === 1) {
        return {
          // exam_center_code: values.exam_center_code === "" ? "Exam center must be selected" : null,
          name: values.name.length < 2 ? "Name must have at least 2 letters" : null,
          mobile_1: /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(values.mobile_1)
            ? null
            : "Invalid mobile number",
          email_1: /^\S+@\S+$/.test(values.email_1) ? null : "Invalid email",
          dob: values.dob === "" ? "Date of Birth needs to be selected" : null,
          gender: values.gender === "" ? "Gender needs to be selected" : null,
        };
      }

      if (active === 2) {
        return {
          school_name: values.school_name === "" ? "School must be selected" : null,
          // section: values.section.length < 1 ? "Section must have at least 1 letters" : null,
          address: values.address.length < 2 ? "Section must have at least 2 letters" : null,
          state: values.state === "" ? "State must be selected" : null,
          city: values.city === "" ? "City must be selected" : null,
          pincode: /^[1-9][0-9]{5}$/.test(values.pincode) ? null : "Invalid pin-code",
        };
      }

      return {};
    },
  });

  const [oLoader, setOLoader] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState<any>({});
  const [isPaid, setisPaid] = useState<any>(false);
  const [active, setActive] = useState(0);
  const [recaptcha, setRecaptcha] = useState<string>("");

  let formValues: any = form.values;

  console.log(userData, "form.values");
  console.log(formValues, "form.values");

  const nextStep = (isSkipValidate = false) => {
    if (active == 2 && !recaptcha) {
      Notifications.show({
        title: `Invalid recaptcha!`,
        message: ``,
        color: "red",
      });
      return;
    } else {
      setActive(() => {
        if (form.validate().hasErrors) {
          return active;
        } else {
          return active < 5 ? (active ? active + 1 : 1) : active;
        }
      });
    }
  };

  const prevStep = () => {
    setActive(active > 0 ? active - 1 : active);
  };

  console.log(active);
  const onSubmitForm = async (values: any) => {
    let windowConfirm = window.confirm("Hope you have verified details on summary?");
    if (!windowConfirm) {
      return;
    }
    nextStep();

    values = {
      ...values,
      // dob: new Date(values.dob || Date()).toDateString(),
    };

    values.password = values.mobile_1;
    if (!!values.mobile_1) values.mobile_1 = getMobileCode() + values.mobile_1;
    if (!!values.mobile_2) values.mobile_2 = getMobileCode() + values.mobile_2;

    setOLoader(true);
    createStudentSignUp(values as MatrixRowType)
      .then((res) => {
        setStatus(true);
        setOLoader(false);
        close();
        setUserName(res?.data?.username || "");
        setUserData(res?.data);
      })
      .catch((error) => {
        setStatus(false);
        setOLoader(false);
        close();
      });
  };

  const onSuccessHandler = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }: VerifyPaymentData) => {
    // Validate payment at server - using webhooks is a better idea.
    invoiceBreakdown?._id && delete invoiceBreakdown._id;

    verifyPaymantData({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      product_name: form?.values?.competition || "",
      invoiceBreakdown: invoiceBreakdown,
    })
      .then((res: any) => {
        notifications.show({
          title: res?.message || `Payment Paid Succesfully`,
          message: `Redirecting ...`,
          color: "green",
          autoClose: 10000,
        });
        setisPaid(true);
        // router.replace("/authentication/signin");
      })
      .catch(() => {});
  };

  const makePayment = async () => {
    const res = await loadPaymentScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      notifications.show({
        title: `Unable to connect to the payment gateway!`,
        message: `Please make sure you are online and try again later.`,
        color: "red",
      });
      return;
    }

    const paymentData = await createOrder(formValues.product_name, userName);

    const { id, amount, currency, receipt, notes } = paymentData;

    if (!id) {
      alert("Server error. Are you online?");
      notifications.show({
        title: `Unable to generate an order for this transaction.`,
        message: `Please make sure you are online and try again later.`,
        color: "red",
      });
      return;
    }

    const { name, email_1, mobile_1 } = form.values;
    const options = {
      key: process.env.RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
      amount: amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: currency,
      name: "Ignited Mind Lab", //your business name
      description: `${receipt} - ${form.values.name}`,
      image: "https://ignitedmindlab.vercel.app/logo.png",
      order_id: id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
        name: name,
        email: email_1,
        contact: mobile_1,
      },
      handler: onSuccessHandler,
      notes: notes,
      theme: {
        color: "#3399cc",
      },
    };
    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  const goTologin = () => {
    router.replace("/authentication/signin");
  };

  return (
    <div className={classes.wrapper}>
      <Paper h={"100%"} className={classes.form} radius={0} p={30}>
        <ScrollArea w={"100%"} h={"100%"} type={"never"}>
          <Box maw={"75%"} mx="auto">
            <form
            // onSubmit={form.onSubmit(onSubmitForm)}
            >
              <LoadingOverlay visible={oLoader} overlayBlur={2} />
              <Stepper active={active} onStepClick={setActive} breakpoint="sm">
                <Stepper.Step label="Select Product" description="" allowStepSelect={false}>
                  <FirstForm
                    setInvoiceBreakdown={setInvoiceBreakdown}
                    form={form}
                    onClickNext={() => {
                      setActive(+active + 1);
                      // nextStep(true)
                    }}
                  />
                </Stepper.Step>
                <Stepper.Step label="Personal Info" description="" allowStepSelect={false}>
                  <SecondForm form={form} />
                </Stepper.Step>
                <Stepper.Step label="Address" description="" allowStepSelect={false}>
                  <ThirdForm form={form} setRecaptcha={setRecaptcha} />
                </Stepper.Step>
                <Stepper.Step label="Summary" description="" allowStepSelect={false}>
                  <SummaryForm form={form} setRecaptcha={setRecaptcha} />
                </Stepper.Step>
                {/* <Stepper.Step label="Address" description="" allowStepSelect={false}>
                  <ThirdForm form={form} setRecaptcha={setRecaptcha} />
                </Stepper.Step> */}
                <Stepper.Step label="Make Payment" description="" allowStepSelect={false}>
                  {status ? (
                    <Flex mt={"xl"} justify={"center"} align={"center"} direction={"column"}>
                      <Alert my={"xl"} icon={<IconAlertCircle size="1.5rem" />} title="Yayyy!" color="green">
                        Successfully signed-up! Please check your inbox for further instructions!
                      </Alert>

                      {isPaid ? (
                        <div className="mb-3">
                          {userData?.username ? (
                            <div>
                              Username : {userData?.username} <br />
                            </div>
                          ) : (
                            ""
                          )}
                          {userData?.password ?? formValues.mobile_1 ? (
                            <div>Password : {userData?.password ?? formValues.mobile_1}</div>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        ""
                      )}

                      <Button onClick={isPaid ? goTologin : makePayment}>
                        {!isPaid && <IconCreditCard size={"1.5rem"} />}{" "}
                        <Text mx={"xs"}> {isPaid ? "Login" : "Pay"}</Text>
                      </Button>
                    </Flex>
                  ) : (
                    <Alert icon={<IconAlertCircle size="1.5rem" />} title="Oops!" color="red">
                      There was a problem signing you up! Please try again later!
                    </Alert>
                  )}
                </Stepper.Step>
                <Stepper.Completed>
                  {status ? (
                    <Flex mt={"xl"} justify={"center"} align={"center"} direction={"column"}>
                      <Alert my={"xl"} icon={<IconAlertCircle size="1.5rem" />} title="Yayyy!" color="green">
                        Successfully signed-up! Please check your inbox for further instructions!
                      </Alert>
                      <Button
                        onClick={() => {
                          router.replace("/");
                        }}
                      >
                        <IconHome size={"1.5rem"} />
                        <Text mx={"xs"}>Go back to home-page</Text>
                      </Button>
                    </Flex>
                  ) : (
                    <Alert icon={<IconAlertCircle size="1.5rem" />} title="Oops!" color="red">
                      There was a problem signing you up! Please try again later!
                    </Alert>
                  )}
                </Stepper.Completed>
              </Stepper>

              <Group position="center" mt="xl">
                {active != 0 && active != 4 && (
                  <Button variant="default" onClick={prevStep}>
                    Back
                  </Button>
                )}
                {active != 0 && active != 4 && (
                  <Button
                    onClick={() => {
                      if (active != 3) {
                        nextStep();
                      } else {
                        onSubmitForm(form.values);
                      }
                    }}
                  >
                    {"Next step"}
                  </Button>
                )}
              </Group>
            </form>
          </Box>
        </ScrollArea>
      </Paper>
    </div>
  );
}
