export default function PrivacyPolicy() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-900 dark:from-dawn dark:to-location2-bright">
        Privacy Policy
      </h1>

      <div className="space-y-6 text-gray-800 dark:text-gray-200">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Introduction</h2>
          <p>
            This Privacy Policy explains how TimeZone Overlap (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and protects your information when you visit our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Information We Collect</h2>
          <p className="mb-4">We collect minimal information necessary for the functionality of our service:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Time zone settings (only when you select them)</li>
            <li>Basic usage analytics (through Google Analytics)</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Note: We do not collect or store any personal information such as IP addresses, names, or contact details.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Cookies and Advertising</h2>
          <p>
            We use Google AdSense to display advertisements. Google AdSense may use cookies to serve ads. You can opt out of personalized advertising by visiting{' '}
            <a href="https://www.google.com/settings/ads" className="text-location1 hover:underline dark:text-dawn" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide timezone comparison functionality</li>
            <li>To improve our service based on anonymous usage patterns</li>
            <li>To display relevant advertising through Google AdSense</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Third-Party Services</h2>
          <p>
            We use the following third-party services:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Google AdSense for advertising</li>
            <li>Google Analytics for anonymous usage statistics</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            These services may collect additional information as outlined in their respective privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use our service without providing personal information</li>
            <li>Opt out of cookies through your browser settings</li>
            <li>Opt out of Google Analytics tracking</li>
            <li>Opt out of personalized advertising</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mt-2">
            Email: privacy@timezone-overlap.com
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
          <p className="mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </section>
      </div>
    </main>
  );
} 