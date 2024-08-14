"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import logo from "../public/logo.svg";
import Link from "next/link";
import { checkAuthentication } from "@/lib/utils";
import { FaBars } from "react-icons/fa";
type Props = {
  isAuthenticated: boolean;
};

const Header = ({ isAuthenticated }: Props) => {
  return (
    <header className="w-full bg-background text-white p-2  flex flex-col items-center overflow-x-hidden">
      {/* <!-- ------------------- navbar section starts here ------------- --> */}
      <nav className=" w-full flex font-popi leading-none justify-between text-[0.9rem] font-semibold max-w-[1400px]">
        {/* <!-- navbar left section --> */}
        <div className="flex gap-6">
          <div className="flex items-center">
            <Image
              src={logo}
              alt="logo"
              width={100}
              height={100}
              className="w-12 h-12"
            />
          </div>
          {/* <ul className=" hidden lg:flex gap-6">
            <li className="flex items-center">
              <a className="flex items-center gap-1" href="#">
                Features<i className="fa-solid fa-angle-down text-[0.6rem]"></i>
              </a>
            </li>
            <li className="flex items-center">
              <a className="flex items-center gap-1" href="#">
                Solutions
                <i className="fa-solid fa-angle-down text-[0.6rem]"></i>
              </a>
            </li>
            <li className="flex items-center">
              <a className="hover:underline" href="#">
                Enterprise
              </a>
            </li>
            <li className="flex items-center">
              <a className="flex items-center gap-1" href="#">
                Resources
                <i className="fa-solid fa-angle-down text-[0.6rem]"></i>
              </a>
            </li>
            <li className="flex items-center">
              <a className="hover:underline" href="#">
                Pricing
              </a>
            </li>
          </ul> */}
        </div>

        {/* <!-- navbar right section   --> */}
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="">
            <a href="">
              <i className="fa-solid fa-magnifying-glass text-lg"></i>
            </a>
          </div>
          {/* <div className="">
            <a href="" className="flex items-center lg:hidden">
              <FaBars />
            </a>
          </div> */}
          {!isAuthenticated && (
            <>
              <Link
                className=" lg:inline-block hover:underline"
                href={"/login"}
              >
                Sign in
              </Link>
              {/* <button className="hidden lg:inline-block outline outline-1 hover:outline-2 transition-all  py-[0.8rem] px-4 rounded-sm">
            TALK TO SALES
          </button> */}
              <Link
                href={"/register"}
                className=" min-[1150px]:inline-block outline outline-1 outline-white hover:outline-primary  transition-all bg-white text-background text-[0.8rem] font-semibold py-[0.5rem] sm:py-[0.8rem] px-2 sm:px-4 rounded-sm "
              >
                GET STARTED
              </Link>
            </>
          )}
        </div>
      </nav>
      {/* <!------------------------- navbar section ends here ------------- --> */}
    </header>
  );
};

export default Header;
