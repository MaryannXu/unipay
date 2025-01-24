// global.d.ts

// Declare the Persona Client interface
interface PersonaClientOptions {
    templateId: string;
    environmentId: string;
    onReady?: () => void;
    onComplete?: (result: {
        inquiryId: string;
        status: string;
        fields?: Record<string, any>;
    }) => void;
}

// Declare the Persona Client class
declare class PersonaClient {
    constructor(options: PersonaClientOptions);
    open(): void;
}

// Extend the Window interface to include Persona
interface Window {
    Persona: {
        Client: typeof PersonaClient;
    };
}
