import { motion } from "framer-motion";

const Socials = [
  { link: "#linkedin", name: "LinkedIn" },
  { link: "#instagram", name: "Instagram" },
  { link: "#twitter", name: "X" },
];

const legals = [
  { link: "#", name: "Privacy Policy" },
  { link: "#", name: "Terms of Service" },
  { link: "#", name: "Cookie Policy" },
];

const registers = [
  { link: "/signup", name: "Sign Up" },
  { link: "/login", name: "Login" },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const Footer = () => {
  return (
    <motion.div
      className="relative w-full overflow-hidden border-t border-neutral-100 bg-white px-8 py-20 dark:border-white/[0.1] dark:bg-neutral-950"
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true }}
    >
      <motion.div
        className="mx-auto mb-10 flex max-w-7xl flex-col items-start justify-between text-sm text-neutral-300 md:flex-row md:px-8"
        variants={fadeInUp}
      >
        <motion.div className="space-y-2" variants={fadeInUp}>
          <a
            href="#"
            className="text-lg font-semibold tracking-wider text-neutral-600 dark:text-neutral-300"
          >
            🌑 Inklr
          </a>
          <div className="text-sm text-neutral-500">
            © copyright Startup 2025. All rights reserved.
          </div>
        </motion.div>
        <div className="mt-10 grid grid-cols-2 items-start justify-center gap-10 md:mt-0 lg:grid-cols-4">
          {[
            { title: "Socials", items: Socials },
            { title: "Legal", items: legals },
            { title: "Register", items: registers },
          ].map((section, idx) => (
            <motion.div
              key={idx}
              className="flex w-full flex-col justify-center space-y-4"
              variants={fadeInUp}
            >
              <p className="font-bold text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 hover:dark:text-neutral-100">
                {section.title}
              </p>
              <ul className="space-y-2">
                {section.items.map((item, index) => (
                  <li key={index}>
                    <a
                      className="transition-colors hover:text-neutral-800 dark:hover:text-neutral-100"
                      href={item.link}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.h1
        className="inset-x-0 mt-5 bg-gradient-to-b from-neutral-50 to-neutral-200 bg-clip-text text-center text-xl font-bold text-transparent uppercase md:text-[8rem] lg:text-[18rem] dark:from-neutral-950 dark:to-neutral-800"
        initial={{
          opacity: 0,
          y: 50,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
          delay: 0.3,
        }}
        viewport={{ once: true }}
      >
        🌑 Inklr
      </motion.h1>
    </motion.div>
  );
};

export default Footer;
