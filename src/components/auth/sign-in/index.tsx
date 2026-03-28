"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInSchema } from "@/lib/validations/auth";
import SocialSignIn from "../SocialSignIn";
import Logo from "../../layout/header/logo";

type SignInValues = z.infer<typeof signInSchema>;

const Signin = () => {
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInValues) => {
    setErrorMsg("");
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      setErrorMsg("Invalid email or password.");
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
        <Logo />
      </div>

      <SocialSignIn />

      <span className="my-8 flex items-center justify-center text-center">
        <span className="flex-grow border-t border-white/20"></span>
        <span className="mx-4 text-base text-white">OR</span>
        <span className="flex-grow border-t border-white/20"></span>
      </span>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 mb-4 py-2 px-4 rounded-md text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-[22px]">
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className={`w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base outline-hidden transition placeholder:text-grey text-white
              ${errors.email ? "border-red-500 focus:border-red-500" : "border-white/20 focus:border-primary"}`}
          />
          {errors.email && <p className="text-red-500 text-left text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div className="mb-[22px]">
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className={`w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base outline-hidden transition placeholder:text-grey text-white
              ${errors.password ? "border-red-500 focus:border-red-500" : "border-white/20 focus:border-primary"}`}
          />
          {errors.password && <p className="text-red-500 text-left text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div className="mb-9 mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg text-lg text-white font-medium border
              ${isSubmitting ? "bg-gray-500 border-gray-500 cursor-not-allowed" : "bg-primary border-primary hover:text-primary hover:bg-transparent cursor-pointer"}
            `}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </form>

      <Link
        href="/"
        className="mb-2 inline-block text-base hover:text-primary text-white hover:underline"
      >
        Forgot Password?
      </Link>
      <p className="text-white text-base">
        Not a member yet?{" "}
        <Link href="/" className="text-primary hover:underline">
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default Signin;