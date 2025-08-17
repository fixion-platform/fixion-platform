import Artisans from "../assets/artisans.png";
import Logo from "../assets/fixionlogo.png";

// Social button SVGs
const GoogleSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
  >
    <g opacity="0.8">
      <path
        d="M6 12.5C5.99856 13.9165 6.49829 15.2877 7.41074 16.3712C8.32318 17.4546 9.58951 18.1802 10.9856 18.4197C12.3816 18.6592 13.8174 18.397 15.0388 17.6797C16.2601 16.9623 17.1883 15.836 17.659 14.5H12V10.5H21.805V14.5H21.8C20.873 19.064 16.838 22.5 12 22.5C6.477 22.5 2 18.023 2 12.5C2 6.977 6.477 2.5 12 2.5C13.6345 2.49884 15.2444 2.89875 16.6883 3.66467C18.1323 4.43058 19.3662 5.5391 20.282 6.893L17.004 9.188C16.2924 8.11241 15.2532 7.29473 14.0404 6.85617C12.8275 6.4176 11.5057 6.38149 10.2707 6.75319C9.03579 7.12488 7.95347 7.88461 7.18421 8.91974C6.41495 9.95487 5.9997 11.2103 6 12.5Z"
        fill="#050150"
      />
    </g>
  </svg>
);

const AppleSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="23"
    viewBox="0 0 18 23"
    fill="none"
  >
    <path
      d="M9.59317 21.7579L9.58217 21.7599L9.51117 21.7949L9.49117 21.7989L9.47717 21.7949L9.40617 21.7599C9.39551 21.7566 9.3875 21.7583 9.38217 21.7649L9.37817 21.7749L9.36117 22.2029L9.36617 22.2229L9.37617 22.2359L9.48017 22.3099L9.49517 22.3139L9.50717 22.3099L9.61117 22.2359L9.62317 22.2199L9.62717 22.2029L9.61017 21.7759C9.6075 21.7653 9.60184 21.7593 9.59317 21.7579ZM9.85817 21.6449L9.84517 21.6469L9.66017 21.7399L9.65017 21.7499L9.64717 21.7609L9.66517 22.1909L9.67017 22.2029L9.67817 22.2099L9.87917 22.3029C9.89184 22.3063 9.9015 22.3036 9.90817 22.2949L9.91217 22.2809L9.87817 21.6669C9.87484 21.6549 9.86817 21.6476 9.85817 21.6449ZM9.14317 21.6469C9.13876 21.6443 9.1335 21.6434 9.12847 21.6445C9.12344 21.6456 9.11903 21.6487 9.11617 21.6529L9.11017 21.6669L9.07617 22.2809C9.07684 22.2929 9.08251 22.3009 9.09317 22.3049L9.10817 22.3029L9.30917 22.2099L9.31917 22.2019L9.32317 22.1909L9.34017 21.7609L9.33717 21.7489L9.32717 21.7389L9.14317 21.6469Z"
      fill="#050150"
    />
    <path
      d="M10.0642 5.18494L10.8092 4.87894C11.4142 4.63894 12.1962 4.39394 13.1192 4.54894C15.0102 4.86694 16.3142 5.88794 17.0912 7.24194C17.3912 7.76394 17.1492 8.45194 16.5892 8.67094C16.1095 8.85861 15.6994 9.18985 15.415 9.61938C15.1306 10.0489 14.9858 10.5558 15.0003 11.0707C15.0149 11.5857 15.1881 12.0836 15.4963 12.4963C15.8045 12.9091 16.2326 13.2167 16.7222 13.3769C17.2402 13.5469 17.5322 14.1219 17.3622 14.6399C16.9202 15.9819 16.2842 17.2209 15.5312 18.2209C14.7872 19.2089 13.8792 20.0289 12.8682 20.4299C12.2082 20.6899 11.5002 20.5929 10.8232 20.4249L10.4212 20.3179L9.82421 20.1449C9.55321 20.0659 9.27421 19.9979 9.00021 19.9979C8.72521 19.9979 8.4472 20.0659 8.1762 20.1449L7.57921 20.3179L7.17721 20.4249C6.50021 20.5929 5.7912 20.6909 5.13221 20.4299C3.85921 19.9259 2.73621 18.7499 1.88721 17.3629C0.969203 15.835 0.362873 14.1404 0.103205 12.3769C-0.123795 10.8229 -0.000795186 9.07794 0.718205 7.60194C1.4582 6.08094 2.81421 4.89694 4.88121 4.54894C5.72121 4.40794 6.4432 4.59694 7.0212 4.81394L7.35221 4.94394L7.9362 5.18494C8.3362 5.34194 8.65121 5.43394 9.00021 5.43394C9.3482 5.43394 9.66421 5.34194 10.0642 5.18494ZM8.7682 1.26794C9.7442 0.290943 11.2432 0.206943 11.5962 0.560943C11.9502 0.913943 11.8662 2.41294 10.8892 3.38894C9.91321 4.36494 8.4142 4.44894 8.0612 4.09594C7.7072 3.74294 7.7912 2.24394 8.7682 1.26794Z"
      fill="#050150"
    />
  </svg>
);

