import React, { useState } from "react";

export async function getPresignedUrl(fileName) {
    const rawUrl = await fetch(
        `http://localhost:8000/getImagePresignedUrl?fileName=${fileName}`
    );
    const url = await rawUrl.json();
    return url;
}
export async function handleUpload(url, image) {
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



const ImageUpload = ({ fileName, image }) => {
    const [file, setFile] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("file", file);

        if (file) {
            const url = await getPresignedUrl(file.name);
            await handleUpload(url.presignedUrl, file);
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default ImageUpload;

