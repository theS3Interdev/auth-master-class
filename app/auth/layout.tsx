const Authlayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="h-full flex items-center justify-center bg-sky-800">
			{children}
		</div>
	);
};

export default Authlayout;
