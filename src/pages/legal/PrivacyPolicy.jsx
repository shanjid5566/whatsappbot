import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
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
            / Privacy Policy
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-black mb-3">
            Privacy Policy
          </h1>
          <p className="text-gray-600">Last updated: {lastUpdated}</p>
        </div>

        {/* Intro */}
        <div className="mt-8 lg:mt-10 space-y-6 text-gray-700 leading-relaxed">
          <p>
            This Privacy Policy explains how MTS Services ("we", "our", or "us")
            collects, uses, and protects your information when you use the Bulk
            Whatsapp website and services (the "Service"). By using the Service,
            you agree to the practices described here.
          </p>

          {/* Table of contents */}
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              On this page
            </p>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm text-[#3574ED]">
              <li>
                <a href="#info-we-collect" className="hover:underline">
                  Information we collect
                </a>
              </li>
              <li>
                <a href="#how-we-use" className="hover:underline">
                  How we use information
                </a>
              </li>
              <li>
                <a href="#cookies" className="hover:underline">
                  Cookies & local storage
                </a>
              </li>
              <li>
                <a href="#sharing" className="hover:underline">
                  How we share information
                </a>
              </li>
              <li>
                <a href="#retention" className="hover:underline">
                  Data retention
                </a>
              </li>
              <li>
                <a href="#security" className="hover:underline">
                  Security
                </a>
              </li>
              <li>
                <a href="#rights" className="hover:underline">
                  Your rights
                </a>
              </li>
              <li>
                <a href="#children" className="hover:underline">
                  Childrens privacy
                </a>
              </li>
              <li>
                <a href="#transfers" className="hover:underline">
                  International transfers
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:underline">
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          {/* Information we collect */}
          <div id="info-we-collect" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Information we collect
            </h2>
            <p>
              We collect information that you provide directly to us and
              information collected automatically when you use the Service.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium text-gray-900">
                  Account information
                </span>
                : name, email, and password that you supply during registration.
              </li>
              <li>
                <span className="font-medium text-gray-900">
                  Authentication data
                </span>
                : we use short-lived access tokens and refresh tokens. As
                implemented in the app, tokens may be stored in cookies for up
                to 7 days and user session data in localStorage.
              </li>
              <li>
                <span className="font-medium text-gray-900">
                  Usage and device data
                </span>
                : interactions with pages and components, approximate device and
                browser information, and diagnostics for performance and
                security.
              </li>
              <li>
                <span className="font-medium text-gray-900">
                  Content you create
                </span>
                : campaign settings, message templates, and other content you
                choose to upload to the Service.
              </li>
              <li>
                <span className="font-medium text-gray-900">
                  Customer feedback
                </span>
                : reviews, ratings, and communications you submit.
              </li>
            </ul>
          </div>

          {/* How we use information */}
          <div id="how-we-use" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              How we use information
            </h2>
            <p>
              We use your information to operate, improve, and protect the
              Service:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Authenticate you and maintain sessions across pages (using
                cookies with{" "}
                <span className="whitespace-nowrap">withCredentials</span> where
                required).
              </li>
              <li>
                Provide product functionality such as campaign management,
                analytics, and delivery reporting.
              </li>
              <li>
                Communicate with you about your account, security alerts, and
                service updates.
              </li>
              <li>
                Monitor and protect the Service against abuse, fraud, and
                security risks.
              </li>
              <li>Analyze usage to improve performance and user experience.</li>
            </ul>
          </div>

          {/* Cookies & local storage */}
          <div id="cookies" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Cookies & local storage
            </h2>
            <p>
              We use cookies and local storage to keep you signed in and to
              improve the Service. Access and refresh tokens may be set as
              cookies (with a typical 7day lifetime). Session details like basic
              user profile and role may be stored in localStorage on your
              device. You can clear these via your browser settings.
            </p>
            <p>
              Some requests are made with credentials to our API to support
              secure sessions. If you block cookies, certain features may not
              work properly.
            </p>
          </div>

          {/* Sharing */}
          <div id="sharing" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              How we share information
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                With service providers that help us operate the Service
                (hosting, security, analytics, customer support).
              </li>
              <li>
                When required by law, to comply with legal process or protect
                rights, property, or safety.
              </li>
              <li>
                In connection with a business transaction such as a merger or
                acquisition, subject to confidentiality.
              </li>
            </ul>
            <p>
              If your usage involves messaging platforms (e.g., WhatsApp
              Business APIs), message metadata and content necessary for
              delivery may be processed by those platforms in accordance with
              their policies.
            </p>
          </div>

          {/* Retention */}
          <div id="retention" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Data retention
            </h2>
            <p>
              We retain personal information for as long as needed to provide
              the Service, comply with legal obligations, resolve disputes, and
              enforce agreements. Access/refresh tokens in cookies are
              shortlived (typically up to 7 days), while some settings kept in
              localStorage remain until you clear them or your account is
              removed.
            </p>
          </div>

          {/* Security */}
          <div id="security" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Security
            </h2>
            <p>
              We implement administrative, technical, and physical safeguards
              designed to protect your information. No method of transmission or
              storage is 100% secure, but we work continuously to improve our
              protections.
            </p>
          </div>

          {/* Rights */}
          <div id="rights" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Your rights
            </h2>
            <p>
              Depending on your jurisdiction, you may have rights to access,
              correct, delete, or export your personal information, and to
              object to or restrict certain processing. To exercise these
              rights, contact us using the details below.
            </p>
          </div>

          {/* Children */}
          <div id="children" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Childrens privacy
            </h2>
            <p>
              The Service is not intended for children under the age of 13 (or
              16 where applicable). We do not knowingly collect personal
              information from children. If you believe a child has provided
              personal information, please contact us so we can delete it.
            </p>
          </div>

          {/* Transfers */}
          <div id="transfers" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              International data transfers
            </h2>
            <p>
              Your information may be processed in countries other than your
              own. Where required, we use appropriate safeguards to protect your
              information when it is transferred internationally.
            </p>
          </div>

          {/* Changes to this policy */}
          <div className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Changes to this policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will post
              the updated policy and revise the "Last updated" date at the top
              of this page. Significant changes may also be communicated through
              the Service.
            </p>
          </div>

          {/* Contact */}
          <div id="contact" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Contact us
            </h2>
            <p>
              If you have questions about this Privacy Policy or your personal
              information, contact us at
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

export default PrivacyPolicy;
