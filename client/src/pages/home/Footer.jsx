import React from "react";

const Footer = () => {
  return (
    <footer className="mt-10 border-t-2 bg-white py-10 dark:bg-neutral-950">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-4 sm:px-6 md:flex-row lg:px-8">
        <div>
          <h4 className="mb-2 text-2xl font-bold text-neutral-950 dark:text-neutral-200">
            🌑 Inklr{" "}
          </h4>
          <p className="text-sm text-gray-400">Where Words Make a Mark</p>
        </div>

        <div>
          <h5 className="mb-3 text-lg font-semibold text-neutral-950 dark:text-neutral-200">
            Quick Links
          </h5>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a href="/blogs" className="hover:text-white">
                Blogs
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="mb-3 text-lg font-semibold text-neutral-950 dark:text-neutral-200">
            Follow Us
          </h5>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                X
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Git
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Inklr. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