// const socialButtonStyle = {
//   display: "flex",
//   width: "268px",
//   height: "55px",
//   padding: "10px 23px",
//   justifyContent: "center",
//   alignItems: "center",
//   gap: "8px",
//   borderRadius: "16px",
//   border: "1px solid #000",
//   background: "#fff",
//   outline: "none",
//   fontWeight: 500,
//   fontSize: "14px",
//   color: "#1A1A1A",
//   cursor: "pointer",
//   transition: "background 0.2s",
// };

// Input icons
const icons = {
  firstName: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
      <path
        d="M7.99935 8.00016C9.8403 8.00016 11.3327 6.50778 11.3327 4.66683C11.3327 2.82588 9.8403 1.3335 7.99935 1.3335C6.1584 1.3335 4.66602 2.82588 4.66602 4.66683C4.66602 6.50778 6.1584 8.00016 7.99935 8.00016Z"
        stroke="#4D4D4D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.7268 14.6667C13.7268 12.0867 11.1601 10 8.0001 10C4.8401 10 2.27344 12.0867 2.27344 14.6667"
        stroke="#4D4D4D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  email: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
      <path
        d="M11.334 13.6668H4.66732C2.66732 13.6668 1.33398 12.6668 1.33398 10.3335V5.66683C1.33398 3.3335 2.66732 2.3335 4.66732 2.3335H11.334C13.334 2.3335 14.6673 3.3335 14.6673 5.66683V10.3335C14.6673 12.6668 13.334 13.6668 11.334 13.6668Z"
        stroke="#4D4D4D"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.3327 6L9.24601 7.66667C8.55935 8.21333 7.43268 8.21333 6.74601 7.66667L4.66602 6"
        stroke="#4D4D4D"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  phone: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
      <path
        d="M14.6473 12.2207C14.6473 12.4607 14.594 12.7073 14.4807 12.9473C14.3673 13.1873 14.2207 13.414 14.0273 13.6273C13.7007 13.9873 13.3407 14.2473 12.934 14.414C12.534 14.5807 12.1007 14.6673 11.634 14.6673C10.954 14.6673 10.2273 14.5073 9.46065 14.1807C8.69398 13.854 7.92732 13.414 7.16732 12.8607C6.40065 12.3007 5.67398 11.6807 4.98065 10.994C4.29398 10.3007 3.67398 9.57398 3.12065 8.81398C2.57398 8.05398 2.13398 7.29398 1.81398 6.54065C1.49398 5.78065 1.33398 5.05398 1.33398 4.36065C1.33398 3.90732 1.41398 3.47398 1.57398 3.07398C1.73398 2.66732 1.98732 2.29398 2.34065 1.96065C2.76732 1.54065 3.23398 1.33398 3.72732 1.33398C3.91398 1.33398 4.10065 1.37398 4.26732 1.45398C4.44065 1.53398 4.59398 1.65398 4.71398 1.82732L6.26065 4.00732C6.38065 4.17398 6.46732 4.32732 6.52732 4.47398C6.58732 4.61398 6.62065 4.75398 6.62065 4.88065C6.62065 5.04065 6.57398 5.20065 6.48065 5.35398C6.39398 5.50732 6.26732 5.66732 6.10732 5.82732L5.60065 6.35398C5.52732 6.42732 5.49398 6.51398 5.49398 6.62065C5.49398 6.67398 5.50065 6.72065 5.51398 6.77398C5.53398 6.82732 5.55398 6.86732 5.56732 6.90732C5.68732 7.12732 5.89398 7.41398 6.18732 7.76065C6.48732 8.10732 6.80732 8.46065 7.15398 8.81398C7.51398 9.16732 7.86065 9.49398 8.21398 9.79398C8.56065 10.0873 8.84732 10.2873 9.07398 10.4073C9.10732 10.4207 9.14732 10.4407 9.19398 10.4607C9.24732 10.4807 9.30065 10.4873 9.36065 10.4873C9.47398 10.4873 9.56065 10.4473 9.63398 10.374L10.1407 9.87398C10.3073 9.70732 10.4673 9.58065 10.6207 9.50065C10.774 9.40732 10.9273 9.36065 11.094 9.36065C11.2207 9.36065 11.354 9.38732 11.5007 9.44732C11.6473 9.50732 11.8007 9.59398 11.9673 9.70732L14.174 11.274C14.3473 11.394 14.4673 11.534 14.5407 11.7007C14.6073 11.8673 14.6473 12.034 14.6473 12.2207Z"
        stroke="#4D4D4D"
        strokeWidth="1.5"
        strokeMiterlimit="10"
      />
    </svg>
  ),
  password: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
      <path
        d="M9.68661 6.31328L6.31328 9.68661C5.87995 9.25328 5.61328 8.65995 5.61328 7.99995C5.61328 6.67995 6.67995 5.61328 7.99995 5.61328C8.65995 5.61328 9.25328 5.87995 9.68661 6.31328Z"
        stroke="#4D4D4D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.8799 3.84633C10.7132 2.96633 9.3799 2.48633 7.9999 2.48633C5.64656 2.48633 3.45323 3.87299 1.92656 6.27299C1.32656 7.21299 1.32656 8.793 1.92656 9.733C2.45323 10.5597 3.06656 11.273 3.73323 11.8463"
        stroke="#4D4D4D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.61328 13.0204C6.37328 13.3404 7.17995 13.5138 7.99995 13.5138C10.3533 13.5138 12.5466 12.1271 14.0733 9.72711C14.6733 8.78711 14.6733 7.20711 14.0733 6.26711C13.8533 5.92044 13.6133 5.59378 13.3666 5.28711"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.3409 8.4668C10.1676 9.4068 9.40094 10.1735 8.46094 10.3468"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.31398 9.68652L1.33398 14.6665"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6675 1.33301L9.6875 6.31301"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  gender: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
      <path
        d="M7.99935 7.99967C9.8403 7.99967 11.3327 6.50729 11.3327 4.66634C11.3327 2.82539 9.8403 1.33301 7.99935 1.33301C6.1584 1.33301 4.66602 2.82539 4.66602 4.66634C4.66602 6.50729 6.1584 7.99967 7.99935 7.99967Z"
        stroke="#4D4D4D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.7268 14.6667C13.7268 12.0867 11.1601 10 8.0001 10C4.8401 10 2.27344 12.0867 2.27344 14.6667"
        stroke="#4D4D4D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  location: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
      <path
        d="M7.99992 8.95395C9.14867 8.95395 10.0799 8.0227 10.0799 6.87395C10.0799 5.72519 9.14867 4.79395 7.99992 4.79395C6.85117 4.79395 5.91992 5.72519 5.91992 6.87395C5.91992 8.0227 6.85117 8.95395 7.99992 8.95395Z"
        stroke="#4D4D4D"
        strokeWidth="1.5"
      />
      <path
        d="M2.41379 5.66065C3.72712 -0.112681 12.2805 -0.106014 13.5871 5.66732C14.3538 9.05399 12.2471 11.9207 10.4005 13.694C9.06046 14.9873 6.94046 14.9873 5.59379 13.694C3.75379 11.9207 1.64712 9.04732 2.41379 5.66065Z"
        stroke="#4D4D4D"
        strokeWidth="1.5"
      />
    </svg>
  ),
  dropdown: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M13.2807 5.96655L8.93404 10.3132C8.4207 10.8266 7.5807 10.8266 7.06737 10.3132L2.7207 5.96655"
        stroke="#4D4D4D"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  ),
  badge: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M5.33387 14.6667H10.6672C13.3472 14.6667 13.8272 13.5933 13.9672 12.2867L14.4672 6.95333C14.6472 5.32667 14.1805 4 11.3339 4H4.6672C1.82054 4 1.35387 5.32667 1.53387 6.95333L2.03387 12.2867C2.17387 13.5933 2.65387 14.6667 5.33387 14.6667Z"
        stroke="#4D4D4D"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.33398 3.99992V3.46659C5.33398 2.28659 5.33398 1.33325 7.46732 1.33325H8.53398C10.6673 1.33325 10.6673 2.28659 10.6673 3.46659V3.99992"
        stroke="#4D4D4D"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33268 8.66667V9.33333C9.33268 9.34 9.33268 9.34 9.33268 9.34667C9.33268 10.0733 9.32602 10.6667 7.99935 10.6667C6.67935 10.6667 6.66602 10.08 6.66602 9.35333V8.66667C6.66602 8 6.66602 8 7.33268 8H8.66602C9.33268 8 9.33268 8 9.33268 8.66667Z"
        stroke="black"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.434 7.33325C12.894 8.45325 11.134 9.11992 9.33398 9.34659"
        stroke="black"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.74609 7.51343C3.24609 8.54009 4.93943 9.16009 6.66609 9.35343"
        stroke="black"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  google: GoogleSVG,
  apple: AppleSVG,
};

