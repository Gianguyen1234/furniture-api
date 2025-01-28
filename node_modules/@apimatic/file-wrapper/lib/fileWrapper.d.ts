/**
 * Wraps file with mime-type and filename to be sent as part of an HTTP request.
 */
export declare class FileWrapper {
    file: Blob | import('stream').Readable;
    options?: FileWrapperOptions | undefined;
    constructor(file: Blob | import('stream').Readable, options?: FileWrapperOptions | undefined);
}
/** File upload options such as filename and mime-type */
interface FileWrapperOptions {
    /** Mime-type to be sent with the file */
    contentType?: string;
    /** Name of the file to be used in the upload data */
    filename?: string;
    /** Headers to be used in the multipart request */
    headers?: Record<string, string>;
}
/** Returns true if value is a FileWrapper */
export declare function isFileWrapper(value: unknown): value is FileWrapper;
/**
 * Returns a deep clone of the FileWrapper instance
 *
 * @param fileWrapper FileWrapper instance to copy
 */
export declare function cloneFileWrapper(fileWrapper: FileWrapper): FileWrapper;
export {};
//# sourceMappingURL=fileWrapper.d.ts.map