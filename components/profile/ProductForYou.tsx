import { VerifyPaymentData, createOrder, loadPaymentScript, readProducts, verifyPaymantData } from "@/utilities/API";
import { notifications } from "@mantine/notifications";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ProductView } from "../common";

function ProductForYou() {
  const [product, setyourProducts] = useState<any>([]);
  const [buyDetails, setBuyDetails] = useState<any>({});

  let userData = useSelector((state: any) => state?.data?.userData?.user);
  let country = useSelector((state: any) => state?.data.selectedCountry);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: country.currency || "USD",
  });

  const filterYourProducts = () => {
    //  const payload = { username: userData.username };
    //  studentAvailableproducts(payload);

    readProducts("class", [userData?.class_id])
      .then((res: any) => {
        if (Array.isArray(res)) {
          setyourProducts(res);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    userData.class_id && filterYourProducts();
  }, [userData?.class_id, country.value]);

  const onSuccessHandler = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }: VerifyPaymentData) => {
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
      key: process.env.RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
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

  return (
    <div>
      <div style={{ marginBottom: "20px", fontSize: "30px" }}>Product For you</div>
      <div className="d-flex gap-3 flex-wrap mb-5">
        {product.map((item: any, index: any) => (
          <ProductView
            item={item}
            key={index}
            onClick={() => {
              setBuyDetails(item);
              makePayment(item);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductForYou;
