import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";

import logoImage from "../../assets/6bb1bf4af511394138b5489e98459465e7ee4122.png";

interface LoginScreenProps {
  onLogin: () => void;
  onAdminLogin: () => void;
}

export function LoginScreen({ onLogin, onAdminLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Check if admin credentials
    if (email === "admin@zouhair.ma" && password === "admin123") {
      onAdminLogin();
    } else {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f4c81] to-[#1e3a5f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Logo */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center mb-4">
              <img
                src={logoImage}
                alt="Zouhair Metro Connect"
                className="w-32 h-32 object-contain"
              />
            </div>
            <p className="text-muted-foreground text-[14px]">
              Réservez votre voyage en toute simplicité
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[14px]">
                Adresse e-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-2 border-border focus:border-primary rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[14px]">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-2 border-border focus:border-primary rounded-xl"
                required
              />
            </div>

            <div className="text-right">
              <a
                href="#"
                className="text-[14px] text-primary hover:underline"
              >
                Mot de passe oublié ?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-xl text-[16px] font-semibold shadow-lg"
            >
              Se connecter
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={onLogin}
                className="text-[14px] text-muted-foreground hover:text-primary transition-colors"
              >
                Vous n'avez pas de compte ?{" "}
                <span className="font-semibold text-primary">
                  Créer un compte
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2">
          <div className="text-white/80 text-[12px]">
            © 2026 Zouhair Metro Connect. Tous droits réservés.
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-white/90 text-[11px]">
            <div className="font-semibold mb-1">Connexion Admin Demo:</div>
            <div>Email: admin@zouhair.ma</div>
            <div>Mot de passe: admin123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
