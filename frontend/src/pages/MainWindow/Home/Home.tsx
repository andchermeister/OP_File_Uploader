import "../MainWindow.css";
import "./Home.css";

interface HomeProps {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export default function Home({ user }: HomeProps) {
  return (
    <div className="main-window-container">
      <h1>Welcome back, {user?.name}!</h1>
      <p> Stratos File Uploader (Landing Page)</p>
    </div>
  );
}
