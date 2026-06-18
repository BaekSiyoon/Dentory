import MainMenu from "../components/mainMenu";
import MainContent from "./home/mainContent";

export default function Home() {
  return (
    <div className="h-screen overflow-hidden">
      <MainMenu />
      <MainContent />
    </div>
  );
}
