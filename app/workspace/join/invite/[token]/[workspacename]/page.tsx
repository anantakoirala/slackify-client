"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isValid, z } from "zod";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { checkAuthentication } from "@/lib/utils";
import { restApi } from "@/api";
import Image from "next/image";

import logo from "../../../../../public/logo.svg";
import { LT1 } from "@/constants";
import toast from "react-hot-toast";

type Props = {};
const formSchema = z.object({
  email: z.string().email(),
});

const Page = (props: Props) => {
  const params = useParams();
  const [validInvitation, setValidInvitation] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const route = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    axios
      .post(
        "http://localhost:7000/api/v1/auth/w-login",
        { email: data.email, LT: params.token, N: params.workspacename },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);

        toast.success("Confirmation link has been sent to your email");
      })
      .catch((error) => {
        console.log("error", error.response.data.message);
        toast.error(error.response.data.message);
      });
    console.log(data);
  };

  useEffect(() => {
    // Check if params is empty
    if (!params || Object.keys(params).length === 0) {
      setValidInvitation(false);
      return;
    }
    const checkAuthenticationAndLog = async () => {
      const response = await checkAuthentication();
      setIsAuthenticated(response);
      console.log("Is authenticated:", isAuthenticated);
    };

    restApi
      .post(`/api/v1/workspace/check-invitation`, { params })
      .then((res) => {
        console.log("res", res);
        if (res.status !== 200) {
          setValidInvitation(false);
        }
      })
      .catch((error) => setValidInvitation(false));

    checkAuthenticationAndLog();
  }, [setIsAuthenticated, isAuthenticated, params, setValidInvitation]);

  return (
    <>
      {validInvitation ? (
        <>
          <div className="flex flex-col items-center justify-start w-full min-h-[100vh] bg-background  ">
            <div className="flex flex-col items-center justify-center bg-card w-full pt-4 h-[45%]">
              <div className="pb-12">
                <Image src={logo} alt="logo" width={100} height={100} />
              </div>
              <div className="mb-12 text-muted-foreground">
                <span className="text-4xl font-extrabold text-white p-1">
                  Join
                </span>
                <span className="text-4xl font-extrabold text-muted-foreground p-1">
                  {params.workspacename}
                </span>
                <span className="text-4xl font-extrabold text-white p-1">
                  workspace
                </span>
              </div>
            </div>
            <div>
              <Card className="w-[350px] rounded-2xl bg-card text-card-foreground shadow-sm">
                <CardHeader className="flex items-center">
                  <CardTitle className="">Sign In</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Form {...form}>
                    <form
                      className="flex flex-col items-center mb-2 w-full"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="w-full mb-3 ">
                            <FormControl>
                              <Input
                                placeholder="example@email.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        className="w-full bg-primary hover:bg-primary/90"
                        type="submit"
                      >
                        Submit
                      </Button>
                    </form>
                    {/* <span>or</span>
                    <Button
                      onClick={() => {
                        window.open(
                          `${process.env.NEXT_PUBLIC_API}/api/v1/auth/google`,
                          "_self"
                        );
                      }}
                      variant={"ghost"}
                      className="w-full bg-background rounded-md ring-offset-background border hover:bg-accent flex items-center justify-center gap-1"
                    >
                      <FaGoogle />
                      Login with Google
                    </Button> */}
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-between"></CardFooter>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center w-full h-screen bg-background text-white">
            INVITATION EXPIRED
          </div>
        </>
      )}
    </>
  );
};

export default Page;
