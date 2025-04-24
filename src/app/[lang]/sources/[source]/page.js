"use server";
import { getSource } from "@/lib/getSource";
import { getDict } from "../../i18n";
import SourceClient from "./sourceClient";
import { notFound } from "next/navigation";

async function getData(sourceId) {
    try {
        const res = await getSource(sourceId);
        if (!res) {
            notFound();
        }
        return await JSON.parse(res);
    } catch (err) {
        notFound();
    }
}

export default async function Source({
    params: { source: sourceId, lang },
}) {
    const locale = await getDict(lang);
    const sourceData = await getData(sourceId);
    return (
        <>
            <SourceClient
                sourceId={sourceId}
                sourceData={sourceData || null}
                locale={locale}
                defaultView={sourceId == "new" ? "new" : "view"}
            />
        </>
    );
}

export async function generateMetadata({
    params: { source: sourceId, lang },
}) {
    const sourceData = await getData(sourceId);
    const locale = await getDict(lang);

    return {
        title: `${sourceData.name} | ${locale.siteName}`,
        description: `${sourceData.name} on the world's largest, most comprehensive Tz'utujil dictionary and translator.`,
        openGraph: {
            images: [
                `https://dictionary.tzutujil.org/api/og?word=${sourceData.name}&lang=${locale._code}`,
            ],
        },
    };
}
