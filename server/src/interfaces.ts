interface Game {
    name: string;
    description: string;
    gameId: string;
    avatar: string;
    creator: string;
    email: string;
    website: string;
    templates: Template[];
}

interface Template {
    templateUri: string;
}