// Wails Bridge Code
import { main } from "../../wailsjs/go/models";

export function formatAuthors(authors: main.AuthorAttributes[]): string {
    return authors.map((author) => author.name).join(", ");
}