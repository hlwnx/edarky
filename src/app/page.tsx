import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-6xl font-bold mb-6">
          Vítejte v aplikaci <span className="text-primary">Darky</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Spravujte dárky pro své blízké s pomocí AI
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/login">
            <Button size="lg">Přihlásit se</Button>
          </Link>
          <Link href="/auth/register">
            <Button size="lg" variant="outline">Registrovat se</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
