import NavigationBar from "@/app/(protected)/_components/navigation-bar";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-sky-800">
			<NavigationBar />
			{children}
		</div>
	);
};

export default ProtectedLayout;
