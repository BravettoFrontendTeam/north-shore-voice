import { GenerateOptions, GenerateResult } from '../abevoice-integration';
export declare class ElevenLabsProvider {
    private apiKey?;
    private baseUrl;
    constructor(apiKey?: string, baseUrl?: string);
    isConfigured(): boolean;
    getVoices(): Promise<string[]>;
    generate(options: GenerateOptions): Promise<GenerateResult>;
}
export default ElevenLabsProvider;
//# sourceMappingURL=elevenlabs.d.ts.map