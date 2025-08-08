import { IoMdCloseCircleOutline } from "../utils/icons";

export default function EmailSentModal({
  setIsModalOpen,
}: {
  setIsModalOpen: (value: boolean) => void;
}) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="relative flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg w-1/2 max-sm:w-[90%] py-16"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="absolute top-2 right-2 flex items-center cursor-pointer bg-gray-500 hover:bg-gray-300 transition-colors rounded-full p-1"
          onClick={() => setIsModalOpen(false)}
        >
          <IoMdCloseCircleOutline className="w-5 h-5" />
        </span>
        <div className="flex flex-col items-center space-y-4 text-center">
          <img
            src="/envelope.svg"
            alt="Envelope Icon"
            width={193}
            height={193}
          />
          <h2 className="text-2xl font-bold">Email Confirmation</h2>
          <p className="text-gray-600">
            We’ve sent a reset link to your inbox (expires in 10mins). Tap it to
            reset your password.
          </p>
        </div>
      </div>
    </div>
  );
}
