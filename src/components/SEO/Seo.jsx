import { Helmet } from "react-helmet-async";

const Seo = ({ title, description, image, path }) => {
    return (
        <Helmet>
            <title>{title}</title>

            {/* Open Graph Meta Tags (For Facebook, LinkedIn, etc.) */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={`https://learning-point-us.vercel.app${path ? `/${path}` : ''}`} />
            <meta property="og:type" content="website" />

            {/* Twitter Card Meta Tags (For Twitter) */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

export default Seo;