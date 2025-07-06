import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Hero = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="h-[40vh] bg-gradient-to-r px-6 py-12 text-center">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-950 md:text-5xl dark:text-neutral-100">
          🌑 Inklr –{" "}
          <span className="text-indigo-600">Where Words Make a Mark</span>
        </h1>
        <p className="mb-6 text-lg text-neutral-500">
          Exploring ideas that matter through sharp insight and engaging stories
          — all crafted with ink that speaks.
        </p>

        {!userInfo && (
          <div className="rounded-lg p-6">
            <h2 className="mb-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-200">
              Ready to share your ideas with the world?
            </h2>
            <p className="mb-4 text-neutral-600">
              Join Inklr and start writing today.
            </p>
            <button className="rounded bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700">
              Get Started
            </button>
            <Link
              to="/explore"
              className="mt-4 ml-4 inline-block text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Explore Blogs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
