import type { Metadata } from "next";
import "./globals.css";
import "./styles/theme.css"

export const metadata: Metadata = {
	title: "WallyPost",
	description: "WallyPost for a demo web application",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html data-theme="synthwave" lang="en">
			<body
				className={`antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
