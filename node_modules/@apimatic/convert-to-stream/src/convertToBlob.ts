export function convertToStream(
  content: string | Blob | NodeJS.ReadableStream
): Blob | NodeJS.ReadableStream {
  if (typeof content !== 'string') {
    return content;
  }

  return new Blob([content]);
}
