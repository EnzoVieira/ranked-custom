import { GameInvtedForm } from "./components/game-invited-form";

export default function GamesPage() {
  return (
    <div className="px-4 pt-12 space-y-6">
      <h1 className="text-2xl font-bold">Entrar</h1>

      <GameInvtedForm />
    </div>
  );
}
