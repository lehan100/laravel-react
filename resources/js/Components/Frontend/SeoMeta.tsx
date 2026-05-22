import { Head } from '@inertiajs/react';

interface SeoProps {
    seo?: {
        title?: string;
        description?: string;
        keyword?: string;
        canonical?: string;
        og?: Record<string, string>;
        twitter?: Record<string, string>;
        json_ld?: Record<string, any>;
    };
}

export default function SeoMeta({ seo }: SeoProps) {
    if (!seo) return null;

    return (
        <>
            <Head title={seo.title}>
                {/* 1. General Meta */}
                {seo.description && <meta name="description" content={seo.description} />}
                {seo.keyword && <meta name="keywords" content={seo.keyword} />}
                {seo.canonical && <link rel="canonical" href={seo.canonical} />}

                {/* 2. Open Graph (Facebook, Zalo) */}
                {seo.og && Object.entries(seo.og).map(([property, content]) => (
                    <meta key={property} property={property} content={content} />
                ))}

                {/* 3. Twitter Card */}
                {seo.twitter && Object.entries(seo.twitter).map(([name, content]) => (
                    <meta key={name} name={name} content={content} />
                ))}

                {/* 4. JSON-LD Schema (Google) */}
                {seo.json_ld && (
                    <script type="application/ld+json">
                        {JSON.stringify(seo.json_ld)}
                    </script>
                )}
            </Head>
        </>
    );
}
