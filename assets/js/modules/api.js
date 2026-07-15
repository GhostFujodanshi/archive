export async function getJSON(path) {

    try {

        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(`Gagal memuat ${path}`);
        }

        return await response.json();

    } catch (error) {

        console.error(error);

        return [];

    }

}