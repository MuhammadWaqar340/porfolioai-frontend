import {
  LegalPageLayout,
  LegalSection,
} from "@/components/legal/legal-page-layout";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service for PortfolioAI.",
};

const LAST_UPDATED = "June 12, 2026";

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated={LAST_UPDATED}>
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use
        of PortfolioAI (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;),
        including our website, applications, and related services (collectively,
        the &quot;Service&quot;). By creating an account or using the Service,
        you agree to these Terms. If you do not agree, do not use the Service.
      </p>

      <LegalSection title="1. Eligibility">
        <p>
          You must be at least 16 years old to use PortfolioAI. By using the
          Service, you represent that you meet this requirement and that the
          information you provide during registration is accurate and complete.
        </p>
      </LegalSection>

      <LegalSection title="2. Your account">
        <p>
          You are responsible for maintaining the confidentiality of your login
          credentials and for all activity that occurs under your account. Notify
          us promptly if you suspect unauthorized access. We may suspend or
          terminate accounts that violate these Terms or pose a security risk.
        </p>
        <p>
          You may sign in using email and password or Google Sign-In where
          available. You agree to provide accurate profile information and to
          keep it up to date.
        </p>
      </LegalSection>

      <LegalSection title="3. Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Use the Service for unlawful, harmful, or fraudulent purposes</li>
          <li>
            Upload content that infringes intellectual property, privacy, or
            other rights of third parties
          </li>
          <li>
            Distribute malware, spam, or content that is harassing, hateful, or
            sexually explicit
          </li>
          <li>
            Attempt to probe, scan, or compromise the security of our systems
          </li>
          <li>
            Scrape, reverse engineer, or resell the Service without permission
          </li>
        </ul>
        <p>
          We reserve the right to remove content and suspend accounts that
          violate this section.
        </p>
      </LegalSection>

      <LegalSection title="4. Your content">
        <p>
          You retain ownership of the portfolio content you upload or create,
          including text, images, project details, and other materials
          (&quot;Your Content&quot;). By using the Service, you grant us a
          non-exclusive, worldwide, royalty-free license to host, store,
          display, and process Your Content solely to operate and improve the
          Service.
        </p>
        <p>
          You represent that you have the rights necessary to upload Your Content
          and that it does not violate applicable law or third-party rights.
        </p>
      </LegalSection>

      <LegalSection title="5. Public portfolios">
        <p>
          If you publish or share your portfolio publicly, you understand that
          anyone with access to the link may view the information you choose to
          display. You are responsible for what you publish and for any personal
          data you include in your public portfolio.
        </p>
      </LegalSection>

      <LegalSection title="6. AI features">
        <p>
          PortfolioAI may offer AI-assisted tools to help generate or improve
          portfolio content. AI outputs are provided for convenience and may be
          inaccurate or incomplete. You are responsible for reviewing,
          editing, and approving any AI-generated content before publishing it.
        </p>
      </LegalSection>

      <LegalSection title="7. Intellectual property">
        <p>
          The Service, including its design, branding, software, and
          documentation, is owned by PortfolioAI and protected by intellectual
          property laws. These Terms do not grant you any rights to our
          trademarks or proprietary materials except as needed to use the
          Service.
        </p>
      </LegalSection>

      <LegalSection title="8. Service availability">
        <p>
          We strive to keep PortfolioAI available and reliable, but we do not
          guarantee uninterrupted or error-free operation. We may modify,
          suspend, or discontinue features with reasonable notice where
          practicable.
        </p>
      </LegalSection>

      <LegalSection title="9. Disclaimer of warranties">
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;
          WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING
          IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, AND NON-INFRINGEMENT.
        </p>
      </LegalSection>

      <LegalSection title="10. Limitation of liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, PORTFOLIOAI AND ITS AFFILIATES
          WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR
          GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.
        </p>
      </LegalSection>

      <LegalSection title="11. Termination">
        <p>
          You may stop using the Service at any time. We may suspend or
          terminate your access if you breach these Terms or if required by law.
          Upon termination, your right to use the Service ends, though certain
          provisions of these Terms will survive.
        </p>
      </LegalSection>

      <LegalSection title="12. Changes to these Terms">
        <p>
          We may update these Terms from time to time. If we make material
          changes, we will post the updated Terms on this page and update the
          &quot;Last updated&quot; date. Continued use of the Service after
          changes become effective constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="13. Governing law">
        <p>
          These Terms are governed by the laws applicable in your jurisdiction
          of residence, without regard to conflict-of-law principles, except
          where mandatory local consumer protections apply.
        </p>
      </LegalSection>

      <LegalSection title="14. Contact">
        <p>
          Questions about these Terms? Contact us at{" "}
          <a
            href="mailto:legal@portfolioai.app"
            className="text-primary hover:underline"
          >
            legal@portfolioai.app
          </a>
          . For information about how we handle personal data, see our{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
