import VerifyLogo from "../assets/verifyfixionlogo.png";

// const boxSVG = (
//   <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
//     <rect x="0.5" y="0.5" width="47" height="47" rx="9.5" stroke="#050150"/>
//   </svg>
// );

const goBackSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M9.57 5.93018L3.5 12.0002L9.57 18.0702"
      stroke="#1A1A1A"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.4999 12H3.66992"
      stroke="#1A1A1A"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const resendSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M20.75 13.25C20.75 18.08 16.83 22 12 22C7.17 22 3.25 18.08 3.25 13.25C3.25 8.42 7.17 4.5 12 4.5C16.83 4.5 20.75 8.42 20.75 13.25Z"
      stroke="#1A1A1A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8V13"
      stroke="#1A1A1A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 2H15"
      stroke="#1A1A1A"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function VerifyEmail() {
  return (
    <div className="flex items-center justify-center m-0 min-h-screen w-full bg-white">
      <div className="min-h-screen w-full bg-white flex flex-col">
        {/* Logo/Back Button */}
        <div className="fixed -left-15 -top-25">
          <img src={VerifyLogo} alt="Fixion logo" className="h-70" />
        </div>
        <div className="fixed left-5 top-18 z-20">
          <button aria-label="Go Back" className="bg-white">
            {goBackSVG}
          </button>
        </div>

        {/* Main Centered Content */}
        <div className="flex flex-1 justify-center items-center w-full">
          <div className="w-full max-w-[420px] flex flex-col items-center justify-center mx-auto">
            <h1 className="text-[48px] font-bold leading-[60px] text-[#1A1A1A] text-center mb-12">
              Verify Email
            </h1>

            <p className="text-[#1A1A1A] text-center text-[18px] font-medium leading-[30px] mb-8">
              A six-digit code will be sent to your email address.
              <br />
              Enter the code below
            </p>

            {/* OTP Boxes */}
            <div className="flex justify-center gap-4 mb-10">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-12 md:w-[48px] md:h-[48px] text-center text-2xl border-2 border-[#050150] rounded-[9.5px] outline-none focus:border-[#373785] transition bg-white"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button className="w-full h-12 mb-4 rounded-[16px] border-[1.5px] border-[#050150] text-[#1E1A62] text-[16px] font-semibold leading-[26px] bg-white outline-none hover:bg-gray-100 transition">
              Verify and Register
            </button>

            {/* Resend */}
            <div className="flex items-center gap-2 text-[#1A1A1A] text-sm mt-2">
              {resendSVG}
              <button
                type="button"
                className="hover:underline text-[#1A1A1A] text-[16px] font-semibold leading-[26px] bg-transparent border-none p-0 cursor-pointer"
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
