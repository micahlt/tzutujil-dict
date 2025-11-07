"use cache"
import { unstable_cacheLife as cacheLife } from 'next/cache'

/**
 * @typedef { import("@prisma/client").Words } Word
 */

import prisma from "./prisma";

/**
 * @returns {Word}
 */
export async function frontPageWords() {
    cacheLife("hours")
    let result;
    try {
        // First get all word IDs that have both EN and ES senses
        const wordsWithBothLanguages = await prisma.$queryRaw`
            SELECT w.id
            FROM "Words" w
            WHERE EXISTS (
                SELECT 1 FROM "Senses" s1 
                WHERE s1.word_id = w.id AND s1.language = 'EN'
            )
            AND EXISTS (
                SELECT 1 FROM "Senses" s2 
                WHERE s2.word_id = w.id AND s2.language = 'ES'
            )
            ORDER BY RANDOM()
            LIMIT 6
        `;

        // Extract the word IDs
        const wordIds = wordsWithBothLanguages.map(row => row.id);

        // Fetch the full word data for these IDs
        result = await prisma.words.findMany({
            where: {
                id: {
                    in: wordIds
                }
            },
            include: {
                Spellings: true,
                Senses: true
            }
        });

        return result;
    } catch (e) {
        console.error(e);
        return [];
    }
}
