/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['res.cloudinary.com']
	},
	reactStrictMode: true,
	compiler: {
		styledComponents: true,
	},
};

module.exports = nextConfig;
