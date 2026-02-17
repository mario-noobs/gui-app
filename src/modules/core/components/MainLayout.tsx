import { Header } from "./Header";
import { FaceNotificationProvider } from "../../face-reg/context/FaceNotificationContextType";

interface IMainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: IMainLayoutProps) => {
  return (
    <FaceNotificationProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow flex">
          {children}
        </main>
      </div>
    </FaceNotificationProvider>
  );
};
