export interface XmlSerializerInterface {
    xmlSerialize: (rootName: string, value: unknown) => string;
    xmlDeserialize: (rootName: string, xmlString: string) => Promise<any>;
}
export declare class XmlSerialization {
    xmlSerialize(_rootName: string, _value: unknown): string;
    xmlDeserialize(_rootName: string, _xmlString: string): Promise<any>;
}
//# sourceMappingURL=xmlSerializer.d.ts.map