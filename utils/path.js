import fs from "fs";

const CONTENT_DELIVERY_ROOT = process.env.CONTENT_DELIVERY_ROOT;
const VIDEOS_ROOT = `${CONTENT_DELIVERY_ROOT}/uploads`;
const POSTERS_ROOT = `${CONTENT_DELIVERY_ROOT}/posters`;
const ATTACHMENT_ROOT = `${CONTENT_DELIVERY_ROOT}/attachments`;

(function() {
    console.info('Running startup script for content delivery');
    if (!fs.existsSync(VIDEOS_ROOT))
        fs.mkdirSync(VIDEOS_ROOT);
    if (!fs.existsSync(POSTERS_ROOT))
        fs.mkdirSync(POSTERS_ROOT);
    if (!fs.existsSync(ATTACHMENT_ROOT))
        fs.mkdirSync(ATTACHMENT_ROOT);
})()

export function getVideoPath(video) {
    return `${VIDEOS_ROOT}/${video.getFullFileName()}`;
}

export function getPosterPath(video) {
    return `${POSTERS_ROOT}/${video.getFullPosterName()}`;
}

export function getAttachmentPath(ticket) {
    return `${ATTACHMENT_ROOT}/${ticket.getFullAttachmentName()}`;
}