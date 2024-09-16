import { CreateGameForm } from "./components/create-game-form";

export default function AppPage() {
  return (
    <div className="px-4 pt-12 space-y-6">
      <h1 className="font-bold text-2xl">Criar jogo</h1>

      <CreateGameForm />
    </div>
  );
}
