export const getFormattedTime = (time) => {
    return time.slice(0, 19).replace("T", " ");
};
