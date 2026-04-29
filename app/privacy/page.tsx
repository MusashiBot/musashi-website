import type { Metadata } from 'next'
import Header from '../components/Header'
import SiteFooter from '../components/SiteFooter'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Musashi — the AI intelligence service for prediction market trading bots.',
  openGraph: {
    title: 'Privacy Policy | MUSASHI',
    url: 'https://musashi.bot/privacy',
  },
}

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col w-full bg-[var(--bg-primary)] min-h-screen">
      <Header />

      {/* Main Content */}
      <main className="flex flex-col items-center w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-[80px] lg:py-[60px]">
        <div className="w-full max-w-[900px]">
          {/* Title */}
          <div className="border-l-4 border-[var(--text-primary)] pl-4 mb-8">
            <h1 className="font-jetbrains text-[var(--text-primary)] text-[48px] font-bold tracking-[-1px]">
              Privacy Policy
            </h1>
          </div>

          <p className="font-jetbrains text-[var(--text-tertiary)] text-sm mb-10">
            Effective Date: February 25, 2026
          </p>

          {/* Summary Box */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--text-primary)] border-l-4 p-6 mb-12">
            <h3 className="font-jetbrains text-[var(--text-primary)] text-lg font-bold mb-4">
              Privacy Summary
            </h3>
            <ul className="font-jetbrains text-[var(--text-secondary)] text-sm space-y-2 pl-5 list-disc">
              <li>We do not collect or store personal data</li>
              <li>No user accounts, tracking, or analytics within the Extension</li>
              <li>This website (musashi.bot) uses Vercel Analytics for anonymous, aggregate page-view measurement</li>
              <li>All data processing occurs locally in your browser</li>
              <li>Data is transmitted to third-party services only when you explicitly request sentiment analysis</li>
              <li>This service is provided free of charge with no advertising or data monetization</li>
            </ul>
          </div>

          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="font-jetbrains text-[var(--text-primary)] text-[28px] font-bold uppercase tracking-[2px] mb-5">
              1. Introduction
            </h2>
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8] mb-4">
              This Privacy Policy describes how Musashi (&quot;we&quot;, &quot;our&quot;, or &quot;the Extension&quot;) handles information when you use our Chrome browser extension. Musashi provides AI-powered sentiment analysis and prediction market signals on the Twitter/X platform. By using the Extension, you agree to the data practices described in this policy.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="font-jetbrains text-[var(--text-primary)] text-[28px] font-bold uppercase tracking-[2px] mb-5">
              2. Information Collection and Use
            </h2>

            <h3 className="font-jetbrains text-[var(--text-primary)] text-lg font-semibold mb-3">
              2.1 Information Collected by the Extension
            </h3>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-6 mb-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-primary)]">
                    <th className="font-jetbrains text-[var(--text-primary)] text-xs font-bold text-left pb-3 pr-4">Data Type</th>
                    <th className="font-jetbrains text-[var(--text-primary)] text-xs font-bold text-left pb-3 pr-4">Purpose</th>
                    <th className="font-jetbrains text-[var(--text-primary)] text-xs font-bold text-left pb-3">Storage Location</th>
                  </tr>
                </thead>
                <tbody className="font-jetbrains text-[var(--text-secondary)] text-xs">
                  <tr className="border-b border-[var(--border-primary)]">
                    <td className="py-3 pr-4">Prediction market data (titles, odds, URLs)</td>
                    <td className="py-3 pr-4">To match markets to tweets and display current market information</td>
                    <td className="py-3">Local browser storage exclusively</td>
                  </tr>
                  <tr className="border-b border-[var(--border-primary)]">
                    <td className="py-3 pr-4">Tweet content (when analysis is requested)</td>
                    <td className="py-3 pr-4">To perform AI-powered sentiment analysis</td>
                    <td className="py-3">Temporarily transmitted to DeepSeek API; not stored by us</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">User preferences and settings</td>
                    <td className="py-3 pr-4">To maintain extension configuration</td>
                    <td className="py-3">Local browser storage exclusively</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="font-jetbrains text-[var(--text-primary)] text-lg font-semibold mb-3">
              2.2 Information Not Collected
            </h3>
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8] mb-3">
              The Extension does not collect, store, or transmit the following information:
            </p>
            <ul className="font-jetbrains text-[var(--text-secondary)] text-sm space-y-2 pl-5 list-disc mb-6">
              <li>Twitter/X account credentials or user identification</li>
              <li>Browsing history or navigation patterns</li>
              <li>Personally identifiable information including name, email address, or physical address</li>
              <li>IP addresses or geolocation data</li>
              <li>Usage analytics or behavioral tracking data from your Extension usage or browsing activity</li>
              <li>Cookies or browser fingerprinting data</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="font-jetbrains text-[var(--text-primary)] text-[28px] font-bold uppercase tracking-[2px] mb-5">
              3. Data Processing and Usage
            </h2>

            <h3 className="font-jetbrains text-[var(--text-primary)] text-lg font-semibold mb-3">
              3.1 Automatic Tweet Content Processing
            </h3>
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8] mb-3">
              When you browse Twitter/X with the Extension enabled, the following automated processing occurs:
            </p>
            <ol className="font-jetbrains text-[var(--text-secondary)] text-sm space-y-2 pl-5 list-decimal mb-6">
              <li>Tweet text is analyzed locally within your browser to detect mentions of prediction markets</li>
              <li>Matching markets from Polymarket and Kalshi are displayed inline within the Twitter interface</li>
              <li>No tweet content is transmitted to external services during this automatic processing</li>
            </ol>

            <h3 className="font-jetbrains text-[var(--text-primary)] text-lg font-semibold mb-3">
              3.2 Optional AI Sentiment Analysis
            </h3>
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8] mb-3">
              When you explicitly request sentiment analysis by activating the analysis feature:
            </p>
            <ol className="font-jetbrains text-[var(--text-secondary)] text-sm space-y-2 pl-5 list-decimal mb-6">
              <li>The selected tweet text or content is transmitted to the DeepSeek API for processing</li>
              <li>DeepSeek returns sentiment analysis including directional bias (bullish/bearish/neutral) and confidence metrics</li>
              <li>Analysis results are displayed to you and cached locally for performance optimization</li>
              <li>We do not maintain server infrastructure to store analysis requests or results</li>
            </ol>

            <div className="bg-[var(--bg-secondary)] border border-[var(--text-primary)] border-l-4 p-6 mb-6">
              <h3 className="font-jetbrains text-[var(--text-primary)] text-base font-bold mb-3">
                Third-Party AI Processing Notice
              </h3>
              <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8]">
                When you request sentiment analysis, tweet content is transmitted to DeepSeek&apos;s application programming interface. DeepSeek&apos;s privacy policy governs the processing of this data. DeepSeek may utilize transmitted content to improve their artificial intelligence models. We recommend reviewing DeepSeek&apos;s privacy policy at their official website for complete information regarding their data practices.
              </p>
            </div>

            <h3 className="font-jetbrains text-[var(--text-primary)] text-lg font-semibold mb-3">
              3.3 Local Data Storage
            </h3>
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8] mb-3">
              The Extension stores the following data exclusively within your local browser storage:
            </p>
            <ul className="font-jetbrains text-[var(--text-secondary)] text-sm space-y-2 pl-5 list-disc mb-4">
              <li>Market cache containing current prediction market data (refreshed every 15-20 seconds)</li>
              <li>Recent sentiment analysis results cache (retained for 24 hours for performance purposes)</li>
              <li>User preferences and extension configuration settings</li>
            </ul>
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8]">
              This locally stored data is never transmitted to our servers, as we do not maintain server infrastructure. All data can be removed by uninstalling the Extension or clearing your browser&apos;s extension data.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="font-jetbrains text-[var(--text-primary)] text-[28px] font-bold uppercase tracking-[2px] mb-5">
              4. Third-Party Services
            </h2>

            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8] mb-6">
              The Extension integrates with the following third-party services:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-jetbrains text-[var(--text-primary)] text-base font-semibold mb-2">
                  4.1 DeepSeek AI
                </h3>
                <p className="font-jetbrains text-[var(--text-secondary)] text-sm">
                  <strong>Purpose:</strong> Sentiment analysis of tweet content and news articles<br />
                  <strong>Data Transmitted:</strong> Tweet text or user-selected text (only upon explicit user request)<br />
                  <strong>Privacy Policy:</strong> Available at DeepSeek&apos;s official website
                </p>
              </div>

              <div>
                <h3 className="font-jetbrains text-[var(--text-primary)] text-base font-semibold mb-2">
                  4.2 Polymarket API
                </h3>
                <p className="font-jetbrains text-[var(--text-secondary)] text-sm">
                  <strong>Purpose:</strong> Retrieval of prediction market data including titles, odds, and URLs<br />
                  <strong>Data Transmitted:</strong> None (we retrieve publicly available market data only)<br />
                  <strong>Privacy Policy:</strong> Available at polymarket.com/privacy
                </p>
              </div>

              <div>
                <h3 className="font-jetbrains text-[var(--text-primary)] text-base font-semibold mb-2">
                  4.3 Kalshi API
                </h3>
                <p className="font-jetbrains text-[var(--text-secondary)] text-sm">
                  <strong>Purpose:</strong> Retrieval of regulated prediction market data<br />
                  <strong>Data Transmitted:</strong> None (we retrieve publicly available market data only)<br />
                  <strong>Privacy Policy:</strong> Available at kalshi.com/privacy
                </p>
              </div>

              <div>
                <h3 className="font-jetbrains text-[var(--text-primary)] text-base font-semibold mb-2">
                  4.4 Vercel Analytics
                </h3>
                <p className="font-jetbrains text-[var(--text-secondary)] text-sm">
                  <strong>Purpose:</strong> Anonymous, aggregate page-view measurement on the musashi.bot website<br />
                  <strong>Data Collected:</strong> Page view events and referrer information; no personal identity data is collected<br />
                  <strong>Privacy Policy:</strong> Available at vercel.com/legal/privacy-policy<br />
                  <strong>Note:</strong> This analytics applies to the musashi.bot website only, not to the Chrome Extension.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="font-jetbrains text-[var(--text-primary)] text-[28px] font-bold uppercase tracking-[2px] mb-5">
              5. Data Sharing and Disclosure
            </h2>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-6">
              <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8] mb-4">
                We do not sell, rent, trade, or otherwise transfer your data to third parties for marketing or commercial purposes.
              </p>
              <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8] mb-4">
                The only data sharing that occurs is:
              </p>
              <ul className="font-jetbrains text-[var(--text-secondary)] text-sm space-y-2 pl-5 list-disc">
                <li>Transmission of tweet content to DeepSeek AI exclusively when you explicitly request sentiment analysis</li>
                <li>Standard API requests to Polymarket and Kalshi to retrieve publicly available market data (no personal information is involved in these requests)</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-12">
            <h2 className="font-jetbrains text-[var(--text-primary)] text-[28px] font-bold uppercase tracking-[2px] mb-5">
              6. API Access for AI Agents
            </h2>

            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8] mb-4">
              The Extension provides an application programming interface for AI trading agents to access sentiment analysis functionality. When an AI agent utilizes this API:
            </p>
            <ul className="font-jetbrains text-[var(--text-secondary)] text-sm space-y-2 pl-5 list-disc">
              <li>The AI agent operates on your local machine and queries your installed Extension instance</li>
              <li>No data is transmitted to our infrastructure (we do not maintain servers)</li>
              <li>The same privacy practices described in this policy apply to AI agent access</li>
              <li>You retain full control over what your AI agent does with data received from the Extension</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="mb-12">
            <h2 className="font-jetbrains text-[var(--text-primary)] text-[28px] font-bold uppercase tracking-[2px] mb-5">
              7. Data Retention
            </h2>

            <ul className="font-jetbrains text-[var(--text-secondary)] text-sm space-y-2 pl-5 list-disc">
              <li><strong>Market data cache:</strong> Automatically refreshed every 15-20 seconds; outdated data is automatically purged</li>
              <li><strong>Sentiment analysis cache:</strong> Retained for 24 hours, then automatically deleted</li>
              <li><strong>User preferences:</strong> Retained until you uninstall the Extension or manually clear browser extension data</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="mb-12">
            <h2 className="font-jetbrains text-[var(--text-primary)] text-[28px] font-bold uppercase tracking-[2px] mb-5">
              8. User Rights and Data Control
            </h2>

            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8] mb-4">
              You have the following rights regarding your data:
            </p>
            <ul className="font-jetbrains text-[var(--text-secondary)] text-sm space-y-2 pl-5 list-disc">
              <li><strong>Right to Access:</strong> All data is stored locally in your browser and can be inspected using Chrome Developer Tools</li>
              <li><strong>Right to Deletion:</strong> Uninstall the Extension or clear browser storage data to remove all locally stored information</li>
              <li><strong>Right to Opt-Out:</strong> AI sentiment analysis is entirely optional; simply refrain from activating the analysis feature</li>
              <li><strong>Right to Control Data Sharing:</strong> You determine when data is transmitted to third parties by choosing when to request sentiment analysis</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="mb-12">
            <h2 className="font-jetbrains text-[var(--text-primary)] text-[28px] font-bold uppercase tracking-[2px] mb-5">
              9. Children&apos;s Privacy
            </h2>

            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8]">
              The Extension is not intended for use by individuals under the age of 13. We do not knowingly collect information from children under 13. If you are a parent or guardian and believe your child has used the Extension, please contact us at the address provided in Section 12.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-12">
            <h2 className="font-jetbrains text-[var(--text-primary)] text-[28px] font-bold uppercase tracking-[2px] mb-5">
              10. Security Measures
            </h2>

            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8] mb-4">
              We implement the following security measures to protect data:
            </p>
            <ul className="font-jetbrains text-[var(--text-secondary)] text-sm space-y-2 pl-5 list-disc">
              <li>All API communications utilize HTTPS encryption</li>
              <li>No server-side data storage eliminates risks associated with centralized data breaches</li>
              <li>All data processing occurs locally within your browser environment</li>
              <li>Extension source code is available for security auditing</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section className="mb-12">
            <h2 className="font-jetbrains text-[var(--text-primary)] text-[28px] font-bold uppercase tracking-[2px] mb-5">
              11. Changes to This Privacy Policy
            </h2>

            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8] mb-4">
              We may update this Privacy Policy periodically. When changes are made:
            </p>
            <ul className="font-jetbrains text-[var(--text-secondary)] text-sm space-y-2 pl-5 list-disc">
              <li>The &quot;Effective Date&quot; at the beginning of this policy will be updated</li>
              <li>Significant changes will be communicated to users via the Extension interface</li>
              <li>Continued use of the Extension after changes constitute acceptance of the revised policy</li>
            </ul>
          </section>

          {/* Section 12 */}
          <section className="mb-12">
            <h2 className="font-jetbrains text-[var(--text-primary)] text-[28px] font-bold uppercase tracking-[2px] mb-5">
              12. International Data Transfers
            </h2>

            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8] mb-4">
              The Extension may be used globally. Please note:
            </p>
            <ul className="font-jetbrains text-[var(--text-secondary)] text-sm space-y-2 pl-5 list-disc">
              <li>DeepSeek AI may process data in various jurisdictions</li>
              <li>The Extension itself does not collect or store personal data</li>
              <li>For European Economic Area users: We act as a data processor only when you request sentiment analysis</li>
              <li>For California residents: We do not sell personal information as defined under the California Consumer Privacy Act</li>
            </ul>
          </section>

          {/* Section 13 */}
          <section className="mb-12">
            <h2 className="font-jetbrains text-[var(--text-primary)] text-[28px] font-bold uppercase tracking-[2px] mb-5">
              13. Contact Information
            </h2>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] border-l-4 border-l-[var(--text-primary)] p-6">
              <p className="font-jetbrains text-[var(--text-secondary)] text-sm mb-4">
                For questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <p className="font-jetbrains text-[var(--text-secondary)] text-sm">
                <strong>Email:</strong> support@musashi.bot<br />
                <strong>Website:</strong> <a href="https://musashi.bot" className="text-[var(--text-primary)] underline">https://musashi.bot</a><br />
                <strong>Response Time:</strong> We aim to respond to all inquiries within 48 hours
              </p>
            </div>
          </section>

          {/* Section 14 */}
          <section className="mb-12">
            <h2 className="font-jetbrains text-[var(--text-primary)] text-[28px] font-bold uppercase tracking-[2px] mb-5">
              14. Regulatory Compliance
            </h2>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-6 space-y-4">
              <div>
                <h3 className="font-jetbrains text-[var(--text-primary)] text-base font-semibold mb-2">
                  General Data Protection Regulation (GDPR)
                </h3>
                <p className="font-jetbrains text-[var(--text-secondary)] text-sm">
                  For users in the European Economic Area: When you request sentiment analysis, we act as a data processor transmitting your data to DeepSeek (the data controller). As we do not collect or store personal data ourselves, most GDPR data subject rights requests would be directed to DeepSeek rather than to us.
                </p>
              </div>

              <div>
                <h3 className="font-jetbrains text-[var(--text-primary)] text-base font-semibold mb-2">
                  California Consumer Privacy Act (CCPA)
                </h3>
                <p className="font-jetbrains text-[var(--text-secondary)] text-sm">
                  For California residents: We do not sell your personal information. We do not share personal information for cross-context behavioral advertising. As we do not collect personal information, CCPA data subject rights are generally not applicable to our Extension.
                </p>
              </div>

              <div>
                <h3 className="font-jetbrains text-[var(--text-primary)] text-base font-semibold mb-2">
                  Chrome Web Store Compliance
                </h3>
                <p className="font-jetbrains text-[var(--text-secondary)] text-sm">
                  This Privacy Policy complies with the Chrome Web Store Program Policies and User Data FAQ requirements.
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <SiteFooter
        variant="extended"
        description="Chrome extension that shows prediction markets on Twitter. API for agents."
        className="mt-auto"
      />
    </div>
  );
}
