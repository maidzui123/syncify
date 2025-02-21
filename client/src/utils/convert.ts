import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { store } from '@/redux/store'
import "dayjs/locale/vi";
import "dayjs/locale/en";

dayjs.extend(relativeTime);

export const convertBlobToFile = (blob: Blob) => {
    let fileExtension;
    switch (blob.type) {
        case 'image/png':
            fileExtension = 'png';
            break;
        case 'image/jpeg':
        case 'image/jpg':
            fileExtension = 'jpg';
            break;
        default:
            fileExtension = 'jpg';
    }
    const fileName = `image_${Date.now()}.${fileExtension}`;
    return new File([blob], fileName, {
        type: blob.type || `image/${fileExtension}`,
        lastModified: new Date().getTime()
    });
};

export const timeSince = (dateString: string) => {
    const locale = store.getState().locale.value
    dayjs.locale(locale)
    const pastDate = dayjs(dateString);
    const now = dayjs();
    if (pastDate.isAfter(now)) {
        return "The given date is in the future.";
    }
    return pastDate.from(now, true);
}