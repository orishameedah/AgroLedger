import { LoginForm } from "@/components/auth/login-form";

export default function BuyerLoginPage() {
  return (
    <LoginForm
      mainTitle="Agroledger Dashboard"
      formTitle="Login to your dashboard"
      role="farmer"
    />
  );
}
