import { useRef, useState } from "react";
import VerifyLogo from "../assets/verifyfixionlogo.png";

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

const uploadPicSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="101"
    height="100"
    viewBox="0 0 101 100"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M85.917 42.4582H73.8753C64.0003 42.4582 55.9587 34.4166 55.9587 24.5416V12.4999C55.9587 10.2083 54.0837 8.33325 51.792 8.33325H34.1253C21.292 8.33325 10.917 16.6666 10.917 31.5416V68.4583C10.917 83.3333 21.292 91.6666 34.1253 91.6666H66.8753C79.7087 91.6666 90.0837 83.3333 90.0837 68.4583V46.6249C90.0837 44.3332 88.2087 42.4582 85.917 42.4582Z"
      fill="#050150"
    />
    <path
      d="M66.3337 9.20839C64.6253 7.50005 61.667 8.66672 61.667 11.0417V25.5834C61.667 31.6667 66.8337 36.7084 73.1253 36.7084C77.0837 36.7501 82.5837 36.75 87.292 36.75C89.667 36.75 90.917 33.9584 89.2503 32.2917C83.2503 26.2501 72.5003 15.3751 66.3337 9.20839Z"
      fill="#050150"
    />
    <path
      d="M48.5413 51.9583L40.208 43.6249C40.1663 43.5833 40.1247 43.5833 40.1247 43.5416C39.8747 43.2916 39.5413 43.0833 39.208 42.9166C39.1663 42.9166 39.1663 42.9166 39.1247 42.9166C38.7913 42.7916 38.458 42.7499 38.1247 42.7083C37.9997 42.7083 37.9163 42.7083 37.7913 42.7083C37.5413 42.7083 37.2497 42.7916 36.9997 42.8749C36.8747 42.9166 36.7913 42.9583 36.708 42.9999C36.3747 43.1666 36.0413 43.3333 35.7913 43.6249L27.458 51.9583C26.2497 53.1666 26.2497 55.1666 27.458 56.3749C28.6663 57.5833 30.6663 57.5833 31.8747 56.3749L34.8747 53.3749V70.8333C34.8747 72.5416 36.2913 73.9583 37.9997 73.9583C39.708 73.9583 41.1247 72.5416 41.1247 70.8333V53.3749L44.1247 56.3749C44.7497 56.9999 45.5413 57.2916 46.333 57.2916C47.1247 57.2916 47.9163 56.9999 48.5413 56.3749C49.7497 55.1666 49.7497 53.1666 48.5413 51.9583Z"
      fill="#050150"
    />
  </svg>
);

const supportedFileSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M10.0003 18.3334C14.5837 18.3334 18.3337 14.5834 18.3337 10.0001C18.3337 5.41675 14.5837 1.66675 10.0003 1.66675C5.41699 1.66675 1.66699 5.41675 1.66699 10.0001C1.66699 14.5834 5.41699 18.3334 10.0003 18.3334Z"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 6.66675V10.8334"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.99512 13.3333H10.0026"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function UploadIdentity() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="flex items-center justify-center p-0 m-0 min-h-screen w-full bg-white font-poppins">
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

        {/* Main Content */}
        <div className="flex flex-col items-center flex-1 justify-center max-w-md mx-auto w-full">
          <h1 className="text-[40px] leading-[52px] text-[#1A1A1A] font-bold text-center mb-5 mt-15">
            Verify Your Identity
          </h1>
          <p className="text-[13px] leading-[30px] text-black font-semibold text-center mb-8">
            Please upload a clear photo of your valid National ID Card
          </p>

          {/* Upload Box */}
          <div
            onClick={handleFileClick}
            className="w-full max-w-[350px] min-h-[139px] border-4 border-[#050150] rounded-[24px] border-dotted p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 transition"
          >
            <div className="bg-transparent p-4 mb-2">
              <button className="cursor-pointer" aria-label="Upload Pic">{uploadPicSVG}</button>
            </div>
            <p className="text-sm">
              {fileName ? (
                <span className="font-medium">{fileName}</span>
              ) : (
                <>
                  Drop your file here,{" "}
                  <span className="text-green-600">or click to browse</span>
                </>
              )}
            </p>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={handleFileChange}
            />
          </div>

          {/* File Info */}
          <div className="flex justify-between items-center w-full max-w-[350px]">
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Supported files"
                className="flex w-[15px] h-[15px] justify-center items-center bg-transparent border-none p-0 m-0"
              >
                {supportedFileSVG}
              </button>
              <p className="text-black text-[10px] font-normal leading-[20px]">
                Supported files: png, jpeg, and pdf.
              </p>
            </div>
            <p className="text-black text-[10px] font-normal leading-[20px]">
              Maximum Size: 10MB
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="rounded-[16px] border-[1.5px] border-[#050150] w-[200px] h-[40px] flex justify-center items-center gap-[10px] text-[10px] bg-transparent hover:bg-gray-100 transition cursor-pointer">
              Cancel
            </button>
            <button className="w-[60px] h-[40px] flex justify-center items-center gap-[10px] bg-[#050150] rounded-[16px] text-[10px] text-white hover:bg-indigo-800 transition cursor-pointer">
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadIdentity;
