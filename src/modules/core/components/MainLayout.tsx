import { Header } from "./Header";

interface IMainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: IMainLayoutProps) => {
  return (
    <div className="h-screen bg-gray-200 flex flex-col">
      <Header />
      <main className="flex-grow p-4 md:p-8 flex flex-col overflow-hidden">
      {children}
      </main>
    </div>
  );
};
