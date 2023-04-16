
async function getPresignedUrl(fileName) {
    const rawUrl = await fetch(
        `http://localhost:8000/getImagePresignedUrl?fileName=${fileName}`
    );
    const url = await rawUrl.json();
    return url;
}
async function handleUpload(url, image) {
    console.log("image", image);
    try {
        const result = await fetch(url, {
            method: "PUT",
            body: image,
            headers: { "content-type": "image/jpeg" },
        });
        if (!result.ok) {
            throw new Error("Image upload failed");
        } else {
            console.log("Image upload successful");
            return;
        }
    } catch (e) {
        console.log(e);
        return -1;
    }
}

export default function uploadHandler(files) {
    const promises = [];

    for (const { file, progress } of files) {
        promises.push(
            () =>
                new Promise(async (resolve) => {
                    const reader = new FileReader();
                    const url = await getPresignedUrl(file.name);
                    await handleUpload(url.presignedUrl, file);

                    reader.addEventListener(
                        "load",
                        (readerEvent) => {
                            resolve({
                                src: url.objectUrl,
                                fileName: file.name,
                            });
                        },
                        { once: true }
                    );
                    reader.readAsDataURL(file);
                })
        );
    }

    return promises;
}
