import RNFS from 'react-native-fs';

const CACHE_DIR = `${RNFS.DocumentDirectoryPath}/breed_images`;

export const initImageCache = async () => {
    const exists = await RNFS.exists(CACHE_DIR);
    if (!exists) {
        await RNFS.mkdir(CACHE_DIR);
    }
};

export const getBreedImages = async (breedName: string): Promise<string[]> => {
    await initImageCache();
    const safeName = breedName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const localPath = `${CACHE_DIR}/${safeName}`;

    // Check for local images first (simple implementation: check if directory exists and has files)
    // For this one-shot, we'll just use a simple file naming convention: breed_1.jpg, breed_2.jpg
    // Actually, let's just store a JSON map or check specific files.
    // Simpler: check if we have downloaded images for this breed.

    const localFile = `${localPath}_1.jpg`;
    if (await RNFS.exists(localFile)) {
        return [`file://${localFile}`];
    }

    // Fetch from Wikipedia API
    try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=original&titles=${encodeURIComponent(breedName)}&pithumbsize=500`;
        const response = await fetch(searchUrl);
        const data = await response.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];

        if (pageId === '-1') return [];

        const imageUrl = pages[pageId]?.original?.source;
        if (imageUrl) {
            // Download image
            const destPath = `${localPath}_1.jpg`;
            await RNFS.downloadFile({
                fromUrl: imageUrl,
                toFile: destPath,
            }).promise;
            return [`file://${destPath}`];
        }
    } catch (e) {
        console.error('Error fetching breed image:', e);
        // Try a fallback search with "dog" appended if specific enough
        if (!breedName.toLowerCase().includes('dog')) {
            try {
                const fallbackUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=original&titles=${encodeURIComponent(breedName + ' dog')}&pithumbsize=500`;
                const response = await fetch(fallbackUrl);
                const data = await response.json();
                const pages = data.query.pages;
                const pageId = Object.keys(pages)[0];
                if (pageId !== '-1') {
                    const imageUrl = pages[pageId]?.original?.source;
                    if (imageUrl) {
                        const destPath = `${localPath}_1.jpg`;
                        await RNFS.downloadFile({ fromUrl: imageUrl, toFile: destPath }).promise;
                        return [`file://${destPath}`];
                    }
                }
            } catch (e2) {
                console.error('Fallback search failed:', e2);
            }
        }
    }

    return [];
};
