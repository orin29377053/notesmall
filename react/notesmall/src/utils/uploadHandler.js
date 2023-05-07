const { imageAPI } = require("./const");

async function getPresignedUrl(fileName) {
    const rawUrl = await fetch(
        `${imageAPI}api/1.0/image/getImagePresignedUrl?fileName=${fileName}`
    );
    const url = await rawUrl.json();
    return url;
}

async function handleUpload(url, image) {
    try {
        const result = await fetch(url, {
            method: "PUT",
            body: image,
            headers: { "content-type": "image/jpeg" },
        });
        if (!result.ok) {
            throw new Error("Image upload failed");
        } else {
            return;
        }
    } catch (e) {
        return -1;
    }
}

async function checkImageExists(url) {
    try {
        const response = await fetch(url, {
            method: "HEAD",
        });
        return response.ok;
    } catch (e) {
        return false;
    }
}

async function waitForImage(url, interval = 1000, retries = 10) {
    for (let i = 0; i < retries; i++) {
        const exists = await checkImageExists(url);
        if (exists) {
            return true;
        }
        await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return false;
}

export default function uploadHandler(files) {
    const promises = [];

    for (const { file, progress } of files) {
        promises.push(
            () =>
                new Promise(async (resolve) => {
                    const reader = new FileReader();

                    let newFilename = file.name.replace(/[\s\)]/g, "");

                    const url = await getPresignedUrl(newFilename);
                    await handleUpload(url.presignedUrl, file);
                    const isImageReady = await waitForImage(url.objectUrl);
                    if (!isImageReady) {
                        // Handle this case as needed
                        return;
                    }

                    reader.addEventListener(
                        "load",
                        (readerEvent) => {
                            resolve({
                                src: url.objectUrl,
                                fileName: newFilename,
                            });
                        },
                        { once: true }
                    );

                    reader.readAsDataURL(file);
                    // setTimeout(async () => {
                    //     reader.addEventListener(
                    //         "load",
                    //         (readerEvent) => {
                    //             resolve({
                    //                 src: url.objectUrl,
                    //                 fileName: newFilename,
                    //             });
                    //         },
                    //         { once: true }
                    //     );

                    //     reader.readAsDataURL(file);
                    // }, 1500);
                })
        );
    }

    return promises;
}
