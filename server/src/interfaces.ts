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

interface NFTMetadata {
    name: string;
    description: string;
    external_url: string;
    image: string;
    attributes: Attribute[];
}

interface Attribute {
    trait_type: string;
    value: string;
}