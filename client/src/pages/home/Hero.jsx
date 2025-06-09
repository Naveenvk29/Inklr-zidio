import { useSelector } from "react-redux";

const Hero = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-4xl font-bold">
          🌑 Inklr –{" "}
          <span className="text-indigo-600">Where Words Make a Mark</span>
        </h1>
        <p className="mb-6 text-lg text-gray-700">
          Exploring ideas that matter through sharp insight and engaging stories
          — all crafted with ink that speaks.
        </p>

        {!userInfo && (
          <div className="rounded-lg bg-gray-100 p-6 shadow-md">
            <h2 className="mb-2 text-2xl font-semibold">
              Ready to share your ideas with the world?
            </h2>
            <p className="mb-4 text-gray-600">
              Join Inklr and start writing today.
            </p>
            <button className="rounded bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700">
              Get Started
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