function Artisansignup() {
  return(
    <section className="min-h-screen w-full flex flex-col xl:flex-row font-poppins">
      {/* Left Side */}
      <div className="relative w-full h-[300px] xl:h-auto xl:flex-1">
        <img
          src={Artisans}
          alt="artisans-img"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050150]/90" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-center text-white pb-16 w-full px-6">
          <img src={Logo} alt="Fixion-logo" />
          <h3 className="text-[32px] leading-[44px] font-semibold text-center">
            Find the right fix, Fast!
          </h3>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col justify-center items-center bg-white px-6 py-10 xl:flex-1">
        <div className="w-full max-w-[500px]">
          <h2 className="text-[40px] leading-[52px] font-bold text-black text-center mb-2">
            Sign Up as an Artisan
          </h2>
          <p className="text-[14px] leading-[20px] text-center text-black/50 mb-6">
            Book reliable artisans for any job, anytime.
          </p>

          {/* Social buttons */}
          <div className="flex gap-4 mb-6">
            <button className="flex w-[268px] h-[55px] px-[23px] py-[10px] justify-center items-center gap-2 rounded-[16px] border border-black bg-white text-black text-[14px] font-medium leading-5 hover:bg-gray-100 transition cursor-pointer">
              {icons.google}
              Sign Up with Google
            </button>
            <button className="flex w-[268px] h-[55px] px-[23px] py-[10px] justify-center items-center gap-2 rounded-[16px] border border-black bg-white text-black text-[14px] font-medium leading-5 hover:bg-gray-100 transition cursor-pointer">
              {icons.apple}
              Sign Up with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-grow border-t border-gray-200" />
            <span className="mx-2 text-center text-[#000000] text-base font-light leading-[26px]">
              or continue with
            </span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="firstName" className="block mb-1 text-sm font-normal text-[#1e1a62] leading-5">
                  First Name
                </label>
                <div className="relative">
                  <input
                    id="firstName"
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {icons.firstName}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <label htmlFor="email" className="block mb-1 text-sm font-normal text-[#1e1a62] leading-5">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {icons.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="phone" className="block mb-1 text-sm font-normal text-[#1e1a62] leading-5">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    type="tel"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {icons.phone}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <label htmlFor="location" className="block mb-1 text-sm font-normal text-[#1e1a62] leading-5">
                  Location
                </label>
                <div className="relative">
                  <input
                    id="location"
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {icons.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="skill" className="block mb-1 text-sm font-normal text-[#1e1a62] leading-5">
                  Select your skill
                </label>
                <div className="relative">
                  <select
                    id="skill"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none block mb-1 text-sm font-normal text-[#1e1a62] leading-5"
                  >
                    <option value="">Select your skill</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrician">Electrician</option>
                    <option value="others">Others</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {icons.dropdown}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <label htmlFor="gender" className="block mb-1 text-sm font-normal text-[#1e1a62] leading-5">
                  Gender
                </label>
                <div className="relative">
                  <input
                    id="gender"
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {icons.gender}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="portfolio" className="block mb-1 text-sm font-normal text-[#1e1a62] leading-5">
                Portfolio Link (Optional)
              </label>
              <div className="relative">
                <input
                  id="portfolio"
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {icons.badge}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="password" className="block mb-1 text-sm font-normal text-[#1e1a62] leading-5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {icons.password}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <label htmlFor="confirmPassword" className="block mb-1 text-sm font-normal text-[#1e1a62] leading-5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type="password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {icons.password}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-[12px] leading-5 text-black/50 font-normal">
              <input
                type="checkbox"
                className="accent-indigo-600 mt-1"
                id="terms"
              />
              <label htmlFor="terms" className="font-poppins">
                I have read and agree to the{" "}
                <a href="#" className="text-[#373473] font-normal">
                  terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#373473] font-normal">
                  conditions
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#050150] hover:bg-indigo-900 text-white py-3 rounded-lg font-semibold mt-2 transition cursor-pointer"
            >
              Sign up
            </button>
          </form>

          <p className="text-center text-gray-500 mt-4">
            Already have an account?{" "}
            <a href="#" className="text-[#050150] font-semibold">
              Login
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Artisansignup;
