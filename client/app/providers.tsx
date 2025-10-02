"use client";

import { Provider } from "react-redux";
import { store } from "./store/store";
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "./store/auth";
import { Toaster } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

function InnerProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const { checkAuth } = useAuth();

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  useEffect(() => {
    checkAuth();
  }, []);

 

  return (
    <QueryClientProvider client={queryClient}>
      <Elements stripe={stripePromise}>{children}

      </Elements>
      <Toaster position="top-center" reverseOrder={false} /></QueryClientProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <InnerProviders>{children}</InnerProviders>
    </Provider>
  );
}
