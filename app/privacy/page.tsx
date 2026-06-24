import {
  LegalPageLayout,
  LegalSection,
} from "@/components/legal/legal-page-layout";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for PortfolioAI.",
};

const LAST_UPDATED = "June 12, 2026";

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated={LAST_UPDATED}>
      <p>
        This Privacy Policy explains how PortfolioAI (&quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;) collects, uses, shares, and
        protects personal information when you use our website, applications,
        and related services (the &quot;Service&quot;). By using PortfolioAI, you
        agree to the practices described in this policy.
      </p>

      <LegalSection title="1. Information we collect">
        <p>
          <strong className="text-foreground">Account information.</strong> When
          you register, we collect your name, email address, and password (stored
          in hashed form). If you use Google Sign-In, we receive information from
          Google such as your name, email address, and Google account
          identifier, as permitted by your Google account settings.
        </p>
        <p>
          <strong className="text-foreground">Portfolio content.</strong> We
          store the information you add to your portfolio, including profile
          details, work experience, education, skills, projects, certifications,
          images, and links you choose to publish.
        </p>
        <p>
          <strong className="text-foreground">Usage and technical data.</strong>{" "}
          We may collect device and browser information, IP address, log data,
          and interactions with the Service to maintain security, diagnose
          issues, and improve performance.
        </p>
        <p>
          <strong className="text-foreground">Cookies and similar technologies.</strong>{" "}
          We use cookies and local storage for authentication, session
          management, and preferences. Essential cookies are required for sign-in
          and account security.
        </p>
      </LegalSection>

      <LegalSection title="2. How we use your information">
        <p>We use personal information to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Create and manage your account</li>
          <li>Provide, host, and personalize the Service</li>
          <li>Display your portfolio when you choose to publish or preview it</li>
          <li>Authenticate you and protect against fraud or abuse</li>
          <li>Respond to support requests and communicate service updates</li>
          <li>Improve features, including AI-assisted portfolio tools</li>
          <li>Comply with legal obligations</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How we share information">
        <p>
          We do not sell your personal information. We may share information only
          in these circumstances:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Service providers.</strong> With
            vendors who help us operate the Service (for example, hosting,
            analytics, or authentication providers such as Google), subject to
            contractual safeguards.
          </li>
          <li>
            <strong className="text-foreground">Public portfolios.</strong>{" "}
            Information you publish in a public portfolio is visible to anyone
            with access to the link.
          </li>
          <li>
            <strong className="text-foreground">Legal requirements.</strong>{" "}
            When required by law, regulation, legal process, or to protect
            rights, safety, and security.
          </li>
          <li>
            <strong className="text-foreground">Business transfers.</strong> In
            connection with a merger, acquisition, or sale of assets, with
            notice where required by law.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Google Sign-In">
        <p>
          If you choose Google Sign-In, Google processes your information under
          its own privacy policy. We receive only the data needed to authenticate
          you and create or access your PortfolioAI account, such as your name,
          email address, and Google user ID. We do not receive your Google
          password.
        </p>
      </LegalSection>

      <LegalSection title="5. Data retention">
        <p>
          We retain account and portfolio data for as long as your account is
          active or as needed to provide the Service. If you delete your account
          or request deletion, we will remove or anonymize your personal
          information within a reasonable period, except where retention is
          required for legal, security, or backup purposes.
        </p>
      </LegalSection>

      <LegalSection title="6. Security">
        <p>
          We use administrative, technical, and organizational measures to
          protect personal information, including encrypted connections (HTTPS),
          hashed passwords, and access controls. No method of transmission or
          storage is completely secure, and we cannot guarantee absolute
          security.
        </p>
      </LegalSection>

      <LegalSection title="7. Your rights and choices">
        <p>Depending on your location, you may have the right to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Access, correct, or delete your personal information</li>
          <li>Export your portfolio data</li>
          <li>Object to or restrict certain processing</li>
          <li>Withdraw consent where processing is based on consent</li>
        </ul>
        <p>
          You can update much of your information directly in your profile
          settings. For other requests, contact us at the email below.
        </p>
      </LegalSection>

      <LegalSection title="8. Children&apos;s privacy">
        <p>
          PortfolioAI is not directed to children under 16, and we do not
          knowingly collect personal information from children. If you believe a
          child has provided us personal information, please contact us so we
          can take appropriate action.
        </p>
      </LegalSection>

      <LegalSection title="9. International users">
        <p>
          If you access the Service from outside the country where our servers
          are located, your information may be transferred to and processed in
          other jurisdictions that may have different data protection laws.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. We will post the
          revised policy on this page and update the &quot;Last updated&quot;
          date. Material changes may also be communicated through the Service or
          by email where appropriate.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact us">
        <p>
          For privacy questions or requests, contact us at{" "}
          <a
            href="mailto:privacy@portfolioai.app"
            className="text-primary hover:underline"
          >
            privacy@portfolioai.app
          </a>
          . For terms governing use of the Service, see our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
