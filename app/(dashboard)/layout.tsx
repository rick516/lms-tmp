import { Sidebar } from "./_components/sidebar";

const DashborardLayout = ({
  children
}: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}

export default DashborardLayout;