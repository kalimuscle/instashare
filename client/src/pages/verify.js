import { NavLink, Link } from "react-router";

import { useLocation } from 'react-router';

export default function Verify() {

    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
        <div className="max-w-xl px-5 text-center">
          <h2 className="mb-2 text-[42px] font-bold text-zinc-800">
            Check your inbox
          </h2>
          <p className="mb-2 text-lg text-zinc-500">
            We are glad, that you’re with us. Now, <NavLink to="/signin" className="font-bold text-blue-600">signin</NavLink> and upload files
            
          </p>
          <Link
            to="/"
            className="mt-3 inline-block w-96 rounded bg-blue-600 px-5 py-3 font-medium text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
          >
            Back home→
          </Link>
        </div>
      </div>
    );
  }