export function convertToStream(
  content: string | Blob | NodeJS.ReadableStream
): Blob | NodeJS.ReadableStream {
  if (typeof content !== 'string') {
    return content;
  }

  // ref: https://stackoverflow.com/a/22085851
  const rs = new (require('stream').Readable)();
  // tslint:disable-next-line:no-empty
  rs._read = () => {};
  rs.push(content);
  rs.push(null);
  return rs;
}
