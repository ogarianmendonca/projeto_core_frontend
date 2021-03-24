import { Role } from "./role";

export interface Usuario {
    id: number;
    userName: string;
    name: string;
    email: string;
    ativo: boolean,
    image: string
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    roles: Role[]
}

