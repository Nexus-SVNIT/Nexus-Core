import React from "react";
import { Link } from "react-router-dom";
import { WhatsappIcon } from "react-share";
import { Button } from "../index";

const FormCard = ({ form }) => {
  const registrationLink = window.location;

  const message = `Hey there!\n\n Exciting news! Registration for ${form.name} is now open. 
                  Be part of this incredible event by registering at: ${registrationLink}
                  Don't miss out on the opportunity - secure your spot today!`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `https://wa.me/?text=${encodedMessage}`;

  // Assuming you have a group link stored in form.groupLink
  const groupLink = form.groupLink || ''; // Fallback to an empty string if groupLink is not present

  return (
    <div className="flex w-full md:w-2/5 min-w-[20rem] flex-col gap-2 rounded-md bg-white/90 p-6 text-black">
      <div className="flex justify-between font-semibold">
        <div className="flex-1">
          <h2 className="line-clamp-2 text-xl font-bold md:text-2xl">
            {form.name}
          </h2>
          <p className="font-mono text-xs font-medium text-gray-400 md:text-sm">
            {form.type}
          </p>
        </div>

        <div className="ml-2">
          <Link to={whatsappLink} rel="nofollow noopener" target="_blank">
            <WhatsappIcon size={24} round={true} />
          </Link>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-2 font-semibold md:my-2 md:flex-row">
        <div className="text-sm font-bold md:text-base">
          Deadline: {form.deadline}
        </div>
        <div className="font-mono text-xs text-gray-800 md:text-base">
          Status:{" "}
          <span
            className={`${
              form.status === "Active" ? "text-green-800" : "text-amber-800"
            }`}
          >
            {form.status}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between font-semibold md:my-2 md:flex-row md:gap-6">
        <div className="w-fit rounded-full bg-black/25 px-2 py-2 text-xs font-bold text-white md:px-4 md:text-base">
          {form.status === "Active" ? "Started" : "Completed"}
        </div>
        <div className="font-mono text-xs text-sky-700 md:text-lg">
          {form.responseCount} Registered
        </div>
      </div>
      {
        form.status === "Active" && (
            <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-6">
          <Button
            className="w-full rounded-md border border-blue-700 bg-blue-700 px-4 py-2 text-sm font-semibold text-white outline-none"
            isButton={true}
            variant="primary"
            to={`/register/${form._id}`}  
            isDisabled={form.status === "Inactive"}
          >
            Register Now
          </Button>
        </div>
        )
      }
      {groupLink && (
        <div className="mt-4 text-center">
          <a
            href={groupLink}
            target="_blank"
            rel="nofollow noopener"
            className="text-blue-600 underline"
          >
            Join our WhatsApp Group
          </a>
        </div>
      )}
    </div>
  );
};

export default FormCard;
