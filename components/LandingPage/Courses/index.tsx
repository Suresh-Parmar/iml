import React, { useEffect, useState } from "react";
import SingleCard from "./SingleCard";
import { Carousel } from "@mantine/carousel";
import { Box, Center, Grid, Overlay, Title, createStyles } from "@mantine/core";
import { createOrder, loadPaymentScript, readCompetitionsLanding, verifyPaymantData } from "@/utilities/API";
import { useLandingPageAPisQuery } from "@/redux/apiSlice";
import { useSelector } from "react-redux";
import { iterateData } from "@/helpers/getData";
import { ProductView } from "@/components/common";
import { useRouter } from "next/navigation";
import { setGetData } from "@/helpers/getLocalStorage";
import { notifications } from "@mantine/notifications";

type competitionType = {
  code: string;
  country: string;
  created_at: string;
  message: string;
  mode_id: string;
  name: string;
  parent_competition_id: string;
  status: boolean;
  subject_id: string;
  tags: string;
  updated_at: string;
  _id: string;
};

const useStyles = createStyles(() => ({
  headingBorder: {
    background: "#1250A2",
    borderStyle: "none",
    borderRadius: "0px",
    zIndex: 17,
    width: "97px",
    height: "3px",
    position: "relative",
    margin: "10px 0",
  },
}));

function Courses() {
  const [dataProducts, setDataProducts] = useState([]);
  const [competitionData, setcompetitionData] = useState<competitionType[]>([]);
  const reduxData = useSelector((state: any) => state?.data);
  const [buyDetails, setBuyDetails] = useState<any>({});

  let selectedCountry = reduxData.selectedCountry;
  let authentication: any = setGetData("userData", "", true);
  let userData = authentication?.user;

  let isloggedIn: any = authentication?.metadata?.status == "authenticated";
  let userClass = authentication?.user?.class_id;

  const router = useRouter();
  const { classes } = useStyles();

  const onSuccessHandler = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }: any) => {
    // Validate payment at server - using webhooks is a better idea.
    buyDetails?._id && delete buyDetails._id;

    verifyPaymantData({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      product_name: buyDetails?.name || "",
      invoiceBreakdown: buyDetails,
    })
      .then((res: any) => {
        notifications.show({
          title: res?.message || `Payment Paid Succesfully`,
          message: `Redirecting ...`,
          color: "green",
        });
        // router.replace("/authentication/signin");
      })
      .catch(() => {});
  };

  const makePayment = async (data: any) => {
    const res = await loadPaymentScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      notifications.show({
        title: `Unable to connect to the payment gateway!`,
        message: `Please make sure you are online and try again later.`,
        color: "red",
      });
      return;
    }
    const paymentData = await createOrder(data?.name, userData.username);
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
    const { name, email_1, mobile_1 } = userData;
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
      amount: amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: currency,
      name: "Ignited Mind Lab", //your business name
      description: `${receipt} - ${userData.name}`,
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

  let productsDataPayload: any = {
    collection_name: "products",
    op_name: "find_many",
    filter_var: {
      status: true,
      showfront: true,
      country: selectedCountry.label || "India",
    },
  };
  if (isloggedIn && userClass) {
    productsDataPayload.filter_var.class = [userClass];
  }

  let productsData = useLandingPageAPisQuery(productsDataPayload);
  productsData = iterateData(productsData);

  const handleClick = (item: any) => {
    let { loginrequired } = item;
    if (isloggedIn) {
      setBuyDetails(item);
      makePayment(item);
    } else {
      if (loginrequired) {
        let windowconfirm = window.confirm("You need to login to buy this product.");
        if (windowconfirm) {
          router.replace("/authentication/signin");
        }
      } else {
        router.replace("/authentication/signup");
      }
    }
  };

  const slides =
    productsData &&
    Array.isArray(productsData) &&
    productsData.map((item: any, index: any) => {
      return (
        <ProductView
          className="bg-light text-dark"
          key={index}
          onClick={() => {
            handleClick(item);
          }}
          item={item}
        />
      );
      // return (
      //   <Grid.Col span={12} md={4} lg={3} sm={6} key={index}>
      //     <SingleCard item={item} />
      //   </Grid.Col>
      // );
    });

  const getCompetitionData = async () => {
    let competitions: any = await readCompetitionsLanding();
    setcompetitionData(competitions);
  };

  useEffect(() => {
    // getCompetitionData();
  }, []);

  return (
    <Box
      id={"Courses"}
      pt={60}
      pb={70}
      sx={{
        color: "#fff",
        height: "inherit",
      }}
    >
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Box w={"80%"} m={"auto"}>
          <h2 style={{ lineHeight: "19px" }}>
            <span
              style={{
                fontSize: "18px",
                fontFamily: "Montserrat",
              }}
            >
              <span style={{ fontWeight: 400 }}>POPULAR COURSES </span>
            </span>
          </h2>
          <Box className={classes.headingBorder}>
            <Box
              sx={{
                position: "absolute",
                background: "none",
                height: "3px",
                width: "97px",
              }}
            ></Box>
          </Box>
          <Box pb={"40px"}>
            <h2>
              <span
                style={{
                  fontSize: "48px",
                  fontFamily: "Playfair Display",
                  fontWeight: 900,
                }}
              >
                Our Most
              </span>
              <span
                style={{
                  fontFamily: `"Playfair Display"`,
                  fontSize: "48px",
                  fontWeight: 900,
                  color: "",
                }}
              >
                <span style={{ color: "rgb(0, 0, 0)" }}>&nbsp;</span>
                <span
                  style={{
                    color: "#E21D22",
                    // background:
                    //   "linear-gradient(to bottom right, #E21D22, #1250A2)",
                    // WebkitBackgroundClip: "text",
                    // WebkitTextFillColor: "transparent",
                    // color: 'linear-gradient(to bottom right, #E21D22, #1250A2)'
                  }}
                >
                  Popular And Trending
                </span>
              </span>
            </h2>
            <h2 style={{ lineHeight: "45px" }}>
              <span
                style={{
                  fontSize: "48px",
                  fontFamily: "Playfair Display",
                  fontWeight: 900,
                }}
              >
                Online Courses
              </span>
            </h2>
          </Box>
        </Box>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {slides}
        </div>
      </div>
    </Box>
  );
}

export default Courses;
