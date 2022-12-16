import { getCurrentLanguageForBackend } from "./language.utils";

export function addLanguageOnURL(url: string) {
    let index = url.lastIndexOf(".");
    return url.substring(0,index) + "-" + getCurrentLanguageForBackend() + url.substring(index);
}