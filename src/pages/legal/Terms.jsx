import { Link } from "react-router-dom";

const Terms = () => {
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
            / Terms of Service
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-black mb-3">
            Terms of Service
          </h1>
          <p className="text-gray-600">Last updated: {lastUpdated}</p>
        </div>

        {/* Intro */}
        <div className="mt-8 lg:mt-10 space-y-6 text-gray-700 leading-relaxed">
          <p>
            These Terms of Service ("Terms") govern your access to and use of
            the Bulk Whatsapp website and services (the "Service") provided by
            MTS Services ("we", "our", or "us"). By accessing or using the
            Service, you agree to be bound by these Terms.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900">
              Please read these Terms carefully before using the Service. If you
              do not agree to these Terms, you may not access or use the
              Service.
            </p>
          </div>

          {/* Table of contents */}
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              On this page
            </p>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm text-[#3574ED]">
              <li>
                <a
                  href="#acceptance"
                  className="hover:underline cursor-pointer"
                >
                  Acceptance of terms
                </a>
              </li>
              <li>
                <a
                  href="#service-description"
                  className="hover:underline cursor-pointer"
                >
                  Service description
                </a>
              </li>
              <li>
                <a href="#account" className="hover:underline cursor-pointer">
                  Account registration
                </a>
              </li>
              <li>
                <a
                  href="#acceptable-use"
                  className="hover:underline cursor-pointer"
                >
                  Acceptable use policy
                </a>
              </li>
              <li>
                <a
                  href="#prohibited"
                  className="hover:underline cursor-pointer"
                >
                  Prohibited activities
                </a>
              </li>
              <li>
                <a href="#payment" className="hover:underline cursor-pointer">
                  Payment & billing
                </a>
              </li>
              <li>
                <a
                  href="#intellectual-property"
                  className="hover:underline cursor-pointer"
                >
                  Intellectual property
                </a>
              </li>
              <li>
                <a
                  href="#termination"
                  className="hover:underline cursor-pointer"
                >
                  Termination
                </a>
              </li>
              <li>
                <a
                  href="#disclaimers"
                  className="hover:underline cursor-pointer"
                >
                  Disclaimers
                </a>
              </li>
              <li>
                <a
                  href="#limitation"
                  className="hover:underline cursor-pointer"
                >
                  Limitation of liability
                </a>
              </li>
              <li>
                <a
                  href="#indemnification"
                  className="hover:underline cursor-pointer"
                >
                  Indemnification
                </a>
              </li>
              <li>
                <a href="#changes" className="hover:underline cursor-pointer">
                  Changes to terms
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:underline cursor-pointer">
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          {/* Acceptance of terms */}
          <div id="acceptance" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Acceptance of terms
            </h2>
            <p>
              By creating an account, accessing, or using the Service, you
              acknowledge that you have read, understood, and agree to be bound
              by these Terms and our{" "}
              <Link
                to="/privacy-policy"
                className="text-[#3574ED] hover:underline"
              >
                Privacy Policy
              </Link>
              . If you are using the Service on behalf of an organization, you
              represent that you have the authority to bind that organization to
              these Terms.
            </p>
          </div>

          {/* Service description */}
          <div id="service-description" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Service description
            </h2>
            <p>
              Bulk Whatsapp is an enterprise WhatsApp Business API platform that
              enables you to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Send bulk WhatsApp messages to customers</li>
              <li>Create and manage marketing campaigns</li>
              <li>Track message delivery and analytics</li>
              <li>Integrate with WhatsApp Business APIs</li>
              <li>Access advanced messaging features and reporting tools</li>
            </ul>
            <p>
              We reserve the right to modify, suspend, or discontinue any part
              of the Service at any time with or without notice.
            </p>
          </div>

          {/* Account registration */}
          <div id="account" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Account registration
            </h2>
            <p>
              <span className="font-medium text-gray-900">Eligibility:</span>{" "}
              You must be at least 18 years old to use the Service.
            </p>
            <p>
              <span className="font-medium text-gray-900">
                Account information:
              </span>{" "}
              You agree to provide accurate, current, and complete information
              during registration and to update it as necessary.
            </p>
            <p>
              <span className="font-medium text-gray-900">
                Account security:
              </span>{" "}
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account. You must notify us immediately of any unauthorized access
              or security breach.
            </p>
            <p>
              <span className="font-medium text-gray-900">
                One account per user:
              </span>{" "}
              You may not create multiple accounts or share your account with
              others.
            </p>
          </div>

          {/* Acceptable use policy */}
          <div id="acceptable-use" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Acceptable use policy
            </h2>
            <p>
              You agree to use the Service only for lawful purposes and in
              accordance with these Terms. You agree to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Comply with all applicable laws, regulations, and WhatsApp's
                terms of service
              </li>
              <li>
                Obtain proper consent from recipients before sending messages
              </li>
              <li>Respect recipient opt-out requests and preferences</li>
              <li>Send only relevant, non-spam content to your contacts</li>
              <li>Maintain accurate contact lists and respect privacy</li>
            </ul>
          </div>

          {/* Prohibited activities */}
          <div id="prohibited" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Prohibited activities
            </h2>
            <p>You may not use the Service to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Send spam, unsolicited messages, or bulk messages without proper
                consent
              </li>
              <li>Distribute malware, viruses, or harmful code</li>
              <li>Engage in fraudulent, deceptive, or illegal activities</li>
              <li>Harass, threaten, or abuse others</li>
              <li>Violate intellectual property rights</li>
              <li>Impersonate any person or entity</li>
              <li>Collect or harvest user data without authorization</li>
              <li>
                Circumvent or interfere with security features of the Service
              </li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>
                Use automated systems (bots) to access the Service without
                permission
              </li>
            </ul>
            <p className="text-sm bg-red-50 border border-red-200 rounded p-3 mt-3">
              <span className="font-medium text-gray-900">Warning:</span>{" "}
              Violation of these prohibitions may result in immediate account
              suspension or termination and may expose you to legal liability.
            </p>
          </div>

          {/* Payment & billing */}
          <div id="payment" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Payment & billing
            </h2>
            <p>
              <span className="font-medium text-gray-900">Pricing:</span>{" "}
              Current pricing for our services is available on our pricing page.
              We reserve the right to change our fees at any time with
              reasonable notice.
            </p>
            <p>
              <span className="font-medium text-gray-900">Payment terms:</span>{" "}
              You agree to pay all fees associated with your use of the Service.
              Payments are processed through secure third-party payment
              processors.
            </p>
            <p>
              <span className="font-medium text-gray-900">
                Subscription billing:
              </span>{" "}
              If you subscribe to a paid plan, you authorize us to charge your
              payment method on a recurring basis until you cancel.
            </p>
            <p>
              <span className="font-medium text-gray-900">Refunds:</span>{" "}
              Refunds are handled on a case-by-case basis in accordance with our
              refund policy. Please contact support for refund requests.
            </p>
            <p>
              <span className="font-medium text-gray-900">Taxes:</span> You are
              responsible for any applicable taxes related to your use of the
              Service.
            </p>
          </div>

          {/* Intellectual property */}
          <div id="intellectual-property" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Intellectual property
            </h2>
            <p>
              <span className="font-medium text-gray-900">Our content:</span>{" "}
              The Service, including all content, features, and functionality,
              is owned by MTS Services and is protected by copyright, trademark,
              and other intellectual property laws.
            </p>
            <p>
              <span className="font-medium text-gray-900">Your content:</span>{" "}
              You retain ownership of content you create and upload to the
              Service (campaigns, templates, contacts). By using the Service,
              you grant us a limited license to use, store, and process your
              content solely to provide the Service.
            </p>
            <p>
              <span className="font-medium text-gray-900">Feedback:</span> If
              you provide feedback or suggestions about the Service, we may use
              them without any obligation to you.
            </p>
          </div>

          {/* Termination */}
          <div id="termination" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Termination
            </h2>
            <p>
              <span className="font-medium text-gray-900">By you:</span> You may
              terminate your account at any time through your account settings
              or by contacting support.
            </p>
            <p>
              <span className="font-medium text-gray-900">By us:</span> We
              reserve the right to suspend or terminate your account at any
              time, with or without notice, if you violate these Terms or engage
              in conduct that we deem harmful to the Service or other users.
            </p>
            <p>
              <span className="font-medium text-gray-900">
                Effect of termination:
              </span>{" "}
              Upon termination, your right to use the Service will immediately
              cease. We may delete your account data in accordance with our data
              retention policy.
            </p>
          </div>

          {/* Disclaimers */}
          <div id="disclaimers" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Disclaimers
            </h2>
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <p className="font-medium text-gray-900 mb-2">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND.
              </p>
              <p className="text-sm">
                We do not warrant that the Service will be uninterrupted,
                error-free, or secure. We disclaim all warranties, express or
                implied, including merchantability, fitness for a particular
                purpose, and non-infringement.
              </p>
            </div>
            <p>
              We are not responsible for message delivery failures, third-party
              service disruptions (including WhatsApp), or any damages resulting
              from your use of the Service.
            </p>
          </div>

          {/* Limitation of liability */}
          <div id="limitation" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Limitation of liability
            </h2>
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <p className="text-sm">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, MTS SERVICES SHALL NOT
                BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR
                USE, ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICE.
              </p>
              <p className="text-sm mt-2">
                OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN
                THE 12 MONTHS PRECEDING THE CLAIM.
              </p>
            </div>
          </div>

          {/* Indemnification */}
          <div id="indemnification" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Indemnification
            </h2>
            <p>
              You agree to indemnify, defend, and hold harmless MTS Services and
              its officers, directors, employees, and agents from any claims,
              liabilities, damages, losses, or expenses (including reasonable
              attorney fees) arising out of or related to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>
                Your violation of any third-party rights, including WhatsApp's
                terms
              </li>
              <li>Content you submit or transmit through the Service</li>
            </ul>
          </div>

          {/* Governing law */}
          <div className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Governing law & disputes
            </h2>
            <p>
              These Terms are governed by and construed in accordance with the
              laws of the jurisdiction in which MTS Services operates, without
              regard to conflict of law principles.
            </p>
            <p>
              Any disputes arising from these Terms or the Service shall be
              resolved through binding arbitration or in the courts located in
              our jurisdiction, and you consent to the personal jurisdiction of
              such courts.
            </p>
          </div>

          {/* Changes to terms */}
          <div id="changes" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Changes to these Terms
            </h2>
            <p>
              We may update these Terms from time to time. If we make material
              changes, we will notify you by email or through the Service before
              the changes take effect. Your continued use of the Service after
              the changes take effect constitutes your acceptance of the revised
              Terms.
            </p>
          </div>

          {/* Miscellaneous */}
          <div className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Miscellaneous
            </h2>
            <p>
              <span className="font-medium text-gray-900">
                Entire agreement:
              </span>{" "}
              These Terms constitute the entire agreement between you and MTS
              Services regarding the Service.
            </p>
            <p>
              <span className="font-medium text-gray-900">Severability:</span>{" "}
              If any provision of these Terms is found to be unenforceable, the
              remaining provisions will remain in full effect.
            </p>
            <p>
              <span className="font-medium text-gray-900">Waiver:</span> Our
              failure to enforce any provision of these Terms does not
              constitute a waiver of that provision.
            </p>
            <p>
              <span className="font-medium text-gray-900">Assignment:</span> You
              may not assign these Terms without our prior written consent. We
              may assign these Terms at any time.
            </p>
          </div>

          {/* Contact */}
          <div id="contact" className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-black">
              Contact us
            </h2>
            <p>
              If you have questions about these Terms of Service, please contact
              us at
              <a
                href="mailto:legal@mtscorporate.com"
                className="text-[#3574ED] hover:underline"
              >
                {" "}
                legal@mtscorporate.com
              </a>
              .
            </p>
           
          </div>
        </div>
      </div>
    </section>
  );
};

export default Terms;
