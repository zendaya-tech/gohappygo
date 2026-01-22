import { useState } from "react";
import { useTranslation } from "react-i18next";
import SupportDialog from "./common/dialog/SupportDialog";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);

  return (
    <>
      <footer className="bg-gray-100 text-gray-600 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo.png" alt="GoHappyGo logo" className="h-10" />
                <span className="font-bold text-lg text-gray-900">GoHappyGo</span>
              </div>
              <p className="text-sm mb-4">
                {t("footer.description")}
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://x.com/GoHappyGo1"
                  aria-label="Twitter"
                  className="hover"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 0 0 1.87-2.35 8.54 8.54 0 0 1-2.71 1.04 4.26 4.26 0 0 0-7.26 3.88A12.1 12.1 0 0 1 3.16 4.9a4.25 4.25 0 0 0 1.32 5.68 4.21 4.21 0 0 1-1.93-.53v.05a4.26 4.26 0 0 0 3.42 4.18c-.47.13-.96.2-1.46.08a4.27 4.27 0 0 0 3.98 2.96A8.54 8.54 0 0 1 2 19.54a12.06 12.06 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2v-.56A8.56 8.56 0 0 0 22.46 6z" />
                  </svg>
                </a>
                <a
                  href="https://web.facebook.com/gohappygofr"
                  aria-label="Facebook"
                  className="hover"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.57V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com/gohappygo1"
                  aria-label="Instagram"
                  className="hover"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm0 2.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5zm5.25-2.5a.75.75 0 1 0 .75.75.75.75 0 0 0-.75-.75z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Pour mieux nous connaître */}
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">{t("footer.knowUs.title")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/how-it-work"
                    className="hover"
                  >
                    {t("footer.knowUs.howItWorks")}
                  </a>
                </li>
                <li>
                  <a
                    href="/impact-ecologique"
                    className="hover"
                  >
                    {t("footer.knowUs.ecologicalImpact")}
                  </a>
                </li>
                <li>
                  <a
                    href="/what-is-happiness"
                    className="hover"
                  >
                    {t("footer.knowUs.whatIsHappiness")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Mentions Légales */}
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">{t("footer.legal.title")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/terms-of-use"
                    className="hover"
                  >
                    {t("footer.legal.termsOfUse")}
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    className="hover"
                  >
                    {t("footer.legal.privacyPolicy")}
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing-policy"
                    className="hover"
                  >
                    {t("footer.legal.pricingPolicy")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Donnez du Bonheur */}
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">{t("footer.giveHappiness.title")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/become-transporter"
                    className="hover"
                  >
                    {t("footer.giveHappiness.becomeTransporter")}
                  </a>
                </li>
                <li>
                  <a
                    href="/security-rules"
                    className="hover"
                  >
                    {t("footer.giveHappiness.securityRules")}
                  </a>
                </li>
                <li>
                  <a
                    href="/insurance-protection"
                    className="hover"
                  >
                    {t("footer.giveHappiness.insuranceProtection")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Assistance */}
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">{t("footer.support.title")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/faq"
                    className="hover"
                  >
                    Foire aux questions
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@gohappygo.fr"
                    className="hover"
                  >
                    support@gohappygo.fr
                  </a>
                </li>
                <li>
                  <a
                    href="/download-app"
                    className="hover"
                  >
                    {t("footer.support.downloadApp")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-300 mt-10 pt-8 text-center text-sm">
            <p>&copy; {year} GoHappyGo. {t("footer.copyright")}</p>
          </div>
        </div>
      </footer>

      {/* Support Dialog */}
      <SupportDialog 
        open={supportDialogOpen} 
        onClose={() => setSupportDialogOpen(false)} 
      />
    </>
  );
}
