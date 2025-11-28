import { Link } from "react-router-dom";

const CookiePolicy = () => {
  const lastUpdated = "October 29, 2025";

  return (
    <section className="bg-white">
      <div className="container paddingContainer py-10 lg:py-16">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-sm text-gray-500 mb-2">
            <Link to="/" className="text-[#3574ED] hover:underline">
              Home
            </Link>{" "}
            / Cookie Policy
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-black mb-3">
            Cookie Policy
          </h1>
          <p className="text-gray-600">Last updated: {lastUpdated}</p>
        </div>

        {/* Intro */}
        <div className="mt-8 lg:mt-10 space-y-6 text-gray-700 leading-relaxed">
          <p>
            This Cookie Policy explains how MTS Services ("we", "our", or "us")
            uses cookies and similar technologies on the Bulk Whatsapp website
            (the "Service"). By using the Service, you consent to the use of
            cookies as described in this policy.
          </p>

          {/* Table of contents */}
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              On this page
            </p>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm text-[#3574ED]">
              <li>
                <a href="#what-are-cookies" className="hover:underline">
                  What are cookies
                </a>
              </li>
              <li>
                <a href="#how-we-use" className="hover:underline">
                  How we use cookies
                </a>
              </li>
              <li>
                <a href="#types-of-cookies" className="hover:underline">
                  Types of cookies we use
                </a>
              </li>
              <li>
                <a href="#third-party" className="hover:underline">
                  Third-party cookies
                </a>
              </li>
              <li>
                <a href="#your-choices" className="hover:underline">
                  Your choices
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:underline">
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          {/* What are cookies */}
          <div id="what-are-cookies" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              What are cookies
            </h2>
            <p>
              Cookies are small text files that are placed on your device when
              you visit a website. They help websites remember your preferences,
              keep you signed in, and provide insights into how the site is
              used.
            </p>
            <p>
              We also use localStorage, which is similar to cookies but stores
              data directly in your browser rather than sending it to the server
              with each request.
            </p>
          </div>

          {/* How we use cookies */}
          <div id="how-we-use" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              How we use cookies
            </h2>
            <p>
              We use cookies and similar technologies for the following
              purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium text-gray-900">
                  Authentication
                </span>
                : To keep you logged in and maintain your session across pages.
              </li>
              <li>
                <span className="font-medium text-gray-900">Security</span>: To
                protect your account and detect suspicious activity.
              </li>
              <li>
                <span className="font-medium text-gray-900">Preferences</span>:
                To remember your settings and choices.
              </li>
              <li>
                <span className="font-medium text-gray-900">Analytics</span>: To
                understand how you use the Service and improve performance.
              </li>
            </ul>
          </div>

          {/* Types of cookies */}
          <div id="types-of-cookies" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Types of cookies we use
            </h2>

            {/* Essential Cookies */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h3 className="text-lg font-semibold text-black">
                Essential Cookies
              </h3>
              <p className="text-sm">
                These cookies are necessary for the Service to function
                properly. You cannot opt out of these cookies.
              </p>
              <div className="mt-3 space-y-3">
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="font-medium text-gray-900 text-sm">
                    accessToken
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Short-lived authentication token (up to 7 days)
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Purpose: Authenticates API requests
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="font-medium text-gray-900 text-sm">
                    refreshToken
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Token for refreshing expired access tokens (up to 7 days)
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Purpose: Maintains session without re-login
                  </p>
                </div>
              </div>
            </div>

            {/* LocalStorage Data */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h3 className="text-lg font-semibold text-black">
                LocalStorage Data
              </h3>
              <p className="text-sm">
                The Service stores the following data in your browser's
                localStorage:
              </p>
              <div className="mt-3 space-y-3">
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="font-medium text-gray-900 text-sm">
                    rba_current_user
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Stores user session details (name, email, role,
                    authentication status)
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Purpose: Maintains user session across page loads
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Cookies */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h3 className="text-lg font-semibold text-black">
                Performance & Analytics Cookies
              </h3>
              <p className="text-sm">
                These cookies help us understand how visitors interact with the
                Service by collecting anonymous information about page visits,
                errors, and performance metrics.
              </p>
            </div>
          </div>

          {/* Third-party cookies */}
          <div id="third-party" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Third-party cookies
            </h2>
            <p>
              Some features of the Service may use third-party services that set
              their own cookies. These may include:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Analytics providers to help us understand how you use the
                Service
              </li>
              <li>
                Content delivery networks to improve page load performance
              </li>
              <li>WhatsApp Business API services for message delivery</li>
            </ul>
            <p>
              We do not control these third-party cookies. Please review their
              privacy policies for more information.
            </p>
          </div>

          {/* Your choices */}
          <div id="your-choices" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Your choices
            </h2>
            <p className="font-medium text-gray-900">Browser Settings</p>
            <p>
              Most browsers allow you to control cookies through their settings.
              You can set your browser to reject cookies or delete existing
              cookies. However, if you block or delete essential cookies, some
              features of the Service may not work properly, and you may not be
              able to log in.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm font-medium text-gray-900 mb-2">
                How to manage cookies in popular browsers:
              </p>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>
                  • <span className="font-medium">Chrome</span>: Settings →
                  Privacy and security → Cookies and other site data
                </li>
                <li>
                  • <span className="font-medium">Firefox</span>: Settings →
                  Privacy & Security → Cookies and Site Data
                </li>
                <li>
                  • <span className="font-medium">Safari</span>: Preferences →
                  Privacy → Manage Website Data
                </li>
                <li>
                  • <span className="font-medium">Edge</span>: Settings →
                  Cookies and site permissions → Manage and delete cookies
                </li>
              </ul>
            </div>

            <p className="font-medium text-gray-900 mt-4">LocalStorage</p>
            <p>
              To clear localStorage data, you can use your browser's developer
              tools or clear your browsing data. Note that clearing localStorage
              will log you out of the Service.
            </p>
          </div>

          {/* Changes to this policy */}
          <div className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Changes to this Cookie Policy
            </h2>
            <p>
              We may update this Cookie Policy from time to time. We will notify
              you of any changes by posting the new Cookie Policy on this page
              and updating the "Last updated" date.
            </p>
          </div>

          {/* Contact */}
          <div id="contact" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Contact us
            </h2>
            <p>
              If you have questions about this Cookie Policy or how we use
              cookies, contact us at
              <a
                href="mailto:privacy@mtscorporate.com"
                className="text-[#3574ED] hover:underline"
              >
                {" "}
                privacy@mtscorporate.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CookiePolicy;
