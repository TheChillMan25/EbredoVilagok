export interface User{
    id: string | null | undefined;
    username: string | null | undefined;
    email: string | null | undefined;
    characters: string[];
    adventures: string[];
}