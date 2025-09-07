import bycrpt from "bcryptjs";
export function generateHash(plantext: string): string {
    return bycrpt.hashSync(plantext, 10);
}
export function compareHash(plaintext: string, hash: string): boolean {
    return bycrpt.compareSync(plaintext, hash);
}