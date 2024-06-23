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
import { z } from "zod";
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
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { checkAuthentication } from "@/lib/utils";

type Props = {};
const formSchema = z.object({
  email: z.string().email(),
});

const Page = (props: Props) => {
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
        "http://localhost:7000/api/v1/auth/login",
        { email: data.email },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);
        route.push("/verify");
      })
      .catch((error) => console.log("error", error));
    console.log(data);
  };
  useEffect(() => {
    const checkAuthenticationAndLog = async () => {
      const response = await checkAuthentication();
      setIsAuthenticated(response);
      console.log("Is authenticated:", isAuthenticated);
    };

    checkAuthenticationAndLog();
  }, [setIsAuthenticated, isAuthenticated]);
  return (
    <>
      <Header isAuthenticated={isAuthenticated} />
      <div className="flex items-center justify-center w-full h-screen bg-background ">
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
                        <Input placeholder="example@email.com" {...field} />
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
              <span>or</span>
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
              </Button>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between"></CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Page;
