import MainMenu from "./components/mainMenu";
import MainContent from "./home/mainContent";

export default function Home() {
  return (
    <>
      <MainMenu />
      <MainContent/>
      <main style={{ padding: "20px" }}></main>
    </>
  );
}
