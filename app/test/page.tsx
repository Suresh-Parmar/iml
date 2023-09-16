'use client';

import React from 'react';

import './index.css';
import { Button, Container, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { BASE_URL } from '@/utilities/API';

function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export default function PaymentPage() {
  

  const makePayment = async () => {
    notifications.show({
      title: `Transaction initiated...`,
      message: `Please follow the guide on-screen.`,
      color: 'yellow',
    });
    const res = await loadScript(
      'https://checkout.razorpay.com/v1/checkout.js'
    );

    if (!res) {
      notifications.show({
        title: `Unable to connect to the payment gateway!`,
        message: `Please make sure you are online and try again later.`,
        color: 'red',
      });
      return;
    } else {
      // notifications.show({
      //   title: `Connected to the payment gateway...`,
      //   message: `Please follow the guide on-screen.`,
      //   color: 'yellow',
      // });
    }
    const paymentData = await axios.post(`${BASE_URL}/payment_request`);
    const {
      id,
      entity,
      amount,
      amount_paid,
      amount_due,
      currency,
      receipt,
      offer_id,
      status,
      attempts,
      notes,
      created_at,
    } = paymentData.data;

    const options = {
      key: process.env.RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
      amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: currency,
      name: 'Ignited Mind Lab', //your business name
      description: 'Test Transaction',
      image: 'https://ignitedmindlab.vercel.app/logo.png',
      order_id: id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      // callback_url: 'http://localhost:3000/payments/successful',
      // "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
      //   "name": "Harshit Doshi", //your customer's name
      //   "email": "harshit.doshi@example.com",
      //   "contact": "9876543201" //Provide the customer's phone number for better conversion rates
      // },
      handler: function (response: any) {
        // Validate payment at server - using webhooks is a better idea.
        console.log('response',response)
      },
      // notes: {
      //   address: 'IML Head-Quarters',
      // },
      theme: {
        color: '#3399cc',
      },
    };
    
    if (!id) {
      alert('Server error. Are you online?');
      notifications.show({
        title: `Unable to generate an order for this transaction.`,
        message: `Please make sure you are online and try again later.`,
        color: 'red',
      });
      return;
    } else {
      // notifications.show({
      //   title: `Order generated...`,
      //   message: `Please follow the guide on-screen.`,
      //   color: 'yellow',
      // });
    }
    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  return (
    <Container h={'100%'}>
      <Title>Payment Page</Title>
      <Button onClick={makePayment}>Pay ₹500</Button>
      <Button
        onClick={() => {
          notifications.show({
            title: `Test notification`,
            message: `foo bar`,
            color: 'red',
          });
        }}
      >
        Test
      </Button>
    </Container>
  );
}
