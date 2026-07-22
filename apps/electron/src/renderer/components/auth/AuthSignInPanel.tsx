import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@mcp_router/ui";
import { JeLogo } from "@/renderer/components/brand/JeLogo";
import { Loader2 } from "lucide-react";

type AuthSignInPanelProps = {
  title: string;
  description: string;
  onLogin: () => void | Promise<void>;
  busy?: boolean;
  /** When set, shows a secondary “continue without signing in” action */
  onContinueWithout?: () => void;
};

/**
 * Shared JE corporate sign-in panel used by /login and remote-workspace gate.
 */
export const AuthSignInPanel: React.FC<AuthSignInPanelProps> = ({
  title,
  description,
  onLogin,
  busy = false,
  onContinueWithout,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-full items-center justify-center bg-white px-6 py-12">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <JeLogo className="h-16 w-auto" variant="light" />

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-medium text-[#231f20]">{title}</h1>
          <p className="text-sm text-[#5c5a5a]">{description}</p>
        </div>

        <div className="flex w-full flex-col gap-2">
          <Button
            className="h-11 w-full bg-[#f58220] text-white hover:bg-[#e07418] border-0"
            onClick={onLogin}
            disabled={busy}
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("settings.loggingIn")}
              </>
            ) : (
              t("login.loginButton")
            )}
          </Button>
          {onContinueWithout ? (
            <Button
              variant="ghost"
              className="h-10 w-full text-[#5c5a5a] hover:bg-transparent hover:text-[#231f20]"
              onClick={onContinueWithout}
              disabled={busy}
            >
              {t("login.continueWithout")}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AuthSignInPanel;
